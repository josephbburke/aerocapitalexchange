'use client'

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCcw } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-12">
            <div className="text-center space-y-8">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full" />
                  <div className="relative bg-destructive/10 p-6 rounded-full">
                    <AlertCircle className="h-16 w-16 text-destructive" />
                  </div>
                </div>
              </div>

              {/* Main Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Something Went Wrong
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  We encountered an unexpected error while processing your request.
                  Our team has been notified and we're working to fix the issue.
                </p>
              </div>

              {/* Error Details (for development) */}
              {process.env.NODE_ENV === 'development' && error.message && (
                <div className="p-4 bg-muted rounded-lg text-left">
                  <p className="text-sm font-mono text-destructive break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* Production Error Reference */}
              {process.env.NODE_ENV === 'production' && error.digest && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Error Reference: <span className="font-mono font-medium text-foreground">{error.digest}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please include this reference when contacting support
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={reset}
                    size="lg"
                    className="min-w-[140px]"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-w-[140px]"
                  >
                    <Link href="/">
                      <Home className="h-4 w-4" />
                      Go Home
                    </Link>
                  </Button>
                </div>

                <Button asChild variant="ghost" size="sm">
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
              </div>

              {/* Help Text */}
              <div className="pt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  What happened?
                </p>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                  This error is usually temporary. Try refreshing the page or going back to the homepage.
                  If the problem persists, please contact our support team for assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
