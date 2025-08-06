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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Eye, Edit, Trash2, UserPlus, Mail, Phone, Calendar, MapPin } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'

// Mock data - in a real app, this would come from an API
const users = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+1 (555) 123-4567',
    role: 'customer',
    status: 'active',
    joinDate: '2023-06-15T10:30:00Z',
    lastLogin: '2024-01-15T14:20:00Z',
    totalOrders: 12,
    totalSpent: 1250.50,
    avatar: '/ahmed-hassan-profile.png',
    address: {
      street: '123 Islamic Way',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    }
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    email: 'fatima@example.com',
    phone: '+1 (555) 987-6543',
    role: 'customer',
    status: 'active',
    joinDate: '2023-08-22T09:15:00Z',
    lastLogin: '2024-01-14T16:45:00Z',
    totalOrders: 8,
    totalSpent: 890.25,
    avatar: '/fatima-ali-profile.png',
    address: {
      street: '456 Faith Street',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
      country: 'USA'
    }
  },
  {
    id: '3',
    name: 'Omar Abdullah',
    email: 'omar@example.com',
    phone: '+1 (555) 456-7890',
    role: 'customer',
    status: 'active',
    joinDate: '2023-11-10T11:20:00Z',
    lastLogin: '2024-01-13T12:30:00Z',
    totalOrders: 5,
    totalSpent: 450.75,
    avatar: '/omar-khan-profile.png',
    address: {
      street: '789 Peace Avenue',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    }
  },
  {
    id: '4',
    name: 'Aisha Rahman',
    email: 'aisha@example.com',
    phone: '+1 (555) 321-6547',
    role: 'admin',
    status: 'active',
    joinDate: '2023-03-05T08:45:00Z',
    lastLogin: '2024-01-15T10:15:00Z',
    totalOrders: 0,
    totalSpent: 0,
    avatar: '/aisha-rahman-profile.png',
    address: {
      street: '321 Wisdom Road',
      city: 'Houston',
      state: 'TX',
      zip: '77001',
      country: 'USA'
    }
  },
  {
    id: '5',
    name: 'Ibrahim Khan',
    email: 'ibrahim@example.com',
    phone: '+1 (555) 789-0123',
    role: 'customer',
    status: 'inactive',
    joinDate: '2023-09-18T15:30:00Z',
    lastLogin: '2023-12-20T09:45:00Z',
    totalOrders: 3,
    totalSpent: 180.00,
    avatar: null,
    address: {
      street: '654 Knowledge Lane',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'USA'
    }
  }
]

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'customer', label: 'Customer' },
  { value: 'admin', label: 'Admin' },
  { value: 'moderator', label: 'Moderator' }
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' }
]

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'moderator':
        return 'bg-blue-100 text-blue-800'
      case 'customer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600">Manage customer accounts and permissions</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{filteredUsers.length} users</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{user.totalOrders}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">${user.totalSpent.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDateTime(user.lastLogin)}</div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details - {user.name}</DialogTitle>
                            <DialogDescription>
                              Complete user information and activity
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* User Information */}
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={user.avatar || undefined} />
                                <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">{user.name}</h3>
                                <p className="text-gray-600">{user.email}</p>
                                <div className="flex space-x-2 mt-2">
                                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                                </div>
                              </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                              <h4 className="text-lg font-semibold mb-3">Contact Information</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span>{user.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{user.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span>Joined: {formatDate(user.joinDate)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span>Last login: {formatDateTime(user.lastLogin)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Address */}
                            <div>
                              <h4 className="text-lg font-semibold mb-3">Address</h4>
                              <div className="flex items-start space-x-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div>
                                  {user.address.street}<br />
                                  {user.address.city}, {user.address.state} {user.address.zip}<br />
                                  {user.address.country}
                                </div>
                              </div>
                            </div>

                            {/* Activity Summary */}
                            <div>
                              <h4 className="text-lg font-semibold mb-3">Activity Summary</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">{user.totalOrders}</div>
                                  <div className="text-sm text-gray-600">Total Orders</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">${user.totalSpent.toFixed(2)}</div>
                                  <div className="text-sm text-gray-600">Total Spent</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Edit User</Button>
                            <Button variant="outline" className="text-red-600">Suspend User</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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