/**
 * Design-system documentation helpers.
 * Runtime tokens live in `src/index.css` (`@theme`) and `src/lib/breakpoints.ts`.
 */
export const DESIGN_TOKENS = {
  color: {
    primary: '#00AEEF',
    success: '#2EAD62',
    danger: '#E74C3C',
    warning: '#F4B400',
    purple: '#8E44AD',
    background: '#F6F8FB',
    border: '#E5E7EB',
    text: '#1F2937',
  },
  breakpoint: {
    xs: 320,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1920,
  },
  spacing: [4, 8, 12, 16, 20, 24, 32, 40],
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 12,
  },
} as const
