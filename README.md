# Testbooklet

Computer Based Test (CBT) mock exam platform with purchasable mocks, passcode login, and score report cards.

Built with React 19, TypeScript, Vite, Tailwind CSS, Zustand, Framer Motion, and Lucide icons.

## Features

- Landing page with mock test pricing and checkout
- Passcode-based student login after purchase
- One-frame exam workspace with independent question scrolling
- Section tabs: English (25), Quantitative (35), Reasoning (40)
- Question palette with status colors and filters
- Section and full-test report cards with scoring
- Timer, pause modal, autosave every 10s
- Keyboard navigation: ← → Enter, keys 1–5 for options
- Dark mode, fullscreen, submit confirmation
- Responsive sidebar / mobile drawer

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5176

## Scripts

- `npm run dev` – start development server
- `npm run build` – typecheck + production build
- `npm run preview` – preview production build

## Structure

```
src/
  components/layout|question|common|exam|auth
  pages/LandingPage|CheckoutPage|PurchaseSuccessPage|LoginPage|ExamPage
  hooks/useTimer|useExam|useBreakpoint
  store/examStore|authStore|purchaseStore
  data/questions|questionGroups|tests
  types/exam|auth|commerce
```
