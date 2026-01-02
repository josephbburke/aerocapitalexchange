import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plane, Award, Users, Globe } from "lucide-react"

export const metadata = {
  title: "About Us",
  description: "Learn more about Aero Capital Exchange",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Aero Capital Exchange</h1>
          <p className="text-lg text-muted-foreground">
            Your trusted partner in aviation financing and aircraft sales
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-muted-foreground">
            Aero Capital Exchange specializes in aviation financing and aircraft sales, providing comprehensive
            solutions for individuals and businesses looking to acquire premium aircraft. With years of experience
            in the aviation industry, we understand the unique challenges and opportunities in aircraft acquisition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Industry Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Years of experience in aviation transactions and financing solutions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Personalized Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dedicated team committed to finding the right aircraft and financing for your needs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Global Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access to a worldwide network of aircraft sellers and aviation lenders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Plane className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Comprehensive Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                From business jets to helicopters, we offer diverse aircraft options.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
