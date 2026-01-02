import { AircraftListing } from "@/components/aircraft/aircraft-listing"

export const metadata = {
  title: "Aircraft Inventory",
  description: "Browse our selection of premium aircraft for sale",
}

export default function AircraftPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Aircraft Inventory</h1>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Browse our premium selection of aircraft
          </p>
        </div>

        <AircraftListing />
      </div>
    </div>
  )
}
