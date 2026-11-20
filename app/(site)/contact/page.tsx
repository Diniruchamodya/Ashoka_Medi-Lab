import type { Metadata } from 'next'
import { PageHero } from '@/components/shared/ui'
import { ContactSection } from '@/components/site/contact-section'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Ashoka Medi-Lab — phone, WhatsApp, email, branch contacts and directions.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact us" title="We’re here to help" description="Questions about a test, a report or a booking? Reach out by phone, WhatsApp or the form below." />
      <ContactSection />
    </>
  )
}
