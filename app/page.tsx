import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Shield, DollarSign, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Trusted Partner in{" "}
              <span className="text-primary">Aviation Financing</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover premium aircraft and flexible financing solutions tailored to your needs.
              From business jets to helicopters, we make aircraft ownership accessible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/aircraft">Browse Aircraft</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/financing">Financing Options</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Aero Capital Exchange?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine industry expertise with personalized service to help you find the perfect aircraft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Plane className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Extensive Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse our curated selection of jets, turboprops, helicopters, and piston aircraft from trusted sellers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Flexible Financing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Competitive rates and customized financing solutions designed to fit your budget and timeline.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Trusted Service</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Years of experience in aviation transactions, ensuring a smooth and secure purchasing process.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Fast Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Quick approval and streamlined processes to get you in the air faster.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Take Flight?</h2>
                <p className="text-lg text-muted-foreground">
                  Connect with our aviation financing experts today and discover how we can help you acquire your ideal aircraft.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
