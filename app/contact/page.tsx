import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/components/contact/contact-form"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Aero Capital Exchange",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with our aviation financing experts
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Contact Information Cards */}
          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:info@aerocapitalexchange.com"
                className="text-primary hover:underline break-all"
              >
                info@aerocapitalexchange.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                We typically respond within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Phone className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <a href="tel:+1-555-0123" className="text-primary hover:underline">
                +1 (555) 012-3456
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                Monday - Friday: 9 AM - 6 PM EST
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Florida, United States</p>
              <p className="text-sm text-muted-foreground mt-2">
                Serving clients worldwide
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Business Hours */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Business Hours
            </CardTitle>
            <CardDescription>
              We're here to assist you during the following hours (EST)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="font-medium">Monday - Friday</p>
                <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Saturday</p>
                <p className="text-sm text-muted-foreground">10:00 AM - 4:00 PM</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Sunday</p>
                <p className="text-sm text-muted-foreground">Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </div>
  )
}
