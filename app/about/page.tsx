import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Scroll, Globe, Heart, BookOpen, Crown } from 'lucide-react'
import Image from 'next/image'

const values = [
  {
    icon: ShieldCheck,
    title: 'Verified Authenticity',
    description: 'Every work in our collection is scrupulously vetted for theological accuracy before it reaches your home.'
  },
  {
    icon: Scroll,
    title: 'Venerable Sources',
    description: 'We source our literature directly from the most respected publishers and scholars in the Islamic world.'
  },
  {
    icon: Crown,
    title: 'Premium Quality',
    description: 'We prioritize high-quality prints, durable bindings, and beautiful gift-ready packaging.'
  },
  {
    icon: Globe,
    title: 'Nationwide Delivery',
    description: 'Serving the Ummah across Pakistan with reliable shipping and dedicated customer support.'
  }
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Simple & Clear Hero */}
        <section className="bg-white py-20 border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
              <div className="w-32 h-32 relative mb-2">
                <Image 
                  src="/logo.png" 
                  alt="AR Book Sellers Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <Badge className="bg-islamic-green-50 text-islamic-green-700 hover:bg-islamic-green-100 border-islamic-green-200 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                Our Mission
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight">
                Spreading Islamic Knowledge <span className="text-islamic-green-600">Across Pakistan</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-2xl">
                Founded in 2009, AR Book Sellers is a trusted nationwide platform serving over 50,000 customers across Pakistan, dedicated to making authentic Islamic literature accessible to everyone.
              </p>
              
              <div className="pt-6">
                <p className="text-3xl font-amiri text-islamic-green-700 mb-2">
                  وَقُل رَّبِّ زِدْنِي عِلْمًا
                </p>
                <p className="text-gray-500 italic text-sm">
                  "And say: My Lord, increase me in knowledge" — Quran 20:114
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section with Real Image */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="lg:w-1/2 relative">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                  <Image 
                    src="/scholar-desk.png" 
                    alt="The Desk of an Islamic Researcher" 
                    width={800}
                    height={800}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-islamic-gold-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl animate-float">
                   <Scroll className="w-10 h-10" />
                </div>
              </div>

              <div className="lg:w-1/2 space-y-8 text-lg">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">Our Journey Since 2009</h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    Our founder, <strong>Dr. Ahmad Rahman</strong>, recognized the need for a reliable source of authentic Islamic literature after struggling to find quality books for his own Islamic studies. With his background in scholarship and a passion for education, he began curating a collection from the most respected authors in the Islamic world.
                  </p>
                  <p>
                    Today, we work directly with renowned publishers like <strong>Darussalam</strong>, <strong>Islamic Foundation</strong>, and many others to ensure every book in our collection meets the highest standards. Our team of Islamic scholars carefully reviews each title to verify its adherence to authentic Islamic teachings.
                  </p>
                  <p>
                    What started as a small bookstore in our local community has grown into a trusted nationwide platform. Whether it's our signature printed Quran sets or artisan-crafted Rahals, we prioritize items that embody the excellence required of Islamic knowledge.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-3xl font-black text-islamic-green-600 mb-1">50,000+</p>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Happy Customers</p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-3xl font-black text-islamic-gold-600 mb-1">Nationwide</p>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Redesign */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                Our Core Principles
              </h2>
              <p className="text-gray-500 text-lg">
                Guided by Islamic ethics, we maintain the highest standards of integrity in everything we do.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <Card key={index} className="border-0 shadow-xl shadow-gray-100/50 hover:shadow-islamic-green-100/50 transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-islamic-green-50 rounded-2xl flex items-center justify-center mx-auto text-islamic-green-600">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Simple Contact / CTA */}
        <section className="py-24 bg-islamic-green-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
            <h2 className="text-3xl font-black">Looking for a Specific Work?</h2>
            <p className="text-xl text-islamic-green-100 max-w-2xl mx-auto leading-relaxed">
              If you can't find a particular title or need advice on choosing the right Quran for your level, our team is always here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="mailto:contact@arbooksellers.com"
                className="bg-islamic-gold-500 text-white px-10 py-4 rounded-full font-bold hover:bg-islamic-gold-600 transition-all shadow-lg hover:shadow-xl"
              >
                Reach Out to Us
              </a>
              <a
                href="tel:+923008016812"
                className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
              >
                Call Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
