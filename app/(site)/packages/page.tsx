import type { Metadata } from 'next'
import { PageHero } from '@/components/shared/ui'
import { PackagesGrid } from '@/components/site/packages-grid'

export const metadata: Metadata = {
  title: 'Test Packages',
  description: 'Health check-up packages from Ashoka Medi-Lab — diabetes, heart, thyroid, fever and comprehensive wellness panels.',
}

export default function PackagesPage() {
  return (
    <>
      <PageHero eyebrow="Test packages" title="Health packages for every stage of life" description="Bundled tests designed around common health needs. Book online and visit your preferred branch." />
      <PackagesGrid />
    </>
  )
}
