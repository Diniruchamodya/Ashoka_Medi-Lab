/**
 * Editable business information.
 * Values wrapped in [brackets] are placeholders — replace them with
 * official Ashoka Medi-Lab details before publishing.
 */
export const siteConfig = {
  name: 'Ashoka Medi-Lab',
  tagline: 'Fast, accurate & affordable laboratory services',
  description:
    'With over 35 years of experience, we deliver fast, accurate, and affordable laboratory services to support your health and well-being.',
  yearsOfExperience: 35,
  phone: '[Main phone number]',
  whatsapp: '', // e.g. '94XXXXXXXXX' (country code + number, digits only)
  email: '[contact@your-domain.com]',
  address: '[Head office address]',
  hours: '[Opening hours]',
}

export function publicAssetPath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`
}

export const publicNav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/packages', label: 'Packages' },
  { href: '/branches', label: 'Branches' },
  { href: '/contact', label: 'Contact' },
]

export function whatsappLink(message = 'Hello Ashoka Medi-Lab, I would like to make an inquiry.') {
  if (!siteConfig.whatsapp) return null
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
}
