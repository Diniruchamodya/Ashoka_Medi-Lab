import type { Metadata } from 'next'
import { Eye, HeartHandshake, ShieldCheck, Target, Users, Microscope } from 'lucide-react'
import Image from 'next/image'
import { PageHero, Reveal, SectionHeading } from '@/components/shared/ui'
import { BookingCta } from '@/components/site/home-sections'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about Ashoka Medi-Lab — over ${siteConfig.yearsOfExperience} years of fast, accurate and affordable laboratory services.`,
}

const values = [
  { icon: Target, title: 'Our Mission', text: 'To deliver fast, accurate and affordable laboratory services that help patients and doctors make confident health decisions.' },
  { icon: Eye, title: 'Our Vision', text: 'To be the most trusted community laboratory network, known for quality, integrity and compassionate care.' },
  { icon: HeartHandshake, title: 'Our Promise', text: 'Every sample is handled with care and every report is verified by authorised professionals before release.' },
]

const commitments = [
  { icon: Microscope, title: 'Quality-controlled testing', text: 'Internal quality checks and calibrated equipment support reliable, reproducible results.' },
  { icon: ShieldCheck, title: 'Protected medical data', text: 'Role-based access, audit trails and secure report delivery keep your information private.' },
  { icon: Users, title: 'Experienced team', text: 'Qualified laboratory professionals dedicated to accuracy and patient comfort.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Ashoka Medi-Lab" title={`${siteConfig.yearsOfExperience}+ years of trusted laboratory care`} description={siteConfig.description} />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
            <Image src="/images/about-lab.png" alt="Rack of blood sample tubes being processed by an automated laboratory analyser" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <div>
          <SectionHeading eyebrow="Our story" title="Built on decades of dedication" />
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              For more than {siteConfig.yearsOfExperience} years, Ashoka Medi-Lab has supported the health of individuals, families and doctors through dependable laboratory testing.
              What began as a single laboratory has grown into a connected network of branches, all linked to our main laboratory.
            </p>
            <p>[Add your founding year, founder story and key milestones here.]</p>
            <p>
              Today, we combine modern laboratory practices with the personal care our patients have come to expect — making quality diagnostics accessible and affordable.
            </p>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t pt-8">
            <div>
              <dt className="text-sm text-muted-foreground">Experience</dt>
              <dd className="font-heading text-3xl font-extrabold text-primary">{siteConfig.yearsOfExperience}+ yrs</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Branches</dt>
              <dd className="font-heading text-3xl font-extrabold text-primary">[#]</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Patients served</dt>
              <dd className="font-heading text-3xl font-extrabold text-primary">[#]</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-secondary/50 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3 md:px-6">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="rounded-2xl border bg-card p-8 shadow-xs">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <v.icon className="size-6" aria-hidden />
              </span>
              <h2 className="mt-5 text-xl font-bold">{v.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <SectionHeading center eyebrow="Our commitment" title="Accuracy you can count on" description="Certifications and accreditations: [add official details here once confirmed]." />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {commitments.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06} className="text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                <c.icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <BookingCta />
    </>
  )
}
