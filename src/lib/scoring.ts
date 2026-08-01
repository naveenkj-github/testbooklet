import {
  QuestionStatus,
  type Question,
  type QuestionAttempt,
  type Section,
  type SectionId,
} from '@/types/exam'

export interface ScoreBreakdown {
  totalQuestions: number
  attempted: number
  correct: number
  incorrect: number
  skipped: number
  markedForReview: number
  marksObtained: number
  maxMarks: number
  accuracyPercent: number
}

export interface SectionScoreReport extends ScoreBreakdown {
  sectionId: SectionId
  sectionName: string
}

export interface ExamScoreReport {
  title: string
  overall: ScoreBreakdown
  sections: SectionScoreReport[]
  timeTakenSeconds: number
  generatedAt: string
}

function emptyBreakdown(): ScoreBreakdown {
  return {
    totalQuestions: 0,
    attempted: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    markedForReview: 0,
    marksObtained: 0,
    maxMarks: 0,
    accuracyPercent: 0,
  }
}

function scoreQuestions(
  questions: Question[],
  attempts: Record<string, QuestionAttempt>,
): ScoreBreakdown {
  const result = emptyBreakdown()
  result.totalQuestions = questions.length

  questions.forEach((question) => {
    const attempt = attempts[question.id]
    result.maxMarks += question.positiveMarks

    if (attempt?.isMarkedForReview) {
      result.markedForReview += 1
    }

    const selected = attempt?.selectedOptionId ?? null
    if (!selected) {
      result.skipped += 1
      return
    }

    result.attempted += 1

    if (!question.correctOptionId) {
      return
    }

    if (selected === question.correctOptionId) {
      result.correct += 1
      result.marksObtained += question.positiveMarks
    } else {
      result.incorrect += 1
      result.marksObtained -= question.negativeMarks
    }
  })

  result.marksObtained = Math.round(result.marksObtained * 100) / 100
  result.accuracyPercent =
    result.attempted === 0 ? 0 : Math.round((result.correct / result.attempted) * 100)

  return result
}

export function buildSectionReport(
  section: Section,
  questions: Question[],
  attempts: Record<string, QuestionAttempt>,
): SectionScoreReport {
  const sectionQuestions = questions.filter((q) => q.sectionId === section.id)
  return {
    sectionId: section.id,
    sectionName: section.name,
    ...scoreQuestions(sectionQuestions, attempts),
  }
}

export function buildExamReport(params: {
  title: string
  sections: Section[]
  questions: Question[]
  attempts: Record<string, QuestionAttempt>
  totalDurationSeconds: number
  remainingSeconds: number
}): ExamScoreReport {
  const sectionReports = params.sections.map((section) =>
    buildSectionReport(section, params.questions, params.attempts),
  )

  return {
    title: params.title,
    overall: scoreQuestions(params.questions, params.attempts),
    sections: sectionReports,
    timeTakenSeconds: Math.max(0, params.totalDurationSeconds - params.remainingSeconds),
    generatedAt: new Date().toISOString(),
  }
}

/** Convenience: answered-like statuses for display chips. */
export function answeredLikeCount(status: QuestionStatus | undefined): boolean {
  return (
    status === QuestionStatus.ANSWERED || status === QuestionStatus.MARKED_AND_ANSWERED
  )
}
