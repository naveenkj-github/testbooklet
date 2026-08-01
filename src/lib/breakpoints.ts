/**
 * Responsive breakpoint strategy (mobile-first).
 *
 * Base (unprefixed) styles target the smallest supported viewport (320px).
 * Each named breakpoint is a `min-width` and layers progressively richer
 * layouts on top. Breakpoints are defined by content/device category rather
 * than fixed device sizes. Supported range is 320px -> 1920px+.
 *
 * | Token | Min width | Device category                      |
 * | ----- | --------- | ------------------------------------ |
 * | xs    | 320px     | Mobile (small) 320–479px             |
 * | sm    | 480px     | Mobile (large) 480–767px             |
 * | md    | 768px     | Tablet (portrait) 768–1023px         |
 * | lg    | 1024px    | Tablet (landscape) / small laptop    |
 * | xl    | 1280px    | Desktop 1280–1919px                  |
 * | 2xl   | 1920px    | Large desktop 1920px+                |
 *
 * Keep in sync with `@theme` breakpoints in `src/index.css`.
 */
export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1920,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

/** Content-driven device tiers derived from the token table above. */
export type DeviceTier = 'mobile-sm' | 'mobile-lg' | 'tablet' | 'laptop' | 'desktop' | 'desktop-lg'

export function getDeviceTier(width: number): DeviceTier {
  if (width < BREAKPOINTS.sm) return 'mobile-sm'
  if (width < BREAKPOINTS.md) return 'mobile-lg'
  if (width < BREAKPOINTS.lg) return 'tablet'
  if (width < BREAKPOINTS.xl) return 'laptop'
  if (width < BREAKPOINTS['2xl']) return 'desktop'
  return 'desktop-lg'
}

export function matchesMin(width: number, breakpoint: Breakpoint): boolean {
  return width >= BREAKPOINTS[breakpoint]
}
