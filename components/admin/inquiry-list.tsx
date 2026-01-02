'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllInquiries, updateInquiryStatus } from '@/lib/api/inquiries'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Mail, User, Building, Phone, Calendar, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface InquiryListProps {
  onViewDetails?: (inquiryId: string) => void
}

export function InquiryList({ onViewDetails }: InquiryListProps) {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'responded' | 'closed'>('all')

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'aircraft':
        return '✈️'
      case 'financing':
        return '💰'
      case 'partnership':
        return '🤝'
      default:
        return '📧'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
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
    )
  }

  const filteredInquiries = filter === 'all'
    ? inquiries
    : inquiries?.filter(i => i.status === filter)

  if (!inquiries || inquiries.length === 0) {
    return (
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
    )
  }

  const stats = {
    new: inquiries.filter(i => i.status === 'new').length,
    in_progress: inquiries.filter(i => i.status === 'in_progress').length,
    responded: inquiries.filter(i => i.status === 'responded').length,
    closed: inquiries.filter(i => i.status === 'closed').length,
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({inquiries.length})
        </Button>
        <Button
          variant={filter === 'new' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('new')}
          className={filter === 'new' ? '' : 'text-blue-600'}
        >
          New ({stats.new})
        </Button>
        <Button
          variant={filter === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('in_progress')}
          className={filter === 'in_progress' ? '' : 'text-yellow-600'}
        >
          In Progress ({stats.in_progress})
        </Button>
        <Button
          variant={filter === 'responded' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('responded')}
          className={filter === 'responded' ? '' : 'text-green-600'}
        >
          Responded ({stats.responded})
        </Button>
        <Button
          variant={filter === 'closed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('closed')}
        >
          Closed ({stats.closed})
        </Button>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries?.map((inquiry: any) => (
          <Card key={inquiry.id} className={inquiry.status === 'new' ? 'border-blue-500' : ''}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{getTypeIcon(inquiry.inquiry_type)}</span>
                        <h3 className="font-semibold text-lg">{inquiry.subject}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {inquiry.full_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {inquiry.email}
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
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status.replace('_', ' ')}
                      </Badge>
                      <span className={`text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                        {inquiry.priority} priority
                      </span>
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
                        className="text-sm text-primary hover:underline"
                      >
                        Related to: {inquiry.aircraft.title}
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
                          onClick={() => statusMutation.mutate({ id: inquiry.id, status: 'in_progress' })}
                          disabled={statusMutation.isPending}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Mark In Progress
                        </Button>
                      )}
                      {inquiry.status === 'in_progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => statusMutation.mutate({ id: inquiry.id, status: 'responded' })}
                          disabled={statusMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Responded
                        </Button>
                      )}
                      {onViewDetails && (
                        <Button
                          size="sm"
                          onClick={() => onViewDetails(inquiry.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredInquiries && filteredInquiries.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No {filter !== 'all' ? filter.replace('_', ' ') : ''} inquiries
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
