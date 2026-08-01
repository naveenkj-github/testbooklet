import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  footer?: React.ReactNode
  className?: string
  /** When false, hides the X control and ignores Escape / backdrop click. */
  dismissible?: boolean
}

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  className,
  dismissible = true,
}: ModalProps) {
  useEffect(() => {
    if (!open || !dismissible) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, dismissible])

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissible ? onClose : undefined}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900',
              className,
            )}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-text">{title}</h2>
              {dismissible ? (
                <Button variant="ghost" size="sm" aria-label="Close dialog" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
            {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
