import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
  secondary: 'bg-[#E8F8FD] text-primary border border-[#B6E8F7]',
  outline: 'bg-white text-primary border border-primary',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  danger: 'bg-danger text-white hover:bg-[#d63b2c]',
}

const sizes: Record<Size, string> = {
  xs: 'h-8 px-2 text-xs rounded-lg gap-1',
  sm: 'h-9 px-2.5 text-xs sm:px-3 sm:text-sm rounded-lg sm:rounded-xl',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-11 px-5 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex max-w-full items-center justify-center font-semibold transition duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.99] sm:hover:scale-[1.02]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
)

Button.displayName = 'Button'
