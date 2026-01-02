import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Aircraft } from '@/types/database'
import { Plane, Gauge, Users, Calendar } from 'lucide-react'

interface AircraftCardProps {
  aircraft: Aircraft
}

export function AircraftCard({ aircraft }: AircraftCardProps) {
  const formatPrice = (price: number | null, currency: string) => {
    if (!price) return 'Contact for price'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-600 hover:bg-green-700'
      case 'sold':
        return 'bg-gray-600 hover:bg-gray-700'
      case 'pending':
        return 'bg-yellow-600 hover:bg-yellow-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link href={`/aircraft/${aircraft.slug}`}>
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {aircraft.primary_image_url ? (
            <Image
              src={aircraft.primary_image_url}
              alt={aircraft.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Plane className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          {/* Overlay for sold/pending aircraft */}
          {aircraft.status === 'sold' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-gray-900/95 text-white px-6 py-3 rounded-lg border-2 border-white shadow-xl">
                <span className="text-2xl font-bold">SOLD</span>
              </div>
            </div>
          )}
          {aircraft.status === 'pending' && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-yellow-600/95 text-white px-6 py-3 rounded-lg border-2 border-white shadow-xl">
                <span className="text-xl sm:text-2xl font-bold">SALE PENDING</span>
              </div>
            </div>
          )}

          {/* Status badge - more prominent */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
            <Badge className={`${getStatusBadgeColor(aircraft.status)} text-sm sm:text-base px-3 py-1 shadow-lg`}>
              {aircraft.status.charAt(0).toUpperCase() + aircraft.status.slice(1)}
            </Badge>
            {aircraft.featured && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground text-sm sm:text-base px-3 py-1 shadow-lg">
                Featured
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <CardHeader className="pb-3">
        <Link href={`/aircraft/${aircraft.slug}`}>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {aircraft.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground">
            {aircraft.manufacturer} {aircraft.model}
          </p>
          <Badge variant="outline" className="capitalize">
            {aircraft.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{aircraft.year_manufactured}</span>
          </div>
          {aircraft.total_time_hours && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="h-4 w-4 shrink-0" />
              <span className="truncate">{aircraft.total_time_hours.toLocaleString()} hrs</span>
            </div>
          )}
          {aircraft.passengers_capacity && (
            <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
              <Users className="h-4 w-4 shrink-0" />
              <span>{aircraft.passengers_capacity} passengers</span>
            </div>
          )}
        </div>

        {/* Hide description on mobile to reduce clutter */}
        {aircraft.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 hidden sm:block">
            {aircraft.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t">
        <div className="flex-1">
          <p className="text-lg font-bold text-primary">
            {formatPrice(aircraft.price, aircraft.price_currency)}
          </p>
          {aircraft.is_price_negotiable && aircraft.price && (
            <p className="text-xs text-muted-foreground">Negotiable</p>
          )}
        </div>
        <Button asChild size="default" className="w-full sm:w-auto">
          <Link href={`/aircraft/${aircraft.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
