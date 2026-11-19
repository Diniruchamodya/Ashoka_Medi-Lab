import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/shared/ui'
import { publicNav, siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer className="bg-[oklch(0.2_0.045_240)] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-white/65">{siteConfig.description}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {publicNav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-accent">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Patients</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            <li><Link href="/appointments" className="hover:text-accent">Book an appointment</Link></li>
            <li><Link href="/portal" className="hover:text-accent">Patient portal</Link></li>
            <li><Link href="/packages" className="hover:text-accent">Health packages</Link></li>
            <li><Link href="/portal#staff" className="hover:text-accent">Staff login</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />{siteConfig.address}</li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />{siteConfig.phone}</li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />{siteConfig.email}</li>
            <li className="flex gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />{siteConfig.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/55 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} Ashoka Medi-Lab. All rights reserved.</p>
          <p>Bracketed details are placeholders. Sample data across this site is for demonstration only.</p>
        </div>
      </div>
    </footer>
  )
}
