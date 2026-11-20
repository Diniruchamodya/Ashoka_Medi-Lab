'use client'

import { AnimatePresence, motion } from 'motion/react'
import { CalendarCheck, CheckCircle2, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { nextId, useDemoStore } from '@/components/demo/demo-store'
import { DemoNotice, Field, Input, Select, Spinner } from '@/components/shared/ui'
import { type Patient, isoDate } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

export const timeSlots = Array.from({ length: 20 }, (_, i) => {
  const mins = 7 * 60 + i * 30
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
})

type Props = {
  patient?: Patient
  initialBranch?: string
  initialTest?: string
  initialPackage?: string
  onBooked?: (appointmentId: string) => void
  compact?: boolean
}

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'dob' | 'branch' | 'tests' | 'date' | 'time' | 'consent', string>>

export function BookingForm({ patient, initialBranch, initialTest, initialPackage, onBooked, compact }: Props) {
  const { branches, services, packages, dispatch, log } = useDemoStore()
  const activeBranches = branches.filter((b) => b.active)
  const activeServices = services.filter((s) => s.active)
  const activePackages = packages.filter((p) => p.active)

  const [form, setForm] = useState({
    name: patient?.name ?? '',
    phone: patient?.phone ?? '',
    email: patient?.email ?? '',
    dob: patient?.dob ?? '',
    gender: patient?.gender ?? 'Female',
    branch: initialBranch && activeBranches.some((b) => b.id === initialBranch) ? initialBranch : patient?.branchId ?? '',
    date: '',
    time: '',
    notes: '',
  })
  const [packageId, setPackageId] = useState(initialPackage && activePackages.some((p) => p.id === initialPackage) ? initialPackage : '')
  const [tests, setTests] = useState<string[]>(initialTest && activeServices.some((s) => s.id === initialTest) ? [initialTest] : [])
  const [testQuery, setTestQuery] = useState('')
  const [consent, setConsent] = useState(!!patient)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [bookedId, setBookedId] = useState('')

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const pkg = activePackages.find((p) => p.id === packageId)
  const allTests = Array.from(new Set([...(pkg?.testIds ?? []), ...tests]))
  const visibleServices = activeServices.filter((s) => !testQuery || s.name.toLowerCase().includes(testQuery.toLowerCase()) || s.code.toLowerCase().includes(testQuery.toLowerCase()))
  const needsFasting = allTests.some((id) => services.find((s) => s.id === id)?.fasting)

  function validate(): Errors {
    const e: Errors = {}
    if (form.name.trim().length < 2) e.name = 'Please enter the patient’s full name.'
    if (!/^[+\d][\d\s-]{8,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number (digits, spaces or dashes).'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.dob) e.dob = 'Date of birth is required.'
    else if (form.dob > isoDate(0)) e.dob = 'Date of birth cannot be in the future.'
    if (!form.branch) e.branch = 'Select a branch.'
    if (allTests.length === 0) e.tests = 'Select at least one test or a package.'
    if (!form.date) e.date = 'Choose a date.'
    else if (form.date < isoDate(0)) e.date = 'Date cannot be in the past.'
    if (!form.time) e.time = 'Choose a time slot.'
    if (!consent) e.consent = 'Please confirm the details to continue.'
    return e
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    await new Promise((r) => setTimeout(r, 900))
    const patientId = patient?.id ?? nextId('pt')
    if (!patient) {
      dispatch({
        type: 'addPatient',
        patient: { id: patientId, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), dob: form.dob, gender: form.gender as Patient['gender'], branchId: form.branch },
      })
    }
    const id = nextId('AP')
    dispatch({
      type: 'addAppointment',
      appointment: { id, patientId, patientName: form.name.trim(), branchId: form.branch, date: form.date, time: form.time, testIds: allTests, packageId: packageId || undefined, status: 'Booked', source: 'Online', createdAt: isoDate(0) },
    })
    dispatch({ type: 'notify', patientId, message: `Appointment ${id} booked for ${form.date} at ${form.time}.` })
    log(form.name.trim(), `Booked appointment ${id} online`)
    setBookedId(id)
    setStatus('success')
    onBooked?.(id)
  }

  function reset() {
    setStatus('idle')
    setTests([])
    setPackageId('')
    setForm((f) => ({ ...f, date: '', time: '', notes: '', ...(patient ? {} : { name: '', phone: '', email: '', dob: '' }) }))
    if (!patient) setConsent(false)
  }

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center rounded-2xl border bg-card p-10 text-center shadow-sm">
        <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-bold">Demo appointment created</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Reference <span className="font-mono font-semibold text-foreground">{bookedId}</span> on {form.date} at {form.time}. This is a demonstration booking — it has not been sent to the laboratory.
        </p>
        {needsFasting && <p className="mt-3 rounded-lg bg-secondary px-4 py-2 text-sm text-secondary-foreground">Reminder: some selected tests require 8–12 hours of fasting.</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} variant="outline" className="h-11 rounded-full px-6">
            Book another
          </Button>
          {!patient && (
            <Link href="/portal" className={cn(buttonVariants(), 'h-11 rounded-full px-6')}>
              Go to patient portal
            </Link>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn('space-y-8', !compact && 'rounded-2xl border bg-card p-5 shadow-sm md:p-8')}>
      <DemoNotice>Interactive demo — bookings are stored only in this browser session and are not sent to Ashoka Medi-Lab.</DemoNotice>

      <AnimatePresence>
        {status === 'error' && Object.keys(errors).length > 0 && (
          <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Please fix {Object.keys(errors).length} highlighted field{Object.keys(errors).length > 1 ? 's' : ''} below.
          </motion.div>
        )}
      </AnimatePresence>

      {!patient && (
        <fieldset className="space-y-4">
          <legend className="text-base font-bold">1. Patient details</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" required error={errors.name}>
              {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!errors.name} value={form.name} onChange={set('name')} autoComplete="name" />}
            </Field>
            <Field label="Phone number" required error={errors.phone}>
              {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!errors.phone} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="07X XXX XXXX" />}
            </Field>
            <Field label="Email" error={errors.email} hint="Optional — for booking confirmation">
              {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!errors.email} type="email" value={form.email} onChange={set('email')} autoComplete="email" />}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of birth" required error={errors.dob}>
                {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!errors.dob} type="date" max={isoDate(0)} value={form.dob} onChange={set('dob')} />}
              </Field>
              <Field label="Gender">
                {(id) => (
                  <Select id={id} value={form.gender} onChange={set('gender')}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </Select>
                )}
              </Field>
            </div>
          </div>
        </fieldset>
      )}

      <fieldset className="space-y-4">
        <legend className="text-base font-bold">{patient ? '1' : '2'}. Preferred branch</legend>
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Branch">
          {activeBranches.map((b) => (
            <label key={b.id} className={cn('flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30', form.branch === b.id ? 'border-primary bg-secondary/60' : 'hover:border-primary/40')}>
              <input type="radio" name="branch" value={b.id} checked={form.branch === b.id} onChange={set('branch')} className="mt-1 accent-[var(--primary)]" />
              <span>
                <span className="block font-semibold">{b.name}</span>
                <span className="block text-xs text-muted-foreground">{b.hours}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.branch && <p className="text-xs text-destructive">{errors.branch}</p>}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold">{patient ? '2' : '3'}. Tests</legend>
        <Field label="Health package (optional)">
          {(id) => (
            <Select id={id} value={packageId} onChange={(e) => setPackageId(e.target.value)}>
              <option value="">No package — choose individual tests</option>
              {activePackages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.testIds.length} tests)
                </option>
              ))}
            </Select>
          )}
        </Field>
        <div>
          <label className="relative block">
            <span className="sr-only">Search tests</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input value={testQuery} onChange={(e) => setTestQuery(e.target.value)} placeholder="Search individual tests" className="pl-9" type="search" />
          </label>
          <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto rounded-xl border p-2 sm:grid-cols-2">
            {visibleServices.length === 0 && <p className="p-3 text-sm text-muted-foreground">No tests match “{testQuery}”.</p>}
            {visibleServices.map((s) => {
              const inPkg = pkg?.testIds.includes(s.id)
              const checked = inPkg || tests.includes(s.id)
              return (
                <label key={s.id} className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted', checked && 'bg-secondary/70', inPkg && 'cursor-default')}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={inPkg}
                    onChange={(e) => setTests((t) => (e.target.checked ? [...t, s.id] : t.filter((x) => x !== s.id)))}
                    className="accent-[var(--primary)]"
                  />
                  <span className="flex-1">{s.name}</span>
                  {inPkg && <span className="text-xs text-primary">In package</span>}
                </label>
              )
            })}
          </div>
          <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
            {allTests.length} test{allTests.length === 1 ? '' : 's'} selected{needsFasting && ' · includes fasting tests'}
          </p>
          {errors.tests && <p className="text-xs text-destructive">{errors.tests}</p>}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold">{patient ? '3' : '4'}. Date & time</legend>
        <Field label="Date" required error={errors.date} className="max-w-xs">
          {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!errors.date} type="date" min={isoDate(0)} max={isoDate(60)} value={form.date} onChange={set('date')} />}
        </Field>
        <div>
          <p className="text-sm font-medium" id="slot-label">
            Time slot <span className="text-destructive">*</span>
          </p>
          <div role="radiogroup" aria-labelledby="slot-label" className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-10">
            {timeSlots.map((t) => (
              <button
                type="button"
                role="radio"
                aria-checked={form.time === t}
                key={t}
                onClick={() => setForm((f) => ({ ...f, time: t }))}
                className={cn('rounded-lg border py-2 text-sm font-medium transition', form.time === t ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-primary/40 hover:text-primary')}
              >
                {t}
              </button>
            ))}
          </div>
          {errors.time && <p className="mt-1.5 text-xs text-destructive">{errors.time}</p>}
        </div>
      </fieldset>

      <div className="space-y-4 border-t pt-6">
        {!patient && (
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[var(--primary)]" aria-invalid={!!errors.consent} />
            <span>I confirm these details are correct and consent to my information being used to manage this appointment.</span>
          </label>
        )}
        {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
        <Button type="submit" disabled={status === 'submitting'} className="h-12 w-full rounded-full text-base sm:w-auto sm:px-10">
          {status === 'submitting' ? <Spinner /> : <CalendarCheck className="size-5" aria-hidden />}
          {status === 'submitting' ? 'Booking…' : 'Confirm demo booking'}
        </Button>
      </div>
    </form>
  )
}
