import { examMeta as bankPoMeta, questions as bankPoQuestions } from '@/data/questions'
import { GRADE3_EXAMS } from '@/data/grade3FreeTest'
import type { ExamMeta, Question } from '@/types/exam'

export interface ExamPackage {
  meta: ExamMeta
  questions: Question[]
}

const EXAMS: Record<string, ExamPackage> = {
  'bank-po-prelims': { meta: bankPoMeta, questions: bankPoQuestions },
  'bank-po-mains': { meta: bankPoMeta, questions: bankPoQuestions },
  'ibps-clerk-prelims': { meta: bankPoMeta, questions: bankPoQuestions },
  ...GRADE3_EXAMS,
}

const DEFAULT_EXAM = EXAMS['bank-po-prelims']

/** Resolve runnable exam content for a catalog / purchase test id. */
export function getExamByTestId(testId: string | null | undefined): ExamPackage {
  if (!testId) return DEFAULT_EXAM
  return EXAMS[testId] ?? DEFAULT_EXAM
}
