import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  tone?: 'success' | 'danger' | 'warning' | 'purple' | 'neutral' | 'primary'
}

const tones = {
  success: 'bg-success/15 text-success',
  danger: 'bg-danger/15 text-danger',
  warning: 'bg-warning/20 text-[#9a7400]',
  purple: 'bg-purple/15 text-purple',
  neutral: 'bg-slate-100 text-slate-700',
  primary: 'bg-primary/15 text-primary',
}

export function Badge({ children, className, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2 py-1 text-xs font-bold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
