'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllAircraft, deleteAircraft } from '@/lib/api/aircraft'
import { Aircraft } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Eye, Loader2 } from 'lucide-react'

interface AircraftListProps {
  onEdit: (aircraft: Aircraft) => void
}

export function AircraftList({ onEdit }: AircraftListProps) {
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: aircraft, isLoading, isError, error } = useQuery({
    queryKey: ['aircraft'],
    queryFn: () => getAllAircraft(),
    retry: false,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAircraft(id, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] })
      setDeletingId(null)
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this aircraft?')) {
      setDeletingId(id)
      deleteMutation.mutate(id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500'
      case 'sold':
        return 'bg-gray-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'draft':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isError) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-destructive font-semibold mb-2">Failed to load aircraft</p>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your database connection and try refreshing the page.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!aircraft || aircraft.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No aircraft listings yet</p>
            <p className="text-sm text-muted-foreground">
              Click "Add New Aircraft" to create your first listing
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {aircraft.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex gap-6">
              {item.primary_image_url && (
                <div className="flex-shrink-0">
                  <img
                    src={item.primary_image_url}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.manufacturer} {item.model} • {item.year_manufactured}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    {item.featured && (
                      <Badge variant="outline">Featured</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>{' '}
                    <span className="font-medium capitalize">{item.category}</span>
                  </div>
                  {item.total_time_hours && (
                    <div>
                      <span className="text-muted-foreground">Total Time:</span>{' '}
                      <span className="font-medium">{item.total_time_hours.toLocaleString()} hrs</span>
                    </div>
                  )}
                  {item.passengers_capacity && (
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>{' '}
                      <span className="font-medium">{item.passengers_capacity} pax</span>
                    </div>
                  )}
                  {item.price && (
                    <div>
                      <span className="text-muted-foreground">Price:</span>{' '}
                      <span className="font-medium">
                        ${Number(item.price).toLocaleString()} {item.price_currency}
                      </span>
                    </div>
                  )}
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/aircraft/${item.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
