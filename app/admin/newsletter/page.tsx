"use client"

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useToast } from '@/hooks/use-toast'
import { Search, Mail, Download, Trash2, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface NewsletterSubscription {
  _id: string
  email: string
  name?: string
  subscribed: boolean
  subscribedAt: string
  unsubscribedAt?: string
  lastEmailSent?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export default function NewsletterPage() {
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedSubscription, setSelectedSubscription] = useState<NewsletterSubscription | null>(null)

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(search && { search }),
        ...(filter !== 'all' && { subscribed: filter === 'subscribed' ? 'true' : 'false' })
      })

      const response = await fetch(`/api/newsletter?${params}`)
      if (!response.ok) throw new Error('Failed to fetch subscriptions')

      const data = await response.json()
      setSubscriptions(data.subscriptions)
      setTotalPages(data.pagination.pages)
      setTotal(data.pagination.total)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch newsletter subscriptions',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [currentPage, search, filter])

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilter: 'all' | 'subscribed' | 'unsubscribed') => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const handleUnsubscribe = async (email: string) => {
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User unsubscribed successfully',
        })
        fetchSubscriptions()
      } else {
        throw new Error('Failed to unsubscribe')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unsubscribe user',
        variant: 'destructive',
      })
    }
  }

  const handleResubscribe = async (email: string) => {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User resubscribed successfully',
        })
        fetchSubscriptions()
      } else {
        throw new Error('Failed to resubscribe')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resubscribe user',
        variant: 'destructive',
      })
    }
  }

  const exportSubscriptions = () => {
    const csvContent = [
      ['Email', 'Name', 'Status', 'Subscribed Date', 'Unsubscribed Date', 'Created Date'],
      ...subscriptions.map(sub => [
        sub.email,
        sub.name || '',
        sub.subscribed ? 'Subscribed' : 'Unsubscribed',
        formatDate(sub.subscribedAt),
        sub.unsubscribedAt ? formatDate(sub.unsubscribedAt) : '',
        formatDate(sub.createdAt)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const stats = {
    total: total,
    subscribed: subscriptions.filter(s => s.subscribed).length,
    unsubscribed: subscriptions.filter(s => !s.subscribed).length,
    thisMonth: subscriptions.filter(s => {
      const date = new Date(s.subscribedAt)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
            <p className="text-gray-600 mt-2">Manage newsletter subscriptions and subscriber data</p>
          </div>
          <Button onClick={exportSubscriptions} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.subscribed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
              <Mail className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.unsubscribed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.thisMonth}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'subscribed' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('subscribed')}
                >
                  Subscribed
                </Button>
                <Button
                  variant={filter === 'unsubscribed' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('unsubscribed')}
                >
                  Unsubscribed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Newsletter Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading subscriptions...</p>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No subscriptions found</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subscribed Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((subscription) => (
                        <TableRow key={subscription._id}>
                          <TableCell className="font-medium">{subscription.email}</TableCell>
                          <TableCell>{subscription.name || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={subscription.subscribed ? 'default' : 'secondary'}>
                              {subscription.subscribed ? 'Subscribed' : 'Unsubscribed'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(subscription.subscribedAt)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedSubscription(subscription)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {subscription.subscribed ? (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleUnsubscribe(subscription.email)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleResubscribe(subscription.email)}
                                >
                                  Resubscribe
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
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
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i))
                          if (pageNum > 0 && pageNum <= totalPages) {
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setCurrentPage(pageNum)
                                  }}
                                  isActive={pageNum === currentPage}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          }
                          return null
                        })}
                        
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
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                    
                    <div className="text-center text-sm text-gray-600 mt-4">
                      Page {currentPage} of {totalPages} • {subscriptions.length} subscriptions per page
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Subscription Details Modal */}
        {selectedSubscription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email:</label>
                  <p className="text-gray-900">{selectedSubscription.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Name:</label>
                  <p className="text-gray-900">{selectedSubscription.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status:</label>
                  <Badge variant={selectedSubscription.subscribed ? 'default' : 'secondary'}>
                    {selectedSubscription.subscribed ? 'Subscribed' : 'Unsubscribed'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Subscribed Date:</label>
                  <p className="text-gray-900">{formatDate(selectedSubscription.subscribedAt)}</p>
                </div>
                {selectedSubscription.unsubscribedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Unsubscribed Date:</label>
                    <p className="text-gray-900">{formatDate(selectedSubscription.unsubscribedAt)}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Created Date:</label>
                  <p className="text-gray-900">{formatDate(selectedSubscription.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubscription(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                {selectedSubscription.subscribed ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleUnsubscribe(selectedSubscription.email)
                      setSelectedSubscription(null)
                    }}
                    className="flex-1"
                  >
                    Unsubscribe
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleResubscribe(selectedSubscription.email)
                      setSelectedSubscription(null)
                    }}
                    className="flex-1"
                  >
                    Resubscribe
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
