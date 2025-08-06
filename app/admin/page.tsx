'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for admin authentication
    const adminToken = localStorage.getItem('adminToken')
    const adminUserData = localStorage.getItem('adminUser')

    if (!adminToken || !adminUserData) {
      router.push('/admin/login')
      return
    }

    try {
      const user = JSON.parse(adminUserData)
      setAdminUser(user)
    } catch (error) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      router.push('/admin/login')
      return
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!adminUser) {
    return null
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}
