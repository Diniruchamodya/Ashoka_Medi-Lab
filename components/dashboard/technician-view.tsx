'use client'

import { ArrowRightLeft, Beaker, ClipboardList, FlaskConical, LayoutDashboard, PackageCheck, TestTube } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { DashboardShell } from '@/components/dashboard/shell'
import { OrderDetailModal } from '@/components/dashboard/shared'
import { Panel, StatCard, Table, WorkflowStepper } from '@/components/dashboard/widgets'
import { DemoNotice, Field, Input, Modal, Select, StatusBadge } from '@/components/shared/ui'
import { useToast } from '@/components/shared/toast'
import type { TestOrder, TestResult } from '@/lib/demo-data'

function useScope() {
  const s = useDemoStore()
  const branchId = s.session!.branchId
  return {
    ...s,
    branchId,
    actor: s.session!.name,
    queue: s.orders.filter((o) => (o.processingBranchId === branchId || o.branchId === branchId) && !['Approved', 'Released'].includes(o.status)),
  }
}

function Queue() {
  const { queue, branchId, actor, advanceOrder, serviceName, branchName } = useScope()
  const toast = useToast()
  const [view, setView] = useState<TestOrder | null>(null)
  const [entering, setEntering] = useState<TestOrder | null>(null)

  function act(o: TestOrder) {
    if (o.status === 'Ordered') {
      const sampleId = `S-${o.id.replace(/\D/g, '')}`
      advanceOrder(o.id, 'Sample Collected', actor, { sampleId, technician: actor })
      toast({ tone: 'success', title: 'Sample collected', description: `Barcode ${sampleId} assigned (demo).` })
    } else if (o.status === 'Sample Collected' && o.processingBranchId !== branchId) {
      advanceOrder(o.id, 'In Transit', actor)
    } else if (o.status === 'Sample Collected' || (o.status === 'In Transit' && o.processingBranchId === branchId)) {
      advanceOrder(o.id, 'Processing', actor, { technician: actor })
      toast({ tone: 'success', title: o.status === 'In Transit' ? 'Sample received & processing' : 'Processing started' })
    } else if (o.status === 'Processing' || o.status === 'Correction Requested') {
      setEntering(o)
    }
  }

  function label(o: TestOrder) {
    if (o.status === 'Ordered') return 'Collect sample'
    if (o.status === 'Sample Collected') return 'Start processing'
    if (o.status === 'In Transit' && o.processingBranchId === branchId) return 'Receive sample'
    if (o.status === 'Processing') return 'Enter results'
    if (o.status === 'Correction Requested') return 'Correct results'
    return null
  }

  return (
    <Panel title="Assigned work queue">
      <Table head={['Order', 'Patient', 'Tests', 'Route', 'Status', '']} empty={queue.length === 0}>
        {queue.map((o) => {
          const l = label(o)
          return (
            <tr key={o.id}>
              <td className="font-mono text-xs font-semibold">{o.id}<span className="block font-normal text-muted-foreground">{o.sampleId ?? '—'}</span></td>
              <td>{o.patientName}</td>
              <td className="max-w-48 text-muted-foreground">{o.testIds.map(serviceName).join(', ')}</td>
              <td className="text-xs text-muted-foreground">{branchName(o.branchId)}{o.processingBranchId !== o.branchId && <> → {branchName(o.processingBranchId)}</>}</td>
              <td><StatusBadge status={o.status} /></td>
              <td className="whitespace-nowrap text-right">
                <Button size="sm" variant="ghost" onClick={() => setView(o)}>Details</Button>
                {l && <Button size="sm" variant={o.status === 'Correction Requested' ? 'destructive' : 'default'} onClick={() => act(o)}>{l}</Button>}
                {o.status === 'In Transit' && o.processingBranchId !== branchId && <span className="text-xs text-muted-foreground">Awaiting receipt</span>}
                {o.status === 'Result Entered' && <span className="text-xs text-muted-foreground">With approver</span>}
              </td>
            </tr>
          )
        })}
      </Table>
      <OrderDetailModal order={view} onClose={() => setView(null)} />
      <ResultsModal order={entering} onClose={() => setEntering(null)} />
    </Panel>
  )
}

function ResultsModal({ order, onClose }: { order: TestOrder | null; onClose: () => void }) {
  const { serviceName, enterResults, session } = useDemoStore()
  const toast = useToast()
  return (
    <Modal open={!!order} onClose={onClose} title={order ? `Enter results · ${order.id}` : ''} wide>
      {order && (
        <ResultsForm
          key={order.id}
          order={order}
          serviceName={serviceName}
          onCancel={onClose}
          onSave={(results) => {
            enterResults(order.id, results, session!.name)
            toast({ tone: 'success', title: 'Results submitted for approval', description: 'Reports cannot be released until approved.' })
            onClose()
          }}
        />
      )}
    </Modal>
  )
}

function ResultsForm({ order, serviceName, onSave, onCancel }: { order: TestOrder; serviceName: (id: string) => string; onSave: (r: TestResult[]) => void; onCancel: () => void }) {
  const [rows, setRows] = useState<TestResult[]>(
    order.testIds.map((t) => order.results.find((r) => r.testId === t) ?? { testId: t, value: '', unit: '', reference: '' }),
  )
  const [error, setError] = useState('')
  const update = (i: number, patch: Partial<TestResult>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (rows.some((r) => !r.value.trim())) return setError('Enter a value for every test.')
        onSave(rows.map((r) => ({ ...r, flag: r.flag || undefined })))
      }}
      className="space-y-4"
    >
      <DemoNotice>Demo values only — not for clinical use.</DemoNotice>
      {order.correctionNote && <p className="rounded-lg bg-destructive/5 p-3 text-sm text-destructive">Approver note: {order.correctionNote}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {rows.map((r, i) => (
        <fieldset key={r.testId} className="rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">{serviceName(r.testId)}</legend>
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="Value" required>{(id) => <Input id={id} value={r.value} onChange={(e) => update(i, { value: e.target.value })} aria-invalid={!!error && !r.value} />}</Field>
            <Field label="Unit">{(id) => <Input id={id} value={r.unit} onChange={(e) => update(i, { unit: e.target.value })} />}</Field>
            <Field label="Reference">{(id) => <Input id={id} value={r.reference} onChange={(e) => update(i, { reference: e.target.value })} />}</Field>
            <Field label="Flag">
              {(id) => (
                <Select id={id} value={r.flag ?? ''} onChange={(e) => update(i, { flag: (e.target.value || undefined) as TestResult['flag'] })}>
                  <option value="">Normal</option>
                  <option value="H">High</option>
                  <option value="L">Low</option>
                </Select>
              )}
            </Field>
          </div>
        </fieldset>
      ))}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit"><Beaker className="size-4" aria-hidden /> Submit for approval</Button>
      </div>
    </form>
  )
}

function Tracking() {
  const { orders, branchId, serviceName } = useScope()
  const list = orders.filter((o) => o.branchId === branchId || o.processingBranchId === branchId)
  return (
    <div className="space-y-4">
      {list.map((o) => (
        <div key={o.id} className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">{o.id} · {o.patientName}<span className="ml-2 text-sm font-normal text-muted-foreground">{o.testIds.map(serviceName).join(', ')}</span></p>
            <StatusBadge status={o.status} />
          </div>
          <WorkflowStepper status={o.status} transfer={o.branchId !== o.processingBranchId} />
        </div>
      ))}
    </div>
  )
}

function Overview() {
  const { queue, branchId } = useScope()
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={TestTube} label="To collect" value={queue.filter((o) => o.status === 'Ordered').length} />
        <StatCard icon={ArrowRightLeft} label="Incoming transfers" value={queue.filter((o) => o.status === 'In Transit' && o.processingBranchId === branchId).length} tone="warning" />
        <StatCard icon={FlaskConical} label="Processing" value={queue.filter((o) => o.status === 'Processing').length} />
        <StatCard icon={PackageCheck} label="Corrections" value={queue.filter((o) => o.status === 'Correction Requested').length} tone="destructive" />
      </div>
      <Queue />
    </div>
  )
}

export function TechnicianView() {
  const { session, orders } = useDemoStore()
  const b = session?.branchId
  return (
    <DashboardShell
      role="technician"
      sections={[
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, render: () => <Overview /> },
        { id: 'queue', label: 'Work queue', icon: ClipboardList, render: () => <Queue />, badge: orders.filter((o) => o.processingBranchId === b && o.status === 'Correction Requested').length },
        { id: 'tracking', label: 'Sample tracking', icon: TestTube, render: () => <Tracking /> },
      ]}
    />
  )
}
