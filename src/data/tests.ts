import type { MockTestProduct } from '@/types/commerce'

/** Mock catalog of purchasable CBT tests. */
export const MOCK_TESTS: MockTestProduct[] = [
  {
    id: 'grade3-anvit-beginner',
    title: 'Grade 3 Beginner — Anvit Jain',
    subtitle: 'Warm-up Maths & GK with small numbers and everyday facts',
    examType: 'Grade 3 · Beginner · Free',
    questions: 30,
    durationMinutes: 40,
    priceInr: 0,
    badge: 'Beginner',
    features: [
      '30 questions · 40 minutes',
      'Simple add, subtract, multiply & divide',
      'Basic India & science GK',
      'No percentages, ratios or fractions',
    ],
  },
  {
    id: 'grade3-anvit-intermediate',
    title: 'Grade 3 Intermediate — Anvit Jain',
    subtitle: 'Word problems, place value, perimeter, time & money',
    examType: 'Grade 3 · Intermediate · Free',
    questions: 30,
    durationMinutes: 40,
    priceInr: 0,
    badge: 'Intermediate',
    features: [
      '30 questions · 40 minutes',
      '3-digit maths & 2-step word problems',
      'India, planets & inventors GK',
      'No percentages, ratios or fractions',
    ],
  },
  {
    id: 'grade3-anvit-advanced',
    title: 'Grade 3 Advanced — Anvit Jain',
    subtitle: 'Multi-step stretch questions for strong Grade 3 learners',
    examType: 'Grade 3 · Advanced · Free',
    questions: 30,
    durationMinutes: 40,
    priceInr: 0,
    badge: 'Advanced',
    features: [
      '30 questions · 40 minutes',
      'Larger numbers, packing & perimeter reverse',
      'Deeper world & science GK',
      'No percentages, ratios or fractions',
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
