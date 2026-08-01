import { motion } from 'framer-motion'
import type { Section, SectionId } from '@/types/exam'
import { cn } from '@/lib/utils'

interface SectionTabsProps {
  sections: Section[]
  activeSectionId: SectionId
  onChange: (sectionId: SectionId) => void
}

export function SectionTabs({ sections, activeSectionId, onChange }: SectionTabsProps) {
  return (
    <div className="flex h-[var(--exam-tabs-h)] min-w-0 items-center gap-1 overflow-x-auto border-b border-border bg-[#EEF3F8] px-2 dark:border-slate-700 dark:bg-slate-900 xs:gap-1.5 xs:px-3 sm:gap-2 sm:px-4">
      {sections.map((section) => {
        const active = section.id === activeSectionId
        const short = section.shortName.split(' ')[0]
        return (
          <motion.button
            key={section.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(section.id)}
            className={cn(
              'shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold whitespace-nowrap transition duration-200 xs:rounded-lg xs:px-2.5 xs:text-xs sm:rounded-xl sm:px-4 sm:py-1.5 sm:text-sm',
              active
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-primary/10 dark:bg-slate-800 dark:text-slate-200',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span className="md:hidden">{short}</span>
            <span className="hidden md:inline">{section.shortName}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
