import { useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { CreditCard, Gift, Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { getTestById } from '@/data/tests'
import { formatInr, generatePasscode } from '@/lib/commerce'
import { usePurchaseStore } from '@/store/purchaseStore'
import type { CheckoutFormValues } from '@/types/commerce'
import { cn } from '@/lib/utils'

export default function CheckoutPage() {
  const { testId = '' } = useParams()
  const test = getTestById(testId)
  const addPurchase = usePurchaseStore((state) => state.addPurchase)
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)

  const isFree = Boolean(test && test.priceInr === 0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      fullName: isFree ? 'Anvit Jain' : '',
      email: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
    mode: 'onBlur',
  })

  if (!test) {
    return <Navigate to="/" replace />
  }

  const completePurchase = async (buyerName: string) => {
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, isFree ? 400 : 900))

    const purchaseId = `ord_${Date.now().toString(36)}`
    const passcode = generatePasscode(isFree ? 'FREE' : 'CBT')

    addPurchase({
      id: purchaseId,
      testId: test.id,
      testTitle: test.title,
      passcode,
      amountInr: test.priceInr,
      buyerName: buyerName.trim(),
      purchasedAt: new Date().toISOString(),
    })

    navigate(`/purchase-success/${purchaseId}`, { replace: true })
  }

  const onSubmit = async (values: CheckoutFormValues) => {
    await completePurchase(values.fullName)
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#F3F7FB] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E7490] hover:text-[#00AEEF]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to pricing
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6"
            noValidate
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8FD] text-[#00AEEF]">
                {isFree ? <Gift className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0F172A]">
                  {isFree ? 'Claim free test' : 'Mock checkout'}
                </h1>
                <p className="text-sm text-[#64748B]">
                  {isFree
                    ? 'No payment needed — get a free passcode for Anvit Jain.'
                    : 'No real payment — any valid-looking card works.'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Field id="fullName" label="Student name" error={errors.fullName?.message}>
                <input
                  id="fullName"
                  className={inputClass(Boolean(errors.fullName))}
                  placeholder="e.g. Anvit Jain"
                  {...register('fullName', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Enter at least 2 characters' },
                  })}
                />
              </Field>

              {!isFree ? (
                <>
                  <Field id="email" label="Email (for receipt)" error={errors.email?.message}>
                    <input
                      id="email"
                      type="email"
                      className={inputClass(Boolean(errors.email))}
                      placeholder="you@example.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email',
                        },
                      })}
                    />
                  </Field>

                  <Field
                    id="cardNumber"
                    label="Card number"
                    error={errors.cardNumber?.message}
                  >
                    <input
                      id="cardNumber"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      className={inputClass(Boolean(errors.cardNumber))}
                      placeholder="4111 1111 1111 1111"
                      {...register('cardNumber', {
                        required: 'Card number is required',
                        validate: (value) =>
                          value.replace(/\s/g, '').length >= 12 || 'Enter at least 12 digits',
                      })}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field id="expiry" label="Expiry" error={errors.expiry?.message}>
                      <input
                        id="expiry"
                        className={inputClass(Boolean(errors.expiry))}
                        placeholder="MM/YY"
                        {...register('expiry', {
                          required: 'Required',
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                            message: 'Use MM/YY',
                          },
                        })}
                      />
                    </Field>
                    <Field id="cvv" label="CVV" error={errors.cvv?.message}>
                      <input
                        id="cvv"
                        inputMode="numeric"
                        className={inputClass(Boolean(errors.cvv))}
                        placeholder="123"
                        {...register('cvv', {
                          required: 'Required',
                          pattern: { value: /^\d{3,4}$/, message: '3–4 digits' },
                        })}
                      />
                    </Field>
                  </div>
                </>
              ) : null}
            </div>

            <Button type="submit" className="mt-6 w-full gap-2" size="lg" disabled={processing}>
              {isFree ? <Gift className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {processing
                ? 'Processing…'
                : isFree
                  ? 'Get free passcode'
                  : `Pay ${formatInr(test.priceInr)}`}
            </Button>
          </form>

          <aside className="h-fit border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[11px] font-bold tracking-wide text-[#00AEEF] uppercase">
              Order summary
            </p>
            <h2 className="mt-2 text-lg font-bold text-[#0F172A]">{test.title}</h2>
            <p className="mt-1 text-sm text-[#64748B]">{test.examType}</p>
            <dl className="mt-5 space-y-2 border-t border-[#F1F5F9] pt-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[#64748B]">Questions</dt>
                <dd className="font-semibold">{test.questions}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#64748B]">Duration</dt>
                <dd className="font-semibold">{test.durationMinutes} min</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-[#F1F5F9] pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-extrabold text-[#0F172A]">
                  {isFree ? 'Free' : formatInr(test.priceInr)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#1F2937]">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-[#E74C3C]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    'h-11 w-full rounded-xl border bg-white px-3 text-sm text-[#1F2937] outline-none transition',
    'placeholder:text-slate-400 focus:ring-2 focus:ring-[#00AEEF]/30',
    hasError ? 'border-[#E74C3C]' : 'border-[#E5E7EB] focus:border-[#00AEEF]',
  )
}
