'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Inquiry } from '@/types/database'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  updateInquiryStatus,
  updateInquiryPriority,
  updateInquiryNotes,
  deleteInquiry,
} from '@/lib/api/inquiries'
import {
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
  Trash2,
  Save,
} from 'lucide-react'
import Link from 'next/link'

interface InquiryDetailModalProps {
  inquiry: (Inquiry & { aircraft?: { title: string; slug: string } | null }) | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: () => void
}

export function InquiryDetailModal({
  inquiry,
  open,
  onOpenChange,
  onDelete,
}: InquiryDetailModalProps) {
  const queryClient = useQueryClient()
  const [notes, setNotes] = useState(inquiry?.admin_notes || '')

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })

  const priorityMutation = useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: any }) =>
      updateInquiryPriority(id, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })

  const notesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      updateInquiryNotes(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] })
      onOpenChange(false)
      onDelete?.()
    },
  })

  if (!inquiry) return null

  const handleStatusChange = (status: string) => {
    statusMutation.mutate({ id: inquiry.id, status })
  }

  const handlePriorityChange = (priority: string) => {
    priorityMutation.mutate({ id: inquiry.id, priority })
  }

  const handleSaveNotes = () => {
    notesMutation.mutate({ id: inquiry.id, notes })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      deleteMutation.mutate(inquiry.id)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5" />
            Inquiry Details
          </DialogTitle>
          <DialogDescription>
            View and manage inquiry information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={inquiry.status}
                onValueChange={handleStatusChange}
                disabled={statusMutation.isPending}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={inquiry.priority}
                onValueChange={handlePriorityChange}
                disabled={priorityMutation.isPending}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{inquiry.full_name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">
                  <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">
                    {inquiry.email}
                  </a>
                </p>
              </div>
              {inquiry.phone && (
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">
                    <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline">
                      {inquiry.phone}
                    </a>
                  </p>
                </div>
              )}
              {inquiry.company_name && (
                <div>
                  <Label className="text-muted-foreground">Company</Label>
                  <p className="font-medium">{inquiry.company_name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Inquiry Details
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="font-medium capitalize">{inquiry.inquiry_type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Subject</Label>
                <p className="font-medium">{inquiry.subject}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Message</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap">{inquiry.message}</p>
                </div>
              </div>
              {inquiry.aircraft && (
                <div>
                  <Label className="text-muted-foreground">Related Aircraft</Label>
                  <Link
                    href={`/aircraft/${inquiry.aircraft.slug}`}
                    target="_blank"
                    className="inline-block mt-1 text-primary hover:underline font-medium"
                  >
                    {inquiry.aircraft.title}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Received</Label>
                <p className="font-medium">
                  {new Date(inquiry.created_at).toLocaleString()}
                </p>
              </div>
              {inquiry.responded_at && (
                <div>
                  <Label className="text-muted-foreground">Responded</Label>
                  <p className="font-medium">
                    {new Date(inquiry.responded_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Admin Notes
            </h3>
            <div className="space-y-2">
              <Textarea
                placeholder="Add internal notes about this inquiry..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={notesMutation.isPending || notes === inquiry.admin_notes}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Inquiry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
