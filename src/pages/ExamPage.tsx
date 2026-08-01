import { useCallback, useEffect, useMemo, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'
import { QuestionCard } from '@/components/question/QuestionCard'
import { ReadingComprehensionRenderer } from '@/components/question/ReadingComprehensionRenderer'
import { ReportCard } from '@/components/exam/ReportCard'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Timer } from '@/components/common/Timer'
import { useExam } from '@/hooks/useExam'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useAuthStore } from '@/store/authStore'
import { useExamStore } from '@/store/examStore'
import { buildExamReport, buildSectionReport, type ExamScoreReport, type SectionScoreReport } from '@/lib/scoring'
import { cn } from '@/lib/utils'

export default function ExamPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [sectionSubmitOpen, setSectionSubmitOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [sectionReportOpen, setSectionReportOpen] = useState(false)
  const [testReportOpen, setTestReportOpen] = useState(false)
  const [sectionReport, setSectionReport] = useState<SectionScoreReport | null>(null)
  const [testReport, setTestReport] = useState<ExamScoreReport | null>(null)
  const [examFinished, setExamFinished] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  const finalizeAndShowReport = useCallback((fromTimeout: boolean) => {
    const state = useExamStore.getState()
    if (state.isLocked) return

    state.autosave()
    state.lockExam()

    const report = buildExamReport({
      title: state.meta.title,
      sections: state.meta.sections,
      questions: state.questions,
      attempts: state.attempts,
      totalDurationSeconds: state.meta.totalDurationMinutes * 60,
      remainingSeconds: state.remainingSeconds,
    })

    setTestReport(report)
    setExamFinished(true)
    setTimedOut(fromTimeout)
    setPauseOpen(false)
    setSubmitOpen(false)
    setSectionSubmitOpen(false)
    setSectionReportOpen(false)
    setReportOpen(false)
    setTestReportOpen(true)
  }, [])

  const handleTimeUp = useCallback(() => {
    finalizeAndShowReport(true)
  }, [finalizeAndShowReport])

  const exam = useExam(handleTimeUp)
  const { isMobile, showDockedSidebar } = useBreakpoint()
  const session = useAuthStore((state) => state.session)
  const logout = useAuthStore((state) => state.logout)
  const loadExam = useExamStore((state) => state.loadExam)
  const navigate = useNavigate()

  useEffect(() => {
    if (session?.testId) {
      setExamFinished(false)
      setTimedOut(false)
      setTestReportOpen(false)
      setTestReport(null)
      loadExam(session.testId)
    }
  }, [session?.testId, session?.loggedInAt, loadExam])

  const candidateName = session?.name ?? 'Student'
  const accessLabel = session?.testTitle ?? 'Passcode access'
  const activeSection = exam.meta.sections.find((section) => section.id === exam.currentSectionId)

  const nextSection = useMemo(() => {
    const index = exam.meta.sections.findIndex((section) => section.id === exam.currentSectionId)
    return exam.meta.sections[index + 1] ?? null
  }, [exam.meta.sections, exam.currentSectionId])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const openSectionReport = () => {
    if (!activeSection || exam.isLocked) return
    const report = buildSectionReport(activeSection, exam.questions, exam.attempts)
    setSectionReport(report)
    setSectionSubmitOpen(false)
    setSectionReportOpen(true)
  }

  const continueAfterSectionReport = () => {
    setSectionReportOpen(false)
    setSectionReport(null)
    if (nextSection) {
      exam.setSection(nextSection.id)
      return
    }
    setSubmitOpen(true)
  }

  const openTestReport = () => {
    finalizeAndShowReport(false)
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', exam.isDarkMode)
  }, [exam.isDarkMode])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  useEffect(() => {
    if (showDockedSidebar && exam.isSidebarOpen) {
      exam.toggleSidebar()
    }
  }, [showDockedSidebar, exam.isSidebarOpen, exam.toggleSidebar])

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }, [])

  const handlePauseToggle = () => {
    if (exam.isLocked) return
    if (!exam.isPaused) {
      exam.togglePause()
      setPauseOpen(true)
      return
    }
    exam.togglePause()
    setPauseOpen(false)
  }

  return (
    <motion.div
      className={cn(
        'exam-shell bg-background text-text',
        exam.isDarkMode && 'dark',
        exam.isLocked && 'pointer-events-none select-none',
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      aria-disabled={exam.isLocked}
    >
      <Header
        title={exam.meta.title}
        candidateName={candidateName}
        remainingSeconds={exam.remainingSeconds}
        isPaused={exam.isPaused}
        isDarkMode={exam.isDarkMode}
        isFullscreen={isFullscreen}
        onTogglePause={handlePauseToggle}
        onToggleDarkMode={exam.toggleDarkMode}
        onToggleFullscreen={toggleFullscreen}
      />

      <SectionTabs
        sections={exam.meta.sections}
        activeSectionId={exam.currentSectionId}
        onChange={exam.setSection}
      />

      <div className="exam-main min-w-0">
        <section className="flex min-h-0 min-w-0 flex-col border-r border-border dark:border-slate-700">
          {!showDockedSidebar ? (
            <div className="flex h-[var(--exam-toolbar-h)] min-w-0 shrink-0 items-center justify-between gap-2 border-b border-border px-2 dark:border-slate-700 xs:px-3 sm:px-4">
              <Timer seconds={exam.remainingSeconds} paused={exam.isPaused} compact />
              <Button
                variant="secondary"
                size="xs"
                className="shrink-0"
                onClick={exam.toggleSidebar}
                aria-label="Open question palette"
              >
                {exam.isSidebarOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
                {isMobile ? 'Q' : 'Questions'}
              </Button>
            </div>
          ) : null}

          <div className="h-1 w-full shrink-0 bg-slate-200 dark:bg-slate-800 sm:h-1.5">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${exam.progressPercent}%` }}
              aria-label={`Progress ${exam.progressPercent}%`}
            />
          </div>

          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            {exam.currentGroup ? (
              <ReadingComprehensionRenderer
                group={exam.currentGroup}
                activeQuestion={exam.currentQuestion}
                attempt={exam.attempt}
                onSelect={exam.selectOption}
                onReport={() => setReportOpen(true)}
                onBookmark={exam.toggleBookmark}
                onJumpToSibling={exam.setCurrentQuestion}
              />
            ) : (
              <div className="h-full min-w-0 overflow-y-auto overflow-x-hidden">
                <QuestionCard
                  question={exam.currentQuestion}
                  attempt={exam.attempt}
                  onSelect={exam.selectOption}
                  onReport={() => setReportOpen(true)}
                  onBookmark={exam.toggleBookmark}
                />
              </div>
            )}
          </div>

          <Footer
            onMark={exam.toggleMarkForReview}
            onClear={exam.clearResponse}
            onPrevious={exam.goPrevious}
            onNext={exam.goNext}
            onSaveAndNext={exam.goNext}
            isMarked={exam.attempt.isMarkedForReview}
          />
        </section>

        {showDockedSidebar ? (
          <div className="hidden min-h-0 min-w-0 lg:block">
            <Sidebar
              candidateName={candidateName}
              accessLabel={accessLabel}
              sectionName={activeSection?.name ?? ''}
              counts={exam.counts}
              questions={exam.sectionQuestions}
              attempts={exam.attempts}
              currentQuestionId={exam.currentQuestion.id}
              paletteFilter={exam.paletteFilter}
              onSelectQuestion={exam.setCurrentQuestion}
              onFilterChange={exam.setPaletteFilter}
              onSubmitSection={() => setSectionSubmitOpen(true)}
              onSubmitTest={() => setSubmitOpen(true)}
              onLogout={handleLogout}
            />
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {!showDockedSidebar && exam.isSidebarOpen ? (
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={exam.toggleSidebar}
          >
            <motion.div
              className="absolute inset-y-0 right-0 w-[min(21.25rem,100vw)] max-w-full shadow-2xl"
              initial={{ x: 48, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 48, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <Sidebar
                candidateName={candidateName}
                accessLabel={accessLabel}
                sectionName={activeSection?.name ?? ''}
                counts={exam.counts}
                questions={exam.sectionQuestions}
                attempts={exam.attempts}
                currentQuestionId={exam.currentQuestion.id}
                paletteFilter={exam.paletteFilter}
                onSelectQuestion={(id) => {
                  exam.setCurrentQuestion(id)
                  exam.toggleSidebar()
                }}
                onFilterChange={exam.setPaletteFilter}
                onSubmitSection={() => setSectionSubmitOpen(true)}
                onSubmitTest={() => setSubmitOpen(true)}
                onLogout={handleLogout}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Modal
        open={pauseOpen}
        title="Test Paused"
        onClose={() => {
          setPauseOpen(false)
          if (exam.isPaused) exam.togglePause()
        }}
        footer={
          <Button
            onClick={() => {
              setPauseOpen(false)
              if (exam.isPaused) exam.togglePause()
            }}
          >
            Resume Test
          </Button>
        }
      >
        Your timer is paused. Click Resume Test when you are ready to continue.
      </Modal>

      <Modal
        open={sectionSubmitOpen}
        title="Submit Section?"
        onClose={() => setSectionSubmitOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSectionSubmitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={openSectionReport}>View Section Report</Button>
          </>
        }
      >
        You are about to submit{' '}
        <span className="font-semibold text-text">{activeSection?.name ?? 'this section'}</span>.
        Answered: {exam.counts.answered + exam.counts.markedAndAnswered} · Marked:{' '}
        {exam.counts.marked} · Not Answered: {exam.counts.notAnswered} · Not Visited:{' '}
        {exam.counts.notVisited}
      </Modal>

      <Modal
        open={sectionReportOpen}
        title="Section Report Card"
        onClose={continueAfterSectionReport}
        className="max-w-2xl"
        footer={
          <Button onClick={continueAfterSectionReport}>
            {nextSection ? `Continue to ${nextSection.shortName}` : 'Proceed to Submit Test'}
          </Button>
        }
      >
        {sectionReport ? (
          <ReportCard
            mode="section"
            candidateName={candidateName}
            examTitle={exam.meta.title}
            sectionReport={sectionReport}
          />
        ) : null}
      </Modal>

      <Modal
        open={submitOpen}
        title="Submit Test?"
        onClose={() => {
          if (!examFinished) setSubmitOpen(false)
        }}
        footer={
          <>
            {!examFinished ? (
              <Button variant="secondary" onClick={() => setSubmitOpen(false)}>
                Continue Test
              </Button>
            ) : null}
            <Button onClick={openTestReport}>Submit & View Report</Button>
          </>
        }
      >
        Progress {exam.progressPercent}%. Once submitted, you cannot change your answers.
      </Modal>

      <Modal
        open={testReportOpen}
        title={timedOut ? "Time's Up — Report Card" : 'Test Report Card'}
        onClose={() => undefined}
        dismissible={false}
        className="max-w-2xl"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                logout()
                navigate('/', { replace: true })
              }}
            >
              Back to Home
            </Button>
            <Button
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
            >
              Done
            </Button>
          </>
        }
      >
        {timedOut ? (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            Time is over. Your answers were auto-saved and the test screen is locked.
          </p>
        ) : null}
        {testReport ? (
          <ReportCard
            mode="test"
            candidateName={candidateName}
            examTitle={exam.meta.title}
            examReport={testReport}
          />
        ) : null}
      </Modal>

      <Modal open={reportOpen} title="Report Question" onClose={() => setReportOpen(false)}>
        Thanks. Your report for Question {exam.currentQuestion.number} has been recorded (mock).
      </Modal>
    </motion.div>
  )
}
