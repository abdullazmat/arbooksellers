'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  phone?: string
  addresses: Array<{
    type: 'home' | 'work' | 'other'
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault: boolean
  }>
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  signOut: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Loading stored auth state:', parsedUser._id);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('No stored auth state found');
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Login Failed',
          description: data.error || 'Invalid email or password',
          variant: 'destructive',
        })
        return false
      }

      console.log('User signed in successfully:', data.user._id);
      setUser(data.user)
      setToken(data.token)
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${data.user.name}!`,
      })

      if (data.user.role === 'admin') {
        // Redirect admin to admin panel
        router.push('/admin');
      } else {
        // Redirect regular user to dashboard
        router.push('/dashboard');
      }

      return true
    } catch (error) {
      console.error('Sign in error:', error)
      toast({
        title: 'Login Failed',
        description: 'An error occurred during login',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Registration Failed',
          description: data.error || 'Failed to create account',
          variant: 'destructive',
        })
        return false
      }

      setUser(data.user)
      setToken(data.token)
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      toast({
        title: 'Registration Successful',
        description: `Welcome, ${data.user.name}! Your account has been created.`,
      })

      // Redirect based on user role
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

      return true
    } catch (error) {
      console.error('Sign up error:', error)
      toast({
        title: 'Registration Failed',
        description: 'An error occurred during registration',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    toast({
      title: 'Signed Out',
      description: 'You have been successfully signed out',
    })
    
    router.push('/')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
