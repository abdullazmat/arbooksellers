'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Aisha Rahman',
    role: 'Hifz Student',
    avatar: '/aisha-rahman-profile.png',
    rating: 5,
    review: 'Building a library of my own for Hifz was daunting until I found AR Book Sellers. The quality of their printed Quran sets is unmatched in Pakistan.',
  },
  {
    name: 'Omar Khan',
    role: 'Scholarly Researcher',
    avatar: '/omar-khan-profile.png',
    rating: 5,
    review: 'As someone who values authentic editions, I am impressed with the scrupulous vetting here. Finally a place that respects the text as much as we do.',
  },
  {
    name: 'Fatima Ali',
    role: 'Gift Buyer',
    avatar: '/fatima-ali-profile.png',
    rating: 5,
    review: 'I ordered the Fancy Quran Gift Box for my brother\'s Nikah, and it was the highlight of the day. Exceptional craftsmanship and premium feel.',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Regular Customer',
    avatar: '/ahmed-hassan-profile.png',
    rating: 5,
    review: 'Fast delivery across Pakistan and incredibly professional. My go-to store for anything related to Islamic literature.',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white font-inter overflow-hidden border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <Badge className="bg-islamic-gold-50 text-islamic-gold-700 border-islamic-gold-200 uppercase tracking-widest text-[10px] font-bold">Trusted by the Ummah</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
            Hear from Our <span className="text-islamic-green-600">Customers</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Discover why over 50,000 readers in Pakistan choose AR Book Sellers for their journey into sacred knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.name} className="border-0 shadow-2xl shadow-gray-100/50 hover:shadow-islamic-green-100/50 transition-all duration-300 group">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6 relative">
                <Quote className="absolute top-4 left-4 w-10 h-10 text-islamic-green-50 opacity-0 group-hover:opacity-100 transition-opacity -rotate-12" />
                
                <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
                  <AvatarFallback className="bg-islamic-green-50 text-islamic-green-700 font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <p className="text-lg font-black text-gray-900">{testimonial.name}</p>
                  <p className="text-xs font-bold text-islamic-green-600 uppercase tracking-widest">{testimonial.role}</p>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-islamic-gold-500 text-islamic-gold-500" />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed italic text-sm">
                  "{testimonial.review}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </div>
  )
}
