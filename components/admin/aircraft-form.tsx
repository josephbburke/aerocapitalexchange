'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { aircraftFormSchema, AircraftFormData } from '@/schemas/aircraft'
import { createAircraft, updateAircraft, uploadAircraftImage } from '@/lib/api/aircraft'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Aircraft } from '@/types/database'
import { Loader2, Upload, X } from 'lucide-react'

interface AircraftFormProps {
  aircraft?: Aircraft
  onSuccess?: () => void
  onCancel?: () => void
}

export function AircraftForm({ aircraft, onSuccess, onCancel }: AircraftFormProps) {
  const { user, loading } = useAuth()
  const queryClient = useQueryClient()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    aircraft?.primary_image_url || null
  )
  const [features, setFeatures] = useState<string[]>(() => {
    if (aircraft?.features && Array.isArray(aircraft.features)) {
      return aircraft.features.filter((f): f is string => typeof f === 'string')
    }
    return []
  })
  const [currentFeature, setCurrentFeature] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AircraftFormData>({
    resolver: zodResolver(aircraftFormSchema),
    defaultValues: aircraft
      ? {
          title: aircraft.title,
          slug: aircraft.slug,
          status: aircraft.status,
          manufacturer: aircraft.manufacturer,
          model: aircraft.model,
          year_manufactured: aircraft.year_manufactured,
          registration_number: aircraft.registration_number || '',
          serial_number: aircraft.serial_number || '',
          category: aircraft.category as 'jet' | 'turboprop' | 'helicopter' | 'piston',
          aircraft_type: aircraft.aircraft_type || '',
          total_time_hours: aircraft.total_time_hours || undefined,
          engines: aircraft.engines || undefined,
          passengers_capacity: aircraft.passengers_capacity || undefined,
          max_range_nm: aircraft.max_range_nm || undefined,
          max_speed_kts: aircraft.max_speed_kts || undefined,
          cruise_speed_kts: aircraft.cruise_speed_kts || undefined,
          max_altitude_ft: aircraft.max_altitude_ft || undefined,
          price: aircraft.price ? Number(aircraft.price) : undefined,
          price_currency: aircraft.price_currency,
          is_price_negotiable: aircraft.is_price_negotiable,
          description: aircraft.description || '',
          meta_title: aircraft.meta_title || '',
          meta_description: aircraft.meta_description || '',
          featured: aircraft.featured,
        }
      : {
          status: 'draft' as const,
          category: 'jet' as const,
          price_currency: 'USD',
          is_price_negotiable: true,
          featured: false,
        },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: AircraftFormData) => {
      if (!user) throw new Error('User not authenticated')

      let imageUrl = aircraft?.primary_image_url

      // Upload image if a new one was selected
      if (imageFile) {
        const tempId = aircraft?.id || crypto.randomUUID()
        imageUrl = await uploadAircraftImage(imageFile, tempId)
      }

      const formDataWithImage = {
        ...data,
        features,
        primary_image_url: imageUrl,
      }

      if (aircraft) {
        return updateAircraft(aircraft.id, formDataWithImage)
      } else {
        return createAircraft(formDataWithImage, user.id)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] })
      onSuccess?.()
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFeatures([...features, currentFeature.trim()])
      setCurrentFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const onSubmit = (data: AircraftFormData) => {
    saveMutation.mutate(data)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        You must be logged in to manage aircraft.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              onBlur={(e) => {
                if (!aircraft) {
                  setValue('slug', generateSlug(e.target.value))
                }
              }}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register('slug')} />
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                {...register('status')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="draft">Draft</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                {...register('category')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="jet">Jet</option>
                <option value="turboprop">Turboprop</option>
                <option value="helicopter">Helicopter</option>
                <option value="piston">Piston</option>
                <option value="trailer">Trailer / Equipment</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              {...register('featured')}
              className="h-4 w-4"
            />
            <Label htmlFor="featured">Featured Aircraft</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aircraft Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input id="manufacturer" {...register('manufacturer')} />
              {errors.manufacturer && (
                <p className="text-sm text-red-500 mt-1">{errors.manufacturer.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="model">Model *</Label>
              <Input id="model" {...register('model')} />
              {errors.model && (
                <p className="text-sm text-red-500 mt-1">{errors.model.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="year_manufactured">Year *</Label>
              <Input
                id="year_manufactured"
                type="number"
                {...register('year_manufactured', { valueAsNumber: true })}
              />
              {errors.year_manufactured && (
                <p className="text-sm text-red-500 mt-1">{errors.year_manufactured.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="registration_number">Registration Number</Label>
              <Input id="registration_number" {...register('registration_number')} />
            </div>

            <div>
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input id="serial_number" {...register('serial_number')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_time_hours">Total Time (hours)</Label>
              <Input
                id="total_time_hours"
                type="number"
                {...register('total_time_hours', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="engines">Engines</Label>
              <Input
                id="engines"
                type="number"
                {...register('engines', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="passengers_capacity">Passenger Capacity</Label>
              <Input
                id="passengers_capacity"
                type="number"
                {...register('passengers_capacity', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="max_range_nm">Max Range (NM)</Label>
              <Input
                id="max_range_nm"
                type="number"
                {...register('max_range_nm', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="max_speed_kts">Max Speed (kts)</Label>
              <Input
                id="max_speed_kts"
                type="number"
                {...register('max_speed_kts', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="cruise_speed_kts">Cruise Speed (kts)</Label>
              <Input
                id="cruise_speed_kts"
                type="number"
                {...register('cruise_speed_kts', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="max_altitude_ft">Max Altitude (ft)</Label>
            <Input
              id="max_altitude_ft"
              type="number"
              {...register('max_altitude_ft', { valueAsNumber: true })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="price_currency">Currency</Label>
              <Input id="price_currency" {...register('price_currency')} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_price_negotiable"
              {...register('is_price_negotiable')}
              className="h-4 w-4"
            />
            <Label htmlFor="is_price_negotiable">Price is negotiable</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description & Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={6} />
          </div>

          <div>
            <Label>Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addFeature()
                  }
                }}
              />
              <Button type="button" onClick={addFeature}>
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted p-2 rounded"
                >
                  <span>{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Primary Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-md h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Label htmlFor="image" className="cursor-pointer">
                  <span className="text-primary hover:underline">Click to upload</span> or
                  drag and drop
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input id="meta_title" {...register('meta_title')} />
          </div>

          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea id="meta_description" {...register('meta_description')} rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {aircraft ? 'Update Aircraft' : 'Create Aircraft'}
        </Button>
      </div>

      {saveMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Error: {saveMutation.error instanceof Error ? saveMutation.error.message : 'Failed to save aircraft'}
        </div>
      )}
    </form>
  )
}
