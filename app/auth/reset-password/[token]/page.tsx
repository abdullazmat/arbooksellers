'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setIsSuccess(true)
      toast({
        title: "Password Updated",
        description: "Your password has been reset successfully.",
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
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-6 tracking-tight">Set New Password</h1>
          </div>

          <Card className="bg-card backdrop-blur-xl border border-border/50 dark:border-zinc-700/50 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="px-6 sm:px-8 py-8">
              {isSuccess ? (
                <div className="text-center space-y-5 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-islamic-green-100 dark:bg-islamic-green-500/20 text-islamic-green-600 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Success!</h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      Your password has been updated. You can now sign in with your new password.
                    </p>
                    <Button className="w-full h-12 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-xl font-bold transition-all" asChild>
                      <Link href="/auth/signin">Sign In Now</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <CardHeader className="pt-0 pb-6 text-center px-0">
                    <CardTitle className="text-xl font-bold">Create New Password</CardTitle>
                    <CardDescription>Enter a strong password for your account</CardDescription>
                  </CardHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          className={`h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all ${error ? 'border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className={`h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all ${error ? 'border-red-500' : ''}`}
                      />
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-xl font-bold shadow-lg transition-all group"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Reset Password</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                    </Button>
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
