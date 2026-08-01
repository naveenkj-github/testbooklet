/** Generate a mock purchase passcode, e.g. CBT-A7K2-M9QX */
export function generatePasscode(prefix = 'CBT'): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const chunk = (length: number) =>
    Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
  return `${prefix}-${chunk(4)}-${chunk(4)}`
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function normalizePasscode(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, '')
}
