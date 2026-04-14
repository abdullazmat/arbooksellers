'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setIsSubmitted(true)
      toast({
        title: "Email sent",
        description: data.message || "Check your inbox for a password reset link.",
      })
    } catch (err: any) {
      toast({
        title: "Reset Failed",
        description: err.message || 'Something went wrong. Please try again.',
        variant: "destructive",
      })
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900">
      <Header />
      <main className="flex-grow bg-background flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden">
        {/* Background blob */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-islamic-green-500/5 dark:bg-islamic-green-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo & heading */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block group">
              <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-border/50 flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
                <Image src="/logo.png" alt="AR Publishers" width={80} height={80} className="object-contain" />
              </div>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-6 tracking-tight">Reset Password</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">We&apos;ll send you a link to reset it</p>
          </div>

          <Card className="bg-card backdrop-blur-xl border border-border/50 dark:border-zinc-700/50 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="px-6 sm:px-8 py-8">
              {isSubmitted ? (
                <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-islamic-green-100 dark:bg-islamic-green-500/20 text-islamic-green-600 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                      We sent a reset link to <span className="text-foreground font-semibold">{email}</span>. Check your inbox and follow the link to set a new password.
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full h-12 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-xl font-bold text-sm transition-all" asChild>
                        <Link href="/auth/signin">Back to Sign In</Link>
                      </Button>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Try a different email
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <CardHeader className="pt-0 pb-6 text-center px-0">
                    <CardTitle className="text-xl font-bold text-foreground">Forgot your password?</CardTitle>
                    <CardDescription className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      Enter your email and we&apos;ll send you a link to reset your password.
                    </CardDescription>
                  </CardHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className={`h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 text-sm ${error ? 'border-red-500' : ''}`}
                      />
                      {error && <p className="text-xs text-red-500">{error}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all group"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending link...</span>
                        </div>
                      ) : (
                        <span>Send Reset Link</span>
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Sign In</span>
                      </Link>
                    </div>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
