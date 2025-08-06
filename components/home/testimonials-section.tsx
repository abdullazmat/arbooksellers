import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Aisha Rahman',
    title: 'Satisfied Customer',
    avatar: '/aisha-rahman-profile.png',
    rating: 5,
    review: 'This website is a treasure trove of Islamic knowledge. The quality of books is exceptional, and the delivery was super fast. Highly recommended!',
  },
  {
    name: 'Omar Khan',
    title: 'Regular Buyer',
    avatar: '/omar-khan-profile.png',
    rating: 5,
    review: 'I always find what I\'m looking for here. The collection is vast, and the customer service is excellent. A must-visit for anyone seeking authentic Islamic books.',
  },
  {
    name: 'Fatima Ali',
    title: 'New Reader',
    avatar: '/fatima-ali-profile.png',
    rating: 4,
    review: 'As a new Muslim, this site has been invaluable. The beginner-friendly books are a great starting point, and the descriptions are very helpful.',
  },
  {
    name: 'Ahmed Hassan',
    title: 'Scholar',
    avatar: '/ahmed-hassan-profile.png',
    rating: 5,
    review: 'An excellent platform for serious students and scholars. The range of classical and contemporary works is impressive. May Allah bless this initiative.',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-islamic-green-50 font-inter">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-6 animate-fade-in-down stagger-1">
            What Our Readers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
            Hear from our satisfied customers about their experience with Islamic Books.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.name} className={`rounded-xl shadow-modern hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in-up stagger-${index + 3}`}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4 border-4 border-islamic-green-200 shadow-md">
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex items-center mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-islamic-gold-500 text-islamic-gold-500" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i + testimonial.rating} className="h-5 w-5 text-gray-300" />
                  ))}
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground mb-4">{testimonial.title}</p>
                <p className="text-base text-gray-700 italic">"{testimonial.review}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
