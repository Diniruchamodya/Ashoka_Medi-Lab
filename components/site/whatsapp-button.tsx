import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { whatsappLink } from '@/lib/site-config'

export function WhatsAppButton() {
  const href = whatsappLink()
  const className =
    'fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]'

  if (!href) {
    return (
      <Link href="/contact#whatsapp" className={className} aria-label="Chat on WhatsApp (number not configured yet)">
        <MessageCircle className="size-6" aria-hidden />
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label="Chat with us on WhatsApp">
      <MessageCircle className="size-6" aria-hidden />
    </a>
  )
}
