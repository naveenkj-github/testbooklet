import { useCallback, useEffect, useMemo } from 'react'
import { getGroupForQuestion } from '@/data/questionGroups'
import { useExamStore } from '@/store/examStore'
import { useTimer } from '@/hooks/useTimer'

/** High-level exam orchestration: navigation, keyboard, autosave, timer. */
export function useExam(onAutoSubmit?: () => void) {
  const currentQuestion = useExamStore((s) => s.getCurrentQuestion())
  const currentSectionId = useExamStore((s) => s.currentSectionId)
  const attempts = useExamStore((s) => s.attempts)
  const questions = useExamStore((s) => s.questions)
  const meta = useExamStore((s) => s.meta)
  const isPaused = useExamStore((s) => s.isPaused)
  const isLocked = useExamStore((s) => s.isLocked)
  const isDarkMode = useExamStore((s) => s.isDarkMode)
  const isSidebarOpen = useExamStore((s) => s.isSidebarOpen)
  const paletteFilter = useExamStore((s) => s.paletteFilter)
  const remainingSeconds = useExamStore((s) => s.remainingSeconds)
  const lastAutosavedAt = useExamStore((s) => s.lastAutosavedAt)

  const setCurrentQuestion = useExamStore((s) => s.setCurrentQuestion)
  const setSection = useExamStore((s) => s.setSection)
  const selectOption = useExamStore((s) => s.selectOption)
  const clearResponse = useExamStore((s) => s.clearResponse)
  const toggleMarkForReview = useExamStore((s) => s.toggleMarkForReview)
  const goNext = useExamStore((s) => s.goNext)
  const goPrevious = useExamStore((s) => s.goPrevious)
  const togglePause = useExamStore((s) => s.togglePause)
  const toggleDarkMode = useExamStore((s) => s.toggleDarkMode)
  const toggleSidebar = useExamStore((s) => s.toggleSidebar)
  const setPaletteFilter = useExamStore((s) => s.setPaletteFilter)
  const toggleBookmark = useExamStore((s) => s.toggleBookmark)
  const autosave = useExamStore((s) => s.autosave)
  const lockExam = useExamStore((s) => s.lockExam)
  const getSectionCounts = useExamStore((s) => s.getSectionCounts)
  const getSectionQuestions = useExamStore((s) => s.getSectionQuestions)
  const getProgressPercent = useExamStore((s) => s.getProgressPercent)

  const currentGroup = useMemo(
    () => getGroupForQuestion(currentQuestion),
    [currentQuestion],
  )

  useTimer(onAutoSubmit)

  useEffect(() => {
    if (isLocked) return undefined
    const id = window.setInterval(() => {
      autosave()
    }, 10_000)
    return () => window.clearInterval(id)
  }, [autosave, isLocked])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isPaused || isLocked) return
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrevious()
      } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault()
        goNext()
      } else if (/^[1-5]$/.test(event.key)) {
        const option = currentQuestion.options[Number(event.key) - 1]
        if (option) selectOption(option.id)
      }
    },
    [currentQuestion.options, goNext, goPrevious, isLocked, isPaused, selectOption],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    meta,
    questions,
    currentQuestion,
    currentGroup,
    currentSectionId,
    attempt: attempts[currentQuestion.id],
    attempts,
    counts: getSectionCounts(currentSectionId),
    sectionQuestions: getSectionQuestions(currentSectionId),
    progressPercent: getProgressPercent(),
    remainingSeconds,
    isPaused,
    isLocked,
    isDarkMode,
    isSidebarOpen,
    paletteFilter,
    lastAutosavedAt,
    setCurrentQuestion,
    setSection,
    selectOption,
    clearResponse,
    toggleMarkForReview,
    goNext,
    goPrevious,
    togglePause,
    toggleDarkMode,
    toggleSidebar,
    setPaletteFilter,
    toggleBookmark,
    autosave,
    lockExam,
  }
}
