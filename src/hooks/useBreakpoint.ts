import { useEffect, useState } from 'react'
import {
  BREAKPOINTS,
  getDeviceTier,
  matchesMin,
  type Breakpoint,
  type DeviceTier,
} from '@/lib/breakpoints'

function getWidth() {
  return typeof window === 'undefined' ? BREAKPOINTS.xl : window.innerWidth
}

/** Reactive viewport helpers aligned to the design-system breakpoint tokens. */
export function useBreakpoint() {
  const [width, setWidth] = useState(getWidth)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const tier: DeviceTier = getDeviceTier(width)

  return {
    width,
    tier,
    isMobileSm: tier === 'mobile-sm',
    isMobileLg: tier === 'mobile-lg',
    isMobile: tier === 'mobile-sm' || tier === 'mobile-lg',
    isTablet: tier === 'tablet',
    isLaptop: tier === 'laptop',
    isDesktop: tier === 'desktop' || tier === 'desktop-lg',
    isAtLeast: (breakpoint: Breakpoint) => matchesMin(width, breakpoint),
    /** Docked question palette from `lg` (1024px) upward. */
    showDockedSidebar: matchesMin(width, 'lg'),
  }
}
