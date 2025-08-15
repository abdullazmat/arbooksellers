'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'

interface DashboardStats {
  totalSales: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  pendingOrders: number
  processingOrders: number
}

interface RecentOrder {
  _id: string
  orderNumber?: string
  user?: {
    name?: string
    email?: string
  }
  total: number
  orderStatus: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    processingOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')

    if (!adminToken || !adminUser) {
      router.push('/admin/login')
      return
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')

      // Fetch orders data (includes stats)
      const ordersResponse = await fetch('/api/admin/orders?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch orders data')
      }

      const ordersData = await ordersResponse.json()

      // Fetch users data
      const usersResponse = await fetch('/api/admin/users?limit=1', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users data')
      }

      const usersData = await usersResponse.json()

      // Fetch products data
      const productsResponse = await fetch('/api/admin/products?limit=1', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products data')
      }

      const productsData = await productsResponse.json()

      setStats({
        totalSales: ordersData.stats?.totalSales || 0,
        totalOrders: ordersData.stats?.totalOrders || 0,
        totalUsers: usersData.stats?.totalUsers || 0,
        totalProducts: productsData.pagination?.total || 0,
        pendingOrders: ordersData.stats?.pendingOrders || 0,
        processingOrders: ordersData.stats?.processingOrders || 0,
      })

      // Validate and set recent orders
      if (ordersData.orders && Array.isArray(ordersData.orders)) {
        // Filter out any orders with missing user data
        const validOrders = ordersData.orders.filter((order: any) => 
          order && order._id && order.total && order.orderStatus && order.createdAt
        )
        setRecentOrders(validOrders)
      } else {
        setRecentOrders([])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      })
      // Set default values to prevent crashes
      setStats({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        pendingOrders: 0,
        processingOrders: 0,
      })
      setRecentOrders([])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return formatPrice(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
              <p className="text-xs text-gray-600">
                <ArrowUpRight className="inline h-3 w-3 text-green-600" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-gray-600">
                <ArrowUpRight className="inline h-3 w-3 text-green-600" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-gray-600">
                <ArrowUpRight className="inline h-3 w-3 text-green-600" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-gray-600">
                <ArrowUpRight className="inline h-3 w-3 text-green-600" />
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.processingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => router.push('/admin/products')}
              >
                Add Product
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/admin/orders')}
              >
                View Orders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders from your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No orders found</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">#{order.orderNumber || order._id.slice(-6)}</p>
                        <p className="text-sm text-gray-600">
                          {order.user?.name || order.user?.email || 'Unknown Customer'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total)}</p>
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentOrders.length > 0 && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/admin/orders')}
                >
                  View All Orders
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
