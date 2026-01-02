import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, CheckCircle } from "lucide-react"

export const metadata = {
  title: "Financing Options",
  description: "Flexible financing solutions for aircraft acquisition",
}

export default function FinancingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Financing Options</h1>
          <p className="text-lg text-muted-foreground">
            Flexible solutions tailored to your aviation financing needs
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Competitive Rates</CardTitle>
              <CardDescription>
                We work with leading aviation lenders to secure the best rates for your aircraft purchase.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Services Include:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Aircraft Acquisition Financing</p>
                  <p className="text-sm text-muted-foreground">Flexible terms for new and pre-owned aircraft</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Refinancing</p>
                  <p className="text-sm text-muted-foreground">Optimize your current aircraft loan terms</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Lease Options</p>
                  <p className="text-sm text-muted-foreground">Operating and capital lease structures available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/contact">Contact Us for a Quote</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
