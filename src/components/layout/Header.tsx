import { Maximize, Minimize, Moon, Pause, Play, Sun } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { Timer } from '@/components/common/Timer'

interface HeaderProps {
  title: string
  candidateName: string
  remainingSeconds: number
  isPaused: boolean
  isDarkMode: boolean
  isFullscreen: boolean
  onTogglePause: () => void
  onToggleDarkMode: () => void
  onToggleFullscreen: () => void
}

export function Header({
  title,
  candidateName,
  remainingSeconds,
  isPaused,
  isDarkMode,
  isFullscreen,
  onTogglePause,
  onToggleDarkMode,
  onToggleFullscreen,
}: HeaderProps) {
  return (
    <header className="flex h-[var(--exam-header-h)] min-w-0 items-center justify-between gap-1.5 overflow-hidden border-b border-border bg-surface px-2 dark:border-slate-700 dark:bg-slate-950 xs:gap-2 xs:px-3 sm:gap-3 sm:px-4 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 xs:gap-2 sm:gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-[10px] font-extrabold text-white xs:h-8 xs:w-8 xs:rounded-lg xs:text-xs sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm">
          CBT
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold leading-tight text-text xs:text-xs sm:text-sm md:text-base">
            {title}
          </p>
          <p className="hidden truncate text-xs text-text-muted sm:block">Computer Based Test</p>
        </div>
      </div>

      {/* From tablet portrait up, timer lives in the header */}
      <Timer
        seconds={remainingSeconds}
        paused={isPaused}
        compact
        className="hidden min-w-0 md:flex"
      />

      <div className="flex shrink-0 items-center gap-0.5 xs:gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="xs"
          className="hidden px-1.5 sm:inline-flex md:px-2.5"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
          <span className="hidden xl:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </Button>
        <Button
          variant="secondary"
          size="xs"
          className="px-1.5 xs:px-2"
          onClick={onTogglePause}
          aria-label={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          <span className="hidden md:inline">{isPaused ? 'Resume' : 'Pause'}</span>
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="px-1.5"
          onClick={onToggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </Button>
        <Avatar name={candidateName} className="hidden h-8 w-8 sm:flex sm:h-9 sm:w-9 md:h-10 md:w-10" />
      </div>
    </header>
  )
}
