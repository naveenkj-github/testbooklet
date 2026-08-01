import { AnimatePresence, motion } from 'framer-motion'
import { Directions } from '@/components/question/Directions'
import { Options } from '@/components/question/Options'
import { QuestionHeader } from '@/components/question/QuestionHeader'
import type { Question, QuestionAttempt } from '@/types/exam'

interface QuestionCardProps {
  question: Question
  attempt: QuestionAttempt
  onSelect: (optionId: string) => void
  onReport: () => void
  onBookmark: () => void
}

export function QuestionCard({ question, attempt, onSelect, onReport, onBookmark }: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.2 }}
        className="min-w-0 p-3 xs:p-4 sm:p-6 md:p-8"
      >
        <QuestionHeader
          question={question}
          attempt={attempt}
          onReport={onReport}
          onBookmark={onBookmark}
        />
        <Directions text={question.directions} />
        <p className="break-words text-sm leading-6 text-text xs:text-base xs:leading-7 sm:text-[18px] sm:leading-[1.8]">
          {question.statement}
        </p>
        <Options
          name={question.id}
          options={question.options}
          selectedOptionId={attempt.selectedOptionId}
          onSelect={onSelect}
        />
      </motion.div>
    </AnimatePresence>
  )
}
