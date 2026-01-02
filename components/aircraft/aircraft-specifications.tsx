import { Aircraft } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Gauge,
  Users,
  Plane,
  Wind,
  TrendingUp,
  Ruler,
  Hash,
  DollarSign,
  Settings,
} from 'lucide-react'

interface AircraftSpecificationsProps {
  aircraft: Aircraft
}

interface SpecItemProps {
  icon: React.ReactNode
  label: string
  value: string | number | null | undefined
  suffix?: string
}

function SpecItem({ icon, label, value, suffix = '' }: SpecItemProps) {
  if (value === null || value === undefined) return null

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="text-primary mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix && ` ${suffix}`}
        </p>
      </div>
    </div>
  )
}

export function AircraftSpecifications({ aircraft }: AircraftSpecificationsProps) {
  const formatPrice = (price: number | null, currency: string) => {
    if (!price) return 'Contact for price'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Price Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-primary">
              {formatPrice(aircraft.price, aircraft.price_currency)}
            </p>
            {aircraft.price && aircraft.is_price_negotiable && (
              <Badge variant="secondary">Negotiable</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <SpecItem
            icon={<Plane className="h-4 w-4" />}
            label="Manufacturer"
            value={aircraft.manufacturer}
          />
          <SpecItem
            icon={<Settings className="h-4 w-4" />}
            label="Model"
            value={aircraft.model}
          />
          <SpecItem
            icon={<Calendar className="h-4 w-4" />}
            label="Year Manufactured"
            value={aircraft.year_manufactured}
          />
          <SpecItem
            icon={<Hash className="h-4 w-4" />}
            label="Registration Number"
            value={aircraft.registration_number}
          />
          <SpecItem
            icon={<Hash className="h-4 w-4" />}
            label="Serial Number"
            value={aircraft.serial_number}
          />
          <SpecItem
            icon={<Plane className="h-4 w-4" />}
            label="Aircraft Type"
            value={aircraft.aircraft_type}
          />
        </CardContent>
      </Card>

      {/* Performance Specifications */}
      {(aircraft.total_time_hours ||
        aircraft.max_range_nm ||
        aircraft.max_speed_kts ||
        aircraft.cruise_speed_kts ||
        aircraft.max_altitude_ft) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <SpecItem
              icon={<Gauge className="h-4 w-4" />}
              label="Total Time"
              value={aircraft.total_time_hours}
              suffix="hours"
            />
            <SpecItem
              icon={<Ruler className="h-4 w-4" />}
              label="Maximum Range"
              value={aircraft.max_range_nm}
              suffix="nm"
            />
            <SpecItem
              icon={<Wind className="h-4 w-4" />}
              label="Maximum Speed"
              value={aircraft.max_speed_kts}
              suffix="kts"
            />
            <SpecItem
              icon={<Wind className="h-4 w-4" />}
              label="Cruise Speed"
              value={aircraft.cruise_speed_kts}
              suffix="kts"
            />
            <SpecItem
              icon={<TrendingUp className="h-4 w-4" />}
              label="Maximum Altitude"
              value={aircraft.max_altitude_ft}
              suffix="ft"
            />
          </CardContent>
        </Card>
      )}

      {/* Capacity */}
      {(aircraft.passengers_capacity || aircraft.engines) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <SpecItem
              icon={<Users className="h-4 w-4" />}
              label="Passenger Capacity"
              value={aircraft.passengers_capacity}
              suffix="passengers"
            />
            <SpecItem
              icon={<Settings className="h-4 w-4" />}
              label="Engines"
              value={aircraft.engines}
            />
          </CardContent>
        </Card>
      )}

      {/* Features */}
      {aircraft.features && Array.isArray(aircraft.features) && aircraft.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Features & Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2">
              {aircraft.features
                .filter((f): f is string => typeof f === 'string')
                .map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
