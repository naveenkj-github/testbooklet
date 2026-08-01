import type { ReactNode } from 'react'
import { Award, CheckCircle2, CircleSlash, Target, Timer, XCircle } from 'lucide-react'
import type { ExamScoreReport, SectionScoreReport } from '@/lib/scoring'
import { formatHms, cn } from '@/lib/utils'

type ReportMode = 'section' | 'test'

interface ReportCardProps {
  mode: ReportMode
  candidateName: string
  examTitle: string
  sectionReport?: SectionScoreReport
  examReport?: ExamScoreReport
  className?: string
}

export function ReportCard({
  mode,
  candidateName,
  examTitle,
  sectionReport,
  examReport,
  className,
}: ReportCardProps) {
  const breakdown = mode === 'section' ? sectionReport : examReport?.overall
  if (!breakdown) return null

  const heading =
    mode === 'section'
      ? `${sectionReport?.sectionName ?? 'Section'} Report`
      : 'Test Report Card'

  return (
    <div className={cn('space-y-5 text-left', className)}>
      <div className="border border-[#B6E8F7] bg-[#E8F8FD] p-4 dark:border-slate-600 dark:bg-slate-800/80">
        <p className="text-[11px] font-bold tracking-[0.16em] text-[#0284C7] uppercase dark:text-sky-300">
          {heading}
        </p>
        <p className="mt-1 text-lg font-bold text-[#0F172A] dark:text-slate-100">{candidateName}</p>
        <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">{examTitle}</p>
        {mode === 'test' && examReport ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] dark:text-slate-400">
            <Timer className="h-3.5 w-3.5" />
            Time taken {formatHms(examReport.timeTakenSeconds)}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat
          icon={<Award className="h-4 w-4 text-[#00AEEF]" />}
          label="Score"
          value={`${formatMarks(breakdown.marksObtained)} / ${formatMarks(breakdown.maxMarks)}`}
          emphasize
        />
        <Stat
          icon={<Target className="h-4 w-4 text-[#0E7490]" />}
          label="Accuracy"
          value={`${breakdown.accuracyPercent}%`}
        />
        <Stat
          icon={<CheckCircle2 className="h-4 w-4 text-[#22C55E]" />}
          label="Correct"
          value={String(breakdown.correct)}
        />
        <Stat
          icon={<XCircle className="h-4 w-4 text-[#E74C3C]" />}
          label="Incorrect"
          value={String(breakdown.incorrect)}
        />
        <Stat
          icon={<CircleSlash className="h-4 w-4 text-[#94A3B8]" />}
          label="Skipped"
          value={String(breakdown.skipped)}
        />
        <Stat
          label="Attempted"
          value={`${breakdown.attempted} / ${breakdown.totalQuestions}`}
        />
      </div>

      {mode === 'test' && examReport ? (
        <div>
          <p className="mb-2 text-xs font-bold tracking-wide text-[#64748B] uppercase">
            Section-wise
          </p>
          <div className="overflow-hidden border border-[#E2E8F0] dark:border-slate-700">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F8FAFC] text-[#64748B] dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-semibold">Section</th>
                  <th className="px-3 py-2 font-semibold">Attempted</th>
                  <th className="px-3 py-2 font-semibold">Correct</th>
                  <th className="px-3 py-2 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {examReport.sections.map((section) => (
                  <tr
                    key={section.sectionId}
                    className="border-t border-[#E2E8F0] dark:border-slate-700"
                  >
                    <td className="px-3 py-2 font-medium text-[#0F172A] dark:text-slate-100">
                      {section.sectionName}
                    </td>
                    <td className="px-3 py-2 text-[#475569] dark:text-slate-300">
                      {section.attempted}/{section.totalQuestions}
                    </td>
                    <td className="px-3 py-2 text-[#475569] dark:text-slate-300">
                      {section.correct}
                    </td>
                    <td className="px-3 py-2 font-semibold text-[#0F172A] dark:text-slate-100">
                      {formatMarks(section.marksObtained)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {mode === 'section' && sectionReport ? (
        <p className="text-xs leading-relaxed text-[#64748B] dark:text-slate-400">
          Marked for review: {sectionReport.markedForReview}. Negative marking (−0.25) applied on
          incorrect answers using the mock answer key.
        </p>
      ) : null}
    </div>
  )
}

function Stat({
  label,
  value,
  icon,
  emphasize,
}: {
  label: string
  value: string
  icon?: ReactNode
  emphasize?: boolean
}) {
  return (
    <div
      className={cn(
        'border border-[#E2E8F0] bg-white p-3 dark:border-slate-700 dark:bg-slate-900',
        emphasize && 'border-[#00AEEF]/40 bg-[#F0FBFF] dark:bg-slate-800',
      )}
    >
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-[#94A3B8] uppercase">
        {icon}
        {label}
      </div>
      <p className="text-base font-bold text-[#0F172A] dark:text-slate-100 sm:text-lg">{value}</p>
    </div>
  )
}

function formatMarks(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}
