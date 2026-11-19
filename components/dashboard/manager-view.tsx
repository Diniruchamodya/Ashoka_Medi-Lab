'use client'

import { BarChart3, Building2, CalendarDays, FileCheck2, LayoutDashboard, Pencil, Plus, TestTubes, Users } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { DashboardShell } from '@/components/dashboard/shell'
import { BranchForm, StaffForm } from '@/components/dashboard/admin-view'
import { AppointmentsPanel, OrdersPanel, weeklyKeysFor } from '@/components/dashboard/shared'
import { Panel, StatCard, StatusPie, Table, VolumeChart } from '@/components/dashboard/widgets'
import { DemoNotice, Modal, StatusBadge } from '@/components/shared/ui'
import { useToast } from '@/components/shared/toast'
import { type StaffUser, demoWeeklyVolume, isoDate, roleLabels } from '@/lib/demo-data'

function useBranchScope() {
  const store = useDemoStore()
  const branchId = store.session!.branchId
  return {
    ...store,
    branchId,
    actor: store.session!.name,
    branch: store.branches.find((b) => b.id === branchId)!,
    appts: store.appointments.filter((a) => a.branchId === branchId),
    orders: store.orders.filter((o) => o.branchId === branchId || o.processingBranchId === branchId),
    team: store.staff.filter((u) => u.branchId === branchId),
  }
}

function Overview() {
  const { appts, orders, branch, branchId, team } = useBranchScope()
  const today = appts.filter((a) => a.date === isoDate(0))
  return (
    <div className="space-y-6">
      <DemoNotice>You can only view and manage data for {branch.name}. All figures are demo data.</DemoNotice>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarDays} label="Today’s appointments" value={today.length} hint={`${appts.length} total`} />
        <StatCard icon={TestTubes} label="Samples in progress" value={orders.filter((o) => !['Approved', 'Released'].includes(o.status)).length} tone="warning" />
        <StatCard icon={FileCheck2} label="Reports released" value={orders.filter((o) => o.status === 'Released').length} tone="success" />
        <StatCard icon={Users} label="Active staff" value={team.filter((u) => u.active).length} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Weekly sample volume"><VolumeChart data={demoWeeklyVolume} keys={weeklyKeysFor(branchId)} /></Panel>
        <Panel title="Orders by status"><StatusPie orders={orders} /></Panel>
      </div>
    </div>
  )
}

function BranchInfo() {
  const { branch, actor } = useBranchScope()
  const [editing, setEditing] = useState(false)
  return (
    <Panel title="Branch information" action={<Button size="sm" variant="outline" onClick={() => setEditing(true)}><Pencil className="size-4" aria-hidden /> Edit</Button>}>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        {[['Name', branch.name], ['Address', branch.address], ['Phone', branch.phone], ['Opening hours', branch.hours], ['Services', branch.services.join(', ')]].map(([k, v]) => (
          <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v || '—'}</dd></div>
        ))}
        <div><dt className="text-muted-foreground">Status</dt><dd className="mt-1"><StatusBadge status={branch.active ? 'Active' : 'Inactive'} /></dd></div>
      </dl>
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit branch information">
        {editing && <BranchForm branch={branch} onClose={() => setEditing(false)} actor={actor} lockType />}
      </Modal>
    </Panel>
  )
}

function Staff() {
  const { team, branchId, actor, dispatch, log } = useBranchScope()
  const toast = useToast()
  const [editing, setEditing] = useState<StaffUser | null | undefined>(undefined)
  return (
    <Panel title="Branch staff" action={<Button size="sm" onClick={() => setEditing(null)}><Plus className="size-4" aria-hidden /> Add staff</Button>}>
      <Table head={['Name', 'Role', 'Status', '']}>
        {team.map((u) => (
          <tr key={u.id}>
            <td><span className="font-semibold">{u.name}</span><span className="block text-xs text-muted-foreground">{u.email}</span></td>
            <td>{roleLabels[u.role]}</td>
            <td><StatusBadge status={u.active ? 'Active' : 'Inactive'} /></td>
            <td className="whitespace-nowrap text-right">
              {['receptionist', 'technician'].includes(u.role) && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(u)} aria-label={`Edit ${u.name}`}><Pencil className="size-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => { dispatch({ type: 'upsertStaff', user: { ...u, active: !u.active } }); log(actor, `${u.active ? 'Disabled' : 'Enabled'} ${u.email}`); toast({ tone: 'success', title: 'Staff updated' }) }}>
                    {u.active ? 'Disable' : 'Enable'}
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </Table>
      <Modal open={editing !== undefined} onClose={() => setEditing(undefined)} title={editing ? 'Edit staff' : 'Add staff'}>
        {editing !== undefined && <StaffForm key={editing?.id ?? 'new'} user={editing} onClose={() => setEditing(undefined)} actor={actor} allowedRoles={['receptionist', 'technician']} fixedBranch={branchId} />}
      </Modal>
    </Panel>
  )
}

function Reports() {
  const { appts, orders, payments, branchId } = useBranchScope()
  const paid = payments.filter((p) => p.branchId === branchId && p.status === 'Paid')
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarDays} label="Online bookings" value={appts.filter((a) => a.source === 'Online').length} hint={`${appts.filter((a) => a.source === 'Walk-in').length} walk-ins`} />
        <StatCard icon={TestTubes} label="Transferred to main lab" value={orders.filter((o) => o.branchId === branchId && o.processingBranchId !== branchId).length} />
        <StatCard icon={BarChart3} label="Payments recorded" value={paid.length} hint={paid.length ? `LKR ${paid.reduce((s, p) => s + p.amount, 0).toLocaleString()} (demo)` : 'Demo data'} tone="success" />
      </div>
      <Panel title="Weekly volume"><VolumeChart data={demoWeeklyVolume} keys={weeklyKeysFor(branchId)} /></Panel>
    </div>
  )
}

export function ManagerView() {
  const { session } = useDemoStore()
  return (
    <DashboardShell
      role="branch-manager"
      sections={[
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, render: () => <Overview /> },
        { id: 'branch', label: 'Branch information', icon: Building2, render: () => <BranchInfo /> },
        { id: 'appointments', label: 'Appointments', icon: CalendarDays, render: () => <ManagerAppointments /> },
        { id: 'samples', label: 'Samples & operations', icon: TestTubes, render: () => <ManagerSamples /> },
        { id: 'staff', label: 'Staff', icon: Users, render: () => <Staff /> },
        { id: 'reports', label: 'Branch reports', icon: BarChart3, render: () => <Reports /> },
      ].filter(() => !!session)}
    />
  )
}

function ManagerAppointments() {
  const { appts, actor } = useBranchScope()
  return <AppointmentsPanel appointments={appts} manage actor={actor} />
}
function ManagerSamples() {
  const { orders, actor } = useBranchScope()
  return <OrdersPanel orders={orders} canTransfer actor={actor} />
}
