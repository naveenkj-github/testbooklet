import { Button } from '@/components/common/Button'

interface FooterProps {
  onMark: () => void
  onClear: () => void
  onPrevious: () => void
  onNext: () => void
  onSaveAndNext: () => void
  isMarked: boolean
}

export function Footer({
  onMark,
  onClear,
  onPrevious,
  onNext,
  onSaveAndNext,
  isMarked,
}: FooterProps) {
  return (
    <footer className="z-20 shrink-0 border-t border-border bg-surface/95 px-2 py-1.5 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95 xs:px-3 xs:py-2 sm:px-4 sm:py-3 md:px-6">
      {/*
        320px: single horizontal scroll row so the question area keeps height.
        480px+: wrapping flex groups.
      */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-between sm:overflow-visible sm:pb-0">
        <div className="flex shrink-0 items-center gap-1.5">
          <Button variant="secondary" size="xs" className="whitespace-nowrap sm:h-9 sm:px-3 sm:text-sm" onClick={onMark}>
            <span className="sm:hidden">{isMarked ? 'Unmark' : 'Mark'}</span>
            <span className="hidden sm:inline">{isMarked ? 'Unmark Review' : 'Mark for Review'}</span>
          </Button>
          <Button variant="secondary" size="xs" className="whitespace-nowrap sm:h-9 sm:px-3 sm:text-sm" onClick={onClear}>
            Clear
          </Button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <Button variant="outline" size="xs" className="whitespace-nowrap sm:h-9 sm:px-3 sm:text-sm" onClick={onPrevious}>
            Prev
          </Button>
          <Button variant="outline" size="xs" className="whitespace-nowrap sm:h-9 sm:px-3 sm:text-sm" onClick={onNext}>
            Next
          </Button>
          <Button size="xs" className="whitespace-nowrap sm:h-9 sm:min-w-28 sm:px-4 sm:text-sm" onClick={onSaveAndNext}>
            <span className="sm:hidden">Save</span>
            <span className="hidden sm:inline">Save & Next</span>
          </Button>
        </div>
      </div>
    </footer>
  )
}
