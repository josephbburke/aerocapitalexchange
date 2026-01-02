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
import { Loader2, CheckCircle, Mail } from 'lucide-react'

interface AircraftInquiryFormProps {
  aircraftId: string
  aircraftTitle: string
}

export function AircraftInquiryForm({ aircraftId, aircraftTitle }: AircraftInquiryFormProps) {
  const { user } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      subject: `Inquiry about ${aircraftTitle}`,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: InquiryFormData) => createInquiry(data, aircraftId, user?.id),
    onSuccess: () => {
      setIsSuccess(true)
      reset()
      setTimeout(() => setIsSuccess(false), 5000)
    },
  })

  const onSubmit = (data: InquiryFormData) => {
    mutation.mutate(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Request Information
        </CardTitle>
        <CardDescription>
          Interested in this aircraft? Send us your inquiry and we'll get back to you shortly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Inquiry Sent Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Thank you for your interest. We'll contact you shortly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                {...register('full_name')}
                disabled={mutation.isPending}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={mutation.isPending}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  disabled={mutation.isPending}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                {...register('company_name')}
                disabled={mutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                {...register('subject')}
                disabled={mutation.isPending}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                rows={6}
                {...register('message')}
                disabled={mutation.isPending}
                placeholder="Please provide details about your inquiry, financing needs, or any questions you have..."
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            {mutation.isError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : 'Failed to send inquiry. Please try again.'}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Inquiry'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
