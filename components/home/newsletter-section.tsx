"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Mail, SendHorizontal, CheckCircle, BellRing, BookOpen } from 'lucide-react'

export default function NewsletterSection() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubscribed(true)
        setEmail('')
        toast({
          title: 'Welcome to the Community!',
          description: 'You have been successfully subscribed.',
        })
      } else {
        const data = await response.json()
        toast({
          title: 'Subscription Failed',
          description: data.error || 'Please try again later.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Connection error. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 bg-background font-inter relative border-y border-border overflow-hidden">
      {/* Subtle organic background elements to match the theme */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-islamic-green-50 dark:bg-islamic-green-950/20 rounded-full blur-[100px] -mr-48 -mt-48 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-islamic-gold-50 dark:bg-islamic-gold-950/20 rounded-full blur-[100px] -ml-48 -mb-48 opacity-60"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-islamic-green-50 dark:bg-islamic-green-950/30 text-islamic-green-700 dark:text-islamic-green-400 border border-islamic-green-100 dark:border-islamic-green-800 text-xs font-bold uppercase tracking-widest">
              <BellRing className="w-4 h-4" />
              <span>Join our community of seekers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1]">
              Your Journey of <span className="text-islamic-green-600">Knowledge</span> Continues Here
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
               Subscribe to get early access to new arrivals from Darussalam and spiritual reminders that matter to your study.
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
               <div className="flex -space-x-3">
                  {['aisha-rahman', 'omar-khan', 'fatima-ali', 'ahmed-hassan'].map(name => (
                    <div key={name} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                      <img src={`/${name}-profile.png`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <p className="text-sm font-bold text-muted-foreground">Liked by 50,000+ Students</p>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-card p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(20,83,45,0.1)] dark:shadow-none border border-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-islamic-green-50 dark:bg-islamic-green-950/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              {subscribed ? (
                <div className="text-center space-y-6 py-10 relative z-10">
                  <div className="w-20 h-20 bg-islamic-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-islamic-green-200">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground leading-tight">JazakAllah Khairan for Joining!</h3>
                  <p className="text-muted-foreground">We’ve added you to our community. Look out for our welcome message.</p>
                </div>
              ) : (
                <div className="space-y-8 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground">Don't Miss a New Chapter</h3>
                    <p className="text-muted-foreground">Enter your email for the latest updates on Quran para sets and new literature.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-islamic-green-600" />
                      <Input
                        type="email"
                        placeholder="yourname@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-16 pl-12 pr-6 bg-accent/20 border-border rounded-2xl focus:bg-card focus:border-islamic-green-500 transition-all text-lg"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-16 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-xl hover:shadow-islamic-green-200"
                    >
                      {loading ? 'Subscribing...' : (
                        <div className="flex items-center gap-2 justify-center">
                          <span>Join the Community</span>
                          <SendHorizontal className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <div className="w-1.5 h-1.5 bg-islamic-gold-400 rounded-full"></div>
                    <span>We respect your privacy. Unsubscribe at any time.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
