import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Options } from '@/components/question/Options'
import { QuestionHeader } from '@/components/question/QuestionHeader'
import { Button } from '@/components/common/Button'
import type { Question, QuestionAttempt } from '@/types/exam'
import { cn } from '@/lib/utils'

interface ChildQuestionPanelProps {
  question: Question
  attempt: QuestionAttempt
  siblingQuestions: Question[]
  onSelect: (optionId: string) => void
  onReport: () => void
  onBookmark: () => void
  onJumpToSibling: (questionId: string) => void
}

export function ChildQuestionPanel({
  question,
  attempt,
  siblingQuestions,
  onSelect,
  onReport,
  onBookmark,
  onJumpToSibling,
}: ChildQuestionPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [question.id])

  const index = siblingQuestions.findIndex((item) => item.id === question.id)

  return (
    <section
      className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-white dark:bg-slate-950"
      aria-label={`Grouped question ${question.number}`}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-border px-2 py-1.5 dark:border-slate-700 xs:gap-1.5 xs:px-3 xs:py-2 sm:gap-2 sm:px-4">
        <span className="w-full text-[10px] font-semibold text-text-muted xs:w-auto xs:text-[11px] sm:text-xs">
          In this set
        </span>
        {siblingQuestions.map((sibling) => (
          <button
            key={sibling.id}
            type="button"
            onClick={() => onJumpToSibling(sibling.id)}
            aria-current={sibling.id === question.id ? 'true' : undefined}
            aria-label={`Go to question ${sibling.number} in this group`}
            className={cn(
              'inline-flex h-6 min-w-6 items-center justify-center rounded-md border px-1 text-[10px] font-bold transition duration-200 xs:h-7 xs:min-w-7 xs:rounded-lg xs:text-[11px] sm:h-8 sm:min-w-8 sm:px-2 sm:text-xs',
              sibling.id === question.id
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-slate-700 hover:bg-primary/10 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200',
            )}
          >
            {sibling.number}
          </button>
        ))}
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.2 }}
            className="p-3 xs:p-4 sm:p-5 md:p-6"
          >
            <QuestionHeader
              question={question}
              attempt={attempt}
              onReport={onReport}
              onBookmark={onBookmark}
            />
            <p className="break-words text-sm leading-6 text-text xs:text-base xs:leading-7 sm:text-[18px] sm:leading-[1.8]">
              {question.statement}
            </p>
            <Options
              name={question.id}
              options={question.options}
              selectedOptionId={attempt.selectedOptionId}
              onSelect={onSelect}
            />

            <div className="mt-4 grid grid-cols-2 gap-1.5 xs:mt-5 xs:gap-2 sm:mt-6 sm:flex">
              <Button
                variant="outline"
                size="xs"
                className="w-full sm:w-auto sm:h-9 sm:px-3 sm:text-sm"
                disabled={index <= 0}
                onClick={() => onJumpToSibling(siblingQuestions[index - 1]?.id)}
              >
                Prev in set
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="w-full sm:w-auto sm:h-9 sm:px-3 sm:text-sm"
                disabled={index >= siblingQuestions.length - 1}
                onClick={() => onJumpToSibling(siblingQuestions[index + 1]?.id)}
              >
                Next in set
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
