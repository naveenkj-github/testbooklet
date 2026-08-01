import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900',
        className,
      )}
    >
      {children}
    </div>
  )
}
