import { motion } from 'framer-motion'
import { QuestionStatus, type Question, type QuestionAttempt } from '@/types/exam'
import { cn } from '@/lib/utils'

interface QuestionPaletteProps {
  questions: Question[]
  attempts: Record<string, QuestionAttempt>
  currentQuestionId: string
  onSelect: (questionId: string) => void
}

const statusClass: Record<QuestionStatus, string> = {
  [QuestionStatus.ANSWERED]: 'bg-success border-success text-white',
  [QuestionStatus.NOT_VISITED]: 'bg-white border-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-100',
  [QuestionStatus.NOT_ANSWERED]: 'bg-danger border-danger text-white',
  [QuestionStatus.MARKED]: 'bg-purple border-purple text-white',
  [QuestionStatus.MARKED_AND_ANSWERED]:
    'bg-purple border-purple text-white relative after:absolute after:right-1 after:bottom-1 after:h-2 after:w-2 after:rounded-full after:bg-success',
}

export function QuestionPalette({
  questions,
  attempts,
  currentQuestionId,
  onSelect,
}: QuestionPaletteProps) {
  return (
    <div
      className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 sm:gap-2 lg:grid-cols-4 xl:grid-cols-5"
      role="list"
      aria-label="Question palette"
    >
      {questions.map((question) => {
        const status = attempts[question.id]?.status ?? QuestionStatus.NOT_VISITED
        const isCurrent = question.id === currentQuestionId
        return (
          <motion.button
            key={question.id}
            type="button"
            role="listitem"
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(question.id)}
            aria-label={`Question ${question.number}, ${status.replaceAll('_', ' ').toLowerCase()}`}
            aria-current={isCurrent ? 'true' : undefined}
            className={cn(
              'h-9 w-full max-w-10 justify-self-center rounded-md border text-xs font-bold transition duration-200 xs:h-10 xs:max-w-11 xs:rounded-lg sm:h-11 sm:rounded-xl sm:text-sm',
              isCurrent ? 'border-danger bg-danger text-white ring-2 ring-danger/30' : statusClass[status],
            )}
          >
            {question.number}
          </motion.button>
        )
      })}
    </div>
  )
}
