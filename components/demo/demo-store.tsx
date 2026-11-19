'use client'

import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import {
  type Appointment,
  type AuditEntry,
  type Branch,
  type LabService,
  type OrderStatus,
  type Patient,
  type Payment,
  type Role,
  type StaffUser,
  type TestOrder,
  type TestPackage,
  type TestResult,
  demoAppointments,
  demoBranches,
  demoOrders,
  demoPackages,
  demoPatients,
  demoPayments,
  demoServices,
  demoStaff,
} from '@/lib/demo-data'

export type Session = { role: Role; userId: string; name: string; branchId: string } | null

export type Notification = { id: string; patientId: string; message: string; at: string; read: boolean }

type State = {
  branches: Branch[]
  services: LabService[]
  packages: TestPackage[]
  patients: Patient[]
  appointments: Appointment[]
  orders: TestOrder[]
  payments: Payment[]
  staff: StaffUser[]
  audit: AuditEntry[]
  notifications: Notification[]
  session: Session
}

type Action =
  | { type: 'upsertBranch'; branch: Branch }
  | { type: 'upsertService'; service: LabService }
  | { type: 'upsertPackage'; pkg: TestPackage }
  | { type: 'upsertStaff'; user: StaffUser }
  | { type: 'addPatient'; patient: Patient }
  | { type: 'updatePatient'; patient: Patient }
  | { type: 'addAppointment'; appointment: Appointment }
  | { type: 'setAppointmentStatus'; id: string; status: Appointment['status'] }
  | { type: 'addOrder'; order: TestOrder }
  | { type: 'updateOrder'; id: string; patch: Partial<TestOrder> }
  | { type: 'addPayment'; payment: Payment }
  | { type: 'setPaymentStatus'; id: string; status: Payment['status']; method?: Payment['method']; amount?: number }
  | { type: 'audit'; actor: string; action: string }
  | { type: 'notify'; patientId: string; message: string }
  | { type: 'readNotifications'; patientId: string }
  | { type: 'setSession'; session: Session }

const now = () => new Date().toISOString()
let counter = 6000
export const nextId = (prefix: string) => `${prefix}-${++counter}`

function upsert<T extends { id: string }>(list: T[], item: T) {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list]
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'upsertBranch':
      return { ...state, branches: upsert(state.branches, action.branch) }
    case 'upsertService':
      return { ...state, services: upsert(state.services, action.service) }
    case 'upsertPackage':
      return { ...state, packages: upsert(state.packages, action.pkg) }
    case 'upsertStaff':
      return { ...state, staff: upsert(state.staff, action.user) }
    case 'addPatient':
      return { ...state, patients: [action.patient, ...state.patients] }
    case 'updatePatient':
      return { ...state, patients: upsert(state.patients, action.patient) }
    case 'addAppointment':
      return { ...state, appointments: [action.appointment, ...state.appointments] }
    case 'setAppointmentStatus':
      return {
        ...state,
        appointments: state.appointments.map((a) => (a.id === action.id ? { ...a, status: action.status } : a)),
      }
    case 'addOrder':
      return { ...state, orders: [action.order, ...state.orders] }
    case 'updateOrder':
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.id ? { ...o, ...action.patch, updatedAt: now() } : o)),
      }
    case 'addPayment':
      return { ...state, payments: [action.payment, ...state.payments] }
    case 'setPaymentStatus':
      return {
        ...state,
        payments: state.payments.map((p) =>
          p.id === action.id ? { ...p, status: action.status, method: action.method ?? p.method, amount: action.amount ?? p.amount } : p,
        ),
      }
    case 'audit':
      return {
        ...state,
        audit: [{ id: nextId('AUD'), at: now(), actor: action.actor, action: action.action }, ...state.audit].slice(0, 200),
      }
    case 'notify':
      return {
        ...state,
        notifications: [
          { id: nextId('NTF'), patientId: action.patientId, message: action.message, at: now(), read: false },
          ...state.notifications,
        ],
      }
    case 'setSession':
      return { ...state, session: action.session }
    case 'readNotifications':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.patientId === action.patientId ? { ...n, read: true } : n)),
      }
  }
}

const initialState: State = {
  branches: demoBranches,
  services: demoServices,
  packages: demoPackages,
  patients: demoPatients,
  appointments: demoAppointments,
  orders: demoOrders,
  payments: demoPayments,
  staff: demoStaff,
  audit: [
    { id: 'AUD-1', at: now(), actor: 'Demo Pathologist', action: 'Released report ORD-5103' },
    { id: 'AUD-2', at: now(), actor: 'Demo Technician A', action: 'Entered results for ORD-5102' },
  ],
  notifications: [
    {
      id: 'NTF-1',
      patientId: 'pt-1001',
      message: 'Your Vitamin D report (ORD-5103) is ready to download.',
      at: now(),
      read: false,
    },
  ],
  session: null,
}

type Ctx = State & {
  dispatch: React.Dispatch<Action>
  log: (actor: string, action: string) => void
  advanceOrder: (id: string, status: OrderStatus, actor: string, patch?: Partial<TestOrder>) => void
  enterResults: (id: string, results: TestResult[], actor: string) => void
  branchName: (id: string) => string
  serviceName: (id: string) => string
}

const DemoStoreContext = createContext<Ctx | null>(null)

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const log = useCallback((actor: string, action: string) => dispatch({ type: 'audit', actor, action }), [])

  const advanceOrder = useCallback(
    (id: string, status: OrderStatus, actor: string, patch?: Partial<TestOrder>) => {
      dispatch({ type: 'updateOrder', id, patch: { ...patch, status } })
      dispatch({ type: 'audit', actor, action: `Set ${id} → ${status}` })
      if (status === 'Released') {
        const order = state.orders.find((o) => o.id === id)
        if (order) dispatch({ type: 'notify', patientId: order.patientId, message: `Your report ${id} has been approved and is ready to download.` })
      }
    },
    [state.orders],
  )

  const enterResults = useCallback((id: string, results: TestResult[], actor: string) => {
    dispatch({ type: 'updateOrder', id, patch: { results, status: 'Result Entered', technician: actor, correctionNote: undefined } })
    dispatch({ type: 'audit', actor, action: `Entered results for ${id}` })
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      dispatch,
      log,
      advanceOrder,
      enterResults,
      branchName: (id) => state.branches.find((b) => b.id === id)?.name ?? 'Unknown branch',
      serviceName: (id) => state.services.find((s) => s.id === id)?.name ?? id,
    }),
    [state, log, advanceOrder, enterResults],
  )

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext)
  if (!ctx) throw new Error('useDemoStore must be used within DemoStoreProvider')
  return ctx
}
