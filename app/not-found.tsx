import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Plane, Mail, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <Card className="border-primary/20">
          <CardContent className="p-12">
            <div className="text-center space-y-8">
              {/* 404 Visual */}
              <div className="relative">
                <div className="text-9xl font-bold text-primary/10 select-none">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Plane className="h-24 w-24 text-primary animate-pulse" />
                </div>
              </div>

              {/* Main Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Page Not Found
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  It looks like this flight path doesn't exist. The page you're looking for
                  may have been moved, deleted, or never existed.
                </p>
              </div>

              {/* Helpful Suggestions */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">
                  Here's what you can do:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Search className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Check the URL</p>
                      <p className="text-xs text-muted-foreground">
                        Make sure the address is spelled correctly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Home className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Go to Homepage</p>
                      <p className="text-xs text-muted-foreground">
                        Start fresh from our main page
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="/">
                      <Home className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/aircraft">
                      <Plane className="h-4 w-4" />
                      Browse Aircraft
                    </Link>
                  </Button>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/contact">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </div>

              {/* Additional Help Text */}
              <p className="text-xs text-muted-foreground pt-4">
                If you believe this is an error, please contact our support team
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
