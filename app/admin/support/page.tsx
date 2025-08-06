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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Eye, MessageSquare, Clock, CheckCircle, AlertCircle, Mail, Phone, Calendar, User } from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'

// Mock data - in a real app, this would come from an API
const tickets = [
  {
    id: 'TKT-001',
    customer: {
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+1 (555) 123-4567'
    },
    subject: 'Order not received',
    message: 'I placed an order on January 15th but haven\'t received it yet. The tracking number shows it\'s been stuck in transit for 5 days. Can you help me track this down?',
    status: 'open',
    priority: 'high',
    category: 'order',
    assignedTo: 'Admin User',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    replies: [
      {
        id: '1',
        from: 'customer',
        message: 'I placed an order on January 15th but haven\'t received it yet. The tracking number shows it\'s been stuck in transit for 5 days. Can you help me track this down?',
        timestamp: '2024-01-20T10:30:00Z'
      },
      {
        id: '2',
        from: 'admin',
        message: 'I apologize for the delay. Let me check the status of your order and get back to you within 24 hours.',
        timestamp: '2024-01-20T14:20:00Z'
      }
    ]
  },
  {
    id: 'TKT-002',
    customer: {
      name: 'Fatima Al-Zahra',
      email: 'fatima@example.com',
      phone: '+1 (555) 987-6543'
    },
    subject: 'Wrong book received',
    message: 'I ordered "Sahih Al-Bukhari Complete Set" but received a different book. The packaging was correct but the contents were wrong.',
    status: 'in_progress',
    priority: 'medium',
    category: 'product',
    assignedTo: 'Admin User',
    createdAt: '2024-01-19T15:45:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    replies: [
      {
        id: '1',
        from: 'customer',
        message: 'I ordered "Sahih Al-Bukhari Complete Set" but received a different book. The packaging was correct but the contents were wrong.',
        timestamp: '2024-01-19T15:45:00Z'
      },
      {
        id: '2',
        from: 'admin',
        message: 'I\'m very sorry for this mistake. We\'ll send you the correct book immediately and provide a return label for the wrong item.',
        timestamp: '2024-01-20T09:15:00Z'
      }
    ]
  },
  {
    id: 'TKT-003',
    customer: {
      name: 'Omar Abdullah',
      email: 'omar@example.com',
      phone: '+1 (555) 456-7890'
    },
    subject: 'Website not working',
    message: 'I\'m trying to place an order but the website keeps showing an error when I try to add items to cart. This has been happening for the past 2 days.',
    status: 'closed',
    priority: 'low',
    category: 'technical',
    assignedTo: 'Admin User',
    createdAt: '2024-01-18T11:20:00Z',
    updatedAt: '2024-01-19T16:30:00Z',
    replies: [
      {
        id: '1',
        from: 'customer',
        message: 'I\'m trying to place an order but the website keeps showing an error when I try to add items to cart. This has been happening for the past 2 days.',
        timestamp: '2024-01-18T11:20:00Z'
      },
      {
        id: '2',
        from: 'admin',
        message: 'Thank you for reporting this issue. Our technical team has been notified and is working on a fix.',
        timestamp: '2024-01-18T14:30:00Z'
      },
      {
        id: '3',
        from: 'admin',
        message: 'The issue has been resolved. Please try placing your order again. Thank you for your patience.',
        timestamp: '2024-01-19T16:30:00Z'
      }
    ]
  },
  {
    id: 'TKT-004',
    customer: {
      name: 'Aisha Rahman',
      email: 'aisha@example.com',
      phone: '+1 (555) 321-6547'
    },
    subject: 'Payment issue',
    message: 'I tried to pay with my credit card but the payment was declined. I\'m sure the card is valid and has sufficient funds.',
    status: 'open',
    priority: 'high',
    category: 'payment',
    assignedTo: null,
    createdAt: '2024-01-20T16:45:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    replies: [
      {
        id: '1',
        from: 'customer',
        message: 'I tried to pay with my credit card but the payment was declined. I\'m sure the card is valid and has sufficient funds.',
        timestamp: '2024-01-20T16:45:00Z'
      }
    ]
  }
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' }
]

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'order', label: 'Order Issues' },
  { value: 'product', label: 'Product Issues' },
  { value: 'payment', label: 'Payment Issues' },
  { value: 'technical', label: 'Technical Issues' },
  { value: 'general', label: 'General Inquiry' }
]

export default function AdminSupportPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState('')

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'order':
        return 'bg-blue-100 text-blue-800'
      case 'product':
        return 'bg-purple-100 text-purple-800'
      case 'payment':
        return 'bg-orange-100 text-orange-800'
      case 'technical':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleReply = () => {
    if (!replyMessage.trim()) return
    
    // Add reply to ticket
    if (selectedTicket) {
      selectedTicket.replies.push({
        id: Date.now().toString(),
        from: 'admin',
        message: replyMessage,
        timestamp: new Date().toISOString()
      })
      selectedTicket.status = 'in_progress'
      selectedTicket.updatedAt = new Date().toISOString()
    }
    
    setReplyMessage('')
    // In a real app, you would save this to the database
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600">Manage customer support requests and inquiries</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'in_progress').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Closed</p>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'closed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold">{tickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tickets..."
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
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{filteredTickets.length} tickets</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{ticket.customer.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{ticket.customer.name}</div>
                          <div className="text-sm text-gray-500">{ticket.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.subject}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{ticket.message}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(ticket.category)}>
                        {ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(ticket.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Ticket #{ticket.id} - {ticket.subject}</DialogTitle>
                            <DialogDescription>
                              Support ticket details and conversation
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="font-semibold mb-3">Customer Information</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span>{ticket.customer.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span>{ticket.customer.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{ticket.customer.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span>Created: {formatDate(ticket.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Ticket Details */}
                            <div>
                              <div className="flex items-center space-x-4 mb-4">
                                <Badge className={getStatusColor(ticket.status)}>
                                  {ticket.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority} Priority
                                </Badge>
                                <Badge className={getCategoryColor(ticket.category)}>
                                  {ticket.category}
                                </Badge>
                              </div>
                            </div>

                            {/* Conversation */}
                            <div>
                              <h3 className="font-semibold mb-3">Conversation</h3>
                              <div className="space-y-4">
                                {ticket.replies.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className={`p-4 rounded-lg ${
                                      reply.from === 'admin'
                                        ? 'bg-blue-50 border border-blue-200'
                                        : 'bg-gray-50 border border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium">
                                        {reply.from === 'admin' ? 'Admin' : ticket.customer.name}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {formatDate(reply.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-gray-700">{reply.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Reply Form */}
                            <div>
                              <h3 className="font-semibold mb-3">Add Reply</h3>
                              <Textarea
                                placeholder="Type your reply..."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Close Ticket</Button>
                            <Button onClick={handleReply}>Send Reply</Button>
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