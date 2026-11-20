'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Inbox, Info, X } from 'lucide-react'
import Image from 'next/image'
import { asset } from '@/lib/asset'
import Link from 'next/link'
import { useEffect, useId } from 'react'
import type { OrderStatus } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2.5', className)} aria-label="Ashoka Medi-Lab home">
      <span className="relative block size-10 shrink-0 overflow-hidden rounded-xl bg-[#06b6d4] shadow-sm">
        <Image
          src={asset('/images/ashoka-logo.jpg')}
          alt=""
          fill
          sizes="40px"
          className="scale-[1.85] object-cover"
          style={{ objectPosition: '49% 40%' }}
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-heading text-lg font-extrabold tracking-tight', light ? 'text-white' : 'text-foreground')}>ASHOKA</span>
        <span className={cn('text-[10px] font-medium tracking-[0.3em]', light ? 'text-white/70' : 'text-muted-foreground')}>MEDI-LAB</span>
      </span>
    </Link>
  )
}

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, description, center = false }: { eyebrow: string; title: string; description?: string; center?: boolean }) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
}

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.24_0.05_240)] text-white">
      <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-accent/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-primary/40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-3 max-w-3xl text-balance text-4xl font-bold md:text-5xl">
          {title}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-white/75">
          {description}
        </motion.p>
      </div>
    </section>
  )
}

export function DemoNotice({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="note" className={cn('flex items-start gap-2.5 rounded-lg border border-warning/40 bg-warning/10 px-3.5 py-2.5 text-sm text-foreground', className)}>
      <Info className="mt-0.5 size-4 shrink-0 text-[oklch(0.55_0.14_65)]" aria-hidden />
      <p className="leading-relaxed">{children}</p>
    </div>
  )
}

const fieldBase =
  'w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/25 aria-invalid:border-destructive disabled:opacity-60'

type FieldProps = { label: string; error?: string; hint?: string; children: (id: string, describedBy?: string) => React.ReactNode; className?: string; required?: boolean }

export function Field({ label, error, hint, children, className, required }: FieldProps) {
  const id = useId()
  const descId = error || hint ? `${id}-desc` : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children(id, descId)}
      {error ? (
        <p id={descId} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={descId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldBase, props.className)} />
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldBase, 'appearance-auto pr-8', props.className)} />
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldBase, 'min-h-24', props.className)} />
}

const statusTone: Record<string, string> = {
  Ordered: 'bg-secondary text-secondary-foreground',
  'Sample Collected': 'bg-[oklch(0.94_0.05_215)] text-[oklch(0.38_0.09_225)]',
  'In Transit': 'bg-[oklch(0.95_0.06_75)] text-[oklch(0.45_0.11_60)]',
  Processing: 'bg-[oklch(0.93_0.05_265)] text-[oklch(0.42_0.13_265)]',
  'Result Entered': 'bg-[oklch(0.94_0.05_300)] text-[oklch(0.42_0.13_300)]',
  'Correction Requested': 'bg-destructive/10 text-destructive',
  Approved: 'bg-[oklch(0.94_0.06_160)] text-[oklch(0.4_0.1_160)]',
  Released: 'bg-success text-white',
  Booked: 'bg-secondary text-secondary-foreground',
  'Checked-in': 'bg-[oklch(0.94_0.05_215)] text-[oklch(0.38_0.09_225)]',
  Completed: 'bg-[oklch(0.94_0.06_160)] text-[oklch(0.4_0.1_160)]',
  Cancelled: 'bg-muted text-muted-foreground line-through',
  Paid: 'bg-[oklch(0.94_0.06_160)] text-[oklch(0.4_0.1_160)]',
  Pending: 'bg-[oklch(0.95_0.06_75)] text-[oklch(0.45_0.11_60)]',
  Active: 'bg-[oklch(0.94_0.06_160)] text-[oklch(0.4_0.1_160)]',
  Inactive: 'bg-muted text-muted-foreground',
}

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  return (
    <span className={cn('inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium', statusTone[status] ?? 'bg-muted text-muted-foreground')}>
      {status}
    </span>
  )
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
        <Inbox className="size-5" aria-hidden />
      </span>
      <p className="mt-1 font-semibold">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  const titleId = useId()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close dialog" className="absolute inset-0 bg-[oklch(0.2_0.04_240/0.55)] backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className={cn('relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-card p-6 shadow-2xl sm:rounded-2xl', wide ? 'sm:max-w-2xl' : 'sm:max-w-lg')}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 id={titleId} className="text-lg font-bold">
                {title}
              </h2>
              <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Spinner({ className }: { className?: string }) {
  return <span aria-hidden className={cn('inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent', className)} />
}
