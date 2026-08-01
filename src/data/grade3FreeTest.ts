import type { ExamMeta, Question } from '@/types/exam'

const sections = [
  {
    id: 'mathematics' as const,
    name: 'Mathematics',
    shortName: 'Maths',
    questionCount: 15,
    durationMinutes: 20,
  },
  {
    id: 'general_knowledge' as const,
    name: 'General Knowledge',
    shortName: 'GK',
    questionCount: 15,
    durationMinutes: 20,
  },
]

export const grade3ExamMeta: ExamMeta = {
  id: 'grade3-free-anvit',
  title: 'Grade 3 Free Practice Test — Anvit Jain',
  totalDurationMinutes: 40,
  sections,
}

function optionSet(prefix: string, texts: string[]) {
  return texts.map((text, index) => ({
    id: `${prefix}-o${index + 1}`,
    label: String.fromCharCode(65 + index),
    text,
  }))
}

type Stem = {
  statement: string
  options: string[]
  /** 0-based index of the correct option */
  correctIndex: number
}

const mathDirections = 'Directions: Choose the correct answer.'
const gkDirections = 'Directions: Choose the correct answer.'

const mathStems: Stem[] = [
  {
    statement: 'What is 8 + 7?',
    options: ['14', '15', '16', '17'],
    correctIndex: 1,
  },
  {
    statement: 'What is 25 − 9?',
    options: ['14', '15', '16', '17'],
    correctIndex: 2,
  },
  {
    statement: 'What is 6 × 4?',
    options: ['20', '22', '24', '26'],
    correctIndex: 2,
  },
  {
    statement: 'What is 36 ÷ 6?',
    options: ['4', '5', '6', '7'],
    correctIndex: 2,
  },
  {
    statement: 'Which number comes next: 2, 4, 6, 8, ?',
    options: ['9', '10', '11', '12'],
    correctIndex: 1,
  },
  {
    statement: 'How many sides does a triangle have?',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
  },
  {
    statement: 'How many hours are there in one day?',
    options: ['12', '20', '24', '30'],
    correctIndex: 2,
  },
  {
    statement: 'Ria has ₹50. She buys a pencil for ₹12. How much money is left?',
    options: ['₹28', '₹32', '₹38', '₹42'],
    correctIndex: 2,
  },
  {
    statement: 'What is 15 + 10 + 5?',
    options: ['25', '30', '35', '40'],
    correctIndex: 1,
  },
  {
    statement: 'Which is the largest number?',
    options: ['89', '98', '79', '97'],
    correctIndex: 1,
  },
  {
    statement: 'A box has 9 apples. Mother adds 6 more. How many apples are there now?',
    options: ['12', '14', '15', '16'],
    correctIndex: 2,
  },
  {
    statement: 'What is 7 × 5?',
    options: ['30', '35', '40', '45'],
    correctIndex: 1,
  },
  {
    statement: 'How many minutes are there in one hour?',
    options: ['30', '45', '60', '100'],
    correctIndex: 2,
  },
  {
    statement: 'A square has how many equal sides?',
    options: ['2', '3', '4', '5'],
    correctIndex: 2,
  },
  {
    statement: 'What is 100 − 45?',
    options: ['45', '55', '65', '75'],
    correctIndex: 1,
  },
]

const gkStems: Stem[] = [
  {
    statement: 'How many days are there in a week?',
    options: ['5', '6', '7', '8'],
    correctIndex: 2,
  },
  {
    statement: 'What is the capital of India?',
    options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
    correctIndex: 1,
  },
  {
    statement: 'Which animal is known as the King of the Jungle?',
    options: ['Tiger', 'Elephant', 'Lion', 'Bear'],
    correctIndex: 2,
  },
  {
    statement: 'How many colours are there in a rainbow?',
    options: ['5', '6', '7', '8'],
    correctIndex: 2,
  },
  {
    statement: 'Which planet do we live on?',
    options: ['Mars', 'Venus', 'Earth', 'Jupiter'],
    correctIndex: 2,
  },
  {
    statement: 'Which festival is known as the Festival of Lights?',
    options: ['Holi', 'Diwali', 'Eid', 'Christmas'],
    correctIndex: 1,
  },
  {
    statement: 'How many letters are there in the English alphabet?',
    options: ['24', '25', '26', '27'],
    correctIndex: 2,
  },
  {
    statement: 'Which sense organ helps us to see?',
    options: ['Ears', 'Nose', 'Eyes', 'Tongue'],
    correctIndex: 2,
  },
  {
    statement: 'National bird of India is the:',
    options: ['Sparrow', 'Peacock', 'Crow', 'Parrot'],
    correctIndex: 1,
  },
  {
    statement: 'Which is the largest ocean in the world?',
    options: ['Indian Ocean', 'Atlantic Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctIndex: 3,
  },
  {
    statement: 'A baby frog is called a:',
    options: ['Cub', 'Kitten', 'Tadpole', 'Calf'],
    correctIndex: 2,
  },
  {
    statement: 'Which sport uses a bat and a ball?',
    options: ['Football', 'Cricket', 'Hockey', 'Swimming'],
    correctIndex: 1,
  },
  {
    statement: 'The Sun rises in the:',
    options: ['West', 'North', 'East', 'South'],
    correctIndex: 2,
  },
  {
    statement: 'Which of these is a fruit?',
    options: ['Carrot', 'Potato', 'Mango', 'Onion'],
    correctIndex: 2,
  },
  {
    statement: 'How many months are there in a year?',
    options: ['10', '11', '12', '13'],
    correctIndex: 2,
  },
]

function buildQuestions(
  stems: Stem[],
  sectionId: 'mathematics' | 'general_knowledge',
  idPrefix: string,
  directions: string,
): Question[] {
  return stems.map((stem, index) => {
    const n = index + 1
    const options = optionSet(`${idPrefix}-${n}`, stem.options)
    return {
      id: `${idPrefix}-q-${n}`,
      sectionId,
      number: n,
      directions,
      statement: stem.statement,
      options,
      positiveMarks: 1,
      negativeMarks: 0,
      correctOptionId: options[stem.correctIndex].id,
    }
  })
}

export const grade3Questions: Question[] = [
  ...buildQuestions(mathStems, 'mathematics', 'math', mathDirections),
  ...buildQuestions(gkStems, 'general_knowledge', 'gk', gkDirections),
]
