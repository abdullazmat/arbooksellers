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
    <section className="py-24 bg-background dark:bg-zinc-950/50 font-inter overflow-hidden border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <Badge className="bg-islamic-gold-50 dark:bg-islamic-gold-500/10 text-islamic-gold-700 dark:text-islamic-gold-400 border-islamic-gold-200 dark:border-islamic-gold-500/20 uppercase tracking-widest text-[10px] font-bold shadow-sm">Trusted by the Ummah</Badge>
          <h2 className="text-4xl lg:text-5xl font-black text-foreground leading-tight">
            Hear from Our <span className="text-islamic-green-600">Customers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-medium">
            Discover why over 50,000 readers in Pakistan choose AR Book Sellers for their journey into sacred knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border border-border/40 bg-card hover:bg-accent/5 transition-all duration-500 group rounded-[2.5rem] overflow-hidden hover:-translate-y-2">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6 relative">
                <Quote className="absolute top-6 left-6 w-12 h-12 text-islamic-green-500/10 dark:text-islamic-green-500/20 -rotate-12 transition-transform group-hover:rotate-0 duration-500" />
                
                <Avatar className="h-24 w-24 border-4 border-background shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
                  <AvatarFallback className="bg-islamic-green-50 dark:bg-zinc-800 text-islamic-green-700 dark:text-islamic-green-400 font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1 relative z-10">
                  <p className="text-xl font-black text-foreground tracking-tight">{testimonial.name}</p>
                  <p className="text-[10px] font-black text-islamic-green-600 uppercase tracking-widest">{testimonial.role}</p>
                </div>

                <div className="flex items-center gap-1.5 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-islamic-gold-500 text-islamic-gold-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed italic text-sm font-medium relative z-10">
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
