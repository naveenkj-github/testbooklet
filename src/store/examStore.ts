import { create } from 'zustand'
import { examMeta, questions as allQuestions } from '@/data/questions'
import {
  QuestionStatus,
  type ExamState,
  type PaletteFilter,
  type QuestionAttempt,
  type SectionId,
  type StatusCounts,
} from '@/types/exam'

function createInitialAttempts(): Record<string, QuestionAttempt> {
  return Object.fromEntries(
    allQuestions.map((question, index) => [
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

interface ExamStore extends ExamState {
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
  getSectionQuestions: (sectionId?: SectionId) => typeof allQuestions
  getCurrentQuestion: () => (typeof allQuestions)[number]
  getProgressPercent: () => number
}

export const useExamStore = create<ExamStore>((set, get) => ({
  meta: examMeta,
  questions: allQuestions,
  attempts: createInitialAttempts(),
  currentQuestionId: allQuestions[0].id,
  currentSectionId: 'english',
  remainingSeconds: examMeta.totalDurationMinutes * 60,
  isPaused: false,
  isDarkMode: false,
  isSidebarOpen: false,
  paletteFilter: 'ALL',
  lastAutosavedAt: null,

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

  setCurrentQuestion: (questionId) =>
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
    }),

  setSection: (sectionId) => {
    const first = get().questions.find((q) => q.sectionId === sectionId)
    if (first) get().setCurrentQuestion(first.id)
  },

  selectOption: (optionId) =>
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
    }),

  clearResponse: () =>
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
    }),

  toggleMarkForReview: () =>
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
    }),

  goNext: () => {
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
      if (state.isPaused || state.remainingSeconds <= 0) return state
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

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setPaletteFilter: (filter) => set({ paletteFilter: filter }),
  toggleBookmark: () =>
    set((state) => {
      const id = state.currentQuestionId
      const attempt = state.attempts[id]
      return {
        attempts: {
          ...state.attempts,
          [id]: { ...attempt, bookmarked: !attempt.bookmarked },
        },
      }
    }),
  autosave: () => set({ lastAutosavedAt: Date.now() }),
}))
