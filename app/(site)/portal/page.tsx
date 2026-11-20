import type { Metadata } from 'next'
import { PortalLogin } from '@/components/site/portal-login'

export const metadata: Metadata = {
  title: 'Patient Portal',
  description: 'Sign in to the Ashoka Medi-Lab patient portal to view appointments, track tests and download approved reports.',
}

export default function PortalPage() {
  return <PortalLogin />
}
