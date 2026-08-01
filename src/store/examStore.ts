import { create } from 'zustand'
import { getExamByTestId } from '@/data/examRegistry'
import {
  QuestionStatus,
  type ExamMeta,
  type ExamState,
  type PaletteFilter,
  type Question,
  type QuestionAttempt,
  type SectionId,
  type StatusCounts,
} from '@/types/exam'

function createInitialAttempts(questions: Question[]): Record<string, QuestionAttempt> {
  return Object.fromEntries(
    questions.map((question, index) => [
      question.id,
      {
        selectedOptionId: null,
        status: index === 0 ? QuestionStatus.NOT_ANSWERED : QuestionStatus.NOT_VISITED,
        timeSpentSeconds: 0,
        bookmarked: false,
        isMarkedForReview: false,
      } satisfies QuestionAttempt,
    ]),
  )
}

function deriveStatus(selectedOptionId: string | null, isMarkedForReview: boolean): QuestionStatus {
  if (selectedOptionId && isMarkedForReview) return QuestionStatus.MARKED_AND_ANSWERED
  if (selectedOptionId) return QuestionStatus.ANSWERED
  if (isMarkedForReview) return QuestionStatus.MARKED
  return QuestionStatus.NOT_ANSWERED
}

function buildExamSlice(meta: ExamMeta, questions: Question[]) {
  return {
    meta,
    questions,
    attempts: createInitialAttempts(questions),
    currentQuestionId: questions[0]?.id ?? '',
    currentSectionId: (meta.sections[0]?.id ?? 'mathematics') as SectionId,
    remainingSeconds: meta.totalDurationMinutes * 60,
    isPaused: false,
    isLocked: false,
    paletteFilter: 'ALL' as PaletteFilter,
    lastAutosavedAt: null,
  }
}

const bootstrap = getExamByTestId(null)

interface ExamStore extends ExamState {
  loadedTestId: string | null
  loadExam: (testId: string) => void
  /** Autosave + freeze timer/answers (time-up or final submit). */
  lockExam: () => void
  setCurrentQuestion: (questionId: string) => void
  setSection: (sectionId: SectionId) => void
  selectOption: (optionId: string) => void
  clearResponse: () => void
  toggleMarkForReview: () => void
  goNext: () => void
  goPrevious: () => void
  tick: () => void
  togglePause: () => void
  toggleDarkMode: () => void
  toggleSidebar: () => void
  setPaletteFilter: (filter: PaletteFilter) => void
  toggleBookmark: () => void
  autosave: () => void
  getSectionCounts: (sectionId?: SectionId) => StatusCounts
  getSectionQuestions: (sectionId?: SectionId) => Question[]
  getCurrentQuestion: () => Question
  getProgressPercent: () => number
}

export const useExamStore = create<ExamStore>((set, get) => ({
  ...buildExamSlice(bootstrap.meta, bootstrap.questions),
  loadedTestId: null,
  isDarkMode: false,
  isSidebarOpen: false,

  loadExam: (testId) => {
    const pack = getExamByTestId(testId)
    set({
      ...buildExamSlice(pack.meta, pack.questions),
      loadedTestId: testId,
    })
  },

  lockExam: () => {
    const state = get()
    if (state.isLocked) return
    set({
      isLocked: true,
      isPaused: true,
      isSidebarOpen: false,
      lastAutosavedAt: Date.now(),
    })
  },

  getCurrentQuestion: () => {
    const state = get()
    return state.questions.find((q) => q.id === state.currentQuestionId) ?? state.questions[0]
  },

  getSectionQuestions: (sectionId) => {
    const state = get()
    const id = sectionId ?? state.currentSectionId
    return state.questions.filter((q) => q.sectionId === id)
  },

  getSectionCounts: (sectionId) => {
    const state = get()
    const sectionQuestions = state.getSectionQuestions(sectionId)
    const counts: StatusCounts = {
      answered: 0,
      marked: 0,
      markedAndAnswered: 0,
      notAnswered: 0,
      notVisited: 0,
    }

    sectionQuestions.forEach((question) => {
      const status = state.attempts[question.id]?.status ?? QuestionStatus.NOT_VISITED
      if (status === QuestionStatus.ANSWERED) counts.answered += 1
      else if (status === QuestionStatus.MARKED) counts.marked += 1
      else if (status === QuestionStatus.MARKED_AND_ANSWERED) counts.markedAndAnswered += 1
      else if (status === QuestionStatus.NOT_ANSWERED) counts.notAnswered += 1
      else counts.notVisited += 1
    })

    return counts
  },

  getProgressPercent: () => {
    const state = get()
    const answeredLike = Object.values(state.attempts).filter(
      (attempt) =>
        attempt.status === QuestionStatus.ANSWERED ||
        attempt.status === QuestionStatus.MARKED_AND_ANSWERED,
    ).length
    return Math.round((answeredLike / state.questions.length) * 100)
  },

  setCurrentQuestion: (questionId) => {
    if (get().isLocked) return
    set((state) => {
      const question = state.questions.find((item) => item.id === questionId)
      if (!question) return state

      const attempt = state.attempts[questionId]
      const nextStatus =
        attempt.status === QuestionStatus.NOT_VISITED
          ? QuestionStatus.NOT_ANSWERED
          : attempt.status

      return {
        currentQuestionId: questionId,
        currentSectionId: question.sectionId,
        attempts: {
          ...state.attempts,
          [questionId]: { ...attempt, status: nextStatus },
        },
      }
    })
  },

  setSection: (sectionId) => {
    if (get().isLocked) return
    const first = get().questions.find((q) => q.sectionId === sectionId)
    if (first) get().setCurrentQuestion(first.id)
  },

  selectOption: (optionId) => {
    if (get().isLocked) return
    set((state) => {
      const id = state.currentQuestionId
      const attempt = state.attempts[id]
      return {
        attempts: {
          ...state.attempts,
          [id]: {
            ...attempt,
            selectedOptionId: optionId,
            status: deriveStatus(optionId, attempt.isMarkedForReview),
          },
        },
      }
    })
  },

  clearResponse: () => {
    if (get().isLocked) return
    set((state) => {
      const id = state.currentQuestionId
      const attempt = state.attempts[id]
      return {
        attempts: {
          ...state.attempts,
          [id]: {
            ...attempt,
            selectedOptionId: null,
            status: deriveStatus(null, attempt.isMarkedForReview),
          },
        },
      }
    })
  },

  toggleMarkForReview: () => {
    if (get().isLocked) return
    set((state) => {
      const id = state.currentQuestionId
      const attempt = state.attempts[id]
      const isMarkedForReview = !attempt.isMarkedForReview
      return {
        attempts: {
          ...state.attempts,
          [id]: {
            ...attempt,
            isMarkedForReview,
            status: deriveStatus(attempt.selectedOptionId, isMarkedForReview),
          },
        },
      }
    })
  },

  goNext: () => {
    if (get().isLocked) return
    const state = get()
    const sectionQuestions = state.getSectionQuestions()
    const index = sectionQuestions.findIndex((q) => q.id === state.currentQuestionId)
    if (index < sectionQuestions.length - 1) {
      state.setCurrentQuestion(sectionQuestions[index + 1].id)
      return
    }

    const sectionIndex = state.meta.sections.findIndex((s) => s.id === state.currentSectionId)
    const nextSection = state.meta.sections[sectionIndex + 1]
    if (nextSection) state.setSection(nextSection.id)
  },

  goPrevious: () => {
    if (get().isLocked) return
    const state = get()
    const sectionQuestions = state.getSectionQuestions()
    const index = sectionQuestions.findIndex((q) => q.id === state.currentQuestionId)
    if (index > 0) {
      state.setCurrentQuestion(sectionQuestions[index - 1].id)
      return
    }

    const sectionIndex = state.meta.sections.findIndex((s) => s.id === state.currentSectionId)
    const prevSection = state.meta.sections[sectionIndex - 1]
    if (prevSection) {
      const prevQuestions = state.getSectionQuestions(prevSection.id)
      state.setCurrentQuestion(prevQuestions[prevQuestions.length - 1].id)
    }
  },

  tick: () =>
    set((state) => {
      if (state.isLocked || state.isPaused || state.remainingSeconds <= 0) return state
      const id = state.currentQuestionId
      const attempt = state.attempts[id]
      return {
        remainingSeconds: state.remainingSeconds - 1,
        attempts: {
          ...state.attempts,
          [id]: { ...attempt, timeSpentSeconds: attempt.timeSpentSeconds + 1 },
        },
      }
    }),

  togglePause: () => {
    if (get().isLocked) return
    set((state) => ({ isPaused: !state.isPaused }))
  },
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleSidebar: () => {
    if (get().isLocked) return
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
  },
  setPaletteFilter: (filter) => {
    if (get().isLocked) return
    set({ paletteFilter: filter })
  },
  toggleBookmark: () => {
    if (get().isLocked) return
    set((state) => {
      const id = state.currentQuestionId
      const attempt = state.attempts[id]
      return {
        attempts: {
          ...state.attempts,
          [id]: { ...attempt, bookmarked: !attempt.bookmarked },
        },
      }
    })
  },
  autosave: () => set({ lastAutosavedAt: Date.now() }),
}))
