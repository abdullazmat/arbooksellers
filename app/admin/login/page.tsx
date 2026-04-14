'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAdminAuth, AdminAuthProvider } from '@/contexts/admin-auth-context'
import Image from 'next/image'

function AdminLoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { adminSignIn, isLoading } = useAdminAuth()

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')

    if (adminToken && adminUser) {
      router.push('/admin')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      })
      return
    }

    try {
      const success = await adminSignIn(email, password)
      if (success) {
        // adminSignIn will handle the redirect
        return
      }
    } catch (error: any) {
      console.error('Admin login error:', error)
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-islamic-green-100 selection:text-islamic-green-900">
      <div className="w-full max-w-[480px]">
        {/* Logo and Greeting */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-pointer" onClick={() => router.push('/')}>
              <div className="absolute -inset-4 bg-islamic-green-500/20 rounded-full blur-2xl group-hover:bg-islamic-green-500/30 transition-all duration-500" />
              <Image
                src="/logo.png"
                alt="AR Publishers Admin"
                width={100}
                height={100}
                className="relative h-24 w-24 object-contain transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">Admin Login</h1>
          <p className="text-muted-foreground font-medium mt-3">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="bg-card border border-border/50 dark:border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 pb-2 text-center">
            <div className="bg-islamic-green-500/10 dark:bg-islamic-green-500/20 text-islamic-green-600 dark:text-islamic-green-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-islamic-green-500/20 shadow-sm">
                <Shield className="h-7 w-7" />
            </div>
            <CardTitle className="text-3xl font-black text-foreground tracking-tight">Sign In</CardTitle>
            <CardDescription className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">
              Enter your email and password
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80 font-black text-[10px] uppercase tracking-widest px-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@arpublishers.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-14 rounded-2xl bg-zinc-100/50 dark:bg-background border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-islamic-green-500 transition-all px-5 font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/80 font-black text-[10px] uppercase tracking-widest px-1">Password</Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-14 rounded-2xl bg-zinc-100/50 dark:bg-background border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-islamic-green-500 transition-all px-5 pr-14 font-bold"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-foreground text-background dark:bg-white dark:text-black hover:bg-islamic-green-600 hover:text-white transition-all rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authorizing...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-border/30 dark:border-white/5">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
              >
                ← Return to Store
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            © 2024 AR Publishers
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <AdminLoginPageContent />
    </AdminAuthProvider>
  )
} 