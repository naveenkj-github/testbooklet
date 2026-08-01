export interface MockTestProduct {
  id: string
  title: string
  subtitle: string
  examType: string
  questions: number
  durationMinutes: number
  priceInr: number
  features: string[]
  badge?: string
}

export interface PurchaseRecord {
  id: string
  testId: string
  testTitle: string
  passcode: string
  amountInr: number
  buyerName: string
  purchasedAt: string
}

export interface CheckoutFormValues {
  fullName: string
  email: string
  cardNumber: string
  expiry: string
  cvv: string
}
