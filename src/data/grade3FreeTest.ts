import type { ExamMeta, Question } from '@/types/exam'

export type Grade3Level = 'beginner' | 'intermediate' | 'advanced'

export interface Grade3ExamPackage {
  meta: ExamMeta
  questions: Question[]
}

type Stem = {
  statement: string
  options: string[]
  /** 0-based index of the correct option */
  correctIndex: number
}

function optionSet(prefix: string, texts: string[]) {
  return texts.map((text, index) => ({
    id: `${prefix}-o${index + 1}`,
    label: String.fromCharCode(65 + index),
    text,
  }))
}

function buildSections(durationMinutes: number) {
  const half = Math.floor(durationMinutes / 2)
  return [
    {
      id: 'mathematics' as const,
      name: 'Mathematics',
      shortName: 'Maths',
      questionCount: 15,
      durationMinutes: half,
    },
    {
      id: 'general_knowledge' as const,
      name: 'General Knowledge',
      shortName: 'GK',
      questionCount: 15,
      durationMinutes: durationMinutes - half,
    },
  ]
}

function buildMeta(level: Grade3Level, label: string): ExamMeta {
  return {
    id: `grade3-anvit-${level}`,
    title: `Grade 3 ${label} Test — Anvit Jain`,
    totalDurationMinutes: 40,
    sections: buildSections(40),
  }
}

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

function packageExam(
  level: Grade3Level,
  label: string,
  math: Stem[],
  gk: Stem[],
): Grade3ExamPackage {
  const prefix = level.slice(0, 3)
  return {
    meta: buildMeta(level, label),
    questions: [
      ...buildQuestions(math, 'mathematics', `${prefix}-math`, mathDirections),
      ...buildQuestions(gk, 'general_knowledge', `${prefix}-gk`, gkDirections),
    ],
  }
}

const mathDirections = 'Directions: Read carefully and choose the correct answer.'
const gkDirections = 'Directions: Choose the correct answer.'

/** Easy warm-up: small numbers, basic facts. */
const beginnerMath: Stem[] = [
  { statement: 'What is 8 + 7?', options: ['14', '15', '16', '17'], correctIndex: 1 },
  { statement: 'What is 25 − 9?', options: ['14', '15', '16', '17'], correctIndex: 2 },
  { statement: 'What is 6 × 4?', options: ['20', '22', '24', '26'], correctIndex: 2 },
  { statement: 'What is 36 ÷ 6?', options: ['4', '5', '6', '7'], correctIndex: 2 },
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
  { statement: 'What is 15 + 10 + 5?', options: ['25', '30', '35', '40'], correctIndex: 1 },
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
  { statement: 'What is 7 × 5?', options: ['30', '35', '40', '45'], correctIndex: 1 },
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
  { statement: 'What is 100 − 45?', options: ['45', '55', '65', '75'], correctIndex: 1 },
]

const beginnerGk: Stem[] = [
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

/** Grade 3 challenge: word problems, place value, perimeter. */
const intermediateMath: Stem[] = [
  { statement: 'What is 387 + 464?', options: ['841', '851', '861', '871'], correctIndex: 1 },
  { statement: 'What is 1000 − 476?', options: ['514', '524', '534', '544'], correctIndex: 1 },
  { statement: 'What is 48 × 7?', options: ['326', '336', '346', '356'], correctIndex: 1 },
  { statement: 'What is 144 ÷ 12?', options: ['10', '11', '12', '14'], correctIndex: 2 },
  {
    statement: 'Find the missing number: 5, 10, 20, 40, ?',
    options: ['50', '60', '70', '80'],
    correctIndex: 3,
  },
  {
    statement: 'A rectangle is 12 cm long and 8 cm wide. What is its perimeter?',
    options: ['20 cm', '32 cm', '40 cm', '96 cm'],
    correctIndex: 2,
  },
  {
    statement: 'A movie starts at 3:45 pm and lasts 2 hours 20 minutes. When does it end?',
    options: ['5:45 pm', '6:05 pm', '6:15 pm', '6:25 pm'],
    correctIndex: 1,
  },
  {
    statement:
      'Anvit has ₹250. He buys a book for ₹175 and a pen for ₹35. How much money is left?',
    options: ['₹30', '₹40', '₹45', '₹55'],
    correctIndex: 1,
  },
  {
    statement: 'Which digit is in the hundreds place in 4,582?',
    options: ['2', '4', '5', '8'],
    correctIndex: 2,
  },
  {
    statement: 'Round 367 to the nearest ten.',
    options: ['360', '365', '370', '400'],
    correctIndex: 2,
  },
  {
    statement:
      'A school has 6 classes. Each class has 28 students. How many students are there in all?',
    options: ['148', '158', '168', '178'],
    correctIndex: 2,
  },
  {
    statement: 'What is the next odd number after 249?',
    options: ['250', '251', '252', '253'],
    correctIndex: 1,
  },
  {
    statement: 'How many centimetres are there in 3 metres 45 centimetres?',
    options: ['345 cm', '3045 cm', '354 cm', '435 cm'],
    correctIndex: 0,
  },
  {
    statement: 'A square garden has each side 15 m long. What is the distance around the garden?',
    options: ['30 m', '45 m', '60 m', '225 m'],
    correctIndex: 2,
  },
  {
    statement: 'Riya packed 96 cookies equally into 8 boxes. How many cookies are in each box?',
    options: ['10', '11', '12', '14'],
    correctIndex: 2,
  },
]

const intermediateGk: Stem[] = [
  {
    statement: 'Which is the largest state of India by area?',
    options: ['Maharashtra', 'Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh'],
    correctIndex: 2,
  },
  {
    statement: 'Who is known as the Father of the Nation in India?',
    options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Subhas Chandra Bose', 'Bhagat Singh'],
    correctIndex: 1,
  },
  {
    statement: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Mercury', 'Saturn'],
    correctIndex: 1,
  },
  {
    statement: 'The national animal of India is the:',
    options: ['Lion', 'Elephant', 'Tiger', 'Peacock'],
    correctIndex: 2,
  },
  {
    statement: 'Which gas do plants take in during photosynthesis?',
    options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    correctIndex: 2,
  },
  {
    statement: 'In which city is the Taj Mahal located?',
    options: ['Delhi', 'Jaipur', 'Agra', 'Lucknow'],
    correctIndex: 2,
  },
  {
    statement: 'How many players are there in a cricket team on the field?',
    options: ['9', '10', '11', '12'],
    correctIndex: 2,
  },
  {
    statement: 'Which is the longest river in India?',
    options: ['Yamuna', 'Godavari', 'Ganga', 'Narmada'],
    correctIndex: 2,
  },
  {
    statement: 'Who invented the telephone?',
    options: ['Thomas Edison', 'Alexander Graham Bell', 'Wright Brothers', 'Isaac Newton'],
    correctIndex: 1,
  },
  {
    statement: 'Which festival marks the victory of good over evil and is linked to Lord Rama?',
    options: ['Holi', 'Diwali', 'Dussehra', 'Pongal'],
    correctIndex: 2,
  },
  {
    statement: 'The Earth rotates around its axis once in about:',
    options: ['12 hours', '24 hours', '7 days', '365 days'],
    correctIndex: 1,
  },
  {
    statement: 'Which organ pumps blood to all parts of the body?',
    options: ['Lungs', 'Brain', 'Heart', 'Stomach'],
    correctIndex: 2,
  },
  {
    statement: 'Which Indian city is known as the Silicon Valley of India?',
    options: ['Hyderabad', 'Pune', 'Bengaluru', 'Chennai'],
    correctIndex: 2,
  },
  {
    statement: 'Water freezes at what temperature on the Celsius scale?',
    options: ['0°C', '10°C', '32°C', '100°C'],
    correctIndex: 0,
  },
  {
    statement: 'Which is the smallest planet in our solar system?',
    options: ['Mars', 'Venus', 'Mercury', 'Pluto'],
    correctIndex: 2,
  },
]

/** Stretch Grade 3 / early Grade 4 — multi-step, still no %, ratios or fractions. */
const advancedMath: Stem[] = [
  {
    statement: 'What is 2,556 − 1,478?',
    options: ['1,058', '1,068', '1,078', '1,088'],
    correctIndex: 2,
  },
  {
    statement: 'What is 125 × 8?',
    options: ['900', '980', '1,000', '1,025'],
    correctIndex: 2,
  },
  {
    statement: 'What is 756 ÷ 9?',
    options: ['74', '82', '84', '86'],
    correctIndex: 2,
  },
  {
    statement: 'Find the missing number: 3, 6, 12, 24, 48, ?',
    options: ['72', '84', '96', '100'],
    correctIndex: 2,
  },
  {
    statement:
      'A rectangular park is 45 m long and 30 m wide. What is the distance around the park?',
    options: ['75 m', '120 m', '150 m', '1,350 m'],
    correctIndex: 2,
  },
  {
    statement:
      'Anvit starts homework at 4:25 pm and works for 1 hour 50 minutes. When does he finish?',
    options: ['5:55 pm', '6:05 pm', '6:15 pm', '6:25 pm'],
    correctIndex: 2,
  },
  {
    statement:
      'A shopkeeper has 1,250 pencils. He packs them in boxes of 25. How many boxes does he need?',
    options: ['40', '45', '50', '55'],
    correctIndex: 2,
  },
  {
    statement: 'What is the place value of 7 in 7,305?',
    options: ['7', '70', '700', '7,000'],
    correctIndex: 3,
  },
  {
    statement: 'Round 2,846 to the nearest hundred.',
    options: ['2,800', '2,850', '2,900', '3,000'],
    correctIndex: 0,
  },
  {
    statement:
      'A train carries 48 passengers in each coach. If there are 12 coaches, how many passengers are there?',
    options: ['476', '546', '576', '586'],
    correctIndex: 2,
  },
  {
    statement: 'Which is the correct expanded form of 3,506?',
    options: [
      '3000 + 50 + 6',
      '3000 + 500 + 6',
      '300 + 50 + 6',
      '3000 + 500 + 60',
    ],
    correctIndex: 1,
  },
  {
    statement: 'How many minutes are there in 3 hours 40 minutes?',
    options: ['180', '200', '220', '240'],
    correctIndex: 2,
  },
  {
    statement:
      'Riya saved ₹85 each week for 6 weeks. She then spent ₹210. How much money does she have left?',
    options: ['₹280', '₹300', '₹310', '₹320'],
    correctIndex: 1,
  },
  {
    statement: 'A square has a perimeter of 64 cm. What is the length of one side?',
    options: ['8 cm', '12 cm', '16 cm', '32 cm'],
    correctIndex: 2,
  },
  {
    statement:
      'There are 864 seats in a hall arranged in 24 equal rows. How many seats are in each row?',
    options: ['32', '34', '36', '38'],
    correctIndex: 2,
  },
]

const advancedGk: Stem[] = [
  {
    statement: 'Which is the highest mountain peak in the world?',
    options: ['K2', 'Kanchenjunga', 'Mount Everest', 'Nanda Devi'],
    correctIndex: 2,
  },
  {
    statement: 'Who was the first Prime Minister of independent India?',
    options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Rajendra Prasad'],
    correctIndex: 1,
  },
  {
    statement: 'Which planet has the most moons in our solar system (among common school answers)?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correctIndex: 2,
  },
  {
    statement: 'The currency of Japan is the:',
    options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
    correctIndex: 2,
  },
  {
    statement: 'Which part of the plant makes food?',
    options: ['Root', 'Stem', 'Leaf', 'Flower'],
    correctIndex: 2,
  },
  {
    statement: 'India’s national anthem was written by:',
    options: [
      'Bankim Chandra Chatterjee',
      'Rabindranath Tagore',
      'Sarojini Naidu',
      'Subramania Bharati',
    ],
    correctIndex: 1,
  },
  {
    statement: 'How many continents are there on Earth?',
    options: ['5', '6', '7', '8'],
    correctIndex: 2,
  },
  {
    statement: 'Which vitamin do we mainly get from sunlight?',
    options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
    correctIndex: 3,
  },
  {
    statement: 'The Great Wall is located in which country?',
    options: ['Japan', 'China', 'India', 'Egypt'],
    correctIndex: 1,
  },
  {
    statement: 'Which instrument is used to measure temperature?',
    options: ['Barometer', 'Thermometer', 'Speedometer', 'Compass'],
    correctIndex: 1,
  },
  {
    statement: 'Which Indian state is famous for the backwaters?',
    options: ['Goa', 'Kerala', 'Odisha', 'Gujarat'],
    correctIndex: 1,
  },
  {
    statement: 'Bones are connected to muscles by:',
    options: ['Nerves', 'Ligaments', 'Tendons', 'Cartilage'],
    correctIndex: 2,
  },
  {
    statement: 'Which is the largest desert in the world?',
    options: ['Thar', 'Gobi', 'Sahara', 'Kalahari'],
    correctIndex: 2,
  },
  {
    statement: 'Who discovered gravity after watching a falling apple (as the famous story says)?',
    options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla'],
    correctIndex: 1,
  },
  {
    statement: 'Which gas do humans need to breathe to stay alive?',
    options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Helium'],
    correctIndex: 2,
  },
]

export const grade3Beginner = packageExam('beginner', 'Beginner', beginnerMath, beginnerGk)
export const grade3Intermediate = packageExam(
  'intermediate',
  'Intermediate',
  intermediateMath,
  intermediateGk,
)
export const grade3Advanced = packageExam('advanced', 'Advanced', advancedMath, advancedGk)

/** @deprecated Prefer level-specific packages; kept for older passcodes. */
export const grade3ExamMeta = grade3Intermediate.meta
/** @deprecated Prefer level-specific packages; kept for older passcodes. */
export const grade3Questions = grade3Intermediate.questions

export const GRADE3_EXAMS: Record<string, Grade3ExamPackage> = {
  'grade3-anvit-beginner': grade3Beginner,
  'grade3-anvit-intermediate': grade3Intermediate,
  'grade3-anvit-advanced': grade3Advanced,
  /** Legacy catalog / passcode id → Intermediate */
  'grade3-free-anvit': grade3Intermediate,
}
