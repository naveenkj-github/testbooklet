import { Filter } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { QuestionPalette } from '@/components/question/QuestionPalette'
import {
  QuestionStatus,
  type PaletteFilter,
  type Question,
  type QuestionAttempt,
  type StatusCounts,
} from '@/types/exam'
import { cn } from '@/lib/utils'

interface SidebarProps {
  candidateName: string
  accessLabel: string
  sectionName: string
  counts: StatusCounts
  questions: Question[]
  attempts: Record<string, QuestionAttempt>
  currentQuestionId: string
  paletteFilter: PaletteFilter
  className?: string
  onSelectQuestion: (questionId: string) => void
  onFilterChange: (filter: PaletteFilter) => void
  onSubmitSection: () => void
  onSubmitTest: () => void
  onLogout?: () => void
}

const legend = [
  { key: QuestionStatus.ANSWERED, label: 'Answered', className: 'bg-success text-white' },
  { key: QuestionStatus.MARKED, label: 'Marked', className: 'bg-purple text-white' },
  {
    key: QuestionStatus.MARKED_AND_ANSWERED,
    label: 'Marked & Answered',
    className: 'bg-purple text-white relative after:absolute after:right-0.5 after:bottom-0.5 after:h-1.5 after:w-1.5 after:rounded-full after:bg-success',
  },
  { key: QuestionStatus.NOT_ANSWERED, label: 'Not Answered', className: 'bg-danger text-white' },
  { key: QuestionStatus.NOT_VISITED, label: 'Not Visited', className: 'bg-white text-slate-700 border border-slate-300' },
] as const

export function Sidebar({
  candidateName,
  accessLabel,
  sectionName,
  counts,
  questions,
  attempts,
  currentQuestionId,
  paletteFilter,
  className,
  onSelectQuestion,
  onFilterChange,
  onSubmitSection,
  onSubmitTest,
  onLogout,
}: SidebarProps) {
  const filteredQuestions =
    paletteFilter === 'ALL'
      ? questions
      : questions.filter((question) => attempts[question.id]?.status === paletteFilter)

  const countMap: Record<QuestionStatus, number> = {
    [QuestionStatus.ANSWERED]: counts.answered,
    [QuestionStatus.MARKED]: counts.marked,
    [QuestionStatus.MARKED_AND_ANSWERED]: counts.markedAndAnswered,
    [QuestionStatus.NOT_ANSWERED]: counts.notAnswered,
    [QuestionStatus.NOT_VISITED]: counts.notVisited,
  }

  return (
    <aside
      className={cn(
        'flex h-full w-full min-w-0 flex-col overflow-hidden border-l border-border bg-[#F3F8FC] dark:border-slate-700 dark:bg-slate-950',
        className,
      )}
    >
      <div className="min-h-0 space-y-3 overflow-y-auto overflow-x-hidden p-3 xs:space-y-4 xs:p-4">
        <Card className="bg-[#E7F6FC] p-2.5 xs:p-3 dark:bg-slate-900">
          <div className="flex items-center gap-2 xs:gap-3">
            <Avatar name={candidateName} className="h-8 w-8 xs:h-10 xs:w-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-text xs:text-sm">{candidateName}</p>
              <p className="truncate text-[10px] font-medium tracking-wide text-primary xs:text-xs">
                {accessLabel}
              </p>
            </div>
          </div>
          {onLogout ? (
            <Button variant="ghost" size="xs" className="mt-2 w-full" onClick={onLogout}>
              Logout
            </Button>
          ) : null}
        </Card>

        <div className="grid grid-cols-2 gap-1.5 xs:gap-2">
          {legend.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onFilterChange(item.key)}
              className={cn(
                'flex min-w-0 items-center gap-1.5 rounded-lg border border-border bg-white px-1.5 py-1.5 text-left transition duration-200 xs:gap-2 xs:rounded-xl xs:px-2 xs:py-2 dark:border-slate-700 dark:bg-slate-900',
                paletteFilter === item.key && 'ring-2 ring-primary/30',
              )}
            >
              <span className={cn('inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold xs:h-6 xs:min-w-6 xs:text-xs', item.className)}>
                {countMap[item.key]}
              </span>
              <span className="truncate text-[10px] font-medium text-slate-600 xs:text-[11px] dark:text-slate-300">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wide text-slate-600 uppercase">
            Section: {sectionName}
          </p>
          <Button variant="ghost" size="sm" onClick={() => onFilterChange('ALL')} aria-label="Clear palette filter">
            <Filter className="h-3.5 w-3.5" />
            All
          </Button>
        </div>

        <QuestionPalette
          questions={filteredQuestions}
          attempts={attempts}
          currentQuestionId={currentQuestionId}
          onSelect={onSelectQuestion}
        />
      </div>

      <div className="mt-auto space-y-2 border-t border-border p-4 dark:border-slate-700">
        <Button className="w-full" onClick={onSubmitSection}>
          Submit Section
        </Button>
        <Button className="w-full" variant="secondary" onClick={onSubmitTest}>
          Submit Test
        </Button>
      </div>
    </aside>
  )
}
