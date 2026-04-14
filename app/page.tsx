import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import FeaturedProducts from "@/components/home/featured-products";
import AboutSection from "@/components/home/about-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import NewsletterSection from "@/components/home/newsletter-section";

export const metadata: Metadata = {
  title: "Islamic BookStore in Pakistan | AR Book Sellers",
  description: "AR Book Sellers is Pakistan's leading online Islamic bookstore. Shop authentic Quran Majeed, Hadith sets, Tafsir, and Islamic history books with nationwide delivery.",
  openGraph: {
    title: "AR Book Sellers | Original Islamic BookStore Pakistan",
    description: "Shop authentic Quran, Hadith, and Islamic literature. Fast delivery across Pakistan from Urdu Bazar Lahore.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://arbooksellers.com",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </>
  );
}
