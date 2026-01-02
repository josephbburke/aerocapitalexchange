'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { inquiryFormSchema, InquiryFormData } from '@/schemas/inquiry'
import { createInquiry } from '@/lib/api/inquiries'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, CheckCircle, Send, MessageSquare } from 'lucide-react'

interface InquiryFormProps {
  // Optional aircraft information
  aircraftId?: string
  aircraftTitle?: string
  // Inquiry type preset
  inquiryType?: 'aircraft' | 'financing' | 'general' | 'partnership'
  // Pre-fill subject
  defaultSubject?: string
  // Custom title and description
  title?: string
  description?: string
  // Compact mode for smaller displays
  compact?: boolean
  // Show/hide certain fields
  showCompanyName?: boolean
  showInquiryType?: boolean
}

export function InquiryForm({
  aircraftId,
  aircraftTitle,
  inquiryType = 'general',
  defaultSubject,
  title,
  description,
  compact = false,
  showCompanyName = true,
  showInquiryType = true,
}: InquiryFormProps) {
  const { user, profile } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedInquiryType, setSelectedInquiryType] = useState<typeof inquiryType>(
    aircraftId ? 'aircraft' : inquiryType
  )
  const [preferredContactMethod, setPreferredContactMethod] = useState<'email' | 'phone' | 'either'>('email')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      subject: defaultSubject || (aircraftTitle ? `Inquiry about ${aircraftTitle}` : ''),
      message: '',
      full_name: profile?.full_name || '',
      email: user?.email || '',
      phone: profile?.phone || '',
      company_name: profile?.company_name || '',
      inquiry_type: selectedInquiryType,
      preferred_contact_method: 'email',
      aircraft_id: aircraftId,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: InquiryFormData) => {
      return createInquiry(
        {
          ...data,
          inquiry_type: selectedInquiryType,
          preferred_contact_method: preferredContactMethod,
        },
        aircraftId,
        user?.id
      )
    },
    onSuccess: () => {
      setIsSuccess(true)
      reset()
      setTimeout(() => {
        setIsSuccess(false)
      }, 8000)
    },
  })

  const onSubmit = (data: InquiryFormData) => {
    mutation.mutate(data)
  }

  const inquiryTypeOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'financing', label: 'Financing Question' },
    { value: 'aircraft', label: 'Aircraft Information' },
    { value: 'partnership', label: 'Partnership Opportunity' },
  ] as const

  const contactMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'either', label: 'Either' },
  ] as const

  return (
    <Card className={compact ? 'shadow-sm' : ''}>
      <CardHeader className={compact ? 'pb-3' : ''}>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {title || (aircraftTitle ? `Inquire About This Aircraft` : 'Send Us a Message')}
        </CardTitle>
        <CardDescription>
          {description ||
            (aircraftTitle
              ? 'Have questions? Fill out the form below and our team will respond promptly.'
              : "Fill out the form below and we'll get back to you as soon as possible")}
        </CardDescription>
      </CardHeader>
      <CardContent className={compact ? 'pt-3' : ''}>
        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
              <p className="text-muted-foreground mb-4">
                Thank you for your inquiry. We'll respond within 24 hours.
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline" size="sm">
                Send Another Message
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className={compact ? 'space-y-3' : 'space-y-4'}>
            {/* Inquiry Type Selection (if enabled and not aircraft-specific) */}
            {showInquiryType && !aircraftId && (
              <div className="space-y-2">
                <Label htmlFor="inquiry_type">Inquiry Type</Label>
                <select
                  id="inquiry_type"
                  value={selectedInquiryType}
                  onChange={(e) => setSelectedInquiryType(e.target.value as typeof inquiryType)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  disabled={mutation.isPending}
                >
                  {inquiryTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  disabled={mutation.isPending}
                  placeholder="John Doe"
                />
                {errors.full_name && (
                  <p className="text-sm text-destructive">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={mutation.isPending}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  disabled={mutation.isPending}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>

              {showCompanyName && (
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    {...register('company_name')}
                    disabled={mutation.isPending}
                    placeholder="Your Company LLC"
                  />
                </div>
              )}
            </div>

            {/* Preferred Contact Method */}
            <div className="space-y-2">
              <Label htmlFor="contact_method">Preferred Contact Method</Label>
              <select
                id="contact_method"
                value={preferredContactMethod}
                onChange={(e) =>
                  setPreferredContactMethod(e.target.value as typeof preferredContactMethod)
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                disabled={mutation.isPending}
              >
                {contactMethodOptions.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                {...register('subject')}
                disabled={mutation.isPending}
                placeholder={
                  aircraftTitle
                    ? `Inquiry about ${aircraftTitle}`
                    : selectedInquiryType === 'financing'
                    ? 'Financing inquiry for...'
                    : selectedInquiryType === 'aircraft'
                    ? 'Question about...'
                    : selectedInquiryType === 'partnership'
                    ? 'Partnership opportunity regarding...'
                    : 'How can we help you?'
                }
              />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                rows={compact ? 4 : 6}
                {...register('message')}
                disabled={mutation.isPending}
                placeholder={
                  aircraftTitle
                    ? `I'm interested in learning more about this aircraft. Please provide additional information about...`
                    : selectedInquiryType === 'financing'
                    ? 'Tell us about your financing needs, desired terms, or any questions you have about our financing options...'
                    : selectedInquiryType === 'aircraft'
                    ? 'Ask us about specific aircraft, availability, specifications, or scheduling a viewing...'
                    : selectedInquiryType === 'partnership'
                    ? 'Describe your partnership proposal and how we can work together...'
                    : 'Please provide details about your inquiry...'
                }
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Minimum 10 characters required</p>
            </div>

            {/* Error Message */}
            {mutation.isError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="font-semibold mb-1">Failed to send message</p>
                <p>
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : 'An error occurred while sending your message. Please try again or contact us directly via email or phone.'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size={compact ? 'default' : 'lg'}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting this form, you agree to be contacted by our team regarding your inquiry.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
