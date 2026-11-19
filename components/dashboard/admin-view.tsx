'use client'

import { Building2, CalendarDays, ClipboardList, CreditCard, FileCheck2, FlaskConical, LayoutDashboard, Package, Pencil, Plus, ScrollText, ShieldCheck, TestTubes, Users } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { nextId, useDemoStore } from '@/components/demo/demo-store'
import { DashboardShell } from '@/components/dashboard/shell'
import { AppointmentsPanel, OrdersPanel, weeklyKeysFor } from '@/components/dashboard/shared'
import { FilterSelect, Panel, SearchBox, StatCard, StatusPie, Table, VolumeChart, formatDateTime } from '@/components/dashboard/widgets'
import { DemoNotice, Field, Input, Modal, Select, StatusBadge, Textarea } from '@/components/shared/ui'
import { useToast } from '@/components/shared/toast'
import { type Branch, type LabService, type Role, type ServiceCategory, type StaffUser, type TestPackage, demoWeeklyVolume, formatPrice, roleLabels } from '@/lib/demo-data'
import { permissionLabels, rolePermissions } from '@/lib/rbac'

const ACTOR = 'Demo Super Admin'

function Overview() {
  const { branches, appointments, orders, payments } = useDemoStore()
  const awaiting = orders.filter((o) => o.status === 'Result Entered').length
  return (
    <div className="space-y-6">
      <DemoNotice>All figures are demo data generated for this prototype.</DemoNotice>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Building2} label="Active branches" value={branches.filter((b) => b.active).length} hint={`${branches.length} total`} />
        <StatCard icon={CalendarDays} label="Appointments" value={appointments.length} hint={`${appointments.filter((a) => a.status === 'Booked').length} upcoming`} />
        <StatCard icon={TestTubes} label="Samples in progress" value={orders.filter((o) => !['Approved', 'Released'].includes(o.status)).length} tone="warning" />
        <StatCard icon={FileCheck2} label="Awaiting approval" value={awaiting} tone={awaiting ? 'destructive' : 'success'} hint={`${payments.filter((p) => p.status === 'Pending').length} payments pending`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Weekly sample volume by branch">
          <VolumeChart data={demoWeeklyVolume} keys={weeklyKeysFor()} />
        </Panel>
        <Panel title="Orders by status">
          <StatusPie orders={orders} />
        </Panel>
      </div>
      <BranchStats />
    </div>
  )
}

function BranchStats() {
  const { branches, appointments, orders, payments } = useDemoStore()
  return (
    <Panel title="Branch-wise statistics">
      <Table head={['Branch', 'Status', 'Appointments', 'Orders', 'Pending reports', 'Payments recorded']}>
        {branches.map((b) => (
          <tr key={b.id}>
            <td className="font-semibold">{b.name}</td>
            <td><StatusBadge status={b.active ? 'Active' : 'Inactive'} /></td>
            <td>{appointments.filter((a) => a.branchId === b.id).length}</td>
            <td>{orders.filter((o) => o.branchId === b.id).length}</td>
            <td>{orders.filter((o) => o.branchId === b.id && !['Released'].includes(o.status)).length}</td>
            <td>{payments.filter((p) => p.branchId === b.id && p.status === 'Paid').length}</td>
          </tr>
        ))}
      </Table>
    </Panel>
  )
}

const emptyBranch: Branch = { id: '', name: '', type: 'branch', address: '', phone: '', hours: '', mapsQuery: 'Ashoka Medi-Lab', services: [], active: true }

export function BranchForm({ branch, onClose, actor, lockType }: { branch: Branch | null; onClose: () => void; actor: string; lockType?: boolean }) {
  const { dispatch, log } = useDemoStore()
  const toast = useToast()
  const [form, setForm] = useState<Branch>(branch ?? emptyBranch)
  const [servicesText, setServicesText] = useState((branch ?? emptyBranch).services.join(', '))
  const [error, setError] = useState('')

  function save(e: React.FormEvent) {
    e.preventDefault()
    if (form.name.trim().length < 3) return setError('Branch name must be at least 3 characters.')
    const saved = { ...form, id: form.id || nextId('br'), name: form.name.trim(), services: servicesText.split(',').map((s) => s.trim()).filter(Boolean) }
    dispatch({ type: 'upsertBranch', branch: saved })
    log(actor, `${form.id ? 'Updated' : 'Created'} branch ${saved.name}`)
    toast({ tone: 'success', title: form.id ? 'Branch updated' : 'Branch added', description: saved.name })
    onClose()
  }

  const set = (k: keyof Branch) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
  return (
    <form onSubmit={save} className="space-y-4" noValidate>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Field label="Branch name" required>{(id) => <Input id={id} value={form.name} onChange={set('name')} aria-invalid={!!error} />}</Field>
      {!lockType && (
        <Field label="Type">
          {(id) => (
            <Select id={id} value={form.type} onChange={set('type')}>
              <option value="main">Main laboratory</option>
              <option value="branch">Branch laboratory</option>
              <option value="collection">Collection centre</option>
            </Select>
          )}
        </Field>
      )}
      <Field label="Address">{(id) => <Input id={id} value={form.address} onChange={set('address')} placeholder="[Official address]" />}</Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone">{(id) => <Input id={id} value={form.phone} onChange={set('phone')} />}</Field>
        <Field label="Opening hours">{(id) => <Input id={id} value={form.hours} onChange={set('hours')} />}</Field>
      </div>
      <Field label="Google Maps search text">{(id) => <Input id={id} value={form.mapsQuery} onChange={set('mapsQuery')} />}</Field>
      <Field label="Available services" hint="Comma separated">{(id, d) => <Input id={id} aria-describedby={d} value={servicesText} onChange={(e) => setServicesText(e.target.value)} />}</Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save branch</Button>
      </div>
    </form>
  )
}

function Branches() {
  const { branches, dispatch, log } = useDemoStore()
  const toast = useToast()
  const [editing, setEditing] = useState<Branch | null | undefined>(undefined)
  return (
    <Panel title="Branches" action={<Button size="sm" onClick={() => setEditing(null)}><Plus className="size-4" aria-hidden /> Add branch</Button>}>
      <Table head={['Branch', 'Type', 'Phone', 'Hours', 'Status', '']}>
        {branches.map((b) => (
          <tr key={b.id}>
            <td><span className="font-semibold">{b.name}</span><span className="block text-xs text-muted-foreground">{b.address}</span></td>
            <td className="capitalize text-muted-foreground">{b.type}</td>
            <td>{b.phone}</td>
            <td className="text-muted-foreground">{b.hours}</td>
            <td><StatusBadge status={b.active ? 'Active' : 'Inactive'} /></td>
            <td className="whitespace-nowrap text-right">
              <Button size="sm" variant="ghost" onClick={() => setEditing(b)} aria-label={`Edit ${b.name}`}><Pencil className="size-4" /></Button>
              {b.type !== 'main' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch({ type: 'upsertBranch', branch: { ...b, active: !b.active } })
                    log(ACTOR, `${b.active ? 'Deactivated' : 'Activated'} branch ${b.name}`)
                    toast({ tone: 'success', title: b.active ? 'Branch deactivated' : 'Branch activated', description: b.name })
                  }}
                >
                  {b.active ? 'Deactivate' : 'Activate'}
                </Button>
              )}
            </td>
          </tr>
        ))}
      </Table>
      <Modal open={editing !== undefined} onClose={() => setEditing(undefined)} title={editing ? 'Edit branch' : 'Add branch'}>
        {editing !== undefined && <BranchForm key={editing?.id ?? 'new'} branch={editing} onClose={() => setEditing(undefined)} actor={ACTOR} />}
      </Modal>
    </Panel>
  )
}

export function StaffForm({ user, onClose, actor, allowedRoles, fixedBranch }: { user: StaffUser | null; onClose: () => void; actor: string; allowedRoles: Role[]; fixedBranch?: string }) {
  const { branches, dispatch, log } = useDemoStore()
  const toast = useToast()
  const [form, setForm] = useState<StaffUser>(user ?? { id: '', name: '', email: '', role: allowedRoles[0], branchId: fixedBranch ?? 'br-main', active: true })
  const [error, setError] = useState('')
  function save(e: React.FormEvent) {
    e.preventDefault()
    if (form.name.trim().length < 2) return setError('Enter a name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email.')
    const saved = { ...form, id: form.id || nextId('u') }
    dispatch({ type: 'upsertStaff', user: saved })
    log(actor, `${form.id ? 'Updated' : 'Created'} user ${saved.email} (${roleLabels[saved.role]})`)
    toast({ tone: 'success', title: form.id ? 'User updated' : 'User created', description: saved.name })
    onClose()
  }
  return (
    <form onSubmit={save} className="space-y-4" noValidate>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Field label="Full name" required>{(id) => <Input id={id} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}</Field>
      <Field label="Email" required>{(id) => <Input id={id} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />}</Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Role">
          {(id) => (
            <Select id={id} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              {allowedRoles.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
            </Select>
          )}
        </Field>
        <Field label="Branch">
          {(id) => (
            <Select id={id} value={form.branchId} disabled={!!fixedBranch} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          )}
        </Field>
      </div>
      <div className="rounded-lg bg-muted/60 p-3 text-xs">
        <p className="font-semibold">Permissions for {roleLabels[form.role]}</p>
        <p className="mt-1 text-muted-foreground">{rolePermissions[form.role].map((p) => permissionLabels[p]).join(' · ')}</p>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save user</Button>
      </div>
    </form>
  )
}

const staffRoles: Role[] = ['super-admin', 'branch-manager', 'receptionist', 'technician', 'approver']

function UsersSection() {
  const { staff, branchName, dispatch, log } = useDemoStore()
  const toast = useToast()
  const [editing, setEditing] = useState<StaffUser | null | undefined>(undefined)
  const [q, setQ] = useState('')
  const [role, setRole] = useState('all')
  const list = staff.filter((u) => (role === 'all' || u.role === role) && (!q || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase())))
  return (
    <div className="space-y-6">
      <Panel
        title="Users"
        action={
          <div className="flex flex-wrap gap-2">
            <SearchBox value={q} onChange={setQ} placeholder="Name or email" label="Search users" />
            <FilterSelect value={role} onChange={setRole} label="Filter by role" options={[{ value: 'all', label: 'All roles' }, ...staffRoles.map((r) => ({ value: r, label: roleLabels[r] }))]} />
            <Button size="sm" onClick={() => setEditing(null)}><Plus className="size-4" aria-hidden /> Add user</Button>
          </div>
        }
      >
        <Table head={['Name', 'Role', 'Branch', 'Status', '']} empty={list.length === 0}>
          {list.map((u) => (
            <tr key={u.id}>
              <td><span className="font-semibold">{u.name}</span><span className="block text-xs text-muted-foreground">{u.email}</span></td>
              <td>{roleLabels[u.role]}</td>
              <td className="text-muted-foreground">{branchName(u.branchId)}</td>
              <td><StatusBadge status={u.active ? 'Active' : 'Inactive'} /></td>
              <td className="whitespace-nowrap text-right">
                <Button size="sm" variant="ghost" onClick={() => setEditing(u)} aria-label={`Edit ${u.name}`}><Pencil className="size-4" /></Button>
                {u.role !== 'super-admin' && (
                  <Button size="sm" variant="outline" onClick={() => { dispatch({ type: 'upsertStaff', user: { ...u, active: !u.active } }); log(ACTOR, `${u.active ? 'Disabled' : 'Enabled'} user ${u.email}`); toast({ tone: 'success', title: u.active ? 'User disabled' : 'User enabled' }) }}>
                    {u.active ? 'Disable' : 'Enable'}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Panel>
      <Panel title="Role permissions matrix">
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="border-y bg-muted/40 uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-2.5">Permission</th>
                {(Object.keys(rolePermissions) as Role[]).map((r) => <th key={r} scope="col" className="px-3 py-2.5 text-center">{roleLabels[r]}</th>)}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(permissionLabels) as (keyof typeof permissionLabels)[]).map((p) => (
                <tr key={p} className="border-b last:border-0">
                  <td className="px-5 py-2">{permissionLabels[p]}</td>
                  {(Object.keys(rolePermissions) as Role[]).map((r) => (
                    <td key={r} className="px-3 py-2 text-center">
                      {rolePermissions[r].includes(p) ? <ShieldCheck className="mx-auto size-4 text-success" aria-label="Allowed" /> : <span className="text-muted-foreground/40" aria-label="Not allowed">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Modal open={editing !== undefined} onClose={() => setEditing(undefined)} title={editing ? 'Edit user' : 'Add user'}>
        {editing !== undefined && <StaffForm key={editing?.id ?? 'new'} user={editing} onClose={() => setEditing(undefined)} actor={ACTOR} allowedRoles={staffRoles} />}
      </Modal>
    </div>
  )
}

const categories: ServiceCategory[] = ['Haematology', 'Biochemistry', 'Hormones', 'Microbiology', 'Urine & Stool', 'Immunology']

function ServiceForm({ service, onClose }: { service: LabService | null; onClose: () => void }) {
  const { dispatch, log } = useDemoStore()
  const toast = useToast()
  const [f, setF] = useState<LabService>(service ?? { id: '', name: '', code: '', category: 'Haematology', sample: '', turnaround: 'Same day', fasting: false, description: '', price: null, active: true })
  const [price, setPrice] = useState(service?.price ? String(service.price) : '')
  const [error, setError] = useState('')
  function save(e: React.FormEvent) {
    e.preventDefault()
    if (f.name.trim().length < 2 || f.code.trim().length < 2) return setError('Name and code are required.')
    if (price && (Number.isNaN(Number(price)) || Number(price) < 0)) return setError('Price must be a positive number or left blank.')
    const saved = { ...f, id: f.id || nextId('t'), code: f.code.toUpperCase(), price: price ? Number(price) : null }
    dispatch({ type: 'upsertService', service: saved })
    log(ACTOR, `${f.id ? 'Updated' : 'Created'} service ${saved.code}`)
    toast({ tone: 'success', title: 'Service saved', description: saved.name })
    onClose()
  }
  return (
    <form onSubmit={save} className="space-y-4" noValidate>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <Field label="Test name" required>{(id) => <Input id={id} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}</Field>
        <Field label="Code" required>{(id) => <Input id={id} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} />}</Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">{(id) => <Select id={id} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as ServiceCategory })}>{categories.map((c) => <option key={c}>{c}</option>)}</Select>}</Field>
        <Field label="Sample type">{(id) => <Input id={id} value={f.sample} onChange={(e) => setF({ ...f, sample: e.target.value })} />}</Field>
        <Field label="Turnaround">{(id) => <Input id={id} value={f.turnaround} onChange={(e) => setF({ ...f, turnaround: e.target.value })} />}</Field>
        <Field label="Price (LKR)" hint="Leave blank for “Price on request”">{(id, d) => <Input id={id} aria-describedby={d} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />}</Field>
      </div>
      <Field label="Description">{(id) => <Textarea id={id} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />}</Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.fasting} onChange={(e) => setF({ ...f, fasting: e.target.checked })} className="accent-[var(--primary)]" /> Fasting required</label>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">Save service</Button></div>
    </form>
  )
}

function Services() {
  const { services, dispatch, log } = useDemoStore()
  const [editing, setEditing] = useState<LabService | null | undefined>(undefined)
  const [q, setQ] = useState('')
  const list = services.filter((s) => !q || `${s.name} ${s.code}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <Panel title="Laboratory services" action={<div className="flex gap-2"><SearchBox value={q} onChange={setQ} label="Search services" /><Button size="sm" onClick={() => setEditing(null)}><Plus className="size-4" aria-hidden /> Add</Button></div>}>
      <Table head={['Test', 'Category', 'Turnaround', 'Price', 'Status', '']} empty={list.length === 0}>
        {list.map((s) => (
          <tr key={s.id}>
            <td><span className="font-semibold">{s.name}</span><span className="block font-mono text-xs text-muted-foreground">{s.code}</span></td>
            <td className="text-muted-foreground">{s.category}</td>
            <td>{s.turnaround}</td>
            <td>{formatPrice(s.price)}</td>
            <td><StatusBadge status={s.active ? 'Active' : 'Inactive'} /></td>
            <td className="whitespace-nowrap text-right">
              <Button size="sm" variant="ghost" onClick={() => setEditing(s)} aria-label={`Edit ${s.name}`}><Pencil className="size-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => { dispatch({ type: 'upsertService', service: { ...s, active: !s.active } }); log(ACTOR, `${s.active ? 'Hid' : 'Published'} service ${s.code}`) }}>{s.active ? 'Hide' : 'Publish'}</Button>
            </td>
          </tr>
        ))}
      </Table>
      <Modal open={editing !== undefined} onClose={() => setEditing(undefined)} title={editing ? 'Edit service' : 'Add service'} wide>
        {editing !== undefined && <ServiceForm key={editing?.id ?? 'new'} service={editing} onClose={() => setEditing(undefined)} />}
      </Modal>
    </Panel>
  )
}

function PackageForm({ pkg, onClose }: { pkg: TestPackage | null; onClose: () => void }) {
  const { services, dispatch, log } = useDemoStore()
  const toast = useToast()
  const [f, setF] = useState<TestPackage>(pkg ?? { id: '', name: '', audience: '', description: '', testIds: [], price: null, active: true })
  const [price, setPrice] = useState(pkg?.price ? String(pkg.price) : '')
  const [error, setError] = useState('')
  function save(e: React.FormEvent) {
    e.preventDefault()
    if (f.name.trim().length < 3) return setError('Package name is required.')
    if (f.testIds.length === 0) return setError('Select at least one test.')
    const saved = { ...f, id: f.id || nextId('p'), price: price ? Number(price) : null }
    dispatch({ type: 'upsertPackage', pkg: saved })
    log(ACTOR, `${f.id ? 'Updated' : 'Created'} package ${saved.name}`)
    toast({ tone: 'success', title: 'Package saved', description: saved.name })
    onClose()
  }
  return (
    <form onSubmit={save} className="space-y-4" noValidate>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Field label="Package name" required>{(id) => <Input id={id} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}</Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Audience">{(id) => <Input id={id} value={f.audience} onChange={(e) => setF({ ...f, audience: e.target.value })} />}</Field>
        <Field label="Price (LKR)" hint="Optional">{(id, d) => <Input id={id} aria-describedby={d} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />}</Field>
      </div>
      <Field label="Description">{(id) => <Textarea id={id} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />}</Field>
      <fieldset>
        <legend className="text-sm font-medium">Included tests</legend>
        <div className="mt-2 grid max-h-48 gap-1 overflow-y-auto rounded-lg border p-2 sm:grid-cols-2">
          {services.map((s) => (
            <label key={s.id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted">
              <input type="checkbox" className="accent-[var(--primary)]" checked={f.testIds.includes(s.id)} onChange={(e) => setF({ ...f, testIds: e.target.checked ? [...f.testIds, s.id] : f.testIds.filter((x) => x !== s.id) })} />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--primary)]" checked={!!f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Mark as popular</label>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">Save package</Button></div>
    </form>
  )
}

function Packages() {
  const { packages, dispatch, log } = useDemoStore()
  const [editing, setEditing] = useState<TestPackage | null | undefined>(undefined)
  return (
    <Panel title="Test packages" action={<Button size="sm" onClick={() => setEditing(null)}><Plus className="size-4" aria-hidden /> Add package</Button>}>
      <Table head={['Package', 'Tests', 'Price', 'Status', '']}>
        {packages.map((p) => (
          <tr key={p.id}>
            <td><span className="font-semibold">{p.name}</span><span className="block text-xs text-muted-foreground">{p.audience}</span></td>
            <td>{p.testIds.length}</td>
            <td>{formatPrice(p.price)}</td>
            <td><StatusBadge status={p.active ? 'Active' : 'Inactive'} /></td>
            <td className="whitespace-nowrap text-right">
              <Button size="sm" variant="ghost" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}><Pencil className="size-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => { dispatch({ type: 'upsertPackage', pkg: { ...p, active: !p.active } }); log(ACTOR, `${p.active ? 'Hid' : 'Published'} package ${p.name}`) }}>{p.active ? 'Hide' : 'Publish'}</Button>
            </td>
          </tr>
        ))}
      </Table>
      <Modal open={editing !== undefined} onClose={() => setEditing(undefined)} title={editing ? 'Edit package' : 'Add package'} wide>
        {editing !== undefined && <PackageForm key={editing?.id ?? 'new'} pkg={editing} onClose={() => setEditing(undefined)} />}
      </Modal>
    </Panel>
  )
}

function Monitoring() {
  const { appointments, orders, payments, branches, branchName } = useDemoStore()
  const [branch, setBranch] = useState('all')
  const by = <T extends { branchId: string }>(l: T[]) => (branch === 'all' ? l : l.filter((x) => x.branchId === branch))
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Branch</span>
        <FilterSelect value={branch} onChange={setBranch} label="Filter by branch" options={[{ value: 'all', label: 'All branches' }, ...branches.map((b) => ({ value: b.id, label: b.name }))]} />
      </div>
      <AppointmentsPanel appointments={by(appointments)} />
      <OrdersPanel orders={by(orders)} title="Samples & reports" canTransfer actor={ACTOR} />
      <Panel title="Payments">
        <Table head={['Invoice', 'Patient', 'Branch', 'Amount', 'Method', 'Status']} empty={by(payments).length === 0}>
          {by(payments).map((p) => (
            <tr key={p.id}>
              <td className="font-mono text-xs font-semibold">{p.id}</td>
              <td>{p.patientName}</td>
              <td className="text-muted-foreground">{branchName(p.branchId)}</td>
              <td>{p.amount ? `LKR ${p.amount.toLocaleString()}` : '—'}</td>
              <td>{p.method}</td>
              <td><StatusBadge status={p.status} /></td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  )
}

function Audit() {
  const { audit } = useDemoStore()
  const [q, setQ] = useState('')
  const list = audit.filter((a) => !q || `${a.actor} ${a.action}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <Panel title="Audit log" action={<SearchBox value={q} onChange={setQ} label="Search audit log" />}>
      <Table head={['Time', 'User', 'Action']} empty={list.length === 0}>
        {list.map((a) => (
          <tr key={a.id}>
            <td className="whitespace-nowrap text-muted-foreground">{formatDateTime(a.at)}</td>
            <td className="font-medium">{a.actor}</td>
            <td>{a.action}</td>
          </tr>
        ))}
      </Table>
    </Panel>
  )
}

export function AdminView() {
  const { orders } = useDemoStore()
  return (
    <DashboardShell
      role="super-admin"
      sections={[
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, render: () => <Overview /> },
        { id: 'branches', label: 'Branches', icon: Building2, render: () => <Branches /> },
        { id: 'users', label: 'Users & permissions', icon: Users, render: () => <UsersSection /> },
        { id: 'services', label: 'Services', icon: FlaskConical, render: () => <Services /> },
        { id: 'packages', label: 'Packages', icon: Package, render: () => <Packages /> },
        { id: 'monitoring', label: 'Monitoring', icon: ClipboardList, render: () => <Monitoring />, badge: orders.filter((o) => o.status === 'Result Entered').length },
        { id: 'payments', label: 'Branch statistics', icon: CreditCard, render: () => <BranchStats /> },
        { id: 'audit', label: 'Audit log', icon: ScrollText, render: () => <Audit /> },
      ]}
    />
  )
}
