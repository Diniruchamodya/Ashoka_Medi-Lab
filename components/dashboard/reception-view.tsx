'use client'

import { CalendarPlus, ClipboardCheck, CreditCard, LayoutDashboard, Receipt, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { nextId, useDemoStore } from '@/components/demo/demo-store'
import { DashboardShell } from '@/components/dashboard/shell'
import { timeSlots } from '@/components/booking/booking-form'
import { Panel, SearchBox, StatCard, Table } from '@/components/dashboard/widgets'
import { DemoNotice, Field, Input, Modal, Select, StatusBadge } from '@/components/shared/ui'
import { useToast } from '@/components/shared/toast'
import { type Appointment, type Patient, type Payment, isoDate } from '@/lib/demo-data'

function useScope() {
  const s = useDemoStore()
  const branchId = s.session!.branchId
  return { ...s, branchId, actor: s.session!.name, appts: s.appointments.filter((a) => a.branchId === branchId), pays: s.payments.filter((p) => p.branchId === branchId) }
}

function Overview() {
  const { appts, pays, branchName, branchId } = useScope()
  const today = appts.filter((a) => a.date === isoDate(0))
  return (
    <div className="space-y-6">
      <DemoNotice>Front desk for {branchName(branchId)}. All data is demo data.</DemoNotice>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarPlus} label="Today’s appointments" value={today.length} />
        <StatCard icon={ClipboardCheck} label="Awaiting check-in" value={today.filter((a) => a.status === 'Booked').length} tone="warning" />
        <StatCard icon={CreditCard} label="Pending payments" value={pays.filter((p) => p.status === 'Pending').length} tone="destructive" />
      </div>
      <CheckIn />
    </div>
  )
}

function RegisterPatient() {
  const { patients, branchId, actor, dispatch, log } = useScope()
  const toast = useToast()
  const blank = { name: '', phone: '', email: '', dob: '', gender: 'Female' as Patient['gender'] }
  const [f, setF] = useState(blank)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [q, setQ] = useState('')

  function save(e: React.FormEvent) {
    e.preventDefault()
    const v: Record<string, string> = {}
    if (f.name.trim().length < 2) v.name = 'Enter the full name.'
    if (!/^[+\d][\d\s-]{8,15}$/.test(f.phone.trim())) v.phone = 'Enter a valid phone number.'
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) v.email = 'Invalid email.'
    if (!f.dob) v.dob = 'Required.'
    if (patients.some((p) => p.phone.replace(/\D/g, '') === f.phone.replace(/\D/g, '') && f.phone)) v.phone = 'A patient with this phone number already exists.'
    setErrors(v)
    if (Object.keys(v).length) return
    const id = nextId('pt')
    dispatch({ type: 'addPatient', patient: { id, ...f, name: f.name.trim(), branchId } })
    log(actor, `Registered patient ${id}`)
    toast({ tone: 'success', title: 'Patient registered', description: `${f.name} · ${id}` })
    setF(blank)
  }

  const list = patients.filter((p) => !q || `${p.name} ${p.phone} ${p.id}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
      <Panel title="Register new patient">
        <form onSubmit={save} noValidate className="space-y-4">
          <Field label="Full name" required error={errors.name}>{(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!errors.name} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}</Field>
          <Field label="Phone" required error={errors.phone}>{(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!errors.phone} type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />}</Field>
          <Field label="Email" error={errors.email}>{(id, d) => <Input id={id} aria-describedby={d} type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />}</Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of birth" required error={errors.dob}>{(id, d) => <Input id={id} aria-describedby={d} type="date" max={isoDate(0)} value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} />}</Field>
            <Field label="Gender">{(id) => <Select id={id} value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value as Patient['gender'] })}><option>Female</option><option>Male</option><option>Other</option></Select>}</Field>
          </div>
          <Button type="submit" className="w-full"><UserPlus className="size-4" aria-hidden /> Register patient</Button>
        </form>
      </Panel>
      <Panel title="Patient directory" action={<SearchBox value={q} onChange={setQ} placeholder="Name, phone or ID" label="Search patients" />}>
        <Table head={['ID', 'Name', 'Phone', 'DOB', 'Gender']} empty={list.length === 0}>
          {list.map((p) => (
            <tr key={p.id}>
              <td className="font-mono text-xs">{p.id}</td>
              <td className="font-medium">{p.name}</td>
              <td>{p.phone}</td>
              <td className="text-muted-foreground">{p.dob}</td>
              <td className="text-muted-foreground">{p.gender}</td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  )
}

function CreateAppointment() {
  const { patients, services, packages, branchId, actor, dispatch, log } = useScope()
  const toast = useToast()
  const [patientId, setPatientId] = useState('')
  const [tests, setTests] = useState<string[]>([])
  const [pkg, setPkg] = useState('')
  const [date, setDate] = useState(isoDate(0))
  const [time, setTime] = useState(timeSlots[0])
  const [walkIn, setWalkIn] = useState(true)
  const [error, setError] = useState('')

  function save(e: React.FormEvent) {
    e.preventDefault()
    const p = patients.find((x) => x.id === patientId)
    const pkgTests = packages.find((x) => x.id === pkg)?.testIds ?? []
    const all = Array.from(new Set([...pkgTests, ...tests]))
    if (!p) return setError('Select a registered patient.')
    if (all.length === 0) return setError('Select at least one test or package.')
    if (date < isoDate(0)) return setError('Date cannot be in the past.')
    setError('')
    const id = nextId('AP')
    const appt: Appointment = { id, patientId: p.id, patientName: p.name, branchId, date, time, testIds: all, packageId: pkg || undefined, status: walkIn ? 'Checked-in' : 'Booked', source: walkIn ? 'Walk-in' : 'Online', createdAt: isoDate(0) }
    dispatch({ type: 'addAppointment', appointment: appt })
    if (walkIn) {
      const orderId = nextId('ORD')
      dispatch({ type: 'addOrder', order: { id: orderId, appointmentId: id, patientId: p.id, patientName: p.name, branchId, processingBranchId: branchId, testIds: all, status: 'Ordered', results: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } })
      dispatch({ type: 'addPayment', payment: { id: nextId('INV'), orderId, patientName: p.name, branchId, amount: 0, method: 'Cash', status: 'Pending', date: isoDate(0) } })
      log(actor, `Created walk-in ${id} and order ${orderId}`)
    } else log(actor, `Created appointment ${id}`)
    toast({ tone: 'success', title: walkIn ? 'Walk-in checked in & order created' : 'Appointment created', description: `${id} · ${p.name}` })
    setTests([]); setPkg(''); setPatientId('')
  }

  return (
    <Panel title="Create appointment / test order">
      <form onSubmit={save} noValidate className="space-y-5">
        {error && <p role="alert" className="rounded-lg bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Patient" required>
            {(id) => (
              <Select id={id} value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                <option value="">Select patient…</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.phone}</option>)}
              </Select>
            )}
          </Field>
          <Field label="Package">
            {(id) => (
              <Select id={id} value={pkg} onChange={(e) => setPkg(e.target.value)}>
                <option value="">None</option>
                {packages.filter((p) => p.active).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            )}
          </Field>
          <Field label="Date">{(id) => <Input id={id} type="date" min={isoDate(0)} value={date} onChange={(e) => setDate(e.target.value)} />}</Field>
          <Field label="Time">{(id) => <Select id={id} value={time} onChange={(e) => setTime(e.target.value)}>{timeSlots.map((t) => <option key={t}>{t}</option>)}</Select>}</Field>
        </div>
        <fieldset>
          <legend className="text-sm font-medium">Individual tests</legend>
          <div className="mt-2 grid max-h-56 gap-1 overflow-y-auto rounded-lg border p-2 sm:grid-cols-2 lg:grid-cols-3">
            {services.filter((s) => s.active).map((s) => (
              <label key={s.id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted">
                <input type="checkbox" className="accent-[var(--primary)]" checked={tests.includes(s.id)} onChange={(e) => setTests((t) => (e.target.checked ? [...t, s.id] : t.filter((x) => x !== s.id)))} />
                {s.name}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--primary)]" checked={walkIn} onChange={(e) => setWalkIn(e.target.checked)} /> Walk-in patient — check in now and create test order</label>
        <Button type="submit"><CalendarPlus className="size-4" aria-hidden /> Save</Button>
      </form>
    </Panel>
  )
}

function CheckIn() {
  const { appts, actor, dispatch, log, orders, serviceName } = useScope()
  const toast = useToast()
  const list = appts.filter((a) => a.status === 'Booked').sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  function checkIn(a: Appointment) {
    dispatch({ type: 'setAppointmentStatus', id: a.id, status: 'Checked-in' })
    if (!orders.some((o) => o.appointmentId === a.id)) {
      const orderId = nextId('ORD')
      dispatch({ type: 'addOrder', order: { id: orderId, appointmentId: a.id, patientId: a.patientId, patientName: a.patientName, branchId: a.branchId, processingBranchId: a.branchId, testIds: a.testIds, status: 'Ordered', results: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } })
      dispatch({ type: 'addPayment', payment: { id: nextId('INV'), orderId, patientName: a.patientName, branchId: a.branchId, amount: 0, method: 'Cash', status: 'Pending', date: isoDate(0) } })
    }
    log(actor, `Checked in ${a.patientName} (${a.id})`)
    toast({ tone: 'success', title: 'Patient checked in', description: 'Test order and invoice created.' })
  }
  return (
    <Panel title="Upcoming check-ins">
      <Table head={['Appointment', 'Patient', 'Date & time', 'Tests', '']} empty={list.length === 0}>
        {list.map((a) => (
          <tr key={a.id}>
            <td className="font-mono text-xs font-semibold">{a.id}</td>
            <td className="font-medium">{a.patientName}</td>
            <td>{a.date} · {a.time}</td>
            <td className="max-w-56 text-muted-foreground">{a.testIds.map(serviceName).join(', ')}</td>
            <td className="text-right"><Button size="sm" onClick={() => checkIn(a)}>Check in</Button></td>
          </tr>
        ))}
      </Table>
    </Panel>
  )
}

function Payments() {
  const { pays, actor, dispatch, log, orders, serviceName, branchName } = useScope()
  const toast = useToast()
  const [open, setOpen] = useState<Payment | null>(null)
  const [invoice, setInvoice] = useState<Payment | null>(null)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<Payment['method']>('Cash')
  const [error, setError] = useState('')

  function record(e: React.FormEvent) {
    e.preventDefault()
    const n = Number(amount)
    if (!amount || Number.isNaN(n) || n <= 0) return setError('Enter an amount greater than 0.')
    dispatch({ type: 'setPaymentStatus', id: open!.id, status: 'Paid', method, amount: n })
    log(actor, `Recorded ${method} payment for ${open!.id}`)
    toast({ tone: 'success', title: 'Payment recorded', description: `${open!.id} · LKR ${n.toLocaleString()}` })
    setOpen(null)
  }

  return (
    <Panel title="Invoices & payments">
      <DemoNotice className="mb-4">Demo billing — prices are entered manually because official prices are not yet published.</DemoNotice>
      <Table head={['Invoice', 'Patient', 'Order', 'Amount', 'Method', 'Status', '']} empty={pays.length === 0}>
        {pays.map((p) => (
          <tr key={p.id}>
            <td className="font-mono text-xs font-semibold">{p.id}</td>
            <td>{p.patientName}</td>
            <td className="font-mono text-xs">{p.orderId}</td>
            <td>{p.amount ? `LKR ${p.amount.toLocaleString()}` : '—'}</td>
            <td>{p.status === 'Paid' ? p.method : '—'}</td>
            <td><StatusBadge status={p.status} /></td>
            <td className="whitespace-nowrap text-right">
              {p.status === 'Pending' ? (
                <Button size="sm" onClick={() => { setOpen(p); setAmount(''); setError('') }}><CreditCard className="size-3.5" aria-hidden /> Record payment</Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setInvoice(p)}><Receipt className="size-3.5" aria-hidden /> Invoice</Button>
              )}
            </td>
          </tr>
        ))}
      </Table>
      <Modal open={!!open} onClose={() => setOpen(null)} title={`Record payment · ${open?.id ?? ''}`}>
        <form onSubmit={record} noValidate className="space-y-4">
          <p className="text-sm text-muted-foreground">Patient: <span className="font-medium text-foreground">{open?.patientName}</span></p>
          <Field label="Amount (LKR)" required error={error}>{(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!error} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />}</Field>
          <Field label="Payment method">{(id) => <Select id={id} value={method} onChange={(e) => setMethod(e.target.value as Payment['method'])}><option>Cash</option><option>Card</option><option>Online</option></Select>}</Field>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(null)}>Cancel</Button><Button type="submit">Confirm payment</Button></div>
        </form>
      </Modal>
      <Modal open={!!invoice} onClose={() => setInvoice(null)} title="Invoice (demo)">
        {invoice && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Invoice</span><span className="font-mono">{invoice.id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span>{invoice.patientName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Branch</span><span>{branchName(invoice.branchId)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{invoice.date}</span></div>
            <ul className="rounded-lg bg-muted/50 p-3">
              {(orders.find((o) => o.id === invoice.orderId)?.testIds ?? []).map((t) => <li key={t}>{serviceName(t)}</li>)}
            </ul>
            <div className="flex justify-between border-t pt-3 text-base font-bold"><span>Total paid ({invoice.method})</span><span>LKR {invoice.amount.toLocaleString()}</span></div>
            <p className="text-xs text-muted-foreground">Demo invoice — not a valid tax document.</p>
          </div>
        )}
      </Modal>
    </Panel>
  )
}

export function ReceptionView() {
  const { session, appointments, payments } = useDemoStore()
  const b = session?.branchId
  return (
    <DashboardShell
      role="receptionist"
      sections={[
        { id: 'overview', label: 'Front desk', icon: LayoutDashboard, render: () => <Overview /> },
        { id: 'checkin', label: 'Check-in', icon: ClipboardCheck, render: () => <CheckIn />, badge: appointments.filter((a) => a.branchId === b && a.status === 'Booked').length },
        { id: 'register', label: 'Patients', icon: Users, render: () => <RegisterPatient /> },
        { id: 'create', label: 'New appointment', icon: CalendarPlus, render: () => <CreateAppointment /> },
        { id: 'payments', label: 'Payments', icon: CreditCard, render: () => <Payments />, badge: payments.filter((p) => p.branchId === b && p.status === 'Pending').length },
      ]}
    />
  )
}
