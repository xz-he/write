/// <reference types="vite/client" />

declare module 'react-pageflip' {
  import type { ReactNode, Ref } from 'react'

  export interface HTMLFlipBookProps {
    children?: ReactNode
    width: number
    height: number
    size?: 'fixed' | 'stretch'
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    drawShadow?: boolean
    flippingTime?: number
    usePortrait?: boolean
    startPage?: number
    autoSize?: boolean
    maxShadowOpacity?: number
    showCover?: boolean
    mobileScrollSupport?: boolean
    clickEventForward?: boolean
    useMouseEvents?: boolean
    swipeDistance?: number
    showPageCorners?: boolean
    disableFlipByClick?: boolean
    className?: string
    style?: React.CSSProperties
    startZIndex?: number
    onFlip?: (e: { data: number }) => void
    onChangeState?: (e: { data: string }) => void
    ref?: Ref<unknown>
  }

  const HTMLFlipBook: React.ForwardRefExoticComponent<
    HTMLFlipBookProps & React.RefAttributes<unknown>
  >
  export default HTMLFlipBook
}
