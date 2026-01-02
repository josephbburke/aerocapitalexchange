import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAircraftBySlug } from '@/lib/api/aircraft'
import { AircraftDetailView } from '@/components/aircraft/aircraft-detail-view'

interface AircraftDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AircraftDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const aircraft = await getAircraftBySlug(slug)

    return {
      title: aircraft.meta_title || aircraft.title,
      description: aircraft.meta_description || aircraft.description || `${aircraft.manufacturer} ${aircraft.model} - ${aircraft.year_manufactured}`,
      openGraph: {
        title: aircraft.title,
        description: aircraft.description || `${aircraft.manufacturer} ${aircraft.model}`,
        images: aircraft.primary_image_url ? [aircraft.primary_image_url] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: aircraft.title,
        description: aircraft.description || `${aircraft.manufacturer} ${aircraft.model}`,
        images: aircraft.primary_image_url ? [aircraft.primary_image_url] : [],
      },
    }
  } catch {
    return {
      title: 'Aircraft Not Found',
      description: 'The requested aircraft could not be found',
    }
  }
}

export default async function AircraftDetailPage({ params }: AircraftDetailPageProps) {
  const { slug } = await params

  let aircraft
  try {
    aircraft = await getAircraftBySlug(slug)
  } catch {
    notFound()
  }

  if (!aircraft || aircraft.status === 'draft') {
    notFound()
  }

  return <AircraftDetailView aircraft={aircraft} />
}
