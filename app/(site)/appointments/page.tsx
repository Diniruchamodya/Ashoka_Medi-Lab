import type { Metadata } from 'next'
import { Clock, FileText, Phone, Utensils } from 'lucide-react'
import { BookingFormWithParams } from '@/components/booking/booking-form-with-params'
import { PageHero } from '@/components/shared/ui'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Book a laboratory appointment online at Ashoka Medi-Lab — choose your branch, tests, date and time.',
}

const tips = [
  { icon: Utensils, title: 'Fasting tests', text: 'Fast for 8–12 hours (water is fine) for tests such as fasting sugar and lipid profile.' },
  { icon: FileText, title: 'Bring with you', text: 'Your ID, doctor’s request form and any previous reports.' },
  { icon: Clock, title: 'Arrive early', text: 'Please arrive 10 minutes before your selected time slot.' },
]

export default function AppointmentsPage() {
  return (
    <>
      <PageHero eyebrow="Appointments" title="Book your laboratory visit online" description="Choose your preferred branch, tests, date and time. It only takes a minute." />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1fr_320px]">
        <BookingFormWithParams />
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {tips.map((t) => (
            <div key={t.title} className="flex gap-3 rounded-2xl border bg-card p-5">
              <t.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <h2 className="font-semibold">{t.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <Phone className="size-5" aria-hidden />
            <p className="mt-2 font-semibold">Prefer to call?</p>
            <p className="text-sm text-primary-foreground/85">{siteConfig.phone}</p>
          </div>
        </aside>
      </section>
    </>
  )
}
