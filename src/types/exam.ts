export type SectionId =
  | 'english'
  | 'quantitative'
  | 'reasoning'
  | 'mathematics'
  | 'general_knowledge'

export enum QuestionStatus {
  NOT_VISITED = 'NOT_VISITED',
  NOT_ANSWERED = 'NOT_ANSWERED',
  ANSWERED = 'ANSWERED',
  MARKED = 'MARKED',
  MARKED_AND_ANSWERED = 'MARKED_AND_ANSWERED',
}

export interface Option {
  id: string
  label: string
  text: string
}

export type QuestionGroupType =
  | 'reading_comprehension'
  | 'case_study'
  | 'cloze_test'
  | 'data_interpretation'

export interface Question {
  id: string
  sectionId: SectionId
  number: number
  directions: string
  statement: string
  options: Option[]
  positiveMarks: number
  negativeMarks: number
  correctOptionId?: string
  /** Present when this question belongs to a shared passage/case group. */
  groupId?: string
}

export interface QuestionGroup {
  id: string
  type: QuestionGroupType
  title: string
  instructions?: string
  passage: string
  image?: string
  sectionId: SectionId
  questions: Question[]
}

export interface QuestionAttempt {
  selectedOptionId: string | null
  status: QuestionStatus
  timeSpentSeconds: number
  bookmarked: boolean
  isMarkedForReview: boolean
}

export interface Section {
  id: SectionId
  name: string
  shortName: string
  questionCount: number
  durationMinutes: number
}

export interface ExamMeta {
  id: string
  title: string
  totalDurationMinutes: number
  sections: Section[]
}

export interface StatusCounts {
  answered: number
  marked: number
  markedAndAnswered: number
  notAnswered: number
  notVisited: number
}

export type PaletteFilter = 'ALL' | QuestionStatus

export interface ExamState {
  meta: ExamMeta
  questions: Question[]
  attempts: Record<string, QuestionAttempt>
  currentQuestionId: string
  currentSectionId: SectionId
  remainingSeconds: number
  isPaused: boolean
  /** When true, answers/navigation are frozen (e.g. time expired or submitted). */
  isLocked: boolean
  isDarkMode: boolean
  isSidebarOpen: boolean
  paletteFilter: PaletteFilter
  lastAutosavedAt: number | null
}
