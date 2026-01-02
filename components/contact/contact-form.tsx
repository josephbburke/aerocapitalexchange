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
import { Loader2, CheckCircle, Send } from 'lucide-react'

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'financing', label: 'Financing Question' },
  { value: 'aircraft', label: 'Aircraft Information' },
  { value: 'partnership', label: 'Partnership Opportunity' },
] as const

export function ContactForm() {
  const { user } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)
  const [inquiryType, setInquiryType] = useState<'general' | 'financing' | 'aircraft' | 'partnership'>('general')
  const [preferredContactMethod, setPreferredContactMethod] = useState<'email' | 'phone' | 'either'>('email')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      subject: '',
      message: '',
      full_name: '',
      email: '',
      phone: '',
      company_name: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: InquiryFormData) => {
      // Create inquiry with the selected type
      return createInquiry(
        {
          ...data,
          inquiry_type: inquiryType,
          preferred_contact_method: preferredContactMethod,
        },
        undefined, // no specific aircraft
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Us a Message
        </CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Message Sent Successfully!</h3>
              <p className="text-muted-foreground mb-4">
                Thank you for contacting us. We'll respond to your inquiry shortly.
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                Send Another Message
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Inquiry Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="inquiry_type">Inquiry Type</Label>
              <select
                id="inquiry_type"
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value as typeof inquiryType)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                disabled={mutation.isPending}
              >
                {inquiryTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

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
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
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
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  {...register('company_name')}
                  disabled={mutation.isPending}
                  placeholder="Your Company LLC"
                />
              </div>
            </div>

            {/* Preferred Contact Method */}
            <div className="space-y-2">
              <Label htmlFor="contact_method">Preferred Contact Method</Label>
              <select
                id="contact_method"
                value={preferredContactMethod}
                onChange={(e) => setPreferredContactMethod(e.target.value as typeof preferredContactMethod)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                disabled={mutation.isPending}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="either">Either</option>
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
                  inquiryType === 'financing'
                    ? 'Financing inquiry for...'
                    : inquiryType === 'aircraft'
                    ? 'Question about...'
                    : inquiryType === 'partnership'
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
                rows={8}
                {...register('message')}
                disabled={mutation.isPending}
                placeholder={
                  inquiryType === 'financing'
                    ? "Tell us about your financing needs, desired terms, or any questions you have about our financing options..."
                    : inquiryType === 'aircraft'
                    ? "Ask us about specific aircraft, availability, specifications, or scheduling a viewing..."
                    : inquiryType === 'partnership'
                    ? "Describe your partnership proposal and how we can work together..."
                    : "Please provide details about your inquiry..."
                }
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters required
              </p>
            </div>

            {/* Error Message */}
            {mutation.isError && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="font-semibold mb-1">Failed to send message</p>
                <p>
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : 'An error occurred while sending your message. Please try again or contact us directly via email or phone.'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
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
