import { questionGroups } from '@/data/questionGroups'
import type { ExamMeta, Question, SectionId } from '@/types/exam'

const sections = [
  {
    id: 'english' as const,
    name: 'English Language',
    shortName: 'English',
    questionCount: 25,
    durationMinutes: 20,
  },
  {
    id: 'quantitative' as const,
    name: 'Quantitative Aptitude',
    shortName: 'Quantitative Aptitude',
    questionCount: 35,
    durationMinutes: 20,
  },
  {
    id: 'reasoning' as const,
    name: 'Reasoning Ability',
    shortName: 'Reasoning Ability',
    questionCount: 40,
    durationMinutes: 20,
  },
]

export const examMeta: ExamMeta = {
  id: 'cbt-bank-po-mock-01',
  title: 'Bank PO Prelims Computer Based Mock Test',
  totalDurationMinutes: 60,
  sections,
}

const englishDirections =
  'Directions: Read the sentence carefully and choose the part that contains a grammatical error. If there is no error, select option E.'

const quantDirections =
  'Directions: Choose the correct answer for the given quantitative aptitude question.'

const reasoningDirections =
  'Directions: Study the information carefully and answer the question that follows.'

function optionSet(prefix: string, texts: string[]) {
  return texts.map((text, index) => ({
    id: `${prefix}-o${index + 1}`,
    label: String.fromCharCode(65 + index),
    text,
  }))
}

function buildEnglishStandalone(): Question[] {
  const stems = [
    'Having finished his homework (A), Jack went outside (B) to play basketball (C) with his friends (D).',
    'Despite of the heavy rains (A), the match continued (B) without interruption (C) till the final over (D).',
    'She is one of those teachers (A) who always inspire (B) their students (C) to work hard (D).',
    'The committee decided to defer (A) the proposal after (B) a long discussion (C) among its members (D).',
    'Neither the manager nor the assistants (A) were present (B) when the auditor arrived (C) at the office (D).',
    'If I was you (A), I would carefully review (B) all the documents (C) before signing them (D).',
    'The speaker’s conciliatory remarks (A) helped placate (B) the angry audience (C) during the meeting (D).',
    'He insisted on that (A) he was innocent (B) and demanded a fair (C) inquiry into the matter (D).',
    'Each of the candidates (A) have submitted (B) their application forms (C) before the deadline (D).',
    'The professor gave a lucid explanation (A) of compound interest (B) that clarified (C) the entire concept (D).',
  ]

  // Q1–Q15 standalone; Q16–25 come from cloze + RC groups.
  return Array.from({ length: 15 }, (_, index) => {
    const n = index + 1
    const options = optionSet(`eng-${n}`, ['A', 'B', 'C', 'D', 'No error'])
    return {
      id: `eng-q-${n}`,
      sectionId: 'english',
      number: n,
      directions: englishDirections,
      statement: stems[index % stems.length],
      options,
      positiveMarks: 1,
      negativeMarks: 0.25,
      correctOptionId: options[4].id,
    }
  })
}

function buildQuantitativeStandalone(): Question[] {
  const prompts = [
    '45% of 800 + 25% of 480 = ?',
    'A can do a work in 12 days and B in 18 days. Working together, they finish it in:',
    'Simple interest on a sum for 2 years at 10% p.a. is ₹400. Find the sum.',
    'The average of 5 numbers is 40. If one number is excluded, the average becomes 38. The excluded number is:',
    'A train 150 m long crosses a platform 250 m long in 20 seconds. Speed of the train is:',
    'If the price of an article is increased by 20% and then decreased by 20%, the net change is:',
    'The ratio of ages of A and B is 3:4. After 6 years, the ratio becomes 4:5. Present age of A is:',
    'Find the wrong number in the series: 7, 8, 18, 57, 228, 1165',
    'A shopkeeper sells an item at 10% profit. Cost price of the item is ₹500. Selling price is:',
    'If a company’s revenue increased from 80 to 100 crore, the percentage increase is:',
  ]

  const optionBanks = [
    ['460', '480', '500', '520', 'None of these'],
    ['6 days', '7.2 days', '8 days', '9 days', '10 days'],
    ['₹1600', '₹1800', '₹2000', '₹2200', '₹2400'],
    ['40', '42', '48', '50', '52'],
    ['54 km/h', '60 km/h', '72 km/h', '80 km/h', '90 km/h'],
    ['No change', '4% decrease', '4% increase', '2% decrease', '2% increase'],
    ['12 years', '15 years', '18 years', '21 years', '24 years'],
    ['8', '18', '57', '228', '1165'],
    ['₹520', '₹540', '₹550', '₹560', '₹580'],
    ['20%', '22%', '25%', '30%', '35%'],
  ]

  // Q1–Q30 standalone; Q31–35 come from DI group.
  return Array.from({ length: 30 }, (_, index) => {
    const n = index + 1
    const texts = optionBanks[index % optionBanks.length]
    const options = optionSet(`qa-${n}`, texts)
    return {
      id: `qa-q-${n}`,
      sectionId: 'quantitative',
      number: n,
      directions: quantDirections,
      statement: prompts[index % prompts.length],
      options,
      positiveMarks: 1,
      negativeMarks: 0.25,
      correctOptionId: options[1].id,
    }
  })
}

function buildReasoningStandalone(): Question[] {
  const prompts = [
    'Statements: All books are pens. Some pens are pencils. Conclusions: I. Some books are pencils. II. No book is a pencil.',
    'If BANK is coded as CZOL, how is MOCK coded?',
    'Pointing to a photo, Ravi said, “She is the daughter of my grandfather’s only son.” How is the girl related to Ravi?',
    'Statements: A > B ≥ C = D < E. Conclusions: I. A > D  II. B < E',
    'Five friends sit in a row facing north. A is left of B but right of C. D is right of B. Who is in the middle?',
    'A man walks 5 km north, then 3 km east, then 5 km south. How far is he from the starting point?',
    'Find the next term: AZ, BY, CX, ?',
    'Which does not belong to the group: Square, Circle, Triangle, Rectangle, Cube?',
    'In a certain machine, input “bank exam test” becomes “knab maxe tset”. What is the rule?',
    'Six people live on six floors. P lives above Q. R lives on floor 2. Who cannot live on floor 6?',
  ]

  const optionBanks = [
    ['Only I follows', 'Only II follows', 'Either I or II', 'Neither follows', 'Both follow'],
    ['NPDL', 'NPDJ', 'LQBJ', 'NPBL', 'None of these'],
    ['Sister', 'Cousin', 'Daughter', 'Niece', 'Aunt'],
    ['Only I is true', 'Only II is true', 'Either is true', 'Both are true', 'Neither is true'],
    ['A', 'B', 'C', 'D', 'Cannot be determined'],
    ['2 km', '3 km', '5 km', '8 km', '13 km'],
    ['DW', 'DV', 'EW', 'DU', 'EV'],
    ['Square', 'Circle', 'Triangle', 'Rectangle', 'Cube'],
    ['Reverse each word', 'Sort alphabetically', 'Shift letters by 1', 'Capitalize all', 'None of these'],
    ['P', 'Q', 'R', 'Both Q and R', 'Data insufficient'],
  ]

  // Q1–Q35 standalone; Q36–40 come from case study group.
  return Array.from({ length: 35 }, (_, index) => {
    const n = index + 1
    const texts = optionBanks[index % optionBanks.length]
    const options = optionSet(`rs-${n}`, texts)
    return {
      id: `rs-q-${n}`,
      sectionId: 'reasoning' as SectionId,
      number: n,
      directions: reasoningDirections,
      statement: prompts[index % prompts.length],
      options,
      positiveMarks: 1,
      negativeMarks: 0.25,
      correctOptionId: options[0].id,
    }
  })
}

const groupedQuestions = questionGroups.flatMap((group) => group.questions)

export const questions: Question[] = [
  ...buildEnglishStandalone(),
  ...groupedQuestions.filter((q) => q.sectionId === 'english'),
  ...buildQuantitativeStandalone(),
  ...groupedQuestions.filter((q) => q.sectionId === 'quantitative'),
  ...buildReasoningStandalone(),
  ...groupedQuestions.filter((q) => q.sectionId === 'reasoning'),
].sort((a, b) => {
  const sectionOrder: Record<SectionId, number> = {
    english: 0,
    quantitative: 1,
    reasoning: 2,
  }
  if (sectionOrder[a.sectionId] !== sectionOrder[b.sectionId]) {
    return sectionOrder[a.sectionId] - sectionOrder[b.sectionId]
  }
  return a.number - b.number
})

export function getQuestionsBySection(sectionId: SectionId): Question[] {
  return questions.filter((question) => question.sectionId === sectionId)
}
