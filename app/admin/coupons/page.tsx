'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Edit, Trash2, Copy, Calendar, Tag, Users, DollarSign } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'

// Mock data - in a real app, this would come from an API
const coupons = [
  {
    id: '1',
    code: 'RAMADAN2024',
    name: 'Ramadan Special Discount',
    description: 'Special discount for the holy month of Ramadan',
    type: 'percentage',
    value: 15,
    minOrderAmount: 50,
    maxDiscount: 100,
    usageLimit: 1000,
    usedCount: 245,
    startDate: '2024-03-10T00:00:00Z',
    endDate: '2024-04-10T23:59:59Z',
    isActive: true,
    applicableProducts: 'all',
    applicableCategories: ['quran', 'hadith', 'islamic-studies'],
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: '2',
    code: 'WELCOME10',
    name: 'Welcome Discount',
    description: '10% off for new customers',
    type: 'percentage',
    value: 10,
    minOrderAmount: 25,
    maxDiscount: 50,
    usageLimit: 500,
    usedCount: 189,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    isActive: true,
    applicableProducts: 'all',
    applicableCategories: ['all'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'FREESHIP',
    name: 'Free Shipping',
    description: 'Free shipping on orders over $75',
    type: 'fixed',
    value: 9.99,
    minOrderAmount: 75,
    maxDiscount: 9.99,
    usageLimit: 200,
    usedCount: 67,
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-05-31T23:59:59Z',
    isActive: true,
    applicableProducts: 'all',
    applicableCategories: ['all'],
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '4',
    code: 'QURAN20',
    name: 'Quran Collection Discount',
    description: '20% off on all Quran books',
    type: 'percentage',
    value: 20,
    minOrderAmount: 30,
    maxDiscount: 75,
    usageLimit: 100,
    usedCount: 89,
    startDate: '2024-03-15T00:00:00Z',
    endDate: '2024-04-15T23:59:59Z',
    isActive: false,
    applicableProducts: 'category',
    applicableCategories: ['quran'],
    createdAt: '2024-03-15T00:00:00Z'
  }
]

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'quran', label: 'Quran & Tafsir' },
  { value: 'hadith', label: 'Hadith Collections' },
  { value: 'islamic-studies', label: 'Islamic Studies' },
  { value: 'kids', label: 'Children Books' },
  { value: 'biography', label: 'Biographies' },
  { value: 'duas', label: 'Duas & Supplications' }
]

export default function AdminCouponsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && coupon.isActive) ||
                         (selectedStatus === 'inactive' && !coupon.isActive)
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type: string) => {
    return type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatValue = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `$${value.toFixed(2)}`
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coupons & Discounts</h1>
            <p className="text-gray-600">Manage promotional codes and discounts</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Coupon</DialogTitle>
                <DialogDescription>
                  Create a new promotional code for your customers
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input id="code" placeholder="e.g., RAMADAN2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Coupon Name</Label>
                  <Input id="name" placeholder="e.g., Ramadan Special" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Discount Value</Label>
                  <Input id="value" type="number" step="0.01" placeholder="15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrder">Minimum Order Amount</Label>
                  <Input id="minOrder" type="number" step="0.01" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Maximum Discount</Label>
                  <Input id="maxDiscount" type="number" step="0.01" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input id="usageLimit" type="number" placeholder="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicableProducts">Applicable Products</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="category">Specific Categories</SelectItem>
                      <SelectItem value="specific">Specific Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Active Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Coupon description..." />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>Add Coupon</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{filteredCoupons.length} coupons</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coupons Table */}
        <Card>
          <CardHeader>
            <CardTitle>Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-medium">{coupon.code}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(coupon.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{coupon.name}</div>
                        <div className="text-sm text-gray-500">{coupon.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(coupon.type)}>
                        {coupon.type === 'percentage' ? 'Percentage' : 'Fixed'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatValue(coupon.type, coupon.value)}</div>
                        <div className="text-sm text-gray-500">
                          Min: ${coupon.minOrderAmount} | Max: ${coupon.maxDiscount}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{coupon.usedCount} / {coupon.usageLimit}</div>
                        <div className="text-gray-500">
                          {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}% used
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(coupon.isActive)}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(coupon.endDate)}</div>
                        <div className="text-gray-500">
                          {new Date(coupon.endDate) > new Date() ? 'Valid' : 'Expired'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 