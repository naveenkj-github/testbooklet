import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CheckCircle2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { formatInr } from '@/lib/commerce'
import { usePurchaseStore } from '@/store/purchaseStore'

export default function PurchaseSuccessPage() {
  const { purchaseId = '' } = useParams()
  const purchase = usePurchaseStore((state) => state.findById(purchaseId))
  const [copied, setCopied] = useState(false)

  if (!purchase) {
    return <Navigate to="/" replace />
  }

  const copyPasscode = async () => {
    try {
      await navigator.clipboard.writeText(purchase.passcode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select is enough for mock demo
      setCopied(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#F3F7FB] px-4 py-8 sm:px-6">
      <div className="w-full max-w-lg border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-8 w-8 shrink-0 text-[#22C55E]" />
          <div>
            <h1 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Purchase successful</h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Your mock payment for <span className="font-semibold text-[#0F172A]">{purchase.testTitle}</span>{' '}
              ({formatInr(purchase.amountInr)}) is complete.
            </p>
          </div>
        </div>

        <div className="border border-[#B6E8F7] bg-[#E8F8FD] p-4 sm:p-5">
          <p className="text-[11px] font-bold tracking-[0.18em] text-[#0284C7] uppercase">
            Your access passcode
          </p>
          <p className="mt-2 font-mono text-2xl font-extrabold tracking-widest text-[#0F172A] sm:text-3xl">
            {purchase.passcode}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#475569]">
            Save this code. You will need it with your name to start the test. It is stored in this
            browser only.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 gap-2"
            onClick={copyPasscode}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy passcode'}
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className="flex-1">
            <Button className="w-full" size="lg">
              Continue to login
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button className="w-full" size="lg" variant="outline">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
