import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DashboardRouter } from '@/components/dashboard/dashboard-router'
import { type Role, roleLabels } from '@/lib/demo-data'

const roles = Object.keys(roleLabels) as Role[]

export function generateStaticParams() {
  return roles.map((role) => ({ role }))
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role } = await params
  return { title: `${roleLabels[role as Role] ?? 'Dashboard'} dashboard`, robots: { index: false } }
}

export default async function DashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  if (!roles.includes(role as Role)) notFound()
  return <DashboardRouter role={role as Role} />
}
