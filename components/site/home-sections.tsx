'use client'

import { motion } from 'motion/react'
import { asset } from '@/lib/asset'
import {
  Activity,
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  HeartPulse,
  Microscope,
  Phone,
  ShieldCheck,
  Timer,
  Wallet,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { BranchCard, PackageCard, ServiceCard } from '@/components/site/cards'
import { Reveal, SectionHeading } from '@/components/shared/ui'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/70 via-background to-background">
      <div aria-hidden className="absolute -left-40 top-20 size-[28rem] rounded-full bg-accent/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 md:px-6 md:pt-16 lg:grid-cols-2 lg:pb-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3.5 py-1.5 text-sm font-medium text-primary shadow-xs"
          >
            <Award className="size-4" aria-hidden /> Trusted for {siteConfig.yearsOfExperience}+ years
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="mt-6 text-balance text-4xl font-extrabold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl"
          >
            Accurate results. <span className="text-primary">Faster care.</span> Affordable for every family.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/appointments" className={cn(buttonVariants(), 'h-12 rounded-full px-7 text-base shadow-md shadow-primary/20')}>
              <CalendarCheck className="size-5" aria-hidden /> Book an appointment
            </Link>
            <Link href="/services" className={cn(buttonVariants({ variant: 'outline' }), 'h-12 rounded-full px-7 text-base')}>
              Explore tests <ArrowRight className="size-5" aria-hidden />
            </Link>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {['Same-day results for routine tests', 'Secure online reports', 'Multiple branches'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" aria-hidden /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/15 sm:aspect-[5/5] lg:aspect-[4/5]">
            <Image src={asset('/images/hero-lab.png')} alt="Laboratory scientist examining a sample tube beside a microscope" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -left-2 bottom-8 flex items-center gap-3 rounded-2xl border bg-card/95 p-4 shadow-xl backdrop-blur sm:-left-6"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Microscope className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-heading text-2xl font-extrabold leading-none">{siteConfig.yearsOfExperience}+</p>
              <p className="text-xs text-muted-foreground">Years of laboratory excellence</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
            className="absolute -right-2 top-8 flex items-center gap-3 rounded-2xl border bg-card/95 p-4 shadow-xl backdrop-blur sm:-right-6"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-success/15 text-success">
              <FileCheck2 className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold">Report approved</p>
              <p className="text-xs text-muted-foreground">Download securely online</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const highlights = [
  { icon: Award, value: `${siteConfig.yearsOfExperience}+`, label: 'Years of experience' },
  { icon: Timer, value: 'Same day', label: 'Routine test turnaround' },
  { icon: FlaskConical, value: 'Wide', label: 'Range of laboratory tests' },
  { icon: ShieldCheck, value: 'Secure', label: 'Online report access' },
]

export function Highlights() {
  return (
    <section aria-label="Highlights" className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border shadow-sm lg:grid-cols-4">
        {highlights.map((h, i) => (
          <Reveal key={h.label} delay={i * 0.06} className="flex items-center gap-4 bg-card p-5 md:p-7">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <h.icon className="size-6" aria-hidden />
            </span>
            <div>
              <p className="font-heading text-xl font-extrabold md:text-2xl">{h.value}</p>
              <p className="text-sm text-muted-foreground">{h.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function FeaturedServices() {
  const { services } = useDemoStore()
  const featured = services.filter((s) => s.active).slice(0, 6)
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow="Laboratory services" title="Diagnostic tests you can rely on" description="From routine blood counts to specialised hormone and microbiology investigations — performed with care and quality checks at every step." />
        <Link href="/services" className={cn(buttonVariants({ variant: 'outline' }), 'h-11 shrink-0 rounded-full px-5')}>
          View all services <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.05}>
            <ServiceCard service={s} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function PackagesPreview() {
  const { packages } = useDemoStore()
  const list = packages.filter((p) => p.active).slice(0, 3)
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading center eyebrow="Health packages" title="Complete check-ups, thoughtfully bundled" description="Save time with packages designed for common health needs. Book online and visit any branch." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <PackageCard pkg={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/packages" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
            See all packages <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}

const reasons = [
  { icon: Award, title: 'Decades of expertise', text: `Over ${siteConfig.yearsOfExperience} years serving patients and doctors with dependable laboratory testing.` },
  { icon: Activity, title: 'Accuracy first', text: 'Every result is reviewed and approved by authorised professionals before it is released.' },
  { icon: Timer, title: 'Fast turnaround', text: 'Most routine tests are reported the same day, so you and your doctor can act sooner.' },
  { icon: Wallet, title: 'Affordable care', text: 'Transparent, fair pricing and value-focused health packages for the whole family.' },
  { icon: ShieldCheck, title: 'Private & secure', text: 'Reports are protected and only available to you through the secure patient portal.' },
  { icon: HeartPulse, title: 'Caring staff', text: 'Gentle, experienced sample collection in clean and comfortable surroundings.' },
]

export function WhyChooseUs() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[1fr_1.2fr]">
      <Reveal className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image src={asset('/images/sample-collection.png')} alt="Phlebotomist preparing to collect a blood sample from a smiling patient" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
        <div className="absolute -bottom-6 right-6 rounded-2xl bg-primary p-5 text-primary-foreground shadow-xl">
          <p className="font-heading text-3xl font-extrabold">{siteConfig.yearsOfExperience}+</p>
          <p className="text-sm text-primary-foreground/80">years caring for our community</p>
        </div>
      </Reveal>
      <div>
        <SectionHeading eyebrow="Why choose us" title="Laboratory care built on trust" description="We combine experienced professionals, careful quality checks and a patient-friendly experience across every branch." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.05} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <r.icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-bold">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = [
  { icon: CalendarCheck, title: 'Book online', text: 'Choose your tests, branch, date and time.' },
  { icon: ClipboardList, title: 'Visit & check in', text: 'Our staff register your visit and test order.' },
  { icon: FlaskConical, title: 'Sample & analysis', text: 'Samples are collected and processed with care.' },
  { icon: FileCheck2, title: 'Approved report', text: 'Download your verified report securely online.' },
]

export function HowItWorks() {
  return (
    <section className="bg-[oklch(0.24_0.05_240)] py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">How it works</p>
          <h2 className="mt-3 text-balance text-3xl font-bold md:text-4xl">From booking to your report in four simple steps</h2>
        </div>
        <ol className="mt-14 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <li className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="font-heading text-sm font-bold text-accent">0{i + 1}</span>
                <s.icon className="mt-4 size-8 text-accent" aria-hidden />
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function BranchesPreview() {
  const { branches } = useDemoStore()
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow="Our branches" title="Care close to where you live" description="All branches are connected to our main laboratory through one central system." />
        <Link href="/branches" className={cn(buttonVariants({ variant: 'outline' }), 'h-11 shrink-0 rounded-full px-5')}>
          All branches <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {branches
          .filter((b) => b.active)
          .map((b, i) => (
            <Reveal key={b.id} delay={i * 0.05}>
              <BranchCard branch={b} />
            </Reveal>
          ))}
      </div>
    </section>
  )
}

export function BookingCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6 md:pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[oklch(0.62_0.12_215)] px-6 py-14 text-primary-foreground md:px-14">
          <div aria-hidden className="absolute -right-16 -top-16 size-72 rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-24 right-40 size-56 rounded-full bg-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-balance text-3xl font-bold md:text-4xl">Ready for your test? Book in under a minute.</h2>
              <p className="mt-3 text-primary-foreground/85">Pick a branch and time that suits you. Need help? Call us on {siteConfig.phone}.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/appointments" className={cn(buttonVariants({ variant: 'secondary' }), 'h-12 rounded-full bg-white px-7 text-base text-primary hover:bg-white/90')}>
                <CalendarCheck className="size-5" aria-hidden /> Book now
              </Link>
              <Link href="/contact" className={cn(buttonVariants({ variant: 'outline' }), 'h-12 rounded-full border-white/40 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white')}>
                <Phone className="size-5" aria-hidden /> Contact us
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
