'use client'

import { Aircraft } from '@/types/database'
import { ImageGallery } from './image-gallery'
import { AircraftSpecifications } from './aircraft-specifications'
import { AircraftInquiryForm } from './aircraft-inquiry-form'
import { SimilarAircraft } from './similar-aircraft'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Share2, Printer, ChevronLeft, Heart } from 'lucide-react'
import { AIRCRAFT_CATEGORY_LABELS } from '@/lib/constants/aircraft-types'
import Link from 'next/link'
import { useState } from 'react'

interface AircraftDetailViewProps {
  aircraft: Aircraft
}

export function AircraftDetailView({ aircraft }: AircraftDetailViewProps) {
  const [shareOpen, setShareOpen] = useState(false)

  const images = aircraft.primary_image_url
    ? [aircraft.primary_image_url]
    : []

  if (aircraft.images && Array.isArray(aircraft.images)) {
    const additionalImages = aircraft.images.filter(
      (img): img is string => typeof img === 'string' && img !== aircraft.primary_image_url
    )
    images.push(...additionalImages)
  }

  const handleShare = async () => {
    const shareData = {
      title: aircraft.title,
      text: `Check out this ${aircraft.manufacturer} ${aircraft.model}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or error occurred
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setShareOpen(true)
    setTimeout(() => setShareOpen(false), 2000)
  }

  const handlePrint = () => {
    window.print()
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
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/aircraft">Aircraft</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{aircraft.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link href="/aircraft">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={getStatusBadgeColor(aircraft.status)}>
                      {aircraft.status.charAt(0).toUpperCase() + aircraft.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {AIRCRAFT_CATEGORY_LABELS[aircraft.category as keyof typeof AIRCRAFT_CATEGORY_LABELS]}
                    </Badge>
                    {aircraft.featured && (
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{aircraft.title}</h1>
                  <p className="text-xl text-muted-foreground">
                    {aircraft.manufacturer} {aircraft.model} • {aircraft.year_manufactured}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    title="Share"
                    className="print:hidden"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrint}
                    title="Print"
                    className="print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Add to favorites"
                    className="print:hidden"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {shareOpen && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
                  Link copied to clipboard!
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <ImageGallery images={images} title={aircraft.title} />

            {/* Description */}
            {aircraft.description && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-muted-foreground">
                      {aircraft.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specifications - Show on mobile */}
            <div className="lg:hidden">
              <AircraftSpecifications aircraft={aircraft} />
            </div>

            {/* Inquiry Form - Show on mobile */}
            <div className="lg:hidden print:hidden">
              <AircraftInquiryForm aircraftId={aircraft.id} aircraftTitle={aircraft.title} />
            </div>
          </div>

          {/* Right Column - Specifications and Inquiry */}
          <div className="space-y-6 hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <AircraftSpecifications aircraft={aircraft} />
              <div className="print:hidden">
                <AircraftInquiryForm aircraftId={aircraft.id} aircraftTitle={aircraft.title} />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Aircraft */}
        <div className="mt-16 print:hidden">
          <SimilarAircraft currentAircraft={aircraft} />
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}
