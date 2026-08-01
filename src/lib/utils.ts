import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHms(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const h = String(Math.floor(safe / 3600)).padStart(2, '0')
  const m = String(Math.floor((safe % 3600) / 60)).padStart(2, '0')
  const s = String(safe % 60).padStart(2, '0')
  return `${h} : ${m} : ${s}`
}

export function formatMmSs(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const m = String(Math.floor(safe / 60)).padStart(2, '0')
  const s = String(safe % 60).padStart(2, '0')
  return `${m}:${s}`
}
