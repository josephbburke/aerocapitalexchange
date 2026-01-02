'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  AIRCRAFT_CATEGORIES,
  AIRCRAFT_STATUS,
  AIRCRAFT_CATEGORY_LABELS,
  AIRCRAFT_STATUS_LABELS
} from '@/lib/constants/aircraft-types'
import { X, SlidersHorizontal } from 'lucide-react'

export interface AircraftFilters {
  search: string
  categories: string[]
  statuses: string[]
  minPrice: number | null
  maxPrice: number | null
  minYear: number | null
  maxYear: number | null
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc'
}

interface AircraftFiltersProps {
  filters: AircraftFilters
  onFiltersChange: (filters: AircraftFilters) => void
  onReset: () => void
  totalResults: number
}

export function AircraftFiltersComponent({
  filters,
  onFiltersChange,
  onReset,
  totalResults
}: AircraftFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const toggleStatus = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status]
    onFiltersChange({ ...filters, statuses: newStatuses })
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10)
    if (type === 'min') {
      onFiltersChange({ ...filters, minPrice: numValue })
    } else {
      onFiltersChange({ ...filters, maxPrice: numValue })
    }
  }

  const handleYearChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10)
    if (type === 'min') {
      onFiltersChange({ ...filters, minYear: numValue })
    } else {
      onFiltersChange({ ...filters, maxYear: numValue })
    }
  }

  const handleSortChange = (sortBy: AircraftFilters['sortBy']) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const activeFiltersCount =
    filters.categories.length +
    filters.statuses.length +
    (filters.minPrice !== null ? 1 : 0) +
    (filters.maxPrice !== null ? 1 : 0) +
    (filters.minYear !== null ? 1 : 0) +
    (filters.maxYear !== null ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search aircraft..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
          </Button>
        </div>

        {/* Quick Status Filters - Mobile Friendly */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-muted-foreground shrink-0">Quick:</span>
          <Badge
            variant={filters.statuses.includes('available') ? 'default' : 'outline'}
            className="cursor-pointer shrink-0 bg-green-600 hover:bg-green-700 border-green-600"
            onClick={() => toggleStatus('available')}
          >
            Available
          </Badge>
          <Badge
            variant={filters.statuses.includes('pending') ? 'default' : 'outline'}
            className="cursor-pointer shrink-0 bg-yellow-600 hover:bg-yellow-700 border-yellow-600"
            onClick={() => toggleStatus('pending')}
          >
            Pending
          </Badge>
          <Badge
            variant={filters.statuses.includes('sold') ? 'default' : 'outline'}
            className="cursor-pointer shrink-0 bg-gray-600 hover:bg-gray-700 border-gray-600"
            onClick={() => toggleStatus('sold')}
          >
            Sold
          </Badge>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as AircraftFilters['sortBy'])}
            className="px-3 py-1.5 border border-input rounded-md bg-background text-xs shrink-0 ml-auto"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="year-desc">Year ↓</option>
            <option value="year-asc">Year ↑</option>
          </select>
        </div>
      </div>

      {/* Results count and reset */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {totalResults} {totalResults === 1 ? 'aircraft' : 'aircraft'}
        </p>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs">
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Filters
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="sm:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Category</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(AIRCRAFT_CATEGORIES).map(([key, value]) => (
                  <Badge
                    key={value}
                    variant={filters.categories.includes(value) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(value)}
                  >
                    {AIRCRAFT_CATEGORY_LABELS[value]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(AIRCRAFT_STATUS)
                  .filter(([_, value]) => value !== 'draft') // Don't show draft to public
                  .map(([key, value]) => (
                    <Badge
                      key={value}
                      variant={filters.statuses.includes(value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(value)}
                    >
                      {AIRCRAFT_STATUS_LABELS[value]}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range (USD)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice ?? ''}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice ?? ''}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Year Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Year</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    type="number"
                    placeholder="Min year"
                    value={filters.minYear ?? ''}
                    onChange={(e) => handleYearChange('min', e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max year"
                    value={filters.maxYear ?? ''}
                    onChange={(e) => handleYearChange('max', e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
