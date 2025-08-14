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
import { Search, MessageSquare, Check, X, Edit, Trash2, Eye, Star } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { authenticatedFetch } from '@/lib/api'

interface Comment {
  _id: string
  productId: string
  userId: string
  userName: string
  userEmail: string
  content: string
  rating: number
  isApproved: boolean
  isEdited: boolean
  editedAt?: string
  createdAt: string
  updatedAt: string
}

export default function AdminCommentsPage() {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  const fetchComments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(search && { search }),
        ...(filter !== 'all' && { isApproved: filter === 'approved' ? 'true' : 'false' })
      })

      const response = await authenticatedFetch(`/api/admin/comments?${params}`)
      if (!response.ok) throw new Error('Failed to fetch comments')

      const data = await response.json()
      setComments(data.comments)
      setTotalPages(data.pagination.pages)
      setTotal(data.pagination.total)
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch comments',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [currentPage, search, filter])

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilter: 'all' | 'approved' | 'pending') => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const handleApproveComment = async (commentId: string) => {
    try {
      const response = await authenticatedFetch(`/api/admin/comments/${commentId}/approve`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Comment approved successfully',
        })
        fetchComments()
      } else {
        throw new Error('Failed to approve comment')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve comment',
        variant: 'destructive',
      })
    }
  }

  const handleRejectComment = async (commentId: string) => {
    try {
      const response = await authenticatedFetch(`/api/admin/comments/${commentId}/reject`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Comment rejected successfully',
        })
        fetchComments()
      } else {
        throw new Error('Failed to reject comment')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject comment',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) return

    try {
      const response = await authenticatedFetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Comment deleted successfully',
        })
        fetchComments()
      } else {
        throw new Error('Failed to delete comment')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const stats = {
    total: total,
    approved: comments.filter(c => c.isApproved).length,
    pending: comments.filter(c => !c.isApproved).length,
    thisMonth: comments.filter(c => {
      const date = new Date(c.createdAt)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comment Management</h1>
            <p className="text-gray-600 mt-2">Manage product reviews and comments</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <MessageSquare className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
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
                  placeholder="Search by user name, email, or content..."
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
                  variant={filter === 'approved' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('approved')}
                >
                  Approved
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('pending')}
                >
                  Pending
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No comments found</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments.map((comment) => (
                        <TableRow key={comment._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{comment.userName}</p>
                              <p className="text-sm text-gray-500">{comment.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-600">Product ID: {comment.productId}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {renderStars(comment.rating)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-900 line-clamp-3">
                                {comment.content}
                              </p>
                              {comment.isEdited && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  Edited
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={comment.isApproved ? 'default' : 'secondary'}>
                              {comment.isApproved ? 'Approved' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              <p>{formatDate(comment.createdAt)}</p>
                              {comment.editedAt && (
                                <p className="text-xs text-gray-400">
                                  Edited: {formatDate(comment.editedAt)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedComment(comment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {!comment.isApproved ? (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApproveComment(comment._id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectComment(comment._id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                      Page {currentPage} of {totalPages} • {comments.length} comments per page
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Comment Details Modal */}
        {selectedComment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Comment Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">User Name:</label>
                    <p className="text-gray-900">{selectedComment.userName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">User Email:</label>
                    <p className="text-gray-900">{selectedComment.userEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Product ID:</label>
                    <p className="text-gray-900">{selectedComment.productId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rating:</label>
                    <div className="flex gap-1 mt-1">
                      {renderStars(selectedComment.rating)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Comment:</label>
                  <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedComment.content}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status:</label>
                    <Badge variant={selectedComment.isApproved ? 'default' : 'secondary'}>
                      {selectedComment.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created:</label>
                    <p className="text-gray-900">{formatDate(selectedComment.createdAt)}</p>
                  </div>
                  {selectedComment.isEdited && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Edited:</label>
                      <p className="text-gray-900">{formatDate(selectedComment.editedAt!)}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedComment(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                {!selectedComment.isApproved ? (
                  <Button
                    onClick={() => {
                      handleApproveComment(selectedComment._id)
                      setSelectedComment(null)
                    }}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleRejectComment(selectedComment._id)
                      setSelectedComment(null)
                    }}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteComment(selectedComment._id)
                    setSelectedComment(null)
                  }}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
