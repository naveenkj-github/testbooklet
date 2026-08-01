import { memo } from 'react'
import { PassagePanel } from '@/components/question/PassagePanel'
import { ChildQuestionPanel } from '@/components/question/ChildQuestionPanel'
import type { Question, QuestionAttempt, QuestionGroup } from '@/types/exam'

interface QuestionGroupLayoutProps {
  group: QuestionGroup
  activeQuestion: Question
  attempt: QuestionAttempt
  onSelect: (optionId: string) => void
  onReport: () => void
  onBookmark: () => void
  onJumpToSibling: (questionId: string) => void
}

function QuestionGroupLayoutComponent({
  group,
  activeQuestion,
  attempt,
  onSelect,
  onReport,
  onBookmark,
  onJumpToSibling,
}: QuestionGroupLayoutProps) {
  return (
    <div className="group-split" role="region" aria-label={`${group.title} question group`}>
      <div className="min-h-0 min-w-0 md:sticky md:top-0 md:h-full md:self-start">
        <PassagePanel
          group={group}
          className="h-full max-h-[32vh] xs:max-h-[36vh] sm:max-h-[40vh] md:max-h-none"
        />
      </div>

      <ChildQuestionPanel
        question={activeQuestion}
        attempt={attempt}
        siblingQuestions={group.questions}
        onSelect={onSelect}
        onReport={onReport}
        onBookmark={onBookmark}
        onJumpToSibling={onJumpToSibling}
      />
    </div>
  )
}

export const QuestionGroupLayout = memo(QuestionGroupLayoutComponent)
QuestionGroupLayout.displayName = 'QuestionGroupLayout'
