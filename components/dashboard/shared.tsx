'use client'

import { ArrowRightLeft, Eye } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { FilterSelect, Panel, SearchBox, Table, WorkflowStepper, formatDateTime } from '@/components/dashboard/widgets'
import { Modal, StatusBadge } from '@/components/shared/ui'
import { useToast } from '@/components/shared/toast'
import { type Appointment, type TestOrder, orderFlow } from '@/lib/demo-data'

const statusOptions = [{ value: 'all', label: 'All statuses' }, ...[...orderFlow, 'Correction Requested'].map((s) => ({ value: s, label: s }))]

export function OrdersPanel({ orders, title = 'Test orders & samples', canTransfer, actor }: { orders: TestOrder[]; title?: string; canTransfer?: boolean; actor?: string }) {
  const { branchName, serviceName, advanceOrder } = useDemoStore()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [view, setView] = useState<TestOrder | null>(null)

  const list = orders.filter(
    (o) => (status === 'all' || o.status === status) && (!q || [o.id, o.patientName, o.sampleId ?? ''].some((v) => v.toLowerCase().includes(q.toLowerCase()))),
  )

  function transfer(o: TestOrder) {
    advanceOrder(o.id, 'In Transit', actor ?? 'Staff', { processingBranchId: 'br-main' })
    toast({ tone: 'success', title: 'Sample transfer started', description: `${o.sampleId ?? o.id} is in transit to the Main Laboratory (demo).` })
  }

  return (
    <Panel
      title={title}
      action={
        <div className="flex flex-wrap gap-2">
          <SearchBox value={q} onChange={setQ} placeholder="Order, patient or sample ID" label="Search orders" />
          <FilterSelect value={status} onChange={setStatus} options={statusOptions} label="Filter by status" />
        </div>
      }
    >
      <Table head={['Order', 'Patient', 'Tests', 'Collected at', 'Processing', 'Status', '']} empty={list.length === 0}>
        {list.map((o) => (
          <tr key={o.id}>
            <td className="font-mono text-xs font-semibold">{o.id}<span className="block font-normal text-muted-foreground">{o.sampleId ?? '—'}</span></td>
            <td>{o.patientName}</td>
            <td className="max-w-48 text-muted-foreground">{o.testIds.map(serviceName).join(', ')}</td>
            <td className="text-muted-foreground">{branchName(o.branchId)}</td>
            <td className="text-muted-foreground">{branchName(o.processingBranchId)}</td>
            <td><StatusBadge status={o.status} /></td>
            <td className="whitespace-nowrap text-right">
              {canTransfer && o.status === 'Sample Collected' && o.processingBranchId !== 'br-main' && (
                <Button size="sm" variant="outline" onClick={() => transfer(o)} className="mr-1.5">
                  <ArrowRightLeft className="size-3.5" aria-hidden /> To main lab
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => setView(o)} aria-label={`View ${o.id}`}>
                <Eye className="size-4" />
              </Button>
            </td>
          </tr>
        ))}
      </Table>
      <OrderDetailModal order={view} onClose={() => setView(null)} />
    </Panel>
  )
}

export function OrderDetailModal({ order, onClose }: { order: TestOrder | null; onClose: () => void }) {
  const { branchName, serviceName, orders } = useDemoStore()
  const live = order ? orders.find((o) => o.id === order.id) ?? order : null
  return (
    <Modal open={!!live} onClose={onClose} title={live ? `Order ${live.id}` : ''} wide>
      {live && (
        <div className="space-y-5 text-sm">
          <WorkflowStepper status={live.status} transfer={live.branchId !== live.processingBranchId} />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div><dt className="text-muted-foreground">Patient</dt><dd className="font-medium">{live.patientName}</dd></div>
            <div><dt className="text-muted-foreground">Sample ID</dt><dd className="font-mono">{live.sampleId ?? 'Not collected'}</dd></div>
            <div><dt className="text-muted-foreground">Collected at</dt><dd>{branchName(live.branchId)}</dd></div>
            <div><dt className="text-muted-foreground">Processing at</dt><dd>{branchName(live.processingBranchId)}</dd></div>
            <div><dt className="text-muted-foreground">Technician</dt><dd>{live.technician ?? '—'}</dd></div>
            <div><dt className="text-muted-foreground">Approved by</dt><dd>{live.approver ?? '—'}</dd></div>
            <div className="col-span-2"><dt className="text-muted-foreground">Last updated</dt><dd>{formatDateTime(live.updatedAt)}</dd></div>
          </dl>
          {live.correctionNote && <p className="rounded-lg bg-destructive/5 p-3 text-destructive">Correction requested: {live.correctionNote}</p>}
          <div>
            <p className="mb-2 font-semibold">Tests</p>
            <ul className="space-y-1.5">
              {live.testIds.map((t) => {
                const r = live.results.find((x) => x.testId === t)
                return (
                  <li key={t} className="flex justify-between gap-4 rounded-lg bg-muted/50 px-3 py-2">
                    <span>{serviceName(t)}</span>
                    <span className="text-muted-foreground">{r ? `${r.value} ${r.unit} (ref ${r.reference})${r.flag ? ` ${r.flag}` : ''}` : 'Pending'}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  )
}

export function AppointmentsPanel({ appointments, title = 'Appointments', manage, actor }: { appointments: Appointment[]; title?: string; manage?: boolean; actor?: string }) {
  const { branchName, dispatch, log } = useDemoStore()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const list = appointments
    .filter((a) => (status === 'all' || a.status === status) && (!q || `${a.id} ${a.patientName}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))

  function setAppt(a: Appointment, s: Appointment['status']) {
    dispatch({ type: 'setAppointmentStatus', id: a.id, status: s })
    log(actor ?? 'Staff', `Appointment ${a.id} → ${s}`)
    toast({ tone: 'success', title: `Appointment ${s.toLowerCase()}`, description: `${a.id} · ${a.patientName}` })
  }

  return (
    <Panel
      title={title}
      action={
        <div className="flex flex-wrap gap-2">
          <SearchBox value={q} onChange={setQ} placeholder="ID or patient" label="Search appointments" />
          <FilterSelect value={status} onChange={setStatus} label="Filter by status" options={['all', 'Booked', 'Checked-in', 'Completed', 'Cancelled'].map((s) => ({ value: s, label: s === 'all' ? 'All statuses' : s }))} />
        </div>
      }
    >
      <Table head={['ID', 'Patient', 'Branch', 'Date & time', 'Source', 'Status', ...(manage ? [''] : [])]} empty={list.length === 0}>
        {list.map((a) => (
          <tr key={a.id}>
            <td className="font-mono text-xs font-semibold">{a.id}</td>
            <td>{a.patientName}</td>
            <td className="text-muted-foreground">{branchName(a.branchId)}</td>
            <td>{a.date} · {a.time}</td>
            <td className="text-muted-foreground">{a.source}</td>
            <td><StatusBadge status={a.status} /></td>
            {manage && (
              <td className="whitespace-nowrap text-right">
                {a.status === 'Booked' && (
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setAppt(a, 'Cancelled')}>Cancel</Button>
                )}
                {a.status === 'Checked-in' && <Button size="sm" variant="outline" onClick={() => setAppt(a, 'Completed')}>Mark completed</Button>}
              </td>
            )}
          </tr>
        ))}
      </Table>
    </Panel>
  )
}

export function weeklyKeysFor(branchId?: string) {
  const all = [
    { key: 'main', label: 'Main Lab', id: 'br-main' },
    { key: 'b2', label: 'Branch 02', id: 'br-2' },
    { key: 'b3', label: 'Branch 03', id: 'br-3' },
    { key: 'c4', label: 'Centre 04', id: 'br-4' },
  ]
  return branchId ? all.filter((k) => k.id === branchId) : all
}
