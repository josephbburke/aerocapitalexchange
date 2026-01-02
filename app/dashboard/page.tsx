import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MessageSquare, Settings } from "lucide-react"

export const metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your favorites, inquiries, and account settings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Favorites</CardTitle>
              <CardDescription>View your saved aircraft</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Saved aircraft</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Inquiries</CardTitle>
              <CardDescription>Your inquiry history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total inquiries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your account information and preferences
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-dashed">
          <CardHeader>
            <CardTitle>Dashboard Features Coming Soon</CardTitle>
            <CardDescription>
              Full dashboard functionality will be available once the database is configured.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
