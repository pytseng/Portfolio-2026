import { useEffect, useRef } from 'react'

const BLUE = 'rgba(150, 187, 255, 0.92)'
const YELLOW = '#f4f493'
const CELL = 44
const LINE = 1.65
const FLOW_AMP = 11

type Props = {
  active?: boolean
}

/** Blue/yellow grid with slow water-like line flow. */
export function HeroGrid({ active = true }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let disposed = false
    let w = 0
    let h = 0
    let dpr = 1
    const start = performance.now()
    const ptsX: number[] = []
    const ptsY: number[] = []

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      w = Math.max(1, Math.floor(rect.width))
      h = Math.max(1, Math.floor(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    /** Layered waves — floaty organic current, same feel as the puddle edge */
    const flow = (x: number, y: number, t: number) => {
      const w1 = Math.sin(x * 0.018 + t * 0.5) * Math.cos(y * 0.014 - t * 0.34)
      const w2 = Math.sin(y * 0.02 + t * 0.42) * Math.cos(x * 0.012 + t * 0.27)
      const w3 = Math.sin((x + y) * 0.01 + t * 0.3)
      // Slow large-scale swell, like the viewport's breathing edge
      const swell = Math.sin(x * 0.004 + t * 0.32) * Math.cos(y * 0.005 - t * 0.24)
      return {
        x: x + (w1 * 0.55 + w2 * 0.35 + w3 * 0.25 + swell * 0.6) * FLOW_AMP,
        y: y + (w1 * 0.4 + w2 * 0.55 + w3 * 0.3 + swell * 0.5) * FLOW_AMP,
      }
    }

    const strokeCurve = (n: number) => {
      if (n < 2) return
      ctx.beginPath()
      ctx.moveTo(ptsX[0], ptsY[0])
      if (n === 2) {
        ctx.lineTo(ptsX[1], ptsY[1])
        ctx.stroke()
        return
      }
      for (let i = 0; i < n - 1; i++) {
        const p0x = ptsX[Math.max(0, i - 1)]
        const p0y = ptsY[Math.max(0, i - 1)]
        const p1x = ptsX[i]
        const p1y = ptsY[i]
        const p2x = ptsX[i + 1]
        const p2y = ptsY[i + 1]
        const p3x = ptsX[Math.min(n - 1, i + 2)]
        const p3y = ptsY[Math.min(n - 1, i + 2)]
        ctx.bezierCurveTo(
          p1x + (p2x - p0x) / 6,
          p1y + (p2y - p0y) / 6,
          p2x - (p3x - p1x) / 6,
          p2y - (p3y - p1y) / 6,
          p2x,
          p2y,
        )
      }
      ctx.stroke()
    }

    const drawFlowLine = (
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      t: number,
    ) => {
      const len = Math.hypot(x1 - x0, y1 - y0)
      const steps = Math.max(40, Math.ceil(len / 12))
      ptsX.length = 0
      ptsY.length = 0
      for (let i = 0; i <= steps; i++) {
        const u = i / steps
        const p = flow(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, t)
        ptsX.push(p.x)
        ptsY.push(p.y)
      }
      strokeCurve(ptsX.length)
    }

    const paint = (now: number) => {
      if (disposed) return
      const t = (now - start) / 1000

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = BLUE
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = YELLOW
      ctx.lineWidth = LINE
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const driftX = Math.sin(t * 0.16) * 14
      const driftY = Math.cos(t * 0.13) * 14

      const cols = Math.ceil(w / CELL) + 3
      const rows = Math.ceil(h / CELL) + 3
      for (let i = -1; i <= cols; i++) {
        const x = i * CELL + driftX
        drawFlowLine(x, -CELL, x, h + CELL, t)
      }
      for (let j = -1; j <= rows; j++) {
        const y = j * CELL + driftY
        drawFlowLine(-CELL, y, w + CELL, y, t)
      }

      raf = requestAnimationFrame(paint)
    }

    resize()
    raf = requestAnimationFrame(paint)
    window.addEventListener('resize', resize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return (
    <div className="bio-hero__grid" ref={wrapRef} aria-hidden="true">
      <canvas className="bio-hero__grid-canvas" ref={canvasRef} />
    </div>
  )
}
