import type { MockTestProduct } from '@/types/commerce'

/** Mock catalog of purchasable CBT tests. */
export const MOCK_TESTS: MockTestProduct[] = [
  {
    id: 'grade3-free-anvit',
    title: 'Grade 3 Free Test — Anvit Jain',
    subtitle: 'Easy Maths & General Knowledge for age 7 (no percentages or fractions)',
    examType: 'Grade 3 · Free Practice',
    questions: 30,
    durationMinutes: 40,
    priceInr: 0,
    badge: 'Free',
    features: [
      '30 easy questions · 40 minutes',
      '15 Maths + 15 General Knowledge',
      'No percentages, ratios or fractions',
      'Made for Anvit Jain',
    ],
  },
  {
    id: 'bank-po-prelims',
    title: 'Bank PO Prelims Mock',
    subtitle: 'Full-length CBT with English, Quant & Reasoning',
    examType: 'Bank PO · Prelims',
    questions: 100,
    durationMinutes: 60,
    priceInr: 199,
    badge: 'Popular',
    features: [
      '100 questions · 60 minutes',
      'Section-wise timer & palette',
      'Reading comprehension groups',
      'Instant access passcode',
    ],
  },
  {
    id: 'bank-po-mains',
    title: 'Bank PO Mains Mock',
    subtitle: 'Advanced difficulty with DI & case-study sets',
    examType: 'Bank PO · Mains',
    questions: 155,
    durationMinutes: 180,
    priceInr: 349,
    features: [
      '155 questions · 3 hours',
      'Descriptive & objective mix (mock UI)',
      'Detailed sectional navigation',
      'Instant access passcode',
    ],
  },
  {
    id: 'ibps-clerk-prelims',
    title: 'IBPS Clerk Prelims',
    subtitle: 'Speed-focused mock for clerical cadre aspirants',
    examType: 'IBPS Clerk · Prelims',
    questions: 100,
    durationMinutes: 60,
    priceInr: 149,
    badge: 'Value',
    features: [
      '100 questions · 60 minutes',
      'Mobile-friendly exam shell',
      'Mark for review & filters',
      'Instant access passcode',
    ],
  },
]

export function getTestById(testId: string): MockTestProduct | undefined {
  return MOCK_TESTS.find((test) => test.id === testId)
}
