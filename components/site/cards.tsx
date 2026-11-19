'use client'

import { ArrowRight, Building2, Check, Clock, Droplet, ExternalLink, MapPin, Phone, Utensils } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { buttonVariants } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { type Branch, type LabService, type TestPackage, formatPrice } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

export function ServiceCard({ service }: { service: LabService }) {
  return (
    <motion.article whileHover={{ y: -4 }} className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{service.category}</span>
        <span className="font-mono text-xs text-muted-foreground">{service.code}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 border-t pt-4 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Droplet className="size-3.5 text-primary" aria-hidden />
          <dt className="sr-only">Sample</dt>
          <dd>{service.sample}</dd>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-3.5 text-primary" aria-hidden />
          <dt className="sr-only">Turnaround</dt>
          <dd>{service.turnaround}</dd>
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
          <Utensils className="size-3.5 text-primary" aria-hidden />
          <dt className="sr-only">Preparation</dt>
          <dd>{service.fasting ? 'Fasting required (8–12 hrs)' : 'No fasting required'}</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{formatPrice(service.price)}</span>
        <Link href={`/appointments?test=${service.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          Book <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </motion.article>
  )
}

export function PackageCard({ pkg }: { pkg: TestPackage }) {
  const { serviceName } = useDemoStore()
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={cn(
        'relative flex h-full flex-col rounded-2xl border p-6 shadow-xs transition-shadow hover:shadow-xl',
        pkg.featured ? 'border-primary/40 bg-gradient-to-b from-secondary to-card ring-1 ring-primary/20' : 'bg-card',
      )}
    >
      {pkg.featured && <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Popular</span>}
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{pkg.audience}</p>
      <h3 className="mt-2 text-xl font-bold">{pkg.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
      <p className="mt-5 font-heading text-2xl font-extrabold">{formatPrice(pkg.price)}</p>
      <p className="text-xs text-muted-foreground">{pkg.testIds.length} tests included</p>
      <ul className="mt-5 flex-1 space-y-2.5 border-t pt-5">
        {pkg.testIds.map((id) => (
          <li key={id} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            {serviceName(id)}
          </li>
        ))}
      </ul>
      <Link href={`/appointments?package=${pkg.id}`} className={cn(buttonVariants({ variant: pkg.featured ? 'default' : 'outline' }), 'mt-6 h-11 w-full rounded-full')}>
        Book this package
      </Link>
    </motion.article>
  )
}

export function BranchCard({ branch, selected, onSelect }: { branch: Branch; selected?: boolean; onSelect?: () => void }) {
  const typeLabel = branch.type === 'main' ? 'Main Laboratory' : branch.type === 'collection' ? 'Collection Centre' : 'Branch Laboratory'
  return (
    <article className={cn('flex h-full flex-col rounded-2xl border bg-card p-6 shadow-xs transition', selected && 'border-primary ring-2 ring-primary/25')}>
      <div className="flex items-start gap-3">
        <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', branch.type === 'main' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary')}>
          <Building2 className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-bold">{branch.name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{typeLabel}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
        <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{branch.address}</li>
        <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{branch.phone}</li>
        <li className="flex gap-2"><Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{branch.hours}</li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {branch.services.map((s) => (
          <span key={s} className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/80">{s}</span>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapsQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }), 'h-10 flex-1')}
        >
          <ExternalLink className="size-4" aria-hidden /> Directions
        </a>
        {onSelect ? (
          <button onClick={onSelect} aria-pressed={selected} className={cn(buttonVariants({ variant: selected ? 'default' : 'secondary' }), 'h-10 flex-1')}>
            {selected ? 'Selected' : 'Select'}
          </button>
        ) : (
          <Link href={`/appointments?branch=${branch.id}`} className={cn(buttonVariants(), 'h-10 flex-1')}>
            Book here
          </Link>
        )}
      </div>
    </article>
  )
}
