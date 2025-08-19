'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface AdminUser {
  _id: string
  name: string
  email: string
  role: 'admin'
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

interface AdminAuthContextType {
  adminUser: AdminUser | null
  adminToken: string | null
  isLoading: boolean
  adminSignIn: (email: string, password: string) => Promise<boolean>
  adminSignOut: () => void
  updateAdminUser: (userData: Partial<AdminUser>) => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check for existing admin token on mount
  useEffect(() => {
    const storedAdminToken = localStorage.getItem('adminToken');
    const storedAdminUser = localStorage.getItem('adminUser');

    if (storedAdminToken && storedAdminUser) {
      try {
        // Check if token is expired
        const tokenPayload = JSON.parse(atob(storedAdminToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          // Token is expired, clear it
          console.log('Admin token expired, clearing...');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setIsLoading(false);
          return;
        }

        const parsedAdminUser = JSON.parse(storedAdminUser);
        setAdminUser(parsedAdminUser);
        setAdminToken(storedAdminToken);
      } catch (error) {
        console.error('Error parsing stored admin user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const adminSignIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Admin Login Failed',
          description: data.error || 'Invalid email or password',
          variant: 'destructive',
        })
        return false
      }

      setAdminUser(data.user)
      setAdminToken(data.token)
      
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminUser', JSON.stringify(data.user))

      toast({
        title: 'Admin Login Successful',
        description: `Welcome back, ${data.user.name}!`,
      })

      router.push('/admin')
      return true
    } catch (error: any) {
      console.error('Admin login error:', error)
      toast({
        title: 'Admin Login Failed',
        description: error.message || 'Login failed',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const adminSignOut = () => {
    setAdminUser(null)
    setAdminToken(null)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out from admin panel',
    })
    
    router.push('/admin/login')
  }

  const updateAdminUser = (userData: Partial<AdminUser>) => {
    if (adminUser) {
      const updatedUser = { ...adminUser, ...userData }
      setAdminUser(updatedUser)
      localStorage.setItem('adminUser', JSON.stringify(updatedUser))
    }
  }

  const isTokenExpired = (token: string): boolean => {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return tokenPayload.exp && tokenPayload.exp < currentTime;
    } catch (error) {
      return true; // If we can't parse the token, consider it expired
    }
  }

  const clearExpiredToken = () => {
    if (adminToken && isTokenExpired(adminToken)) {
      console.log('Clearing expired admin token...');
      setAdminUser(null);
      setAdminToken(null);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    }
  }

  const value = {
    adminUser,
    adminToken,
    isLoading,
    adminSignIn,
    adminSignOut,
    updateAdminUser,
    isTokenExpired,
    clearExpiredToken,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
