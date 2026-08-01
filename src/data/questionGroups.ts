import type { Question, QuestionGroup, QuestionGroupType, SectionId } from '@/types/exam'

function optionSet(prefix: string, texts: string[]) {
  return texts.map((text, index) => ({
    id: `${prefix}-o${index + 1}`,
    label: String.fromCharCode(65 + index),
    text,
  }))
}

function makeChildQuestions(params: {
  groupId: string
  sectionId: SectionId
  startNumber: number
  count: number
  idPrefix: string
  statements: string[]
  optionBanks: string[][]
  directions: string
}): Question[] {
  return Array.from({ length: params.count }, (_, index) => {
    const number = params.startNumber + index
    const options = optionSet(`${params.idPrefix}-${number}`, params.optionBanks[index % params.optionBanks.length])
    return {
      id: `${params.idPrefix}-q-${number}`,
      sectionId: params.sectionId,
      number,
      groupId: params.groupId,
      directions: params.directions,
      statement: params.statements[index % params.statements.length],
      options,
      positiveMarks: 1,
      negativeMarks: 0.25,
      correctOptionId: options[0].id,
    }
  })
}

/** Long passage (~1000+ words) for scroll/perf validation. */
export const SAMPLE_RC_PASSAGE = `
The modern banking sector has undergone a profound transformation over the last three decades.
Financial institutions that once relied almost exclusively on physical branches and paper-ledgers
now operate through dense networks of digital channels, analytics platforms, and regulatory
frameworks designed to protect customers and systemic stability. In emerging economies, this
shift has been especially visible. Mobile banking, Unified Payments Interface systems, and
instant credit underwriting have expanded access to formal finance for millions of households
that earlier remained outside the banking net.

Yet expansion of access is only one part of the story. Banks must simultaneously manage credit
risk, liquidity risk, operational risk, and increasingly, cyber risk. A single vulnerability in
a payments gateway can cascade across counterparties within minutes. Consequently, supervisors
have insisted on stronger governance, continuous monitoring, and scenario-based stress testing.
Boards are expected to understand not only traditional balance-sheet metrics but also technology
architecture, third-party dependencies, and customer-protection obligations.

Financial literacy remains a parallel challenge. Customers who adopt digital products without
adequate awareness of fees, grievance redressal, or data-privacy rights can become vulnerable to
mis-selling and fraud. Regulators therefore encourage banks to design interfaces that are clear,
multilingual, and inclusive for first-time users. Product disclosures that bury critical terms
in dense legal language undermine trust and invite supervisory scrutiny.

Climate risk has also entered the mainstream of banking strategy. Physical risks—floods, heat
waves, and crop failures—can impair asset quality in agriculture and MSME portfolios. Transition
risks arise when carbon-intensive borrowers face abrupt policy or market shifts. Forward-looking
banks are embedding environmental risk factors into credit appraisal and portfolio monitoring,
while also financing renewable energy, green buildings, and sustainable mobility.

Talent and culture matter as much as technology. Institutions that treat compliance as a
checklist often discover issues late, at higher cost. Institutions that treat compliance and
conduct as strategic advantages tend to invest earlier in controls, training, and ethical
decision-making. In competitive markets, reputation is a fragile asset; a single episode of
poor conduct can erase years of brand investment.

Looking ahead, the winners in banking are unlikely to be those that merely digitize existing
processes. They will be institutions that redesign journeys around customer outcomes, use data
responsibly, maintain robust resilience, and collaborate with fintech partners without
surrendering accountability. The passage of banking from brick-and-mortar dominance to a hybrid
digital ecosystem is not an end-state. It is an ongoing adaptation to changing customer
expectations, technological capability, and public-policy priorities.

Community banking experiments illustrate the same theme at a smaller scale. Local lenders that
understand cash-flow patterns of kirana stores, dairy cooperatives, and seasonal traders can
price risk more accurately than distant models trained only on urban salaried profiles. When
such local knowledge is combined with digital collection tools and transparent pricing, credit
can become both inclusive and sustainable. Conversely, aggressive growth targets without
underwriting discipline recreate the boom-bust cycles that banking history repeatedly warns
against.

Payment innovations also reshape monetary habits. Instant settlement reduces float, improves
working capital cycles for merchants, and creates richer transaction data for credit scoring.
However, it also compresses the time available for fraud detection. Banks therefore invest in
behavioral analytics, device fingerprinting, and real-time rule engines. The objective is not
to eliminate every risk—an impossible goal—but to keep residual risk within appetite while
preserving frictionless customer experience.

Finally, public trust depends on reliability. Outages during salary credits, festival sales, or
tax deadlines damage confidence disproportionately. Resilience engineering—redundant data
centers, chaos testing, clear incident communication—has become a board-level topic rather than
a back-office concern. In this environment, reading comprehension of policy documents, case
studies, and financial reports is not merely an examination skill; it mirrors the analytical
discipline required of professionals who interpret complex information under time pressure.
`.replace(/\s+/g, ' ').trim()

const RC_INSTRUCTIONS =
  'Directions: Read the following passage carefully and answer the questions that follow. Base your answers only on the information given in the passage.'

const CLOZE_PASSAGE = `
In today’s competitive job market, soft skills are as important as technical expertise. Employers
look for candidates who can communicate clearly, collaborate across teams, and adapt quickly to
change. Continuous learning has therefore become essential. Professionals who invest in
upskilling are more likely to remain relevant as technology evolves. At the same time,
organizations must create an environment where feedback is constructive and innovation is
encouraged. Without psychological safety, employees may hesitate to share ideas, reducing the
organization’s capacity to improve. Ultimately, sustainable success depends on a balance between
individual initiative and institutional support.
`.replace(/\s+/g, ' ').trim()

const DI_PASSAGE = `
Study the following data carefully and answer the questions.
A company reported quarterly sales (in ₹ crore):
Q1: North 40, South 35, East 28, West 32
Q2: North 44, South 38, East 30, West 36
Q3: North 48, South 41, East 33, West 39
Q4: North 52, South 45, East 36, West 42
Total annual marketing spend was ₹48 crore, allocated equally across the four quarters.
`.replace(/\s+/g, ' ').trim()

const CASE_PASSAGE = `
Case Study: Five employees—Asha, Bharat, Charu, Deepak, and Esha—work in different departments:
HR, Finance, IT, Marketing, and Operations (not necessarily in that order). They sit in a row of
five seats facing north.
1) Asha sits at one of the extreme ends.
2) The IT employee sits second to the right of Asha.
3) Charu is in Finance and sits immediately left of the Marketing employee.
4) Deepak sits in the middle and is not in HR.
5) Esha is in Operations and sits at an extreme end.
6) Bharat is in IT.
`.replace(/\s+/g, ' ').trim()

function buildGroup(params: {
  id: string
  type: QuestionGroupType
  title: string
  instructions: string
  passage: string
  sectionId: SectionId
  startNumber: number
  count: number
  idPrefix: string
  statements: string[]
  optionBanks: string[][]
}): QuestionGroup {
  const questions = makeChildQuestions({
    groupId: params.id,
    sectionId: params.sectionId,
    startNumber: params.startNumber,
    count: params.count,
    idPrefix: params.idPrefix,
    statements: params.statements,
    optionBanks: params.optionBanks,
    directions: params.instructions,
  })

  return {
    id: params.id,
    type: params.type,
    title: params.title,
    instructions: params.instructions,
    passage: params.passage,
    sectionId: params.sectionId,
    questions,
  }
}

export const questionGroups: QuestionGroup[] = [
  buildGroup({
    id: 'eng-cloze-1',
    type: 'cloze_test',
    title: 'Cloze Test – Soft Skills at Work',
    instructions:
      'Directions: In the following passage, some words have been left out. Read the passage carefully and choose the most appropriate word for each blank-linked question.',
    passage: CLOZE_PASSAGE,
    sectionId: 'english',
    startNumber: 16,
    count: 5,
    idPrefix: 'eng-cloze',
    statements: [
      'Which quality is described as equally important as technical expertise?',
      'According to the passage, continuous learning helps professionals to:',
      'What may happen if psychological safety is absent?',
      'Sustainable success depends on a balance between:',
      'The author’s overall tone towards upskilling is:',
    ],
    optionBanks: [
      ['Soft skills', 'Hardware skills', 'Rote memory', 'Strict hierarchy', 'None of these'],
      ['Remain relevant', 'Avoid teamwork', 'Ignore feedback', 'Reduce adaptability', 'Quit learning'],
      ['Employees hesitate to share ideas', 'Innovation rises sharply', 'Trust increases', 'Hiring stops', 'Costs fall automatically'],
      ['Individual initiative and institutional support', 'Only hierarchy', 'Only technology', 'Only incentives', 'Only regulation'],
      ['Supportive', 'Hostile', 'Indifferent', 'Sarcastic', 'Cynical'],
    ],
  }),
  buildGroup({
    id: 'eng-rc-1',
    type: 'reading_comprehension',
    title: 'Reading Comprehension – Future of Banking',
    instructions: RC_INSTRUCTIONS,
    passage: SAMPLE_RC_PASSAGE,
    sectionId: 'english',
    startNumber: 21,
    count: 5,
    idPrefix: 'eng-rc',
    statements: [
      'What has expanded access to formal finance for many households?',
      'According to the passage, boards are now expected to understand:',
      'Why do regulators encourage clear and multilingual interfaces?',
      'Climate-related transition risk arises when:',
      'Which statement best captures the author’s concluding view?',
    ],
    optionBanks: [
      [
        'Mobile banking and instant digital payment systems',
        'Only paper ledgers',
        'Closure of all branches',
        'Higher cash handling only',
        'Reduced regulatory oversight',
      ],
      [
        'Technology architecture and third-party dependencies as well as traditional metrics',
        'Only branch interiors',
        'Only marketing slogans',
        'Only currency design',
        'Only cafeteria policy',
      ],
      [
        'To protect first-time users and improve financial literacy',
        'To increase legal complexity',
        'To hide product fees',
        'To discourage digital adoption',
        'To eliminate customer service',
      ],
      [
        'Carbon-intensive borrowers face abrupt policy or market shifts',
        'Interest rates never change',
        'Customers prefer cash forever',
        'Banks stop lending completely',
        'Branches become larger',
      ],
      [
        'Winners redesign journeys around customer outcomes and resilience',
        'Digitizing old processes alone is enough',
        'Public trust is irrelevant',
        'Banks should ignore cyber risk',
        'Local knowledge has no value',
      ],
    ],
  }),
  buildGroup({
    id: 'qa-di-1',
    type: 'data_interpretation',
    title: 'Data Interpretation – Quarterly Sales',
    instructions: 'Directions: Study the data carefully and answer the questions that follow.',
    passage: DI_PASSAGE,
    sectionId: 'quantitative',
    startNumber: 31,
    count: 5,
    idPrefix: 'qa-di',
    statements: [
      'What was the total sales of all regions in Q1?',
      'Which region had the highest sales in Q4?',
      'What is the difference between North sales in Q4 and Q1?',
      'If marketing spend is equal across quarters, spend per quarter is:',
      'East region’s total annual sales equal:',
    ],
    optionBanks: [
      ['135', '140', '145', '150', '155'],
      ['North', 'South', 'East', 'West', 'Cannot be determined'],
      ['8', '10', '12', '14', '16'],
      ['₹10 crore', '₹12 crore', '₹14 crore', '₹16 crore', '₹18 crore'],
      ['117', '121', '127', '131', '137'],
    ],
  }),
  buildGroup({
    id: 'rs-case-1',
    type: 'case_study',
    title: 'Case Study – Seating & Departments',
    instructions: 'Directions: Study the following information carefully and answer the questions.',
    passage: CASE_PASSAGE,
    sectionId: 'reasoning',
    startNumber: 36,
    count: 5,
    idPrefix: 'rs-case',
    statements: [
      'Who sits at the extreme left end?',
      'Which department does Deepak belong to?',
      'Who sits immediately right of Bharat?',
      'Which of the following is true?',
      'Who is in Marketing?',
    ],
    optionBanks: [
      ['Asha', 'Esha', 'Charu', 'Deepak', 'Bharat'],
      ['HR', 'Finance', 'Marketing', 'Operations', 'Cannot be determined'],
      ['Charu', 'Deepak', 'Esha', 'Asha', 'None of these'],
      ['Esha sits at an extreme end', 'Bharat is in HR', 'Deepak is in IT', 'Asha is in Finance', 'Charu is in IT'],
      ['Asha', 'Bharat', 'Charu', 'Deepak', 'Esha'],
    ],
  }),
]

export const questionGroupById: Record<string, QuestionGroup> = Object.fromEntries(
  questionGroups.map((group) => [group.id, group]),
)

export function getGroupById(groupId: string): QuestionGroup | undefined {
  return questionGroupById[groupId]
}

export function getGroupForQuestion(question: Question): QuestionGroup | undefined {
  return question.groupId ? questionGroupById[question.groupId] : undefined
}
