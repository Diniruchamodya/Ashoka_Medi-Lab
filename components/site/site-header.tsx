'use client'

import { AnimatePresence, motion } from 'motion/react'
import { CalendarCheck, Menu, UserRound, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/shared/ui'
import { publicNav } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className={cn('sticky top-0 z-50 border-b transition-colors', scrolled ? 'border-border bg-background/90 backdrop-blur-md' : 'border-transparent bg-background')}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-[72px] md:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {publicNav.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn('relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors hover:text-primary', active ? 'text-primary' : 'text-foreground/80')}
                  >
                    {item.label}
                    {active && <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/portal" className={cn(buttonVariants({ variant: 'ghost' }), 'h-10 px-3.5')}>
            <UserRound className="size-4" aria-hidden /> Patient Portal
          </Link>
          <Link href="/appointments" className={cn(buttonVariants(), 'h-10 rounded-full px-5 shadow-sm')}>
            <CalendarCheck className="size-4" aria-hidden /> Book a Test
          </Link>
        </div>
        <button className="rounded-lg p-2 text-foreground hover:bg-muted lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-background lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {publicNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={cn('block rounded-lg px-3 py-3 text-base font-medium hover:bg-muted', pathname === item.href && 'bg-secondary text-primary')}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/portal" className={cn(buttonVariants({ variant: 'outline' }), 'h-11')}>
                  Patient Portal
                </Link>
                <Link href="/appointments" className={cn(buttonVariants(), 'h-11')}>
                  Book a Test
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
