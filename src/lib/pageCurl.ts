import * as THREE from 'three'

export const PAGE_W = 2.35
export const PAGE_H = 3.25
export const SEGS_X = 32
export const SEGS_Y = 18

/** Create plane with spine (left edge) at x=0, extending to +X */
export function createPageGeometry(): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(PAGE_W, PAGE_H, SEGS_X, SEGS_Y)
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    pos.setX(i, pos.getX(i) + PAGE_W / 2)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

/**
 * Soft page curl around the spine (x=0).
 * progress 0 = flat on the right; 1 = fully turned to the left.
 */
export function applyPageCurl(geometry: THREE.PlaneGeometry, progress: number): void {
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const p = Math.min(1, Math.max(0, progress))
  const angle = p * Math.PI
  // Curl radius shrinks slightly as page finishes flat on left
  const radius = PAGE_W / Math.PI

  for (let i = 0; i < pos.count; i++) {
    const ix = i % (SEGS_X + 1)
    const iy = Math.floor(i / (SEGS_X + 1))
    const x0 = (ix / SEGS_X) * PAGE_W
    const y = (iy / SEGS_Y) * PAGE_H - PAGE_H / 2

    if (p < 0.0005) {
      pos.setXYZ(i, x0, y, 0)
      continue
    }

    let x: number
    let z: number
    if (x0 < radius * angle) {
      const a = x0 / radius
      x = radius * Math.sin(a)
      z = -radius * (1 - Math.cos(a))
    } else {
      const a = angle
      const rem = x0 - radius * a
      x = radius * Math.sin(a) + rem * Math.cos(a)
      z = -radius * (1 - Math.cos(a)) - rem * Math.sin(a)
    }
    pos.setXYZ(i, x, y, z)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
}

export function copyPositions(from: THREE.PlaneGeometry, to: THREE.PlaneGeometry): void {
  const src = from.attributes.position as THREE.BufferAttribute
  const dst = to.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < src.count; i++) {
    dst.setXYZ(i, src.getX(i), src.getY(i), src.getZ(i))
  }
  dst.needsUpdate = true
  to.computeVertexNormals()
}
