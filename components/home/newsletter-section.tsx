'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Gift, BookOpen, Bell, Send, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to our newsletter. You'll receive updates about new books and special offers.",
    })
    
    setEmail('')
    setIsLoading(false)
  }

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-islamic-green-600 via-islamic-green-700 to-islamic-green-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 islamic-pattern"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-islamic-gold-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-islamic-gold-400/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-islamic-gold-300/30 rounded-full blur-lg"></div>

      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-islamic-gold-500/20 rounded-full mb-6">
            <Mail className="h-8 w-8 text-islamic-gold-300" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-islamic-gold-200 bg-clip-text text-transparent">
            Join Our Newsletter
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-islamic-green-100 leading-relaxed">
            Stay updated with new arrivals, special offers, and exclusive content from Islamic Books.
          </p>
        </div>

        {/* Newsletter Form */}
        <Card className="max-w-2xl mx-auto mb-16 bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 px-6 rounded-full bg-white/95 text-gray-900 placeholder:text-gray-500 border-0 focus:ring-2 focus:ring-islamic-gold-500 focus:bg-white shadow-lg transition-all duration-300 text-lg"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-14 px-8 rounded-full bg-gradient-to-r from-islamic-gold-500 to-islamic-gold-600 text-gray-900 font-bold hover:from-islamic-gold-600 hover:to-islamic-gold-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group min-w-[140px]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                    Subscribing...
                  </div>
                ) : (
                  <>
                    Subscribe
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-islamic-gold-500 to-islamic-gold-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">New Book Alerts</h3>
              <p className="text-islamic-green-100 leading-relaxed">
                Be the first to know about new Islamic book releases and exclusive previews.
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-islamic-gold-500 to-islamic-gold-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Gift className="h-8 w-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Exclusive Offers</h3>
              <p className="text-islamic-green-100 leading-relaxed">
                Get access to subscriber-only discounts and special promotions.
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-islamic-gold-500 to-islamic-gold-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bell className="h-8 w-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Islamic Insights</h3>
              <p className="text-islamic-green-100 leading-relaxed">
                Receive weekly Islamic knowledge, quotes, and spiritual guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12 text-islamic-green-100">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-islamic-gold-400 fill-current" />
            <span className="font-semibold">10,000+ Subscribers</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-islamic-gold-400 fill-current" />
            <span className="font-semibold">Weekly Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-islamic-gold-400 fill-current" />
            <span className="font-semibold">Exclusive Content</span>
          </div>
        </div>

        {/* Arabic Quote */}
        <div className="text-center pt-8 border-t border-white/20">
          <p className="text-3xl font-amiri text-islamic-gold-300 mb-3 leading-relaxed">
            وَقُل رَّبِّ زِدْنِي عِلْمًا
          </p>
          <p className="text-islamic-green-100 text-lg italic">
            "And say: My Lord, increase me in knowledge" - Quran 20:114
          </p>
        </div>
      </div>
    </section>
  )
}
