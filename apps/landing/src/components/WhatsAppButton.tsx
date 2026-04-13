import { whatsappLink } from '~/data/clinica'
import { cn } from '~/lib/utils'

type Props = {
  servicio?: string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

export function WhatsAppButton({
  servicio,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-all cursor-pointer no-underline whitespace-nowrap'
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  }
  const variants = {
    primary: 'bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90',
    outline: 'border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-fg)]',
    ghost: 'text-[var(--primary)] hover:bg-[var(--bg-alt)]',
  }
  return (
    <a
      href={whatsappLink(servicio)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, sizes[size], variants[variant], className)}
      style={{ borderRadius: 'var(--radius)' }}
    >
      {children}
    </a>
  )
}
