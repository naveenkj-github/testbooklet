import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthSession, StudentCredentials } from '@/types/auth'
import { normalizePasscode } from '@/lib/commerce'
import { usePurchaseStore } from '@/store/purchaseStore'

interface AuthState {
  session: AuthSession | null
  login: (credentials: StudentCredentials) => { ok: true } | { ok: false; error: string }
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      login: (credentials) => {
        const passcode = normalizePasscode(credentials.passcode)
        const purchase = usePurchaseStore.getState().findByPasscode(passcode)

        if (!purchase) {
          return {
            ok: false,
            error: 'Invalid passcode. Purchase a test to get your access code.',
          }
        }

        set({
          session: {
            name: credentials.name.trim(),
            passcode: purchase.passcode,
            testId: purchase.testId,
            testTitle: purchase.testTitle,
            loggedInAt: new Date().toISOString(),
          },
        })

        return { ok: true }
      },
      logout: () => set({ session: null }),
      isAuthenticated: () => Boolean(get().session?.name && get().session?.passcode),
    }),
    {
      name: 'cbt-auth-session-v2',
    },
  ),
)
