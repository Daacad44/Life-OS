/** Small, dependency-free SVG chart helpers shared by Analytics and Finance. */

/** Circumference of the donut ring used across the app (r = 46). */
export const DONUT_CIRCUMFERENCE = 2 * Math.PI * 46

export interface DonutArc {
  dasharray: string
  offset: number
}

/**
 * Turn a list of values into stroke-dasharray / dashoffset pairs for stacked
 * donut segments on an r=46 ring. Zero-total returns empty arcs.
 */
export function donutArcs(values: number[]): DonutArc[] {
  const total = values.reduce((sum, v) => sum + v, 0)
  if (total <= 0)
    return values.map(() => ({ dasharray: `0 ${DONUT_CIRCUMFERENCE}`, offset: 0 }))
  let consumed = 0
  return values.map((v) => {
    const length = (v / total) * DONUT_CIRCUMFERENCE
    const arc: DonutArc = {
      dasharray: `${length} ${DONUT_CIRCUMFERENCE - length}`,
      offset: -consumed,
    }
    consumed += length
    return arc
  })
}

/** "x,y x,y …" points for an SVG polyline scaled into a box. */
export function polylinePoints(
  values: number[],
  width: number,
  height: number,
  pad = 10,
): string {
  const max = Math.max(1, ...values)
  const step = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0
  return values
    .map((v, i) => {
      const x = pad + i * step
      const y = height - pad - (v / max) * (height - pad * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
