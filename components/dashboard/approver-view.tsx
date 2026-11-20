'use client'

import { CheckCircle2, ClipboardCheck, FileCheck2, FileWarning, LayoutDashboard, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { DashboardShell } from '@/components/dashboard/shell'
import { Panel, StatCard, Table, formatDateTime } from '@/components/dashboard/widgets'
import { DemoNotice, Field, Modal, StatusBadge, Textarea } from '@/components/shared/ui'
import { useToast } from '@/components/shared/toast'
import type { TestOrder } from '@/lib/demo-data'

function Review({ order, onClose }: { order: TestOrder | null; onClose: () => void }) {
  const { serviceName, branchName, advanceOrder, session } = useDemoStore()
  const toast = useToast()
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const actor = session!.name

  function approve() {
    advanceOrder(order!.id, 'Approved', actor, { approver: actor })
    toast({ tone: 'success', title: 'Report approved', description: 'Release it to make it available to the patient.' })
    onClose()
  }
  function requestCorrection() {
    if (note.trim().length < 5) return setError('Describe what needs to be corrected.')
    advanceOrder(order!.id, 'Correction Requested', actor, { correctionNote: note.trim() })
    toast({ tone: 'success', title: 'Correction requested', description: 'Sent back to the technician.' })
    onClose()
  }

  return (
    <Modal open={!!order} onClose={onClose} title={order ? `Review ${order.id}` : ''} wide>
      {order && (
        <div className="space-y-5 text-sm">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div><dt className="text-muted-foreground">Patient</dt><dd className="font-medium">{order.patientName}</dd></div>
            <div><dt className="text-muted-foreground">Sample</dt><dd className="font-mono">{order.sampleId}</dd></div>
            <div><dt className="text-muted-foreground">Lab</dt><dd>{branchName(order.processingBranchId)}</dd></div>
            <div><dt className="text-muted-foreground">Technician</dt><dd>{order.technician}</dd></div>
          </dl>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr><th className="px-4 py-2">Test</th><th className="px-4 py-2">Result</th><th className="px-4 py-2">Reference</th><th className="px-4 py-2">Flag</th></tr>
              </thead>
              <tbody>
                {order.results.map((r) => (
                  <tr key={r.testId} className="border-t">
                    <td className="px-4 py-2.5 font-medium">{serviceName(r.testId)}</td>
                    <td className="px-4 py-2.5">{r.value} {r.unit}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{r.reference}</td>
                    <td className={r.flag ? 'px-4 py-2.5 font-bold text-destructive' : 'px-4 py-2.5 text-muted-foreground'}>{r.flag ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Field label="Correction note" error={error} hint="Required only when requesting a correction">
            {(id, d) => <Textarea id={id} aria-describedby={d} value={note} onChange={(e) => setNote(e.target.value)} rows={3} />}
          </Field>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={requestCorrection}><FileWarning className="size-4" aria-hidden /> Request correction</Button>
            <Button onClick={approve}><CheckCircle2 className="size-4" aria-hidden /> Approve report</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function Queue({ statuses, title }: { statuses: TestOrder['status'][]; title: string }) {
  const { orders, serviceName, advanceOrder, session } = useDemoStore()
  const toast = useToast()
  const [review, setReview] = useState<TestOrder | null>(null)
  const list = orders.filter((o) => statuses.includes(o.status))
  return (
    <Panel title={title}>
      <Table head={['Order', 'Patient', 'Tests', 'Updated', 'Status', '']} empty={list.length === 0}>
        {list.map((o) => (
          <tr key={o.id}>
            <td className="font-mono text-xs font-semibold">{o.id}</td>
            <td>{o.patientName}</td>
            <td className="max-w-56 text-muted-foreground">{o.testIds.map(serviceName).join(', ')}</td>
            <td className="whitespace-nowrap text-muted-foreground">{formatDateTime(o.updatedAt)}</td>
            <td><StatusBadge status={o.status} /></td>
            <td className="whitespace-nowrap text-right">
              {o.status === 'Result Entered' && <Button size="sm" onClick={() => setReview(o)}><ClipboardCheck className="size-3.5" aria-hidden /> Review</Button>}
              {o.status === 'Approved' && (
                <Button size="sm" onClick={() => { advanceOrder(o.id, 'Released', session!.name); toast({ tone: 'success', title: 'Report released', description: `${o.patientName} has been notified (demo).` }) }}>
                  <Send className="size-3.5" aria-hidden /> Release
                </Button>
              )}
              {o.status === 'Released' && <span className="text-xs text-muted-foreground">by {o.approver}</span>}
            </td>
          </tr>
        ))}
      </Table>
      <Review key={review?.id ?? 'none'} order={review} onClose={() => setReview(null)} />
    </Panel>
  )
}

function Overview() {
  const { orders } = useDemoStore()
  return (
    <div className="space-y-6">
      <DemoNotice>Only authorised approvers can approve and release reports. Patients see reports only after release.</DemoNotice>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardCheck} label="Awaiting review" value={orders.filter((o) => o.status === 'Result Entered').length} tone="warning" />
        <StatCard icon={FileCheck2} label="Approved, not released" value={orders.filter((o) => o.status === 'Approved').length} />
        <StatCard icon={FileWarning} label="Corrections pending" value={orders.filter((o) => o.status === 'Correction Requested').length} tone="destructive" />
      </div>
      <Queue statuses={['Result Entered', 'Approved']} title="Action required" />
    </div>
  )
}

export function ApproverView() {
  const { orders } = useDemoStore()
  return (
    <DashboardShell
      role="approver"
      sections={[
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, render: () => <Overview /> },
        { id: 'review', label: 'Review queue', icon: ClipboardCheck, render: () => <Queue statuses={['Result Entered']} title="Results awaiting review" />, badge: orders.filter((o) => o.status === 'Result Entered').length },
        { id: 'release', label: 'Release reports', icon: Send, render: () => <Queue statuses={['Approved']} title="Approved reports ready to release" /> },
        { id: 'corrections', label: 'Corrections', icon: FileWarning, render: () => <Queue statuses={['Correction Requested']} title="Sent back for correction" /> },
        { id: 'released', label: 'Released', icon: FileCheck2, render: () => <Queue statuses={['Released']} title="Released reports" /> },
      ]}
    />
  )
}
