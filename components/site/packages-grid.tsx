'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { useDemoStore } from '@/components/demo/demo-store'
import { PackageCard } from '@/components/site/cards'
import { EmptyState, Reveal } from '@/components/shared/ui'

export function PackagesGrid() {
  const { packages, serviceName } = useDemoStore()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const list = packages
    .filter((p) => p.active)
    .filter((p) => !q || p.name.toLowerCase().includes(q) || p.audience.toLowerCase().includes(q) || p.testIds.some((t) => serviceName(t).toLowerCase().includes(q)))

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <label className="relative mx-auto block max-w-lg">
        <span className="sr-only">Search packages</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search packages or included tests"
          className="h-12 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm shadow-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/25"
        />
      </label>
      {list.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No packages found" description="Try searching for a different test or health need." />
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.06}>
              <PackageCard pkg={p} />
            </Reveal>
          ))}
        </div>
      )}
      <p className="mt-10 text-center text-xs text-muted-foreground">Package contents are sample data. Prices are shown once confirmed by Ashoka Medi-Lab.</p>
    </section>
  )
}
