'use client'

import { CalendarCheck } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { BranchCard } from '@/components/site/cards'
import { cn } from '@/lib/utils'

const filters = [
  { id: 'all', label: 'All locations' },
  { id: 'main', label: 'Main laboratory' },
  { id: 'branch', label: 'Branch laboratories' },
  { id: 'collection', label: 'Collection centres' },
] as const

export function BranchesExplorer() {
  const { branches } = useDemoStore()
  const active = branches.filter((b) => b.active)
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const [selectedId, setSelectedId] = useState(active[0]?.id)
  const list = active.filter((b) => filter === 'all' || b.type === filter)
  const selected = active.find((b) => b.id === selectedId) ?? active[0]

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter locations">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn('rounded-full border px-4 py-2 text-sm font-medium transition', filter === f.id ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:text-primary')}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          {list.map((b) => (
            <BranchCard key={b.id} branch={b} selected={b.id === selected?.id} onSelect={() => setSelectedId(b.id)} />
          ))}
        </div>
        {selected && (
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Selected branch">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <iframe
                title={`Map showing ${selected.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(selected.mapsQuery)}&output=embed`}
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Selected branch</p>
                <h2 className="mt-1 text-xl font-bold">{selected.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{selected.address}</p>
                <Link href={`/appointments?branch=${selected.id}`} className={cn(buttonVariants(), 'mt-5 h-11 w-full rounded-full')}>
                  <CalendarCheck className="size-4" aria-hidden /> Book at this branch
                </Link>
                <p className="mt-3 text-xs text-muted-foreground">Map location is a placeholder until official addresses are added.</p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}
