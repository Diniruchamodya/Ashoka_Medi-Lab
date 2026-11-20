'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDemoStore } from '@/components/demo/demo-store'
import { ServiceCard } from '@/components/site/cards'
import { EmptyState } from '@/components/shared/ui'
import { cn } from '@/lib/utils'

export function ServicesBrowser() {
  const { services } = useDemoStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [fastingOnly, setFastingOnly] = useState<'any' | 'fasting' | 'none'>('any')

  const active = services.filter((s) => s.active)
  const categories = ['All', ...Array.from(new Set(active.map((s) => s.category)))]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return active.filter(
      (s) =>
        (category === 'All' || s.category === category) &&
        (fastingOnly === 'any' || (fastingOnly === 'fasting' ? s.fasting : !s.fasting)) &&
        (!q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)),
    )
  }, [active, category, fastingOnly, query])

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search tests</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by test name or code, e.g. HbA1c"
            className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/25"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Preparation</span>
          <select value={fastingOnly} onChange={(e) => setFastingOnly(e.target.value as typeof fastingOnly)} className="h-11 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="any">Any</option>
            <option value="fasting">Fasting required</option>
            <option value="none">No fasting</option>
          </select>
        </label>
      </div>

      <div role="tablist" aria-label="Test categories" className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={cn('shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition', category === c ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary/40 hover:text-primary')}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing {filtered.length} of {active.length} tests
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No tests match your search"
            description="Try a different name or clear the filters."
            action={
              <button onClick={() => { setQuery(''); setCategory('All'); setFastingOnly('any') }} className="text-sm font-semibold text-primary hover:underline">
                Clear filters
              </button>
            }
          />
        </div>
      ) : (
        <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((s) => (
              <motion.div key={s.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
                <ServiceCard service={s} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <p className="mt-10 text-center text-xs text-muted-foreground">Test list, turnaround times and prices are sample data. Please confirm with the laboratory.</p>
    </section>
  )
}
