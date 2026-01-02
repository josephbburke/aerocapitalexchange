'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllAircraft } from '@/lib/api/aircraft'
import { Aircraft } from '@/types/database'
import { AircraftCard } from './aircraft-card'
import { AircraftFiltersComponent, AircraftFilters } from './aircraft-filters'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const ITEMS_PER_PAGE = 12

const initialFilters: AircraftFilters = {
  search: '',
  categories: [],
  statuses: [],
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxYear: null,
  sortBy: 'newest'
}

export function AircraftListing() {
  const [filters, setFilters] = useState<AircraftFilters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: allAircraft, isLoading, isError, error } = useQuery({
    queryKey: ['aircraft'],
    queryFn: () => getAllAircraft(),
    retry: false,
  })

  // Filter and sort aircraft
  const filteredAndSortedAircraft = useMemo(() => {
    if (!allAircraft) return []

    let result = [...allAircraft]

    // Only show available, sold, and pending aircraft (not draft)
    result = result.filter(aircraft => aircraft.status !== 'draft')

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(aircraft =>
        aircraft.title.toLowerCase().includes(searchLower) ||
        aircraft.manufacturer.toLowerCase().includes(searchLower) ||
        aircraft.model.toLowerCase().includes(searchLower) ||
        aircraft.description?.toLowerCase().includes(searchLower)
      )
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(aircraft =>
        filters.categories.includes(aircraft.category)
      )
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      result = result.filter(aircraft =>
        filters.statuses.includes(aircraft.status)
      )
    }

    // Apply price range filter
    if (filters.minPrice !== null) {
      result = result.filter(aircraft =>
        aircraft.price !== null && aircraft.price >= filters.minPrice!
      )
    }
    if (filters.maxPrice !== null) {
      result = result.filter(aircraft =>
        aircraft.price !== null && aircraft.price <= filters.maxPrice!
      )
    }

    // Apply year range filter
    if (filters.minYear !== null) {
      result = result.filter(aircraft =>
        aircraft.year_manufactured >= filters.minYear!
      )
    }
    if (filters.maxYear !== null) {
      result = result.filter(aircraft =>
        aircraft.year_manufactured <= filters.maxYear!
      )
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      case 'price-asc':
        result.sort((a, b) => {
          if (a.price === null) return 1
          if (b.price === null) return -1
          return a.price - b.price
        })
        break
      case 'price-desc':
        result.sort((a, b) => {
          if (a.price === null) return 1
          if (b.price === null) return -1
          return b.price - a.price
        })
        break
      case 'year-desc':
        result.sort((a, b) => b.year_manufactured - a.year_manufactured)
        break
      case 'year-asc':
        result.sort((a, b) => a.year_manufactured - b.year_manufactured)
        break
    }

    // Multi-level sort: Available > Featured > Other statuses
    result.sort((a, b) => {
      // First priority: Available aircraft always come first
      if (a.status === 'available' && b.status !== 'available') return -1
      if (a.status !== 'available' && b.status === 'available') return 1

      // Second priority: Within same status group, featured comes first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1

      // Third priority: Pending before sold
      if (a.status === 'pending' && b.status === 'sold') return -1
      if (a.status === 'sold' && b.status === 'pending') return 1

      return 0
    })

    return result
  }, [allAircraft, filters])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAircraft.length / ITEMS_PER_PAGE)
  const paginatedAircraft = filteredAndSortedAircraft.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleFiltersChange = (newFilters: AircraftFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
    setCurrentPage(1)
  }

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading aircraft...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <p className="text-destructive font-semibold mb-2">Failed to load aircraft</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please check your database connection and try refreshing the page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!allAircraft || allAircraft.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="pt-6">
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground text-lg">No aircraft available at the moment</p>
            <p className="text-sm text-muted-foreground">
              Please check back later for new listings
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <AircraftFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        totalResults={filteredAndSortedAircraft.length}
      />

      {filteredAndSortedAircraft.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6">
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground text-lg">No aircraft match your filters</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria or clearing filters
              </p>
              <Button variant="outline" onClick={handleResetFilters}>
                Clear all filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAircraft.map((aircraft) => (
              <AircraftCard key={aircraft.id} aircraft={aircraft} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
