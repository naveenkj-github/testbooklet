import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import './index.css'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const PurchaseSuccessPage = lazy(() => import('@/pages/PurchaseSuccessPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ExamPage = lazy(() => import('@/pages/ExamPage'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="grid h-screen place-items-center bg-background text-text">
            Loading…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/checkout/:testId" element={<CheckoutPage />} />
          <Route path="/purchase-success/:purchaseId" element={<PurchaseSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/exam"
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
