'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Search, 
  Filter,
  Eye,
  Trash2,
  User,
  Calendar,
  Shield,
  Mail,
  Phone
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface AdminUser {
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (roleFilter !== 'all') {
        params.append('role', roleFilter)
      }

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
      setTotalPages(data.pagination.pages)
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
        return 'bg-zinc-100 dark:bg-white/5 text-foreground'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'user':
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    try {
      setDeleting(true)
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/users/${userToDelete._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete user')
      }
      setUserToDelete(null)
      if (selectedUser?._id === userToDelete._id) setSelectedUser(null)
      await fetchUsers()
      toast({
        title: 'User deleted',
        description: `${userToDelete.name} has been removed.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete user',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  const exportToCSV = () => {
    if (users.length === 0) {
      toast({ title: "No data", description: "There are no users to export.", variant: "destructive" });
      return;
    }
    const headers = ["User ID", "Name", "Email", "Role", "Phone", "Addresses Count", "Joined Date"];
    const csvContent = users.map(user => [
      user._id,
      `"${user.name}"`,
      `"${user.email}"`,
      user.role,
      `"${user.phone || ''}"`,
      user.addresses?.length || 0,
      new Date(user.createdAt).toISOString()
    ].join(","));
    
    const csvString = [headers.join(","), ...csvContent].join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8 selection:bg-islamic-green-100 selection:text-islamic-green-900">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Users</h1>
            <p className="text-muted-foreground font-medium mt-1">Manage users and their permissions</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Button onClick={exportToCSV} className="flex-1 md:flex-none h-12 rounded-xl font-black text-[10px] uppercase tracking-widest bg-foreground text-background hover:bg-islamic-green-600 hover:text-white transition-all">
                Export Users
             </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border/50 dark:border-white/5 shadow-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-zinc-50/50 dark:bg-white/2 pb-6 px-8 pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Search className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-foreground">User Search</CardTitle>
                <CardDescription className="font-medium">Search for users</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-islamic-green-600 h-5 w-5 transition-colors" />
                  <Input
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-zinc-100/50 dark:bg-background border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-islamic-green-500 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-14 px-6 rounded-2xl bg-zinc-100/50 dark:bg-background border border-border/50 focus:outline-none focus:ring-2 focus:ring-islamic-green-500 font-bold text-sm min-w-[200px] appearance-none cursor-pointer"
                >
                  <option value="all">Role: All</option>
                  <option value="user">Role: User</option>
                  <option value="admin">Role: Admin</option>
                </select>
                <Button 
                  className="h-14 w-14 rounded-2xl p-0 bg-background border border-border/50 text-foreground hover:bg-islamic-green-600 hover:text-white transition-all shadow-sm"
                  onClick={fetchUsers}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-card border-border/50 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-zinc-50/50 dark:bg-white/2 p-8 text-center sm:text-left">
              <CardTitle className="text-2xl font-black text-foreground tracking-tight">Users</CardTitle>
              <CardDescription className="font-medium mt-1">Total Users: {users.length}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-50/50 dark:bg-white/2">
                  <TableRow className="hover:bg-transparent border-border/50 h-16">
                    <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground">User</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Contact</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Role</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Addresses</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Joined Date</TableHead>
                    <TableHead className="text-right px-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} className="border-border/50 hover:bg-zinc-50/50 dark:hover:bg-white/2 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform shadow-sm">
                            <span className="text-lg font-black text-purple-600">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-black text-foreground tracking-tight text-sm">{user.name}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">UID: {user._id.slice(-8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 bg-zinc-100 dark:bg-white/5 rounded-lg">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-bold text-foreground/80">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-2.5">
                               <div className="p-1.5 bg-zinc-100 dark:bg-white/5 rounded-lg">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground">{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${user.role === 'admin' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>
                             {getRoleIcon(user.role)}
                          </div>
                          <Badge className={`${getRoleColor(user.role)} border-none text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg shadow-sm`}>
                            {user.role}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          <div className="text-xs font-black text-foreground leading-none">{user.addresses.length} Saved Addresses</div>
                          {user.addresses.length > 0 && (
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                              <span className="inline-block h-1 w-1 rounded-full bg-islamic-green-600" />
                              {user.addresses.find(addr => addr.isDefault)?.city || user.addresses[0]?.city}
                              {user.addresses.length > 1 && ` +${user.addresses.length - 1} Location`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          <Calendar className="h-3.5 w-3.5 opacity-50" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 p-0 rounded-xl hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUserToDelete(user)}
                            className="h-10 w-10 p-0 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-8 border-t border-border/50 bg-zinc-50/50 dark:bg-white/2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50 h-10 rounded-xl' : 'h-10 rounded-xl font-bold bg-background border-border/50'}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(1)
                          }}
                           className="h-10 w-10 rounded-xl font-bold border-border/50"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis */}
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Page numbers around current page */}
                    {(() => {
                      const pages = []
                      const startPage = Math.max(1, currentPage - 2)
                      const endPage = Math.min(totalPages, currentPage + 2)
                      
                      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                        pages.push(pageNum)
                      }
                      
                      return pages.map((pageNum) => (
                        <PaginationItem key={`page-${pageNum}`}>
                          <PaginationLink 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(pageNum)
                            }}
                            isActive={pageNum === currentPage}
                            className="h-10 w-10 rounded-xl font-black transition-all data-[active=true]:bg-islamic-green-600 data-[active=true]:text-white border-border/50"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))
                    })()}
                    
                    {/* Ellipsis */}
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(totalPages)
                          }}
                           className="h-10 w-10 rounded-xl font-bold border-border/50"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50 h-10 rounded-xl' : 'h-10 rounded-xl font-bold bg-background border-border/50'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-6 opacity-60">
                  Page {currentPage} of {totalPages} • Showing {users.length} Users
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* User detail modal */}
      <UserDetailDialog user={selectedUser} onClose={() => setSelectedUser(null)} />

      {/* Delete confirmation */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => { if (!open) setUserToDelete(null) }}>
        <AlertDialogContent className="bg-background border border-border/50 shadow-2xl rounded-[2.5rem] p-10">
          <AlertDialogHeader>
             <div className="w-16 h-16 bg-red-500/10 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="h-8 w-8" />
             </div>
            <AlertDialogTitle className="text-2xl font-black text-foreground tracking-tight">Delete User?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium pt-2 leading-relaxed">
              Are you sure you want to delete <strong>{userToDelete?.name}</strong> ({userToDelete?.email})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel disabled={deleting} className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteUser()
              }}
              disabled={deleting}
              className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-500/20"
            >
              {deleting ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
} 

// User detail dialog
// Rendered at the end to avoid layout shifts
function UserDetailDialog({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  return (
    <Dialog open={!!user} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="bg-background border border-border/50 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] rounded-[3rem] max-w-2xl w-full p-10">
        <DialogHeader className="mb-10 text-left">
           <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                 <User className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black text-foreground tracking-tighter">User Details</DialogTitle>
                <DialogDescription className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">View user information</DialogDescription>
              </div>
           </div>
        </DialogHeader>
        {user && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Role", value: user.role, extraClasses: "capitalize" },
                { label: "Phone", value: user.phone || "Not Configured" },
                { label: "Joined Date", value: new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) },
              ].map((item, i) => (
                <div key={i} className="space-y-1.5 p-5 bg-zinc-50/50 dark:bg-white/2 border border-border/30 rounded-2xl">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                  <p className={`text-base font-black text-foreground tracking-tight ${item.extraClasses || ""}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-2">Saved Addresses</h4>
              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-3">
                  {user.addresses.map((addr, idx) => (
                    <div key={idx} className="p-6 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl border border-border/30 flex justify-between items-start">
                      <div className="space-y-1 text-sm font-bold text-foreground">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-[10px] font-black uppercase tracking-widest bg-foreground text-background dark:bg-white dark:text-black py-1 px-3 rounded-lg border border-border/30">{addr.type}</span>
                           {addr.isDefault && (
                             <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg border-islamic-green-600/30 text-islamic-green-600 bg-islamic-green-500/10">Default Entry</Badge>
                           )}
                        </div>
                        <div className="opacity-90 leading-relaxed">
                          {addr.address}<br />
                          <span className="text-muted-foreground uppercase text-[11px] tracking-wider">{addr.city}, {addr.state} {addr.zipCode}</span><br />
                          <span className="text-muted-foreground uppercase text-[11px] tracking-wider font-black">{addr.country}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-zinc-50 dark:bg-white/5 rounded-3xl border border-dashed border-border/50">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No addresses saved</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/50 hover:bg-foreground hover:text-background transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}