import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PurchaseRecord } from '@/types/commerce'
import { normalizePasscode } from '@/lib/commerce'

interface PurchaseState {
  purchases: PurchaseRecord[]
  addPurchase: (purchase: PurchaseRecord) => void
  findByPasscode: (passcode: string) => PurchaseRecord | undefined
  findById: (id: string) => PurchaseRecord | undefined
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      purchases: [],
      addPurchase: (purchase) =>
        set((state) => ({
          purchases: [purchase, ...state.purchases],
        })),
      findByPasscode: (passcode) => {
        const key = normalizePasscode(passcode)
        return get().purchases.find((item) => normalizePasscode(item.passcode) === key)
      },
      findById: (id) => get().purchases.find((item) => item.id === id),
    }),
    {
      name: 'cbt-purchases',
    },
  ),
)
