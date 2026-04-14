'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Mismatch",
        description: "Confirm password does not match. Please check again.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      await signUp(name, email, password, phone || undefined)
    } catch (error: any) {
      console.error('Sign up error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900">
      <Header />
      <main className="flex-grow bg-background flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[40%] h-[40%] bg-islamic-green-500/5 dark:bg-islamic-green-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-lg relative z-10">
          {/* Logo & heading */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block group">
              <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-border/50 flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
                <Image src="/logo.png" alt="AR Publishers" width={80} height={80} className="object-contain" />
              </div>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-6 tracking-tight">Create your account</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Sign up to start shopping</p>
          </div>

          <Card className="bg-card backdrop-blur-xl border border-border/50 dark:border-zinc-700/50 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pt-8 pb-2 text-center">
              <CardTitle className="text-xl font-bold text-foreground">Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="px-6 sm:px-8 pb-8 pt-4">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground/80">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Abdullah Rahman"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 text-sm"
                    />
                  </div>
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
                      className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground/80">Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input
                    id="phone"
                    placeholder="+92 3XX XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 text-sm"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 pr-12 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 pr-12 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all group mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-islamic-green-600 font-semibold hover:text-islamic-green-700 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
