'use client'

import { motion } from 'motion/react'
import { ArrowRight, ClipboardCheck, FlaskConical, KeyRound, Lock, ShieldCheck, Stethoscope, UserCog, UserRound, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { DemoNotice, Field, Input, Spinner } from '@/components/shared/ui'
import { type Role, roleLabels } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

const DEMO_PASSWORD = 'demo1234'

const staffRoles: { role: Role; icon: typeof UserCog; text: string }[] = [
  { role: 'super-admin', icon: ShieldCheck, text: 'All branches, users, catalogue & analytics' },
  { role: 'branch-manager', icon: UserCog, text: 'Branch appointments, staff & samples' },
  { role: 'receptionist', icon: Users, text: 'Registration, check-in & payments' },
  { role: 'technician', icon: FlaskConical, text: 'Samples, processing & results entry' },
  { role: 'approver', icon: ClipboardCheck, text: 'Verify, approve & release reports' },
]

export function PortalLogin() {
  const router = useRouter()
  const { patients, staff, dispatch, log } = useDemoStore()
  const [tab, setTab] = useState<'patient' | 'staff'>('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  async function patientLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const patient = patients.find((p) => p.email.toLowerCase() === email.trim().toLowerCase())
    if (!email || !password) return setError('Enter your email and password.')
    setLoading('patient')
    await new Promise((r) => setTimeout(r, 700))
    if (!patient || password !== DEMO_PASSWORD) {
      setLoading(null)
      return setError('Incorrect email or password. Use the demo credentials shown below.')
    }
    dispatch({ type: 'setSession', session: { role: 'patient', userId: patient.id, name: patient.name, branchId: patient.branchId } })
    log(patient.name, 'Signed in to patient portal')
    router.push('/dashboard/patient')
  }

  async function staffLogin(role: Role) {
    const user = staff.find((u) => u.role === role && u.active)
    if (!user) return setError('No active demo user for this role.')
    setLoading(role)
    await new Promise((r) => setTimeout(r, 500))
    dispatch({ type: 'setSession', session: { role, userId: user.id, name: user.name, branchId: user.branchId } })
    log(user.name, `Signed in as ${roleLabels[role]}`)
    router.push(`/dashboard/${role}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/70 to-background">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Patient portal</p>
          <h1 className="mt-3 text-balance text-4xl font-extrabold md:text-5xl">Your reports, securely in one place</h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">View appointment history, track the status of your tests and download reports once they are approved by an authorised professional.</p>
          <ul className="mt-8 space-y-3">
            {['Approved reports only — never unverified results', 'Role-based access for every staff member', 'Every access and approval recorded in an audit log'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm">
                <span className="flex size-8 items-center justify-center rounded-full bg-card text-primary shadow-xs">
                  <Lock className="size-4" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border bg-card p-6 shadow-xl md:p-8">
          <div role="tablist" aria-label="Sign in type" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
            {(['patient', 'staff'] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => { setTab(t); setError('') }}
                className={cn('flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition', tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
              >
                {t === 'patient' ? <UserRound className="size-4" aria-hidden /> : <Stethoscope className="size-4" aria-hidden />}
                {t === 'patient' ? 'Patient' : 'Staff'}
              </button>
            ))}
          </div>

          <DemoNotice className="mt-5">Demo sign-in only. Real deployment requires secure server-side authentication.</DemoNotice>

          {error && (
            <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          {tab === 'patient' ? (
            <form onSubmit={patientLogin} noValidate className="mt-5 space-y-4">
              <Field label="Email">
                {(id) => <Input id={id} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
              </Field>
              <Field label="Password">
                {(id) => <Input id={id} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />}
              </Field>
              <Button type="submit" disabled={loading === 'patient'} className="h-12 w-full rounded-full text-base">
                {loading === 'patient' ? <Spinner /> : <KeyRound className="size-4" aria-hidden />} Sign in
              </Button>
              <div className="rounded-xl bg-secondary/60 p-4 text-sm">
                <p className="font-semibold">Demo credentials</p>
                <p className="mt-1 text-muted-foreground">
                  Email <code className="font-mono text-foreground">patient@example.com</code> · Password <code className="font-mono text-foreground">{DEMO_PASSWORD}</code>
                </p>
                <button type="button" onClick={() => { setEmail('patient@example.com'); setPassword(DEMO_PASSWORD) }} className="mt-2 font-semibold text-primary hover:underline">
                  Fill demo credentials
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-5 space-y-2.5">
              <p className="text-sm text-muted-foreground">Choose a demo role to explore its dashboard:</p>
              {staffRoles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => staffLogin(r.role)}
                  disabled={!!loading}
                  className="group flex w-full items-center gap-4 rounded-xl border p-3.5 text-left transition hover:border-primary/50 hover:bg-secondary/40 disabled:opacity-60"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <r.icon className="size-5" aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">{roleLabels[r.role]}</span>
                    <span className="block text-xs text-muted-foreground">{r.text}</span>
                  </span>
                  {loading === r.role ? <Spinner className="text-primary" /> : <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
