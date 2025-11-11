'use client'

import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useToast } from '@/components/ui/use-toast'
import { Mail, Phone, Search, RefreshCw } from 'lucide-react'

export default function AdminContactsPage() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'all' | 'new' | 'read' | 'resolved'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'status'>('newest')
  const [q, setQ] = useState('')

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
      if (!token) {
        toast({ title: 'Authentication required', description: 'Please log in to view contacts', variant: 'destructive' })
        return
      }
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status,
        sort,
      })
      if (q.trim()) params.set('q', q.trim())
      const res = await fetch(`/api/admin/contacts?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to load contacts')
      }
      setContacts(data.items || [])
      setTotal(data.pagination?.total || 0)
    } catch (err: any) {
      toast({ title: 'Failed to load contacts', description: err?.message || 'Unknown error', variant: 'destructive' })
      setContacts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
    if (token) {
      fetchContacts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, sort, q])

  const statusColor = (s: string) => {
    switch (s) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'read':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Forms</h1>
            <p className="text-gray-600">View messages submitted via the contact form</p>
          </div>
          <Button onClick={fetchContacts} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, subject or message"
                  className="pl-9"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setPage(1)
                    }
                  }}
                />
              </div>
              <Select value={status} onValueChange={(v: any) => { setPage(1); setStatus(v) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v: any) => { setPage(1); setSort(v) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          <span>{c.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          <span>{c.phone || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[280px]">
                        <div className="truncate" title={c.subject}>{c.subject}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(c.status)}>{c.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {!loading && contacts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No contact forms found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {loading && (
              <div className="text-center text-sm text-gray-600">Loading...</div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages} • {contacts.length} of {total} items {loading ? '(Loading...)' : ''}
              </div>
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className="cursor-pointer"
                        onClick={() => {
                          if (page > 1) {
                            setLoading(true)
                            setPage(page - 1)
                          }
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          isActive={page === idx + 1}
                          className="cursor-pointer"
                          onClick={() => {
                            if (page !== idx + 1) {
                              setLoading(true)
                              setPage(idx + 1)
                            }
                          }}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className="cursor-pointer"
                        onClick={() => {
                          if (page < totalPages) {
                            setLoading(true)
                            setPage(page + 1)
                          }
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}


