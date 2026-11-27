import type { BookMeta, IllustrationKind, MemoryEntry } from '../data/entries'

export const PAGE_TEX_W = 768
export const PAGE_TEX_H = 1068

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 8,
) {
  const chars = [...text]
  let line = ''
  let cy = y
  let lines = 0
  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i]
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy)
      line = chars[i]!
      cy += lineHeight
      lines++
      if (lines >= maxLines - 1) {
        const rest = chars.slice(i).join('')
        let truncated = rest
        while (ctx.measureText(truncated + '…').width > maxWidth && truncated.length > 0) {
          truncated = truncated.slice(0, -1)
        }
        ctx.fillText(truncated + (truncated.length < rest.length ? '…' : ''), x, cy)
        return
      }
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, cy)
}

function drawPaper(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#fffdf9')
  grad.addColorStop(1, '#faf6f1')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  const edge = ctx.createLinearGradient(0, 0, 48, 0)
  edge.addColorStop(0, 'rgba(180,160,140,0.12)')
  edge.addColorStop(1, 'rgba(180,160,140,0)')
  ctx.fillStyle = edge
  ctx.fillRect(0, 0, 48, h)
}

function drawBuiltinIllustration(
  ctx: CanvasRenderingContext2D,
  kind: IllustrationKind,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  roundRect(ctx, x, y, w, h, 18)
  ctx.save()
  ctx.clip()

  const fill = (c: string) => {
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
  }

  switch (kind) {
    case 'sunshine': {
      const g = ctx.createLinearGradient(x, y, x, y + h)
      g.addColorStop(0, '#E8DFF5')
      g.addColorStop(1, '#F7EFE6')
      ctx.fillStyle = g
      ctx.fillRect(x, y, w, h)
      const sun = ctx.createRadialGradient(x + w * 0.7, y + h * 0.28, 4, x + w * 0.7, y + h * 0.28, w * 0.35)
      sun.addColorStop(0, '#FFE6A8')
      sun.addColorStop(1, 'rgba(255,230,168,0)')
      ctx.fillStyle = sun
      ctx.beginPath()
      ctx.arc(x + w * 0.7, y + h * 0.28, w * 0.35, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#E8D5C0'
      ctx.beginPath()
      ctx.ellipse(x + w * 0.5, y + h * 0.78, w * 0.28, h * 0.08, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#F6D9CE'
      ctx.beginPath()
      ctx.ellipse(x + w * 0.46, y + h * 0.62, w * 0.14, h * 0.14, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x + w * 0.46, y + h * 0.48, w * 0.08, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'first-smile':
      fill('#F3EAF8')
      ctx.fillStyle = '#F6D9CE'
      ctx.beginPath()
      ctx.arc(x + w * 0.5, y + h * 0.48, w * 0.18, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#C97B6B'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x + w * 0.5, y + h * 0.52, w * 0.07, 0.15 * Math.PI, 0.85 * Math.PI)
      ctx.stroke()
      ctx.fillStyle = '#6B5A55'
      ctx.beginPath()
      ctx.arc(x + w * 0.44, y + h * 0.45, 4, 0, Math.PI * 2)
      ctx.arc(x + w * 0.56, y + h * 0.45, 4, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'tiny-hands':
      fill('#EDE6F5')
      ctx.fillStyle = '#F6D9CE'
      ctx.beginPath()
      ctx.moveTo(x + w * 0.2, y + h * 0.7)
      ctx.quadraticCurveTo(x + w * 0.35, y + h * 0.35, x + w * 0.55, y + h * 0.55)
      ctx.quadraticCurveTo(x + w * 0.75, y + h * 0.3, x + w * 0.85, y + h * 0.65)
      ctx.lineTo(x + w * 0.2, y + h * 0.7)
      ctx.fill()
      ctx.fillStyle = 'rgba(201,182,224,0.55)'
      ctx.beginPath()
      ctx.arc(x + w * 0.78, y + h * 0.32, w * 0.08, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'garden': {
      const g = ctx.createLinearGradient(x, y, x, y + h)
      g.addColorStop(0, '#DCE8F5')
      g.addColorStop(1, '#E8F0E0')
      ctx.fillStyle = g
      ctx.fillRect(x, y, w, h)
      ctx.fillStyle = 'rgba(168,192,144,0.55)'
      ctx.beginPath()
      ctx.ellipse(x + w * 0.5, y + h * 0.85, w * 0.42, h * 0.1, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#8FAE78'
      ctx.beginPath()
      ctx.moveTo(x + w * 0.25, y + h * 0.8)
      ctx.quadraticCurveTo(x + w * 0.3, y + h * 0.3, x + w * 0.38, y + h * 0.8)
      ctx.fill()
      ctx.fillStyle = 'rgba(201,182,224,0.85)'
      ctx.beginPath()
      ctx.arc(x + w * 0.32, y + h * 0.35, w * 0.08, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#F6D9CE'
      ctx.beginPath()
      ctx.arc(x + w * 0.48, y + h * 0.62, w * 0.07, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'first-steps':
      fill('#F5EDE4')
      ctx.fillStyle = 'rgba(217,200,176,0.5)'
      ctx.fillRect(x + w * 0.12, y + h * 0.75, w * 0.76, 8)
      ctx.fillStyle = '#C9B6E0'
      ctx.beginPath()
      ctx.ellipse(x + w * 0.4, y + h * 0.55, w * 0.07, h * 0.14, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#F6D9CE'
      ctx.beginPath()
      ctx.arc(x + w * 0.4, y + h * 0.38, w * 0.055, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'starry':
      fill('#2A2440')
      ctx.fillStyle = '#FFE6A8'
      for (const [px, py, r] of [
        [0.2, 0.25, 2],
        [0.5, 0.18, 3],
        [0.75, 0.3, 2],
        [0.35, 0.4, 1.5],
        [0.65, 0.45, 2.5],
      ] as const) {
        ctx.beginPath()
        ctx.arc(x + w * px, y + h * py, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = '#F6D9CE'
      ctx.beginPath()
      ctx.arc(x + w * 0.45, y + h * 0.7, w * 0.08, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'birthday':
      fill('#F8E8F0')
      ctx.fillStyle = '#F6D9CE'
      ctx.beginPath()
      ctx.arc(x + w * 0.5, y + h * 0.42, w * 0.12, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#E8A0B0'
      roundRect(ctx, x + w * 0.32, y + h * 0.58, w * 0.36, h * 0.22, 10)
      ctx.fill()
      ctx.fillStyle = '#FFE6A8'
      ctx.fillRect(x + w * 0.48, y + h * 0.48, 6, 18)
      ctx.beginPath()
      ctx.arc(x + w * 0.51, y + h * 0.46, 5, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'snow':
      fill('#E8EEF5')
      ctx.fillStyle = '#fff'
      for (const [px, py, r] of [
        [0.2, 0.2, 3],
        [0.4, 0.35, 2],
        [0.7, 0.25, 4],
        [0.55, 0.5, 2.5],
        [0.3, 0.55, 3],
        [0.8, 0.55, 2],
      ] as const) {
        ctx.beginPath()
        ctx.arc(x + w * px, y + h * py, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = '#F6D9CE'
      ctx.beginPath()
      ctx.arc(x + w * 0.5, y + h * 0.7, w * 0.09, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#C9B6E0'
      roundRect(ctx, x + w * 0.38, y + h * 0.58, w * 0.24, h * 0.08, 8)
      ctx.fill()
      break
    default:
      fill('#F3EAF8')
  }

  ctx.restore()
  ctx.strokeStyle = 'rgba(120,100,140,0.12)'
  ctx.lineWidth = 1
  roundRect(ctx, x, y, w, h, 18)
  ctx.stroke()
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image load failed'))
    img.src = src
  })
}

export async function drawCoverPage(
  canvas: HTMLCanvasElement,
  meta: BookMeta,
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = PAGE_TEX_W
  const h = PAGE_TEX_H
  canvas.width = w
  canvas.height = h

  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#dccceb')
  g.addColorStop(0.45, '#c9b6e0')
  g.addColorStop(1, '#b39dce')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  const shine = ctx.createLinearGradient(0, 0, w, h)
  shine.addColorStop(0, 'rgba(255,255,255,0.35)')
  shine.addColorStop(0.4, 'rgba(255,255,255,0)')
  ctx.fillStyle = shine
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = 'rgba(74,58,98,0.7)'
  ctx.font = '500 42px Caveat, cursive'
  ctx.textAlign = 'center'
  ctx.fillText(meta.coverEyebrow || 'Memory Book', w / 2, h * 0.32)

  ctx.fillStyle = '#4a3a62'
  ctx.font = '72px "Ma Shan Zheng", cursive'
  ctx.fillText(meta.title, w / 2, h * 0.42)

  ctx.fillStyle = '#9b7bb8'
  ctx.font = '36px "ZCOOL XiaoWei", serif'
  ctx.fillText(meta.subtitle, w / 2, h * 0.5)

  ctx.fillStyle = 'rgba(123,95,150,0.45)'
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.arc(w / 2 - 24 + i * 24, h * 0.58, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = 'rgba(74,58,98,0.55)'
  ctx.font = '28px Outfit, sans-serif'
  ctx.fillText('向右轻翻 · 打开记忆', w / 2, h * 0.72)
}

export async function drawMemoryPage(
  canvas: HTMLCanvasElement,
  entry: MemoryEntry,
  pageNumber: number,
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = PAGE_TEX_W
  const h = PAGE_TEX_H
  canvas.width = w
  canvas.height = h
  drawPaper(ctx, w, h)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#6b6278'
  ctx.font = '26px Outfit, sans-serif'
  ctx.fillText(`${entry.weekday}，${entry.dateLabel}`, w / 2, 78)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#a090b0'
  ctx.font = '22px Outfit, sans-serif'
  ctx.fillText(String(entry.year), w - 48, 78)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#4a3a62'
  ctx.font = '56px "Ma Shan Zheng", cursive'
  ctx.fillText(entry.title, w / 2, 150)

  const artX = 90
  const artY = 180
  const artW = w - 180
  const artH = 340

  if (entry.illustration === 'custom' && entry.imageDataUrl) {
    try {
      const img = await loadImage(entry.imageDataUrl)
      roundRect(ctx, artX, artY, artW, artH, 18)
      ctx.save()
      ctx.clip()
      const scale = Math.max(artW / img.width, artH / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      ctx.drawImage(img, artX + (artW - dw) / 2, artY + (artH - dh) / 2, dw, dh)
      ctx.restore()
      ctx.strokeStyle = 'rgba(120,100,140,0.12)'
      roundRect(ctx, artX, artY, artW, artH, 18)
      ctx.stroke()
    } catch {
      drawBuiltinIllustration(ctx, 'sunshine', artX, artY, artW, artH)
    }
  } else {
    drawBuiltinIllustration(
      ctx,
      entry.illustration === 'custom' ? 'sunshine' : entry.illustration,
      artX,
      artY,
      artW,
      artH,
    )
  }

  if (entry.favorite) {
    ctx.strokeStyle = '#9B7BB8'
    ctx.lineWidth = 2
    const sx = artX + artW - 10
    const sy = artY + artH * 0.45
    ctx.beginPath()
    ctx.moveTo(sx, sy - 10)
    ctx.lineTo(sx + 5, sy - 2)
    ctx.lineTo(sx + 14, sy - 1)
    ctx.lineTo(sx + 7, sy + 5)
    ctx.lineTo(sx + 9, sy + 14)
    ctx.lineTo(sx, sy + 9)
    ctx.lineTo(sx - 9, sy + 14)
    ctx.lineTo(sx - 7, sy + 5)
    ctx.lineTo(sx - 14, sy - 1)
    ctx.lineTo(sx - 5, sy - 2)
    ctx.closePath()
    ctx.stroke()
  }

  ctx.fillStyle = '#3d3548'
  ctx.font = '32px "ZCOOL XiaoWei", serif'
  ctx.textAlign = 'center'
  wrapText(ctx, entry.body, w / 2, 580, w - 140, 48, 7)

  ctx.fillStyle = '#a090b0'
  ctx.font = '24px Outfit, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(String(pageNumber), w - 48, h - 40)
}

export async function drawBackPage(
  canvas: HTMLCanvasElement,
  meta: BookMeta,
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = PAGE_TEX_W
  const h = PAGE_TEX_H
  canvas.width = w
  canvas.height = h
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#f7f1fb')
  g.addColorStop(1, '#ebe0f3')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#5a4a6e'
  ctx.font = '48px "Ma Shan Zheng", cursive'
  ctx.fillText(meta.backLine || '愿每一页，都有光。', w / 2, h * 0.48)

  ctx.fillStyle = '#9b7bb8'
  ctx.font = '32px "ZCOOL XiaoWei", serif'
  ctx.fillText(meta.title, w / 2, h * 0.56)
}

export type SheetKind = 'cover' | 'memory' | 'back'

export async function drawSheet(
  canvas: HTMLCanvasElement,
  kind: SheetKind,
  meta: BookMeta,
  entry?: MemoryEntry,
  pageNumber = 1,
): Promise<void> {
  if (kind === 'cover') await drawCoverPage(canvas, meta)
  else if (kind === 'back') await drawBackPage(canvas, meta)
  else if (entry) await drawMemoryPage(canvas, entry, pageNumber)
}
