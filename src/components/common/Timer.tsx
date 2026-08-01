import { cn } from '@/lib/utils'
import { formatHms } from '@/lib/utils'

interface TimerProps {
  seconds: number
  label?: string
  paused?: boolean
  compact?: boolean
  className?: string
}

export function Timer({
  seconds,
  label = 'Time',
  paused,
  compact = false,
  className,
}: TimerProps) {
  const [h, m, s] = formatHms(seconds).split(' : ')

  return (
    <div className={cn('flex min-w-0 items-center gap-1 xs:gap-1.5 sm:gap-2', className)} aria-live="polite">
      <span
        className={cn(
          'shrink-0 font-medium text-text-muted',
          compact ? 'hidden text-[10px] lg:inline lg:text-xs' : 'text-[10px] xs:text-xs',
        )}
      >
        {label}
      </span>
      <div className="flex min-w-0 items-center gap-0.5 xs:gap-1">
        {[h, m, s].map((part, index) => (
          <div key={`${part}-${index}`} className="flex items-center gap-0.5 xs:gap-1">
            <span
              className={cn(
                'inline-flex items-center justify-center font-bold text-white tabular-nums',
                compact
                  ? 'h-6 min-w-6 rounded px-1 text-[10px] xs:h-7 xs:min-w-7 xs:text-xs sm:h-8 sm:min-w-8 sm:rounded-lg sm:text-sm'
                  : 'h-7 min-w-7 rounded-md px-1 text-[11px] xs:h-8 xs:min-w-8 xs:text-xs sm:min-w-9 sm:rounded-xl sm:text-sm',
                paused ? 'bg-warning text-slate-900' : 'bg-slate-700',
              )}
            >
              {part}
            </span>
            {index < 2 ? <span className="text-[10px] font-bold text-slate-500 xs:text-xs">:</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
