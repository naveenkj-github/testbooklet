interface DirectionsProps {
  text: string
}

export function Directions({ text }: DirectionsProps) {
  return (
    <p className="mb-3 break-words text-[11px] font-semibold leading-relaxed text-slate-700 xs:mb-4 xs:text-xs sm:text-sm dark:text-slate-200">
      {text}
    </p>
  )
}
