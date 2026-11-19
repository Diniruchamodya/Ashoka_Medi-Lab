/**
 * DEMO DATA — all records below are sample data for demonstration only.
 * Branch names/addresses, prices and contacts are placeholders.
 */

export type Role =
  | 'super-admin'
  | 'branch-manager'
  | 'receptionist'
  | 'technician'
  | 'approver'
  | 'patient'

export const roleLabels: Record<Role, string> = {
  'super-admin': 'Super Admin',
  'branch-manager': 'Branch Manager',
  receptionist: 'Receptionist',
  technician: 'Lab Technician',
  approver: 'Report Approver',
  patient: 'Patient',
}

export type Branch = {
  id: string
  name: string
  type: 'main' | 'branch' | 'collection'
  address: string
  phone: string
  hours: string
  mapsQuery: string
  services: string[]
  active: boolean
}

export type ServiceCategory =
  | 'Haematology'
  | 'Biochemistry'
  | 'Hormones'
  | 'Microbiology'
  | 'Urine & Stool'
  | 'Immunology'

export type LabService = {
  id: string
  name: string
  code: string
  category: ServiceCategory
  sample: string
  turnaround: string
  fasting: boolean
  description: string
  price: number | null
  active: boolean
}

export type TestPackage = {
  id: string
  name: string
  audience: string
  description: string
  testIds: string[]
  price: number | null
  featured?: boolean
  active: boolean
}

export type Patient = {
  id: string
  name: string
  phone: string
  email: string
  dob: string
  gender: 'Female' | 'Male' | 'Other'
  branchId: string
}

export type AppointmentStatus = 'Booked' | 'Checked-in' | 'Completed' | 'Cancelled'

export type Appointment = {
  id: string
  patientId: string
  patientName: string
  branchId: string
  date: string
  time: string
  testIds: string[]
  packageId?: string
  status: AppointmentStatus
  source: 'Online' | 'Walk-in'
  createdAt: string
}

export type OrderStatus =
  | 'Ordered'
  | 'Sample Collected'
  | 'In Transit'
  | 'Processing'
  | 'Result Entered'
  | 'Correction Requested'
  | 'Approved'
  | 'Released'

export const orderFlow: OrderStatus[] = [
  'Ordered',
  'Sample Collected',
  'In Transit',
  'Processing',
  'Result Entered',
  'Approved',
  'Released',
]

export type TestResult = { testId: string; value: string; unit: string; reference: string; flag?: 'H' | 'L' }

export type TestOrder = {
  id: string
  appointmentId?: string
  patientId: string
  patientName: string
  branchId: string
  processingBranchId: string
  testIds: string[]
  status: OrderStatus
  sampleId?: string
  technician?: string
  results: TestResult[]
  approver?: string
  correctionNote?: string
  updatedAt: string
  createdAt: string
}

export type Payment = {
  id: string
  orderId: string
  patientName: string
  branchId: string
  amount: number
  method: 'Cash' | 'Card' | 'Online'
  status: 'Paid' | 'Pending'
  date: string
}

export type StaffUser = {
  id: string
  name: string
  email: string
  role: Role
  branchId: string
  active: boolean
}

export type AuditEntry = { id: string; at: string; actor: string; action: string }

export const demoBranches: Branch[] = [
  {
    id: 'br-main',
    name: 'Main Laboratory',
    type: 'main',
    address: '[Main laboratory address]',
    phone: '[Main lab phone]',
    hours: '[Mon–Sat, opening hours]',
    mapsQuery: 'Ashoka Medi-Lab',
    services: ['Full test menu', 'Sample processing', 'Report approval', 'Home collection'],
    active: true,
  },
  {
    id: 'br-2',
    name: 'Branch 02 (Demo)',
    type: 'branch',
    address: '[Branch 02 address]',
    phone: '[Branch 02 phone]',
    hours: '[Opening hours]',
    mapsQuery: 'Ashoka Medi-Lab',
    services: ['Sample collection', 'Routine haematology', 'Biochemistry'],
    active: true,
  },
  {
    id: 'br-3',
    name: 'Branch 03 (Demo)',
    type: 'branch',
    address: '[Branch 03 address]',
    phone: '[Branch 03 phone]',
    hours: '[Opening hours]',
    mapsQuery: 'Ashoka Medi-Lab',
    services: ['Sample collection', 'Urine & stool', 'ECG (if available)'],
    active: true,
  },
  {
    id: 'br-4',
    name: 'Collection Centre 04 (Demo)',
    type: 'collection',
    address: '[Collection centre address]',
    phone: '[Collection centre phone]',
    hours: '[Opening hours]',
    mapsQuery: 'Ashoka Medi-Lab',
    services: ['Sample collection only'],
    active: true,
  },
]

export const demoServices: LabService[] = [
  { id: 't-fbc', name: 'Full Blood Count', code: 'FBC', category: 'Haematology', sample: 'EDTA blood', turnaround: 'Same day', fasting: false, description: 'Measures red cells, white cells, haemoglobin and platelets to screen for anaemia, infection and other conditions.', price: null, active: true },
  { id: 't-esr', name: 'Erythrocyte Sedimentation Rate', code: 'ESR', category: 'Haematology', sample: 'EDTA blood', turnaround: 'Same day', fasting: false, description: 'A non-specific marker of inflammation in the body.', price: null, active: true },
  { id: 't-fbs', name: 'Fasting Blood Sugar', code: 'FBS', category: 'Biochemistry', sample: 'Fluoride blood', turnaround: 'Same day', fasting: true, description: 'Measures blood glucose after fasting to screen for and monitor diabetes.', price: null, active: true },
  { id: 't-hba1c', name: 'HbA1c', code: 'HBA1C', category: 'Biochemistry', sample: 'EDTA blood', turnaround: '1 day', fasting: false, description: 'Reflects average blood sugar over the past 2–3 months.', price: null, active: true },
  { id: 't-lipid', name: 'Lipid Profile', code: 'LIPID', category: 'Biochemistry', sample: 'Serum', turnaround: 'Same day', fasting: true, description: 'Total cholesterol, HDL, LDL and triglycerides to assess heart health.', price: null, active: true },
  { id: 't-lft', name: 'Liver Function Tests', code: 'LFT', category: 'Biochemistry', sample: 'Serum', turnaround: 'Same day', fasting: false, description: 'Evaluates liver enzymes, proteins and bilirubin.', price: null, active: true },
  { id: 't-rft', name: 'Renal Function Tests', code: 'RFT', category: 'Biochemistry', sample: 'Serum', turnaround: 'Same day', fasting: false, description: 'Creatinine, urea and electrolytes to assess kidney function.', price: null, active: true },
  { id: 't-tsh', name: 'Thyroid Stimulating Hormone', code: 'TSH', category: 'Hormones', sample: 'Serum', turnaround: '1 day', fasting: false, description: 'Primary screening test for thyroid function.', price: null, active: true },
  { id: 't-ft4', name: 'Free T4', code: 'FT4', category: 'Hormones', sample: 'Serum', turnaround: '1 day', fasting: false, description: 'Measures the active thyroid hormone thyroxine.', price: null, active: true },
  { id: 't-vitd', name: 'Vitamin D (25-OH)', code: 'VITD', category: 'Hormones', sample: 'Serum', turnaround: '2 days', fasting: false, description: 'Assesses vitamin D status for bone and immune health.', price: null, active: true },
  { id: 't-urine', name: 'Urine Full Report', code: 'UFR', category: 'Urine & Stool', sample: 'Urine', turnaround: 'Same day', fasting: false, description: 'Physical, chemical and microscopic examination of urine.', price: null, active: true },
  { id: 't-culture', name: 'Urine Culture & ABST', code: 'UCUL', category: 'Microbiology', sample: 'Urine (sterile)', turnaround: '2–3 days', fasting: false, description: 'Identifies urinary infections and the most effective antibiotics.', price: null, active: true },
  { id: 't-crp', name: 'C-Reactive Protein', code: 'CRP', category: 'Immunology', sample: 'Serum', turnaround: 'Same day', fasting: false, description: 'Detects inflammation and infection.', price: null, active: true },
  { id: 't-dengue', name: 'Dengue NS1 Antigen', code: 'NS1', category: 'Immunology', sample: 'Serum', turnaround: 'Same day', fasting: false, description: 'Early detection of dengue infection.', price: null, active: true },
]

export const demoPackages: TestPackage[] = [
  { id: 'p-basic', name: 'Essential Health Check', audience: 'Adults – annual screening', description: 'A foundational screening covering blood count, sugar and urine.', testIds: ['t-fbc', 't-fbs', 't-urine'], price: null, active: true },
  { id: 'p-diabetes', name: 'Diabetes Care Panel', audience: 'People living with or at risk of diabetes', description: 'Monitor blood sugar control and related kidney health.', testIds: ['t-fbs', 't-hba1c', 't-rft', 't-urine'], price: null, featured: true, active: true },
  { id: 'p-heart', name: 'Heart Health Panel', audience: 'Adults 30+', description: 'Assess cardiovascular risk with lipids and inflammation markers.', testIds: ['t-lipid', 't-crp', 't-fbs'], price: null, active: true },
  { id: 'p-full', name: 'Comprehensive Wellness', audience: 'Complete yearly check-up', description: 'A broad overview of blood, liver, kidney, thyroid and metabolic health.', testIds: ['t-fbc', 't-fbs', 't-lipid', 't-lft', 't-rft', 't-tsh', 't-urine'], price: null, featured: true, active: true },
  { id: 'p-thyroid', name: 'Thyroid Panel', audience: 'Fatigue, weight changes, follow-up', description: 'Evaluate thyroid gland function.', testIds: ['t-tsh', 't-ft4'], price: null, active: true },
  { id: 'p-fever', name: 'Fever Panel', audience: 'Acute fever investigation', description: 'Investigate common causes of fever.', testIds: ['t-fbc', 't-crp', 't-dengue', 't-urine'], price: null, active: true },
]

export const demoPatients: Patient[] = [
  { id: 'pt-1001', name: 'Demo Patient – Nimali P.', phone: '07X XXX XXXX', email: 'patient@example.com', dob: '1986-04-12', gender: 'Female', branchId: 'br-main' },
  { id: 'pt-1002', name: 'Demo Patient – Kasun R.', phone: '07X XXX XXXX', email: 'kasun@example.com', dob: '1974-09-30', gender: 'Male', branchId: 'br-2' },
  { id: 'pt-1003', name: 'Demo Patient – Fathima S.', phone: '07X XXX XXXX', email: 'fathima@example.com', dob: '1992-01-08', gender: 'Female', branchId: 'br-3' },
  { id: 'pt-1004', name: 'Demo Patient – Ravi K.', phone: '07X XXX XXXX', email: 'ravi@example.com', dob: '1965-11-21', gender: 'Male', branchId: 'br-main' },
  { id: 'pt-1005', name: 'Demo Patient – Dilani W.', phone: '07X XXX XXXX', email: 'dilani@example.com', dob: '2001-06-17', gender: 'Female', branchId: 'br-4' },
]

export const demoStaff: StaffUser[] = [
  { id: 'u-1', name: 'Demo Super Admin', email: 'admin@example.com', role: 'super-admin', branchId: 'br-main', active: true },
  { id: 'u-2', name: 'Demo Manager (Main)', email: 'manager.main@example.com', role: 'branch-manager', branchId: 'br-main', active: true },
  { id: 'u-3', name: 'Demo Manager (Branch 02)', email: 'manager.b2@example.com', role: 'branch-manager', branchId: 'br-2', active: true },
  { id: 'u-4', name: 'Demo Receptionist', email: 'reception@example.com', role: 'receptionist', branchId: 'br-main', active: true },
  { id: 'u-5', name: 'Demo Technician A', email: 'tech.a@example.com', role: 'technician', branchId: 'br-main', active: true },
  { id: 'u-6', name: 'Demo Technician B', email: 'tech.b@example.com', role: 'technician', branchId: 'br-2', active: true },
  { id: 'u-7', name: 'Demo Pathologist', email: 'approver@example.com', role: 'approver', branchId: 'br-main', active: true },
  { id: 'u-8', name: 'Demo Receptionist (B03)', email: 'reception.b3@example.com', role: 'receptionist', branchId: 'br-3', active: false },
]

const today = new Date()
export function isoDate(offsetDays = 0) {
  const d = new Date(today)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export const demoAppointments: Appointment[] = [
  { id: 'AP-2401', patientId: 'pt-1001', patientName: 'Demo Patient – Nimali P.', branchId: 'br-main', date: isoDate(0), time: '08:00', testIds: ['t-fbc', 't-fbs'], status: 'Checked-in', source: 'Online', createdAt: isoDate(-2) },
  { id: 'AP-2402', patientId: 'pt-1002', patientName: 'Demo Patient – Kasun R.', branchId: 'br-2', date: isoDate(0), time: '08:30', testIds: ['t-lipid', 't-crp', 't-fbs'], packageId: 'p-heart', status: 'Booked', source: 'Online', createdAt: isoDate(-1) },
  { id: 'AP-2403', patientId: 'pt-1003', patientName: 'Demo Patient – Fathima S.', branchId: 'br-3', date: isoDate(0), time: '09:15', testIds: ['t-tsh', 't-ft4'], packageId: 'p-thyroid', status: 'Booked', source: 'Walk-in', createdAt: isoDate(0) },
  { id: 'AP-2404', patientId: 'pt-1004', patientName: 'Demo Patient – Ravi K.', branchId: 'br-main', date: isoDate(1), time: '07:45', testIds: ['t-fbs', 't-hba1c', 't-rft', 't-urine'], packageId: 'p-diabetes', status: 'Booked', source: 'Online', createdAt: isoDate(-1) },
  { id: 'AP-2405', patientId: 'pt-1005', patientName: 'Demo Patient – Dilani W.', branchId: 'br-4', date: isoDate(-1), time: '10:00', testIds: ['t-fbc', 't-dengue'], status: 'Completed', source: 'Walk-in', createdAt: isoDate(-1) },
  { id: 'AP-2406', patientId: 'pt-1001', patientName: 'Demo Patient – Nimali P.', branchId: 'br-main', date: isoDate(-14), time: '08:15', testIds: ['t-vitd'], status: 'Completed', source: 'Online', createdAt: isoDate(-16) },
  { id: 'AP-2407', patientId: 'pt-1002', patientName: 'Demo Patient – Kasun R.', branchId: 'br-2', date: isoDate(-3), time: '11:00', testIds: ['t-urine'], status: 'Cancelled', source: 'Online', createdAt: isoDate(-5) },
]

const range = (v: string, unit: string, reference: string, testId: string, flag?: 'H' | 'L'): TestResult => ({ testId, value: v, unit, reference, flag })

export const demoOrders: TestOrder[] = [
  { id: 'ORD-5101', appointmentId: 'AP-2401', patientId: 'pt-1001', patientName: 'Demo Patient – Nimali P.', branchId: 'br-main', processingBranchId: 'br-main', testIds: ['t-fbc', 't-fbs'], status: 'Processing', sampleId: 'SMP-88121', technician: 'Demo Technician A', results: [], updatedAt: isoDate(0), createdAt: isoDate(0) },
  { id: 'ORD-5102', appointmentId: 'AP-2405', patientId: 'pt-1005', patientName: 'Demo Patient – Dilani W.', branchId: 'br-4', processingBranchId: 'br-main', testIds: ['t-fbc', 't-dengue'], status: 'Result Entered', sampleId: 'SMP-88102', technician: 'Demo Technician A', results: [range('11.8', 'g/dL', '12.0 – 15.5', 't-fbc', 'L'), range('Negative', '', 'Negative', 't-dengue')], updatedAt: isoDate(0), createdAt: isoDate(-1) },
  { id: 'ORD-5103', appointmentId: 'AP-2406', patientId: 'pt-1001', patientName: 'Demo Patient – Nimali P.', branchId: 'br-main', processingBranchId: 'br-main', testIds: ['t-vitd'], status: 'Released', sampleId: 'SMP-87410', technician: 'Demo Technician A', approver: 'Demo Pathologist', results: [range('24', 'ng/mL', '30 – 100', 't-vitd', 'L')], updatedAt: isoDate(-13), createdAt: isoDate(-14) },
  { id: 'ORD-5104', patientId: 'pt-1003', patientName: 'Demo Patient – Fathima S.', branchId: 'br-3', processingBranchId: 'br-main', testIds: ['t-tsh', 't-ft4'], status: 'In Transit', sampleId: 'SMP-88130', results: [], updatedAt: isoDate(0), createdAt: isoDate(0) },
  { id: 'ORD-5105', patientId: 'pt-1002', patientName: 'Demo Patient – Kasun R.', branchId: 'br-2', processingBranchId: 'br-2', testIds: ['t-lipid', 't-crp', 't-fbs'], status: 'Ordered', results: [], updatedAt: isoDate(0), createdAt: isoDate(0) },
  { id: 'ORD-5106', patientId: 'pt-1004', patientName: 'Demo Patient – Ravi K.', branchId: 'br-main', processingBranchId: 'br-main', testIds: ['t-hba1c'], status: 'Approved', sampleId: 'SMP-88044', technician: 'Demo Technician A', approver: 'Demo Pathologist', results: [range('7.2', '%', '4.0 – 5.6', 't-hba1c', 'H')], updatedAt: isoDate(-1), createdAt: isoDate(-2) },
]

export const demoPayments: Payment[] = [
  { id: 'INV-3301', orderId: 'ORD-5101', patientName: 'Demo Patient – Nimali P.', branchId: 'br-main', amount: 0, method: 'Cash', status: 'Paid', date: isoDate(0) },
  { id: 'INV-3302', orderId: 'ORD-5102', patientName: 'Demo Patient – Dilani W.', branchId: 'br-4', amount: 0, method: 'Card', status: 'Paid', date: isoDate(-1) },
  { id: 'INV-3303', orderId: 'ORD-5105', patientName: 'Demo Patient – Kasun R.', branchId: 'br-2', amount: 0, method: 'Cash', status: 'Pending', date: isoDate(0) },
]

/** Sample volume trend for analytics charts (demo figures). */
export const demoWeeklyVolume = [
  { day: 'Mon', main: 64, b2: 28, b3: 21, c4: 12 },
  { day: 'Tue', main: 71, b2: 31, b3: 19, c4: 15 },
  { day: 'Wed', main: 58, b2: 26, b3: 24, c4: 11 },
  { day: 'Thu', main: 77, b2: 34, b3: 22, c4: 14 },
  { day: 'Fri', main: 82, b2: 36, b3: 27, c4: 18 },
  { day: 'Sat', main: 69, b2: 30, b3: 25, c4: 16 },
]

export function formatPrice(price: number | null) {
  if (price === null || price === 0) return 'Price on request'
  return `LKR ${price.toLocaleString()}`
}
