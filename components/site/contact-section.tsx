'use client'

import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useDemoStore } from '@/components/demo/demo-store'
import { DemoNotice, Field, Input, Select, Spinner, Textarea } from '@/components/shared/ui'
import { siteConfig, whatsappLink } from '@/lib/site-config'
import { cn } from '@/lib/utils'

type Errors = Partial<Record<'name' | 'contact' | 'message', string>>

export function ContactSection() {
  const { branches } = useDemoStore()
  const wa = whatsappLink()
  const [form, setForm] = useState({ name: '', phone: '', email: '', topic: 'General inquiry', branch: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v: Errors = {}
    if (form.name.trim().length < 2) v.name = 'Please enter your name.'
    if (!form.phone.trim() && !form.email.trim()) v.contact = 'Provide a phone number or email so we can reply.'
    else if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) v.contact = 'Enter a valid email address.'
    if (form.message.trim().length < 10) v.message = 'Message should be at least 10 characters.'
    setErrors(v)
    if (Object.keys(v).length) return
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 800))
    setStatus('sent')
  }

  const contacts = [
    { icon: Phone, label: 'Telephone', value: siteConfig.phone },
    { icon: Mail, label: 'Email', value: siteConfig.email },
    { icon: MapPin, label: 'Head office', value: siteConfig.address },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-2xl border bg-card p-5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <c.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</p>
                <p className="font-semibold">{c.value}</p>
              </div>
            </div>
          ))}
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), 'h-12 w-full rounded-full bg-[#25D366] text-base text-white hover:bg-[#1ebe5b]')}>
              <MessageCircle className="size-5" aria-hidden /> Chat on WhatsApp
            </a>
          ) : (
            <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <MessageCircle className="size-5 text-[#25D366]" aria-hidden /> WhatsApp
              </p>
              <p className="mt-1">Add the official WhatsApp number in <code className="rounded bg-muted px-1">lib/site-config.ts</code> to enable click-to-chat.</p>
            </div>
          )}
          <div className="overflow-hidden rounded-2xl border">
            <iframe title="Map showing Ashoka Medi-Lab" src="https://www.google.com/maps?q=Ashoka%20Medi-Lab&output=embed" className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm md:p-8">
          {status === 'sent' ? (
            <div className="flex flex-col items-center py-12 text-center" role="status">
              <CheckCircle2 className="size-14 text-success" aria-hidden />
              <h2 className="mt-4 text-2xl font-bold">Message received (demo)</h2>
              <p className="mt-2 max-w-sm text-muted-foreground">Thanks, {form.name.split(' ')[0]}. In this demo, messages are not delivered. Please call us for urgent questions.</p>
              <Button variant="outline" className="mt-6 h-11 rounded-full px-6" onClick={() => { setStatus('idle'); setForm({ name: '', phone: '', email: '', topic: 'General inquiry', branch: '', message: '' }) }}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <h2 className="text-xl font-bold">Send us a message</h2>
              <DemoNotice>Demo form — messages are validated but not sent anywhere.</DemoNotice>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Your name" required error={errors.name} className="md:col-span-2">
                  {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!errors.name} value={form.name} onChange={set('name')} autoComplete="name" />}
                </Field>
                <Field label="Phone" error={errors.contact}>
                  {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!errors.contact} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />}
                </Field>
                <Field label="Email">
                  {(id) => <Input id={id} type="email" value={form.email} onChange={set('email')} autoComplete="email" />}
                </Field>
                <Field label="Topic">
                  {(id) => (
                    <Select id={id} value={form.topic} onChange={set('topic')}>
                      {['General inquiry', 'Test information', 'Report question', 'Booking help', 'Feedback'].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label="Branch">
                  {(id) => (
                    <Select id={id} value={form.branch} onChange={set('branch')}>
                      <option value="">Any branch</option>
                      {branches.filter((b) => b.active).map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label="Message" required error={errors.message} className="md:col-span-2">
                  {(id, d) => <Textarea id={id} aria-describedby={d} aria-invalid={!!errors.message} rows={5} value={form.message} onChange={set('message')} />}
                </Field>
              </div>
              <Button type="submit" disabled={status === 'sending'} className="h-12 rounded-full px-8 text-base">
                {status === 'sending' ? <Spinner /> : <Send className="size-4" aria-hidden />} {status === 'sending' ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          )}
        </div>
      </div>

      <h2 className="mt-16 text-2xl font-bold">Branch contacts</h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Branch</th>
              <th className="px-5 py-3 font-semibold">Address</th>
              <th className="px-5 py-3 font-semibold">Phone</th>
              <th className="px-5 py-3 font-semibold">Hours</th>
            </tr>
          </thead>
          <tbody>
            {branches.filter((b) => b.active).map((b) => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="px-5 py-3.5 font-semibold">{b.name}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{b.address}</td>
                <td className="px-5 py-3.5">{b.phone}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{b.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
