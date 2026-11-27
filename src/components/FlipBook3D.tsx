import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useHandbook } from '../data/HandbookContext'
import { yearToPageIndex } from '../data/entries'
import {
  PAGE_TEX_H,
  PAGE_TEX_W,
  drawBackPage,
  drawCoverPage,
  drawMemoryPage,
} from '../lib/pageCanvas'
import {
  PAGE_H,
  PAGE_W,
  applyPageCurl,
  copyPositions,
  createPageGeometry,
} from '../lib/pageCurl'
import { YearTabs } from './YearTabs'

type Props = {
  onClose: () => void
}

const FLIP_MS = 880

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

type Sheet = {
  group: THREE.Group
  front: THREE.Mesh
  back: THREE.Mesh
  geoFront: THREE.PlaneGeometry
  geoBack: THREE.PlaneGeometry
  frontTex: THREE.CanvasTexture
  backTex: THREE.CanvasTexture
  index: number
}

export function FlipBook3D({ onClose: _onClose }: Props) {
  const { entries, meta, years } = useHandbook()
  const mountRef = useRef<HTMLDivElement>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [activeYear, setActiveYear] = useState(years[0] ?? 2026)
  const [ready, setReady] = useState(false)
  const pageIndexRef = useRef(0)
  const apiRef = useRef<{
    flipTo: (target: number, animate?: boolean) => void
  } | null>(null)

  const totalSheets = entries.length + 2

  const contentKey = useMemo(
    () =>
      JSON.stringify({
        meta,
        entries: entries.map((e) => ({
          id: e.id,
          title: e.title,
          body: e.body,
          dateLabel: e.dateLabel,
          weekday: e.weekday,
          year: e.year,
          illustration: e.illustration,
          imageDataUrl: e.imageDataUrl?.length ?? 0,
          favorite: e.favorite,
        })),
      }),
    [meta, entries],
  )

  useEffect(() => {
    pageIndexRef.current = pageIndex
  }, [pageIndex])

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let disposed = false
    let animFrame = 0
    const sheets: Sheet[] = []
    let flipping = false
    let drag: { startX: number } | null = null
    let flipAnim: {
      from: number
      to: number
      start: number
      chainGoal?: number
    } | null = null

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40)
    camera.position.set(0.55, 0.4, 6.4)
    camera.lookAt(0.55, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xfff8ff, 0.7))
    const key = new THREE.DirectionalLight(0xfff5ee, 1.2)
    key.position.set(3.2, 5.2, 4.2)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xd8c8f0, 0.5)
    fill.position.set(-3.5, 2.2, 2.5)
    scene.add(fill)

    const binder = new THREE.Group()
    scene.add(binder)

    const lavender = new THREE.MeshStandardMaterial({
      color: '#c9b6e0',
      roughness: 0.52,
      metalness: 0.06,
    })
    const lavenderDeep = new THREE.MeshStandardMaterial({
      color: '#a888c4',
      roughness: 0.55,
      metalness: 0.08,
    })

    const backBoard = new THREE.Mesh(
      new THREE.BoxGeometry(PAGE_W + 0.32, PAGE_H + 0.3, 0.1),
      lavender,
    )
    backBoard.position.set(PAGE_W / 2, 0, -0.1)
    backBoard.castShadow = true
    backBoard.receiveShadow = true
    binder.add(backBoard)

    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, PAGE_H + 0.3, 0.28),
      lavenderDeep,
    )
    spine.position.set(-0.02, 0, -0.02)
    spine.castShadow = true
    binder.add(spine)

    const frontFrame = new THREE.Mesh(
      new THREE.BoxGeometry(PAGE_W + 0.32, PAGE_H + 0.3, 0.06),
      lavender,
    )
    frontFrame.position.set(PAGE_W / 2, 0, 0.05)
    frontFrame.castShadow = true
    binder.add(frontFrame)

    const strap = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.45, 0.12),
      new THREE.MeshStandardMaterial({ color: '#9b7bb8', roughness: 0.4, metalness: 0.12 }),
    )
    strap.position.set(PAGE_W + 0.08, 0.08, 0.14)
    binder.add(strap)

    const ringMat = new THREE.MeshStandardMaterial({
      color: '#c8cad0',
      metalness: 0.88,
      roughness: 0.25,
    })
    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.02, 14, 32), ringMat)
      ring.rotation.y = Math.PI / 2
      ring.position.set(0.04, PAGE_H * 0.38 - (i / 5) * PAGE_H * 0.76, 0.04)
      ring.castShadow = true
      binder.add(ring)
    }

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.ShadowMaterial({ opacity: 0.2 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -PAGE_H / 2 - 0.4
    ground.receiveShadow = true
    scene.add(ground)

    const pagesRoot = new THREE.Group()
    pagesRoot.position.set(0.02, 0, 0.09)
    scene.add(pagesRoot)

    function texFrom(canvas: HTMLCanvasElement) {
      const t = new THREE.CanvasTexture(canvas)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = renderer.capabilities.getMaxAnisotropy()
      return t
    }

    function setSheetProgress(sheet: Sheet, progress: number) {
      applyPageCurl(sheet.geoFront, progress)
      copyPositions(sheet.geoFront, sheet.geoBack)
    }

    function applyPose(current: number, flipProgress: number, flippingIndex: number) {
      for (const sheet of sheets) {
        const i = sheet.index
        let p = 0
        if (i < current) p = 1
        else if (i === flippingIndex) p = flipProgress
        else p = 0
        setSheetProgress(sheet, p)

        let z = 0.02 - i * 0.0012
        if (i < current) z = -0.012 - (current - i) * 0.0015
        if (i === flippingIndex && flipProgress > 0 && flipProgress < 1) z = 0.1
        sheet.group.position.z = z
      }
    }

    async function buildSheets() {
      for (const s of sheets) {
        pagesRoot.remove(s.group)
        s.geoFront.dispose()
        s.geoBack.dispose()
        s.frontTex.dispose()
        s.backTex.dispose()
      }
      sheets.length = 0

      const count = entries.length + 2
      for (let i = 0; i < count; i++) {
        const canvasFront = document.createElement('canvas')
        const canvasBack = document.createElement('canvas')
        canvasFront.width = PAGE_TEX_W
        canvasFront.height = PAGE_TEX_H
        canvasBack.width = PAGE_TEX_W
        canvasBack.height = PAGE_TEX_H

        if (i === 0) {
          await drawCoverPage(canvasFront, meta)
          const ctx = canvasBack.getContext('2d')!
          ctx.fillStyle = '#f7f1ea'
          ctx.fillRect(0, 0, PAGE_TEX_W, PAGE_TEX_H)
        } else if (i === count - 1) {
          await drawBackPage(canvasFront, meta)
          const ctx = canvasBack.getContext('2d')!
          const g = ctx.createLinearGradient(0, 0, 0, PAGE_TEX_H)
          g.addColorStop(0, '#dccceb')
          g.addColorStop(1, '#b39dce')
          ctx.fillStyle = g
          ctx.fillRect(0, 0, PAGE_TEX_W, PAGE_TEX_H)
        } else {
          await drawMemoryPage(canvasFront, entries[i - 1]!, i)
          const ctx = canvasBack.getContext('2d')!
          ctx.fillStyle = '#f0ebe3'
          ctx.fillRect(0, 0, PAGE_TEX_W, PAGE_TEX_H)
          ctx.fillStyle = 'rgba(150,130,160,0.25)'
          ctx.font = '28px "Ma Shan Zheng", cursive'
          ctx.textAlign = 'center'
          ctx.fillText(meta.title, PAGE_TEX_W / 2, PAGE_TEX_H / 2)
        }

        const frontTex = texFrom(canvasFront)
        const backTex = texFrom(canvasBack)
        backTex.wrapS = THREE.RepeatWrapping
        backTex.repeat.x = -1
        backTex.offset.x = 1

        const geoFront = createPageGeometry()
        const geoBack = createPageGeometry()
        const front = new THREE.Mesh(
          geoFront,
          new THREE.MeshStandardMaterial({
            map: frontTex,
            roughness: 0.78,
            metalness: 0.02,
            side: THREE.FrontSide,
          }),
        )
        const back = new THREE.Mesh(
          geoBack,
          new THREE.MeshStandardMaterial({
            map: backTex,
            roughness: 0.85,
            metalness: 0,
            side: THREE.BackSide,
          }),
        )
        front.castShadow = true
        front.receiveShadow = true
        back.castShadow = true

        const group = new THREE.Group()
        group.add(front)
        group.add(back)
        pagesRoot.add(group)

        sheets.push({
          group,
          front,
          back,
          geoFront,
          geoBack,
          frontTex,
          backTex,
          index: i,
        })
      }

      applyPose(pageIndexRef.current, 0, pageIndexRef.current)
      if (!disposed) setReady(true)
    }

    function startFlip(toward: number, chainGoal?: number) {
      const cur = pageIndexRef.current
      if (toward === cur || flipping) return
      flipping = true
      flipAnim = { from: cur, to: toward, start: performance.now(), chainGoal }
    }

    apiRef.current = {
      flipTo: (target, animate = true) => {
        const max = Math.max(0, sheets.length - 1)
        const goal = Math.max(0, Math.min(max, target))
        if (!animate) {
          pageIndexRef.current = goal
          setPageIndex(goal)
          applyPose(goal, 0, goal)
          flipping = false
          flipAnim = null
          return
        }
        if (goal === pageIndexRef.current) return
        const step = goal > pageIndexRef.current ? pageIndexRef.current + 1 : pageIndexRef.current - 1
        startFlip(step, goal)
      },
    }

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const clock = new THREE.Clock()
    const tick = () => {
      if (disposed) return
      animFrame = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      binder.rotation.y = Math.sin(t * 0.32) * 0.028
      binder.position.y = Math.sin(t * 0.5) * 0.018
      pagesRoot.rotation.y = binder.rotation.y
      pagesRoot.position.y = binder.position.y

      if (flipAnim) {
        const u = Math.min(1, (performance.now() - flipAnim.start) / FLIP_MS)
        const e = easeInOutCubic(u)
        if (flipAnim.to > flipAnim.from) {
          applyPose(flipAnim.from, e, flipAnim.from)
        } else {
          applyPose(flipAnim.to, 1 - e, flipAnim.to)
        }
        if (u >= 1) {
          const landed = flipAnim.to
          const chain = flipAnim.chainGoal
          pageIndexRef.current = landed
          setPageIndex(landed)
          applyPose(landed, 0, landed)
          flipAnim = null
          flipping = false
          if (chain !== undefined && chain !== landed) {
            const step = chain > landed ? landed + 1 : landed - 1
            startFlip(step, chain)
          }
        }
      }

      renderer.render(scene, camera)
    }

    const onPointerDown = (ev: PointerEvent) => {
      if (flipping) return
      drag = { startX: ev.clientX }
      el.setPointerCapture(ev.pointerId)
    }
    const onPointerMove = (ev: PointerEvent) => {
      if (!drag || flipping) return
      const dx = ev.clientX - drag.startX
      const progress = Math.max(0, Math.min(1, Math.abs(dx) / (el.clientWidth * 0.38)))
      const cur = pageIndexRef.current
      if (dx < -4 && cur < sheets.length - 1) applyPose(cur, progress, cur)
      else if (dx > 4 && cur > 0) applyPose(cur - 1, 1 - progress, cur - 1)
    }
    const finishDrag = (ev: PointerEvent) => {
      if (!drag) return
      const dx = ev.clientX - drag.startX
      const progress = Math.abs(dx) / (el.clientWidth * 0.38)
      const cur = pageIndexRef.current
      drag = null
      if (progress > 0.25) {
        if (dx < 0 && cur < sheets.length - 1) apiRef.current?.flipTo(cur + 1, true)
        else if (dx > 0 && cur > 0) apiRef.current?.flipTo(cur - 1, true)
        else applyPose(cur, 0, cur)
      } else {
        applyPose(cur, 0, cur)
      }
    }
    let pointerMoved = false
    const onPointerDown2 = (ev: PointerEvent) => {
      pointerMoved = false
      onPointerDown(ev)
    }
    const onPointerMove2 = (ev: PointerEvent) => {
      if (drag && Math.abs(ev.clientX - drag.startX) > 8) pointerMoved = true
      onPointerMove(ev)
    }
    const onClick = (ev: MouseEvent) => {
      if (flipping || pointerMoved) return
      const rect = el.getBoundingClientRect()
      const x = ev.clientX - rect.left
      const cur = pageIndexRef.current
      if (x > rect.width * 0.55 && cur < sheets.length - 1) apiRef.current?.flipTo(cur + 1, true)
      else if (x < rect.width * 0.4 && cur > 0) apiRef.current?.flipTo(cur - 1, true)
    }

    el.addEventListener('pointerdown', onPointerDown2)
    el.addEventListener('pointermove', onPointerMove2)
    el.addEventListener('pointerup', finishDrag)
    el.addEventListener('pointercancel', finishDrag)
    el.addEventListener('click', onClick)

    void document.fonts.ready
      .then(() => buildSheets())
      .then(() => {
        if (!disposed) tick()
      })

    return () => {
      disposed = true
      cancelAnimationFrame(animFrame)
      ro.disconnect()
      el.removeEventListener('pointerdown', onPointerDown2)
      el.removeEventListener('pointermove', onPointerMove2)
      el.removeEventListener('pointerup', finishDrag)
      el.removeEventListener('pointercancel', finishDrag)
      el.removeEventListener('click', onClick)
      apiRef.current = null
      for (const s of sheets) {
        s.geoFront.dispose()
        s.geoBack.dispose()
        s.frontTex.dispose()
        s.backTex.dispose()
      }
      renderer.dispose()
      if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement)
    }
    // contentKey intentionally drives full rebuild
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey])

  const jumpYear = useCallback(
    (year: number) => {
      setActiveYear(year)
      apiRef.current?.flipTo(yearToPageIndex(year, entries), true)
    },
    [entries],
  )

  useEffect(() => {
    if (pageIndex === 0) {
      setActiveYear(years[0] ?? 2026)
      return
    }
    const entry = entries[pageIndex - 1]
    if (entry) setActiveYear(entry.year)
  }, [pageIndex, entries, years])

  const memoryCount = entries.length
  const hint =
    pageIndex === 0
      ? '拖动或轻点右半页翻开'
      : pageIndex >= totalSheets - 1
        ? '已到最后一页'
        : `第 ${Math.min(pageIndex, memoryCount)} / ${memoryCount} 篇`

  return (
    <div className="binder-stage binder-stage--3d">
      <div className="binder binder--3d">
        <div className="binder__canvas-wrap" ref={mountRef}>
          {!ready ? <div className="binder__loading">装订中…</div> : null}
        </div>
        <YearTabs activeYear={activeYear} years={years} onSelect={jumpYear} />
      </div>
      <p className="flip-hint" aria-live="polite">
        {hint}
      </p>
      <div className="flip-controls">
        <button
          type="button"
          className="flip-controls__btn"
          disabled={pageIndex <= 0}
          onClick={() => apiRef.current?.flipTo(pageIndex - 1, true)}
        >
          上一页
        </button>
        <button
          type="button"
          className="flip-controls__btn"
          disabled={pageIndex >= totalSheets - 1}
          onClick={() => apiRef.current?.flipTo(pageIndex + 1, true)}
        >
          下一页
        </button>
      </div>
    </div>
  )
}
