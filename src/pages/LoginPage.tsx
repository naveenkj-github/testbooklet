import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { KeyRound, UserRound } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useAuthStore } from '@/store/authStore'
import type { LoginFormValues } from '@/types/auth'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const session = useAuthStore((state) => state.session)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      name: '',
      passcode: '',
    },
    mode: 'onBlur',
  })

  if (session?.name && session?.passcode) {
    return <Navigate to="/exam" replace />
  }

  const onSubmit = (values: LoginFormValues) => {
    const result = login({
      name: values.name,
      passcode: values.passcode,
    })

    if (!result.ok) {
      setAuthError(result.error)
      return
    }

    setAuthError(null)
    navigate('/exam', { replace: true })
  }

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#F6F8FB] px-3 py-6 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00AEEF] text-sm font-extrabold text-white shadow-sm sm:h-14 sm:w-14 sm:text-base">
            CBT
          </div>
          <h1 className="text-xl font-bold text-[#1F2937] sm:text-2xl">Start your test</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Enter your name and the passcode from your purchase.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6"
          noValidate
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-[#1F2937]">
                Full Name
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Naveen Jain"
                  aria-invalid={Boolean(errors.name)}
                  className={cn(
                    'h-11 w-full rounded-xl border bg-white pr-3 pl-10 text-sm text-[#1F2937] outline-none transition duration-200',
                    'placeholder:text-slate-400 focus:ring-2 focus:ring-[#00AEEF]/30',
                    errors.name ? 'border-[#E74C3C]' : 'border-[#E5E7EB] focus:border-[#00AEEF]',
                  )}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Enter at least 2 characters' },
                    maxLength: { value: 60, message: 'Name is too long' },
                    pattern: {
                      value: /^[A-Za-z][A-Za-z .'-]*$/,
                      message: 'Use letters and spaces only',
                    },
                  })}
                />
              </div>
              {errors.name ? (
                <p className="mt-1.5 text-xs font-medium text-[#E74C3C]" role="alert">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="passcode" className="mb-1.5 block text-sm font-semibold text-[#1F2937]">
                Passcode
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="passcode"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. CBT-A7K2-M9QX"
                  aria-invalid={Boolean(errors.passcode) || Boolean(authError)}
                  className={cn(
                    'h-11 w-full rounded-xl border bg-white pr-3 pl-10 text-sm tracking-wide text-[#1F2937] uppercase outline-none transition duration-200',
                    'placeholder:text-slate-400 placeholder:normal-case focus:ring-2 focus:ring-[#00AEEF]/30',
                    errors.passcode || authError
                      ? 'border-[#E74C3C]'
                      : 'border-[#E5E7EB] focus:border-[#00AEEF]',
                  )}
                  {...register('passcode', {
                    required: 'Passcode is required',
                    minLength: { value: 8, message: 'Enter the full passcode' },
                    maxLength: { value: 24, message: 'Passcode is too long' },
                    pattern: {
                      value: /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/,
                      message: 'Use the passcode from your purchase receipt',
                    },
                    onChange: () => setAuthError(null),
                  })}
                />
              </div>
              {errors.passcode ? (
                <p className="mt-1.5 text-xs font-medium text-[#E74C3C]" role="alert">
                  {errors.passcode.message}
                </p>
              ) : authError ? (
                <p className="mt-1.5 text-xs font-medium text-[#E74C3C]" role="alert">
                  {authError}
                </p>
              ) : null}
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying…' : 'Start Test'}
          </Button>

          <p className="mt-4 text-center text-xs leading-relaxed text-[#6B7280]">
            Don&apos;t have a passcode?{' '}
            <Link to="/" className="font-semibold text-[#00AEEF] hover:underline">
              Buy a mock test
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
