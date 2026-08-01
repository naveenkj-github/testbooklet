import { QuestionGroupLayout } from '@/components/question/QuestionGroupLayout'
import type { Question, QuestionAttempt, QuestionGroup } from '@/types/exam'

interface ReadingComprehensionRendererProps {
  group: QuestionGroup
  activeQuestion: Question
  attempt: QuestionAttempt
  onSelect: (optionId: string) => void
  onReport: () => void
  onBookmark: () => void
  onJumpToSibling: (questionId: string) => void
}

/**
 * Specialized entry-point for RC / cloze / DI / case groups.
 * Currently shares QuestionGroupLayout; kept separate for future type-specific chrome.
 */
export function ReadingComprehensionRenderer({
  group,
  activeQuestion,
  attempt,
  onSelect,
  onReport,
  onBookmark,
  onJumpToSibling,
}: ReadingComprehensionRendererProps) {
  return (
    <QuestionGroupLayout
      group={group}
      activeQuestion={activeQuestion}
      attempt={attempt}
      onSelect={onSelect}
      onReport={onReport}
      onBookmark={onBookmark}
      onJumpToSibling={onJumpToSibling}
    />
  )
}
