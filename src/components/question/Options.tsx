import { cn } from '@/lib/utils'
import type { Option } from '@/types/exam'

interface OptionsProps {
  name: string
  options: Option[]
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function Options({ name, options, selectedOptionId, onSelect }: OptionsProps) {
  return (
    <div className="mt-3 grid max-w-3xl gap-2 xs:mt-4 sm:mt-6 sm:gap-3" role="radiogroup" aria-label="Answer options">
      {options.map((option, index) => {
        const selected = selectedOptionId === option.id
        return (
          <label
            key={option.id}
            className={cn(
              'flex min-w-0 cursor-pointer items-start gap-2 rounded-lg border px-2.5 py-2 transition duration-200 xs:gap-3 xs:rounded-xl xs:px-3 xs:py-2.5 sm:px-4 sm:py-3',
              selected
                ? 'border-primary bg-primary/10'
                : 'border-border bg-white hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-900',
            )}
          >
            <input
              type="radio"
              className="mt-1 shrink-0 accent-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-primary/40"
              name={name}
              value={option.id}
              checked={selected}
              onChange={() => onSelect(option.id)}
              aria-label={`Option ${option.label}`}
            />
            <span className="min-w-0 break-words text-sm leading-relaxed text-text sm:text-base">
              <span className="mr-1.5 font-bold">{option.label}.</span>
              {option.text}
              <span className="ml-1 hidden text-xs text-slate-400 sm:inline">({index + 1})</span>
            </span>
          </label>
        )
      })}
    </div>
  )
}
