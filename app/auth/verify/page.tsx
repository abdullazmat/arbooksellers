'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle, Mail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth-context'

function VerificationContent() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { toast } = useToast()
  const { login } = useAuth()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      router.push('/auth/signup')
    }
  }, [email, router])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)
    
    const focusIndex = Math.min(pastedData.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError('')
    
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      setError('Please enter the full 6-digit code')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      // Store auth state (login the user)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      setIsSuccess(true)
      // Log the user in directly
      if (data.user && data.token) {
        login(data.user, data.token)
      }

      toast({
        title: "Account Verified!",
        description: "Your account has been verified successfully. Logging you in...",
      })

      setTimeout(() => {
        let redirectPath = searchParams.get('returnTo')
        
        if (!redirectPath || redirectPath === '/') {
          // Determine best default path
          if (data.user?.role === 'admin') {
            redirectPath = '/admin'
          } else {
            // Check cart for checkout redirect
            try {
              const cart = localStorage.getItem('cart')
              if (cart && JSON.parse(cart).length > 0) {
                redirectPath = '/checkout'
              } else {
                redirectPath = '/dashboard'
              }
            } catch (e) {
              redirectPath = '/dashboard'
            }
          }
        }
        
        router.push(redirectPath)
      }, 1500)

    } catch (err: any) {
      if (err.message?.includes('already verified')) {
        toast({
          title: "Already Verified",
          description: "Your account is already verified. Redirecting to sign in...",
        })
        setTimeout(() => router.push('/auth/signin'), 2000)
        return
      }
      toast({
        title: "Verification Failed",
        description: err.message || 'Invalid or expired code. Please try again.',
        variant: "destructive",
      })
      setError(err.message || 'Invalid or expired code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resendOnly: true }),
      })
      
      if (response.ok) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to resend code')
      }
    } catch (err: any) {
      if (err.message?.includes('already verified')) {
        toast({
          title: "Already Verified",
          description: "Your account is already verified. Redirecting to sign in...",
        })
        setTimeout(() => router.push('/auth/signin'), 2000)
        return
      }
      setError(err.message || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <main className="flex-grow bg-background flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[40%] h-[40%] bg-islamic-green-500/5 dark:bg-islamic-green-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-border/50 flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="AR Publishers" width={80} height={80} className="object-contain" />
            </div>
          </Link>
        </div>

        <Card className="bg-card backdrop-blur-xl border border-border/50 dark:border-zinc-700/50 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="px-6 sm:px-8 py-8">
            {isSuccess ? (
              <div className="text-center space-y-5 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-islamic-green-100 dark:bg-islamic-green-500/20 text-islamic-green-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Verified!</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Your account is now ready. Redirecting you...
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      const user = JSON.parse(localStorage.getItem('user') || '{}');
                      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
                    }}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <CardHeader className="pt-0 pb-6 text-center px-0">
                  <CardTitle className="text-xl font-bold">Verify Your Email</CardTitle>
                  <CardDescription className="max-w-xs mx-auto">
                    We sent a 6-digit code to <span className="text-foreground font-semibold">{email}</span>
                  </CardDescription>
                </CardHeader>
                
                <div className="space-y-6">
                  <div className="flex justify-between gap-2 sm:gap-4" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-border/50 focus:border-islamic-green-500 focus:ring-1 focus:ring-islamic-green-500 transition-all outline-none"
                      />
                    ))}
                  </div>

                  {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}

                  <Button
                    onClick={() => handleSubmit()}
                    disabled={isLoading || otp.join('').length !== 6}
                    className="w-full h-12 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-xl font-bold shadow-lg transition-all"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <span>Verify Account</span>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Didn&apos;t receive the code?{' '}
                      <button
                        onClick={handleResend}
                        disabled={resending}
                        className="text-islamic-green-600 font-semibold hover:text-islamic-green-700 transition-colors disabled:opacity-50"
                      >
                        {resending ? 'Sending...' : 'Resend'}
                      </button>
                    </p>
                  </div>

                  <div className="text-center pt-4 border-t border-border/30">
                    <Link href="/auth/signup" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Use a different email address
                    </Link>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function VerificationPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900">
      <Header />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
             <Loader2 className="h-12 w-12 animate-spin text-islamic-green-600 mx-auto" />
             <p className="text-muted-foreground font-medium">Preparing verification...</p>
          </div>
        </div>
      }>
        <VerificationContent />
      </Suspense>
      <Footer />
    </div>
  )
}
