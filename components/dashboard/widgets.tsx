'use client'

import { Check, Search, type LucideIcon } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { type OrderStatus, type TestOrder, orderFlow } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

export function StatCard({ icon: Icon, label, value, hint, tone = 'primary' }: { icon: LucideIcon; label: string; value: string | number; hint?: string; tone?: 'primary' | 'success' | 'warning' | 'destructive' }) {
  const tones = {
    primary: 'bg-secondary text-primary',
    success: 'bg-success/12 text-success',
    warning: 'bg-warning/15 text-[oklch(0.5_0.13_65)]',
    destructive: 'bg-destructive/10 text-destructive',
  }
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className={cn('flex size-9 items-center justify-center rounded-lg', tones[tone])}>
          <Icon className="size-4.5" aria-hidden />
        </span>
      </div>
      <p className="mt-3 font-heading text-3xl font-extrabold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function Panel({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-2xl border bg-card shadow-xs', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <h2 className="font-bold">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

export function SearchBox({ value, onChange, placeholder = 'Search…', label = 'Search' }: { value: string; onChange: (v: string) => void; placeholder?: string; label?: string }) {
  return (
    <label className="relative block w-full sm:w-64">
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/25" />
    </label>
  )
}

export function FilterSelect({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

export function Table({ head, children, empty }: { head: string[]; children: React.ReactNode; empty?: boolean }) {
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-y bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-5 py-2.5 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:px-5 [&_td]:py-3 [&_tr]:border-b [&_tr:last-child]:border-0">{children}</tbody>
      </table>
      {empty && <p className="px-5 py-10 text-center text-sm text-muted-foreground">No records match the current filters.</p>}
    </div>
  )
}

const chartColors = ['var(--primary)', 'oklch(0.72 0.12 190)', 'oklch(0.62 0.12 250)', 'oklch(0.78 0.13 75)']

export function VolumeChart({ data, keys }: { data: Record<string, string | number>[]; keys: { key: string; label: string }[] }) {
  return (
    <div className="h-72" role="img" aria-label="Bar chart of weekly sample volume by branch (demo data)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -16, right: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          {keys.map((k, i) => (
            <Bar key={k.key} dataKey={k.key} name={k.label} stackId="a" fill={chartColors[i % chartColors.length]} radius={i === keys.length - 1 ? [6, 6, 0, 0] : 0} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StatusPie({ orders }: { orders: TestOrder[] }) {
  const counts = Object.entries(
    orders.reduce<Record<string, number>>((acc, o) => ({ ...acc, [o.status]: (acc[o.status] ?? 0) + 1 }), {}),
  ).map(([name, value]) => ({ name, value }))
  const colors = ['var(--primary)', 'oklch(0.72 0.12 190)', 'oklch(0.62 0.12 250)', 'oklch(0.78 0.13 75)', 'oklch(0.6 0.13 160)', 'oklch(0.6 0.15 300)', 'oklch(0.6 0.2 25)', 'oklch(0.5 0.05 240)']
  if (counts.length === 0) return <p className="py-10 text-center text-sm text-muted-foreground">No orders yet.</p>
  return (
    <div className="h-72" role="img" aria-label="Pie chart of test orders by status">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={counts} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
            {counts.map((c, i) => (
              <Cell key={c.name} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function WorkflowStepper({ status, transfer }: { status: OrderStatus; transfer?: boolean }) {
  const flow = transfer ? orderFlow : orderFlow.filter((s) => s !== 'In Transit')
  const effective = status === 'Correction Requested' ? 'Result Entered' : status
  const idx = flow.indexOf(effective)
  return (
    <ol className="flex flex-wrap items-center gap-y-3" aria-label="Test progress">
      {flow.map((s, i) => {
        const done = i < idx || status === 'Released'
        const current = i === idx && status !== 'Released'
        return (
          <li key={s} className="flex items-center">
            <span className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border-2 text-xs font-bold',
                  done && 'border-success bg-success text-white',
                  current && (status === 'Correction Requested' ? 'border-destructive text-destructive' : 'border-primary bg-secondary text-primary'),
                  !done && !current && 'border-border text-muted-foreground',
                )}
                aria-current={current ? 'step' : undefined}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
              </span>
              <span className={cn('w-16 text-center text-[10px] leading-tight', current ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{s}</span>
            </span>
            {i < flow.length - 1 && <span className={cn('mx-0.5 mb-5 h-0.5 w-4 sm:w-6', done ? 'bg-success' : 'bg-border')} aria-hidden />}
          </li>
        )
      })}
    </ol>
  )
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: iso.length > 10 ? 'short' : undefined })
}
