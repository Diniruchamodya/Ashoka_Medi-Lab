import type { Role } from '@/lib/demo-data'

export type Permission =
  | 'branches:manage'
  | 'users:manage'
  | 'catalog:manage'
  | 'analytics:all'
  | 'monitor:all'
  | 'audit:view'
  | 'branch:edit-own'
  | 'appointments:branch'
  | 'staff:branch'
  | 'samples:branch'
  | 'analytics:branch'
  | 'samples:transfer'
  | 'patients:register'
  | 'appointments:create'
  | 'orders:create'
  | 'checkin'
  | 'payments:record'
  | 'orders:assigned'
  | 'results:enter'
  | 'status:update'
  | 'results:review'
  | 'reports:approve'
  | 'reports:release'
  | 'profile:own'
  | 'appointments:own'
  | 'reports:own'

export const rolePermissions: Record<Role, Permission[]> = {
  'super-admin': ['branches:manage', 'users:manage', 'catalog:manage', 'analytics:all', 'monitor:all', 'audit:view', 'samples:transfer'],
  'branch-manager': ['branch:edit-own', 'appointments:branch', 'staff:branch', 'samples:branch', 'analytics:branch', 'samples:transfer'],
  receptionist: ['patients:register', 'appointments:create', 'orders:create', 'checkin', 'payments:record'],
  technician: ['orders:assigned', 'results:enter', 'status:update', 'samples:transfer'],
  approver: ['results:review', 'reports:approve', 'reports:release'],
  patient: ['profile:own', 'appointments:own', 'reports:own'],
}

export const permissionLabels: Record<Permission, string> = {
  'branches:manage': 'Manage all branches',
  'users:manage': 'Manage users & permissions',
  'catalog:manage': 'Manage services & packages',
  'analytics:all': 'Centralised analytics',
  'monitor:all': 'Monitor all operations',
  'audit:view': 'View audit log',
  'branch:edit-own': 'Edit assigned branch',
  'appointments:branch': 'Manage branch appointments',
  'staff:branch': 'Manage branch staff',
  'samples:branch': 'Monitor branch samples',
  'analytics:branch': 'Branch analytics',
  'samples:transfer': 'Transfer samples',
  'patients:register': 'Register patients',
  'appointments:create': 'Create appointments',
  'orders:create': 'Create test orders',
  checkin: 'Patient check-in',
  'payments:record': 'Invoices & payments',
  'orders:assigned': 'View assigned orders',
  'results:enter': 'Enter test results',
  'status:update': 'Update processing status',
  'results:review': 'Review results',
  'reports:approve': 'Approve reports',
  'reports:release': 'Release reports',
  'profile:own': 'Manage own profile',
  'appointments:own': 'Own appointments',
  'reports:own': 'Download own reports',
}

/** Roles whose data access is restricted to their assigned branch. */
export const branchScopedRoles: Role[] = ['branch-manager', 'receptionist', 'technician']

export function can(role: Role | undefined, permission: Permission) {
  return !!role && rolePermissions[role].includes(permission)
}
