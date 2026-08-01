import { useEffect, useRef } from 'react'
import { useExamStore } from '@/store/examStore'

/** Drives the countdown and per-question timers. Fires onExpire once when time hits zero. */
export function useTimer(onExpire?: () => void) {
  const tick = useExamStore((s) => s.tick)
  const remainingSeconds = useExamStore((s) => s.remainingSeconds)
  const isPaused = useExamStore((s) => s.isPaused)
  const isLocked = useExamStore((s) => s.isLocked)
  const onExpireRef = useRef(onExpire)
  const hasExpiredRef = useRef(false)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    if (remainingSeconds > 0) {
      hasExpiredRef.current = false
    }
  }, [remainingSeconds])

  useEffect(() => {
    if (isPaused || isLocked) return undefined

    const id = window.setInterval(() => {
      tick()
    }, 1000)

    return () => window.clearInterval(id)
  }, [isPaused, isLocked, tick])

  useEffect(() => {
    if (remainingSeconds !== 0 || hasExpiredRef.current) return
    hasExpiredRef.current = true
    onExpireRef.current?.()
  }, [remainingSeconds])

  return { remainingSeconds, isPaused }
}
