import {
  BookingCta,
  BranchesPreview,
  FeaturedServices,
  Hero,
  Highlights,
  HowItWorks,
  PackagesPreview,
  WhyChooseUs,
} from '@/components/site/home-sections'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Highlights />
      <FeaturedServices />
      <PackagesPreview />
      <WhyChooseUs />
      <HowItWorks />
      <BranchesPreview />
      <BookingCta />
    </>
  )
}
