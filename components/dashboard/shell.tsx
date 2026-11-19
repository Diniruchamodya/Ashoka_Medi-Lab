'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Bell, Building2, LogOut, Menu, ShieldAlert, X, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { Logo } from '@/components/shared/ui'
import { type Role, roleLabels } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

export type DashboardSection = { id: string; label: string; icon: LucideIcon; render: (go: (id: string) => void) => React.ReactNode; badge?: number }

export function DashboardShell({ role, sections }: { role: Role; sections: DashboardSection[] }) {
  const router = useRouter()
  const { session, dispatch, branchName, log, notifications } = useDemoStore()
  const [active, setActive] = useState(sections[0].id)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!session || session.role !== role) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-7" aria-hidden />
          </span>
          <h1 className="mt-4 text-xl font-bold">{session ? 'Access restricted' : 'Sign in required'}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {session
              ? `You are signed in as ${roleLabels[session.role]}. The ${roleLabels[role]} dashboard is only available to authorised ${roleLabels[role]} accounts.`
              : 'Please sign in through the portal to access this dashboard.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {session && (
              <Link href={`/dashboard/${session.role}`} className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full')}>
                My dashboard
              </Link>
            )}
            <Link href="/portal" className={cn(buttonVariants(), 'rounded-full')}>
              Go to sign in
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const current = sections.find((s) => s.id === active) ?? sections[0]
  const unread = role === 'patient' ? notifications.filter((n) => n.patientId === session.userId && !n.read).length : 0

  function signOut() {
    log(session!.name, 'Signed out')
    dispatch({ type: 'setSession', session: null })
    router.push('/portal')
  }

  const nav = (
    <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => { setActive(s.id); setMobileOpen(false) }}
          aria-current={s.id === current.id ? 'page' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
            s.id === current.id ? 'bg-white/12 text-white' : 'text-white/65 hover:bg-white/6 hover:text-white',
          )}
        >
          <s.icon className="size-4.5 shrink-0" aria-hidden />
          <span className="flex-1 text-left">{s.label}</span>
          {!!s.badge && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-[oklch(0.2_0.05_240)]">{s.badge}</span>}
        </button>
      ))}
    </nav>
  )

  const sidebarInner = (
    <>
      <Logo light />
      <div className="mt-8 rounded-xl bg-white/6 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{roleLabels[role]}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-white">{session.name}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
          <Building2 className="size-3.5" aria-hidden /> {role === 'super-admin' ? 'All branches' : branchName(session.branchId)}
        </p>
      </div>
      <div className="mt-6 flex flex-1 flex-col">{nav}</div>
      <button onClick={signOut} className="mt-6 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 hover:bg-white/6 hover:text-white">
        <LogOut className="size-4.5" aria-hidden /> Sign out
      </button>
    </>
  )

  return (
    <div className="min-h-svh bg-muted/40 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-svh flex-col bg-[oklch(0.22_0.05_240)] p-5 lg:flex">{sidebarInner}</aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="relative flex h-full w-72 flex-col bg-[oklch(0.22_0.05_240)] p-5">
              <button onClick={() => setMobileOpen(false)} className="absolute right-4 top-5 rounded-md p-1 text-white/70 hover:bg-white/10" aria-label="Close menu">
                <X className="size-5" />
              </button>
              {sidebarInner}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-card/90 px-4 py-3 backdrop-blur md:px-8">
          <button onClick={() => setMobileOpen(true)} className="rounded-md p-2 hover:bg-muted lg:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{roleLabels[role]} dashboard</p>
            <h1 className="truncate text-lg font-bold">{current.label}</h1>
          </div>
          <span className="hidden rounded-full border border-warning/50 bg-warning/10 px-3 py-1 text-xs font-semibold sm:inline">Demo data</span>
          {role === 'patient' && (
            <button onClick={() => setActive('notifications')} className="relative rounded-full p-2 hover:bg-muted" aria-label={`Notifications, ${unread} unread`}>
              <Bell className="size-5" />
              {unread > 0 && <span className="absolute right-1 top-1 size-2.5 rounded-full bg-destructive" />}
            </button>
          )}
          <Link href="/" className="hidden text-sm font-medium text-primary hover:underline md:inline">
            View website
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <motion.div key={current.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {current.render(setActive)}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
