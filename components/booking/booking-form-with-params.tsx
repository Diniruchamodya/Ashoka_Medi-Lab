'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { BookingForm } from '@/components/booking/booking-form'

/** Reads ?branch= / ?test= / ?package= in the browser so the page can be exported as static HTML. */
function Inner() {
  const sp = useSearchParams()
  const branch = sp.get('branch') ?? undefined
  const test = sp.get('test') ?? undefined
  const pkg = sp.get('package') ?? undefined
  return <BookingForm key={`${branch}|${test}|${pkg}`} initialBranch={branch} initialTest={test} initialPackage={pkg} />
}

export function BookingFormWithParams() {
  return (
    <Suspense fallback={<div className="min-h-96 rounded-2xl border bg-card" aria-busy="true" />}>
      <Inner />
    </Suspense>
  )
}
