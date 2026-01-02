'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllInquiries, updateInquiryStatus, deleteInquiry } from '@/lib/api/inquiries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InquiryDetailModal } from '@/components/admin/inquiry-detail-modal'
import {
  Loader2,
  Mail,
  User,
  Building,
  Phone,
  Calendar,
  Eye,
  CheckCircle,
  AlertCircle,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  ArrowUpDown,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'

type StatusFilter = 'all' | 'new' | 'in_progress' | 'responded' | 'closed' | 'spam'
type PriorityFilter = 'all' | 'low' | 'medium' | 'high' | 'urgent'
type TypeFilter = 'all' | 'aircraft' | 'financing' | 'general' | 'partnership'
type SortField = 'created_at' | 'priority' | 'status' | 'full_name'
type SortOrder = 'asc' | 'desc'

export default function AdminInquiriesPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { data: inquiries, isLoading, isError, error } = useQuery({
    queryKey: ['inquiries'],
    queryFn: getAllInquiries,
    retry: false,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })

  // Filter and sort inquiries
  const filteredAndSortedInquiries = useMemo(() => {
    if (!inquiries) return []

    let filtered = inquiries.filter((inquiry: any) => {
      // Status filter
      if (statusFilter !== 'all' && inquiry.status !== statusFilter) return false

      // Priority filter
      if (priorityFilter !== 'all' && inquiry.priority !== priorityFilter) return false

      // Type filter
      if (typeFilter !== 'all' && inquiry.inquiry_type !== typeFilter) return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          inquiry.full_name.toLowerCase().includes(query) ||
          inquiry.email.toLowerCase().includes(query) ||
          inquiry.subject.toLowerCase().includes(query) ||
          inquiry.message.toLowerCase().includes(query) ||
          (inquiry.phone && inquiry.phone.toLowerCase().includes(query)) ||
          (inquiry.company_name && inquiry.company_name.toLowerCase().includes(query))
        )
      }

      return true
    })

    // Sort
    filtered.sort((a: any, b: any) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortField === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 }
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder]
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder]
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [inquiries, searchQuery, statusFilter, priorityFilter, typeFilter, sortField, sortOrder])

  const handleViewDetails = (inquiry: any) => {
    setSelectedInquiry(inquiry)
    setIsDetailModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
  }

  const handleExport = () => {
    if (!filteredAndSortedInquiries.length) return

    const csv = [
      ['Date', 'Name', 'Email', 'Phone', 'Company', 'Type', 'Subject', 'Status', 'Priority', 'Message'],
      ...filteredAndSortedInquiries.map((inq: any) => [
        new Date(inq.created_at).toLocaleString(),
        inq.full_name,
        inq.email,
        inq.phone || '',
        inq.company_name || '',
        inq.inquiry_type,
        inq.subject,
        inq.status,
        inq.priority,
        inq.message.replace(/\n/g, ' '),
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inquiries-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-600'
      case 'in_progress':
        return 'bg-yellow-600'
      case 'responded':
        return 'bg-green-600'
      case 'closed':
        return 'bg-gray-600'
      case 'spam':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-600'
      case 'high':
        return 'bg-orange-600'
      case 'medium':
        return 'bg-yellow-600'
      case 'low':
        return 'bg-gray-600'
      default:
        return 'bg-gray-600'
    }
  }

  const stats = useMemo(() => {
    if (!inquiries) return { total: 0, new: 0, in_progress: 0, responded: 0, closed: 0 }
    return {
      total: inquiries.length,
      new: inquiries.filter((i: any) => i.status === 'new').length,
      in_progress: inquiries.filter((i: any) => i.status === 'in_progress').length,
      responded: inquiries.filter((i: any) => i.status === 'responded').length,
      closed: inquiries.filter((i: any) => i.status === 'closed').length,
    }
  }, [inquiries])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-destructive font-semibold mb-2">Failed to load inquiries</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Inquiry Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage and respond to customer inquiries
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={!filteredAndSortedInquiries.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">New</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.in_progress}</p>
                  </div>
                  <RefreshCw className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Responded</p>
                    <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Closed</p>
                    <p className="text-2xl font-bold">{stats.closed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as PriorityFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="aircraft">Aircraft</SelectItem>
                  <SelectItem value="financing">Financing</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Summary */}
            {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedInquiries.length} of {inquiries?.length || 0} inquiries
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setPriorityFilter('all')
                    setTypeFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inquiries List */}
        {!inquiries || inquiries.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No inquiries yet</p>
                <p className="text-sm text-muted-foreground">
                  Inquiries will appear here when customers contact you
                </p>
              </div>
            </CardContent>
          </Card>
        ) : filteredAndSortedInquiries.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No inquiries match your filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setPriorityFilter('all')
                    setTypeFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Sort Controls */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSort('created_at')}
                className={sortField === 'created_at' ? 'border-primary' : ''}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Date {sortField === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSort('priority')}
                className={sortField === 'priority' ? 'border-primary' : ''}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Priority {sortField === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
            </div>

            {/* Inquiry Cards */}
            {filteredAndSortedInquiries.map((inquiry: any) => (
              <Card
                key={inquiry.id}
                className={`transition-all hover:shadow-md ${
                  inquiry.status === 'new' ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {inquiry.subject}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {inquiry.full_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <a
                                href={`mailto:${inquiry.email}`}
                                className="hover:text-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {inquiry.email}
                              </a>
                            </span>
                            {inquiry.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {inquiry.phone}
                              </span>
                            )}
                            {inquiry.company_name && (
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {inquiry.company_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(inquiry.status)}>
                              {inquiry.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(inquiry.priority)}>
                              {inquiry.priority}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {inquiry.inquiry_type}
                          </Badge>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {inquiry.message}
                      </p>

                      {/* Aircraft Link if applicable */}
                      {inquiry.aircraft && (
                        <div className="mb-3">
                          <Link
                            href={`/aircraft/${inquiry.aircraft.slug}`}
                            target="_blank"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Aircraft: {inquiry.aircraft.title}
                          </Link>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between gap-4 pt-3 border-t">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(inquiry.created_at).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          {inquiry.status === 'new' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                statusMutation.mutate({ id: inquiry.id, status: 'in_progress' })
                              }
                              disabled={statusMutation.isPending}
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Start Processing
                            </Button>
                          )}
                          {inquiry.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                statusMutation.mutate({ id: inquiry.id, status: 'responded' })
                              }
                              disabled={statusMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Responded
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(inquiry)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(inquiry.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <InquiryDetailModal
          inquiry={selectedInquiry}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        />
      </div>
    </div>
  )
}
