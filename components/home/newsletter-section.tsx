"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Mail, Send, CheckCircle } from 'lucide-react'

export default function NewsletterSection() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribed(true)
        setEmail('')
        setName('')
        toast({
          title: 'Successfully Subscribed!',
          description: data.message || 'You have been subscribed to our newsletter',
        })
      } else {
        toast({
          title: 'Subscription Failed',
          description: data.error || 'Failed to subscribe to newsletter',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribed(false)
        toast({
          title: 'Unsubscribed',
          description: 'You have been unsubscribed from our newsletter',
        })
      } else {
        toast({
          title: 'Unsubscribe Failed',
          description: data.error || 'Failed to unsubscribe',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error)
      toast({
        title: 'Error',
        description: 'Failed to unsubscribe. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-r from-islamic-green-50 to-islamic-green-100 font-inter">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <CheckCircle className="h-16 w-16 text-islamic-green-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-islamic-green-800 mb-4">
              Thank You for Subscribing!
            </h2>
            <p className="text-lg text-islamic-green-700 mb-8">
              You're now part of our community and will receive updates about new Islamic books, special offers, and Islamic knowledge.
            </p>
            <Button
              onClick={handleUnsubscribe}
              disabled={loading}
              variant="outline"
              className="border-islamic-green-300 text-islamic-green-700 hover:bg-islamic-green-50"
            >
              {loading ? 'Processing...' : 'Unsubscribe'}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-islamic-green-50 to-islamic-green-100 font-inter">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-green-100 rounded-full mb-6">
              <Mail className="h-10 w-10 text-islamic-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-islamic-green-800 mb-6">
              Stay Updated with Islamic Knowledge
            </h2>
            <p className="text-lg md:text-xl text-islamic-green-700 max-w-2xl mx-auto leading-relaxed">
              Subscribe to our newsletter and be the first to know about new Islamic books, exclusive offers, and spiritual insights delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Your Name (Optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border-islamic-green-300 focus:border-islamic-green-500 focus:ring-islamic-green-500"
              />
              <Input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border-islamic-green-300 focus:border-islamic-green-500 focus:ring-islamic-green-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-islamic-green-600 hover:bg-islamic-green-700 text-white py-3 px-8 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Subscribing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Subscribe to Newsletter
                </div>
              )}
            </Button>
          </form>

          <p className="text-sm text-islamic-green-600 mt-6 max-w-md mx-auto">
            We respect your privacy. Unsubscribe at any time. No spam, only valuable Islamic content.
          </p>
        </div>
      </div>
    </section>
  )
}
