import type { Metadata } from 'next'
import { PageHero } from '@/components/shared/ui'
import { BranchesExplorer } from '@/components/site/branches-explorer'

export const metadata: Metadata = {
  title: 'Our Branches',
  description: 'Find an Ashoka Medi-Lab branch near you — addresses, opening hours, directions and available services.',
}

export default function BranchesPage() {
  return (
    <>
      <PageHero eyebrow="Our branches" title="Find a laboratory near you" description="Every branch is connected to our main laboratory, so your results are processed and verified to the same standard." />
      <BranchesExplorer />
    </>
  )
}
