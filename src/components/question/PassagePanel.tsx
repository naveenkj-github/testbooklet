import { memo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { QuestionGroup } from '@/types/exam'
import { cn } from '@/lib/utils'

interface PassagePanelProps {
  group: QuestionGroup
  className?: string
}

const typeLabel: Record<QuestionGroup['type'], string> = {
  reading_comprehension: 'Reading Comprehension',
  case_study: 'Case Study',
  cloze_test: 'Cloze Test',
  data_interpretation: 'Data Interpretation',
}

function PassagePanelComponent({ group, className }: PassagePanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <aside
      className={cn(
        'flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-border bg-[#F8FBFD] md:border-b-0 md:border-r dark:border-slate-700 dark:bg-slate-900/60',
        className,
      )}
      aria-label={`${typeLabel[group.type]} passage`}
    >
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-border px-2 py-2 dark:border-slate-700 xs:gap-3 xs:px-3 sm:px-4 md:px-5 md:py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold tracking-wide text-primary uppercase xs:text-xs">
            {typeLabel[group.type]}
          </p>
          <h3 className="mt-0.5 truncate text-xs font-bold text-text xs:text-sm sm:text-base md:text-lg">
            {group.title}
          </h3>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-white px-1.5 py-1 text-[10px] font-semibold text-slate-600 xs:rounded-lg xs:px-2 xs:text-xs md:hidden dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls={`passage-body-${group.id}`}
        >
          {mobileOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {mobileOpen ? 'Hide' : 'Passage'}
        </button>
      </div>

      <div
        id={`passage-body-${group.id}`}
        className={cn(
          'min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 md:px-5',
          !mobileOpen && 'hidden md:block',
        )}
      >
        {group.instructions ? (
          <p className="mb-2 text-[11px] font-semibold leading-relaxed text-slate-700 xs:mb-3 xs:text-xs sm:mb-4 sm:text-sm dark:text-slate-200">
            {group.instructions}
          </p>
        ) : null}

        {group.image ? (
          <img
            src={group.image}
            alt=""
            className="mb-3 max-h-32 w-full rounded-lg border border-border object-contain bg-white xs:max-h-40 sm:mb-4 sm:max-h-56 sm:rounded-xl"
          />
        ) : null}

        <div className="break-words whitespace-pre-wrap text-xs leading-6 text-text xs:text-sm xs:leading-7 sm:text-[15px] md:text-base md:leading-8">
          {group.passage}
        </div>
      </div>
    </aside>
  )
}

export const PassagePanel = memo(PassagePanelComponent, (prev, next) => {
  return (
    prev.group.id === next.group.id &&
    prev.group.passage === next.group.passage &&
    prev.group.title === next.group.title &&
    prev.className === next.className
  )
})

PassagePanel.displayName = 'PassagePanel'
