import type { Metadata } from 'next'
import { PageHero } from '@/components/shared/ui'
import { ServicesBrowser } from '@/components/site/services-browser'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Browse laboratory tests and diagnostic services at Ashoka Medi-Lab — haematology, biochemistry, hormones, microbiology and more.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Our services" title="Laboratory tests & diagnostic services" description="Search our test menu by name or category. Preparation and turnaround details are shown for each test." />
      <ServicesBrowser />
    </>
  )
}
