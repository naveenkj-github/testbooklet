import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  className?: string
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm',
        className,
      )}
      aria-label={name}
      title={name}
    >
      <User className="h-5 w-5" />
    </div>
  )
}
