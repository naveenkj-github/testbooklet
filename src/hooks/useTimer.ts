import { useEffect } from 'react'
import { useExamStore } from '@/store/examStore'

/** Drives the countdown and per-question timers. */
export function useTimer(onExpire?: () => void) {
  const tick = useExamStore((s) => s.tick)
  const remainingSeconds = useExamStore((s) => s.remainingSeconds)
  const isPaused = useExamStore((s) => s.isPaused)

  useEffect(() => {
    if (isPaused) return undefined

    const id = window.setInterval(() => {
      tick()
    }, 1000)

    return () => window.clearInterval(id)
  }, [isPaused, tick])

  useEffect(() => {
    if (remainingSeconds === 0) onExpire?.()
  }, [remainingSeconds, onExpire])

  return { remainingSeconds, isPaused }
}
