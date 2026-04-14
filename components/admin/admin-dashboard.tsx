'use client'

import { useState, useEffect } from 'react'
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
  ArrowDownRight,
  Eye,
  Clock,
  CheckCircle,
  XCircle
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
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
}

interface RecentOrder {
  _id: string
  orderNumber: string
  user: {
    name: string
    email: string
  }
  total: number
  orderStatus: string
  createdAt: string
}

interface TopProduct {
  _id: string
  title: string
  totalSold: number
  revenue: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')

      // Fetch orders data (includes stats)
      const ordersResponse = await fetch('/api/admin/orders?limit=10', {
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
        totalSales: ordersData.stats.totalSales || 0,
        totalOrders: ordersData.stats.totalOrders || 0,
        totalUsers: usersData.stats.totalUsers || 0,
        totalProducts: productsData.pagination.total || 0,
        pendingOrders: ordersData.stats.pendingOrders || 0,
        processingOrders: ordersData.stats.processingOrders || 0,
        shippedOrders: 0, // You can add these to your stats aggregation
        deliveredOrders: 0,
        cancelledOrders: 0,
      })

      setRecentOrders(ordersData.orders || [])
      setTopProducts([]) // You can implement top products logic
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      })
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'processing':
        return <Activity className="h-4 w-4" />
      case 'shipped':
        return <Eye className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 selection:bg-islamic-green-100 selection:text-islamic-green-900">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-foreground tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground font-medium mt-1">Overview of your business performance and key metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "Total Sales", value: formatPrice(stats.totalSales), icon: DollarSign, color: "text-islamic-green-600", trend: "+12.5%", trendIcon: ArrowUpRight, bg: "bg-islamic-green-500/10" },
          { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-600", trend: "+8.2%", trendIcon: ArrowUpRight, bg: "bg-blue-500/10" },
          { title: "Active Users", value: stats.totalUsers, icon: Users, color: "text-purple-600", trend: "+15.0%", trendIcon: ArrowUpRight, bg: "bg-purple-500/10" },
          { title: "Inventory Items", value: stats.totalProducts, icon: Package, color: "text-orange-600", trend: "+5.4%", trendIcon: ArrowUpRight, bg: "bg-orange-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border/50 dark:border-white/5 shadow-xl rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground tracking-tight">
                {stat.value}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="flex items-center text-[10px] font-black text-islamic-green-600 uppercase tracking-widest">
                  <stat.trendIcon className="inline h-3 w-3 mr-0.5" />
                  {stat.trend}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-card border-border/50 dark:border-white/5 shadow-xl rounded-[2.5rem]">
          <CardHeader className="pb-2 px-8 pt-8">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-yellow-500/10 rounded-3xl border border-yellow-500/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600/70 mb-1">Pending</p>
                   <p className="text-2xl font-black text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <div className="p-5 bg-blue-500/10 rounded-3xl border border-blue-500/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-600/70 mb-1">Processing</p>
                   <p className="text-2xl font-black text-blue-600">{stats.processingOrders}</p>
                </div>
             </div>
             <div className="mt-6 space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-foreground text-background hover:bg-islamic-green-600 hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest h-14"
                  onClick={() => window.location.href = '/admin/products'}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full rounded-2xl font-black text-sm uppercase tracking-widest h-14 border-border/50"
                  onClick={() => window.location.href = '/admin/orders'}
                >
                  View Orders
                </Button>
             </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="bg-zinc-100/50 dark:bg-white/5 p-1.5 rounded-2xl h-14 border border-border/50">
              <TabsTrigger value="orders" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg">Recent Orders</TabsTrigger>
              <TabsTrigger value="products" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg">Top Sellers</TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg">Intelligence</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card className="bg-card border-border/50 dark:border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-border/30 bg-zinc-50/50 dark:bg-white/2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-black text-foreground">Latest Orders</CardTitle>
                      <CardDescription className="font-medium">Real-time customer transactions</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-islamic-green-600 hover:bg-islamic-green-500/10 h-10 px-5 rounded-xl transition-all" onClick={() => window.location.href = '/admin/orders'}>
                      See All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="divide-y divide-border/30">
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="bg-zinc-100 dark:bg-white/5 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                           <Clock className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No activity found</p>
                      </div>
                    ) : (
                      recentOrders.map((order) => (
                        <div key={order._id} className="group flex items-center justify-between p-6 hover:bg-zinc-50/50 dark:hover:bg-white/2 transition-all rounded-3xl">
                          <div className="flex items-center space-x-5">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${getStatusColor(order.orderStatus).split(' ')[0]} bg-opacity-20`}>
                              {getStatusIcon(order.orderStatus)}
                            </div>
                            <div className="min-w-0">
                                <p className="font-black text-foreground text-sm tracking-tight capitalize">#{order.orderNumber || order._id.slice(-8)}</p>
                                <p className="text-xs font-bold text-muted-foreground mt-0.5">{order.user.name}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1.5">
                            <p className="font-black text-foreground text-base tracking-tight">{formatPrice(order.total)}</p>
                            <Badge className={`${getStatusColor(order.orderStatus)} border-none text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg`}>
                              {order.orderStatus}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card className="bg-card border-border/50 dark:border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-border/30 bg-zinc-50/50 dark:bg-white/2">
                   <CardTitle className="text-xl font-black text-foreground">Top Performing Items</CardTitle>
                   <CardDescription className="font-medium">Products generating most revenue</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {topProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-zinc-100 dark:bg-white/5 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                           <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Awaiting data...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {topProducts.map((product, index) => (
                        <div key={product._id} className="flex items-center justify-between p-5 hover:bg-zinc-50/50 dark:hover:bg-white/2 transition-all rounded-2xl border border-transparent hover:border-border/30 group">
                          <div className="flex items-center space-x-5">
                            <div className="w-10 h-10 bg-zinc-100 dark:bg-background rounded-xl flex items-center justify-center text-xs font-black text-muted-foreground transition-all group-hover:bg-islamic-green-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-islamic-green-600/20">
                              {index + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-foreground text-sm tracking-tight truncate max-w-[200px]">{product.title}</p>
                              <p className="text-xs font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">{product.totalSold} Units Shipped</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-islamic-green-600 text-base">{formatPrice(product.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card className="bg-card border-border/50 dark:border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-border/30 bg-zinc-50/50 dark:bg-white/2">
                  <CardTitle className="text-xl font-black text-foreground">Operational Intelligence</CardTitle>
                  <CardDescription className="font-medium">Detailed distribution and efficiency</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Order Lifecycle</h3>
                      <div className="space-y-4">
                        {[
                          { label: "Pending Fulfillment", value: stats.pendingOrders, percent: 30, color: "bg-yellow-500" },
                          { label: "Under Processing", value: stats.processingOrders, percent: 45, color: "bg-blue-500" },
                          { label: "Dispatched", value: stats.shippedOrders, percent: 15, color: "bg-purple-500" },
                          { label: "Successfully Delivered", value: stats.deliveredOrders, percent: 10, color: "bg-islamic-green-600" },
                        ].map((item, idx) => (
                           <div key={idx} className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest leading-none">
                                <span className="text-foreground/60">{item.label}</span>
                                <span className="text-foreground">{item.value}</span>
                              </div>
                              <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                                 <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                              </div>
                           </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Performance Ratios</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { label: "Avg Transaction Value", value: stats.totalOrders > 0 ? formatPrice(stats.totalSales / stats.totalOrders) : formatPrice(0), bg: "bg-zinc-100 dark:bg-white/5" },
                          { label: "User Acquisition Rate", value: stats.totalUsers > 0 ? ((stats.totalOrders / stats.totalUsers) * 100).toFixed(1) + "%" : "0.0%", bg: "bg-zinc-100 dark:bg-white/5" },
                        ].map((stat, idx) => (
                           <div key={idx} className={`p-6 ${stat.bg} rounded-[1.5rem] border border-border/30`}>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                              <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
