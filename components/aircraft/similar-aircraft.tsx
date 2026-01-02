'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllAircraft } from '@/lib/api/aircraft'
import { Aircraft } from '@/types/database'
import { AircraftCard } from './aircraft-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plane } from 'lucide-react'

interface SimilarAircraftProps {
  currentAircraft: Aircraft
  limit?: number
}

export function SimilarAircraft({ currentAircraft, limit = 3 }: SimilarAircraftProps) {
  const { data: allAircraft, isLoading } = useQuery({
    queryKey: ['aircraft'],
    queryFn: () => getAllAircraft(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!allAircraft || allAircraft.length === 0) return null

  // Filter and score similar aircraft
  const similarAircraft = allAircraft
    .filter(aircraft =>
      aircraft.id !== currentAircraft.id &&
      aircraft.status !== 'draft' &&
      aircraft.status !== 'sold'
    )
    .map(aircraft => {
      let score = 0

      // Same category gets highest score
      if (aircraft.category === currentAircraft.category) score += 10

      // Same manufacturer
      if (aircraft.manufacturer === currentAircraft.manufacturer) score += 5

      // Similar year (within 5 years)
      const yearDiff = Math.abs(aircraft.year_manufactured - currentAircraft.year_manufactured)
      if (yearDiff <= 5) score += 3
      if (yearDiff <= 2) score += 2

      // Similar price (within 20%)
      if (aircraft.price && currentAircraft.price) {
        const priceDiff = Math.abs(aircraft.price - currentAircraft.price)
        const pricePercent = (priceDiff / currentAircraft.price) * 100
        if (pricePercent <= 20) score += 4
        if (pricePercent <= 10) score += 2
      }

      // Similar passenger capacity
      if (
        aircraft.passengers_capacity &&
        currentAircraft.passengers_capacity &&
        Math.abs(aircraft.passengers_capacity - currentAircraft.passengers_capacity) <= 2
      ) {
        score += 2
      }

      return { aircraft, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.aircraft)

  if (similarAircraft.length === 0) return null

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Plane className="h-6 w-6" />
        Similar Aircraft
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarAircraft.map(aircraft => (
          <AircraftCard key={aircraft.id} aircraft={aircraft} />
        ))}
      </div>
    </div>
  )
}
