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
import { buildExamReport, buildSectionReport, type ExamScoreReport, type SectionScoreReport } from '@/lib/scoring'
import { cn } from '@/lib/utils'

export default function ExamPage() {
  const exam = useExam(() => setSubmitOpen(true))
  const { isMobile, showDockedSidebar } = useBreakpoint()
  const session = useAuthStore((state) => state.session)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
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
    if (!activeSection) return
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
    const report = buildExamReport({
      title: exam.meta.title,
      sections: exam.meta.sections,
      questions: exam.questions,
      attempts: exam.attempts,
      totalDurationSeconds: exam.meta.totalDurationMinutes * 60,
      remainingSeconds: exam.remainingSeconds,
    })
    setTestReport(report)
    setSubmitOpen(false)
    if (!exam.isPaused) exam.togglePause()
    setExamFinished(true)
    setTestReportOpen(true)
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
      className={cn('exam-shell bg-background text-text', exam.isDarkMode && 'dark')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
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
        title="Test Report Card"
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
