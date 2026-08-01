import { Flag, Bookmark } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { formatMmSs } from '@/lib/utils'
import type { Question, QuestionAttempt } from '@/types/exam'

interface QuestionHeaderProps {
  question: Question
  attempt: QuestionAttempt
  onReport: () => void
  onBookmark: () => void
}

export function QuestionHeader({ question, attempt, onReport, onBookmark }: QuestionHeaderProps) {
  return (
    <div className="mb-3 flex min-w-0 flex-col gap-2 xs:mb-4 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
      <h2 className="text-base font-bold text-text xs:text-lg sm:text-xl">Q. {question.number}</h2>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted xs:gap-2 xs:text-xs sm:text-sm">
          <span className="hidden xs:inline">Marks</span>
          <Badge tone="success">+{question.positiveMarks}</Badge>
          <Badge tone="danger">-{question.negativeMarks}</Badge>
        </div>
        <div className="text-[11px] text-text-muted xs:text-xs sm:text-sm">
          <span className="xs:hidden">{formatMmSs(attempt.timeSpentSeconds)}</span>
          <span className="hidden xs:inline">
            Time <strong className="ml-1 text-text">{formatMmSs(attempt.timeSpentSeconds)}</strong>
          </span>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={onBookmark}
          aria-pressed={attempt.bookmarked}
          aria-label="Bookmark question"
        >
          <Bookmark className={`h-3.5 w-3.5 ${attempt.bookmarked ? 'fill-primary text-primary' : ''}`} />
        </Button>
        <Button variant="ghost" size="xs" onClick={onReport} aria-label="Report question">
          <Flag className="h-3.5 w-3.5 text-danger" />
          <span className="hidden sm:inline">Report</span>
        </Button>
      </div>
    </div>
  )
}
