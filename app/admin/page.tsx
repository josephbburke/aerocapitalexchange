import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, MessageSquare, Users, BarChart } from "lucide-react"

export const metadata = {
  title: "Admin Dashboard",
}

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage aircraft listings, inquiries, and users
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Plane className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Aircraft</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">New inquiries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Page views</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-dashed">
          <CardHeader>
            <CardTitle>Admin Features Coming Soon</CardTitle>
            <CardDescription>
              Full admin functionality will be available once your Supabase database is configured.
              You'll be able to manage aircraft listings, respond to inquiries, and oversee user accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Create and edit aircraft listings</li>
              <li>Upload and manage aircraft images</li>
              <li>Review and respond to customer inquiries</li>
              <li>Manage user accounts and permissions</li>
              <li>View analytics and activity logs</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
