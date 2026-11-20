'use client'

import { AdminView } from '@/components/dashboard/admin-view'
import { ApproverView } from '@/components/dashboard/approver-view'
import { ManagerView } from '@/components/dashboard/manager-view'
import { PatientView } from '@/components/dashboard/patient-view'
import { ReceptionView } from '@/components/dashboard/reception-view'
import { TechnicianView } from '@/components/dashboard/technician-view'
import type { Role } from '@/lib/demo-data'

const views: Record<Role, () => React.ReactNode> = {
  'super-admin': AdminView,
  'branch-manager': ManagerView,
  receptionist: ReceptionView,
  technician: TechnicianView,
  approver: ApproverView,
  patient: PatientView,
}

export function DashboardRouter({ role }: { role: Role }) {
  const View = views[role]
  return <View />
}
