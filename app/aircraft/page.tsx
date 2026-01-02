import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plane } from "lucide-react"

export const metadata = {
  title: "Aircraft Inventory",
  description: "Browse our selection of premium aircraft for sale",
}

export default function AircraftPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Aircraft Inventory</h1>
          <p className="text-lg text-muted-foreground">
            Browse our premium selection of aircraft
          </p>
        </div>

        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Plane className="h-16 w-16 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription className="text-base">
              Aircraft listings will be available once you've set up your Supabase database.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              To get started:
            </p>
            <ol className="text-sm text-left max-w-md mx-auto space-y-2 list-decimal list-inside">
              <li>Create a Supabase project at supabase.com</li>
              <li>Run the migration files in your Supabase SQL editor</li>
              <li>Update your .env.local with Supabase credentials</li>
              <li>Add aircraft data through the admin dashboard</li>
            </ol>
            <div className="pt-4">
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
