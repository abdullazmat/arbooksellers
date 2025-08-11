'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  User,
  Loader2,
  Calendar,
  Mail,
  Phone,
  Shield
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

interface UserStats {
  totalUsers: number
  totalAdmins: number
  activeUsers: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalAdmins: 0,
    activeUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'user' | 'admin',
    isActive: true,
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedRole !== 'all') params.append('role', selectedRole)

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users)
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUser) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      toast({
        title: 'Success',
        description: 'User updated successfully',
      })

      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setEditData({ name: '', email: '', phone: '', role: 'user', isActive: true })
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      })

      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      })
    }
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive !== false,
    })
    setIsEditDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'user':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchUsers}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>
              {users.length} users found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">ID: {user._id.slice(-8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <p className="text-sm">{user.email}</p>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <p className="text-sm text-gray-600">{user.phone}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={user.isActive !== false}
                            disabled
                          />
                          <span className="text-sm">
                            {user.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && users.length === 0 && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View User Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                View complete user information
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Contact Information</h4>
                    <p className="text-sm">{selectedUser.email}</p>
                    {selectedUser.phone && (
                      <p className="text-sm">{selectedUser.phone}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Account Status</h4>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedUser.isActive !== false}
                        disabled
                      />
                      <span className="text-sm">
                        {selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Member Since</h4>
                    <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Last Updated</h4>
                    <p className="text-sm">{formatDate(selectedUser.updatedAt)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700">User ID</h4>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {selectedUser._id}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={editData.role} onValueChange={(value: 'user' | 'admin') => setEditData({ ...editData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editData.isActive}
                  onCheckedChange={(checked) => setEditData({ ...editData, isActive: checked })}
                />
                <label className="text-sm font-medium">Active Account</label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
} 