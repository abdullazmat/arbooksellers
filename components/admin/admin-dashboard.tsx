'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown, Eye, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    title: 'Orders',
    value: '2,350',
    change: '+180.1%',
    changeType: 'positive',
    icon: ShoppingCart,
  },
  {
    title: 'Customers',
    value: '12,234',
    change: '+19%',
    changeType: 'positive',
    icon: Users,
  },
  {
    title: 'Products',
    value: '573',
    change: '+201',
    changeType: 'positive',
    icon: Package,
  },
]

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    amount: '$89.99',
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customer: 'Fatima Al-Zahra',
    email: 'fatima@example.com',
    amount: '$29.99',
    status: 'processing',
    date: '2024-01-15',
  },
  {
    id: 'ORD-003',
    customer: 'Omar Abdullah',
    email: 'omar@example.com',
    amount: '$149.99',
    status: 'shipped',
    date: '2024-01-14',
  },
  {
    id: 'ORD-004',
    customer: 'Aisha Rahman',
    email: 'aisha@example.com',
    amount: '$19.99',
    status: 'completed',
    date: '2024-01-14',
  },
  {
    id: 'ORD-005',
    customer: 'Ibrahim Khan',
    email: 'ibrahim@example.com',
    amount: '$79.99',
    status: 'processing',
    date: '2024-01-13',
  },
]

const topProducts = [
  {
    id: '1',
    name: 'The Noble Quran - Arabic & English',
    sales: 245,
    revenue: '$7,350.55',
    image: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '2',
    name: 'Sahih Al-Bukhari Complete Set',
    sales: 189,
    revenue: '$16,998.11',
    image: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '3',
    name: 'Stories of the Prophets for Children',
    sales: 156,
    revenue: '$3,118.44',
    image: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '4',
    name: 'The Sealed Nectar',
    sales: 134,
    revenue: '$3,348.66',
    image: '/placeholder.svg?height=40&width=40',
  },
]

export function AdminDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-600">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Products</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {product.revenue}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <Link href="/admin/products/new">
                <Package className="h-6 w-6" />
                <span>Add Product</span>
              </Link>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <Link href="/admin/orders">
                <ShoppingCart className="h-6 w-6" />
                <span>View Orders</span>
              </Link>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <Link href="/admin/users">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Link>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" asChild>
              <Link href="/admin/support">
                <Eye className="h-6 w-6" />
                <span>Support Tickets</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
