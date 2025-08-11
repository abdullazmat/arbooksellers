import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import HeroSection from '@/components/home/hero-section'
import FeaturedProducts from '@/components/home/featured-products'
import TestimonialsSection from '@/components/home/testimonials-section'
import NewsletterSection from '@/components/home/newsletter-section'

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </>
  )
}
