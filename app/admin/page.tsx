'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, MessageSquare, Users, BarChart, Plus, ArrowLeft } from "lucide-react"
import { AircraftForm } from '@/components/admin/aircraft-form'
import { AircraftList } from '@/components/admin/aircraft-list'
import { InquiryList } from '@/components/admin/inquiry-list'
import { getAllAircraft } from '@/lib/api/aircraft'
import { getAllInquiries } from '@/lib/api/inquiries'
import { Aircraft } from '@/types/database'

type View = 'dashboard' | 'list' | 'form' | 'inquiries'

export default function AdminPage() {
  const [view, setView] = useState<View>('dashboard')
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | undefined>()

  const { data: aircraft, isError, error } = useQuery({
    queryKey: ['aircraft'],
    queryFn: () => getAllAircraft(),
    retry: false,
  })

  const { data: inquiries } = useQuery({
    queryKey: ['inquiries'],
    queryFn: () => getAllInquiries(),
    retry: false,
  })

  const newInquiriesCount = inquiries?.filter(i => i.status === 'new').length || 0

  const handleAddNew = () => {
    setEditingAircraft(undefined)
    setView('form')
  }

  const handleEdit = (aircraft: Aircraft) => {
    setEditingAircraft(aircraft)
    setView('form')
  }

  const handleFormSuccess = () => {
    setView('list')
    setEditingAircraft(undefined)
  }

  const handleCancel = () => {
    setView('list')
    setEditingAircraft(undefined)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              {view !== 'dashboard' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('dashboard')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <h1 className="text-3xl font-bold">
                {view === 'dashboard' && 'Admin Dashboard'}
                {view === 'list' && 'Manage Aircraft'}
                {view === 'form' && (editingAircraft ? 'Edit Aircraft' : 'Add New Aircraft')}
                {view === 'inquiries' && 'Manage Inquiries'}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {view === 'dashboard' && 'Manage aircraft listings, inquiries, and users'}
              {view === 'list' && 'View and manage all aircraft listings'}
              {view === 'form' && (editingAircraft ? 'Update aircraft details' : 'Create a new aircraft listing')}
              {view === 'inquiries' && 'View and respond to customer inquiries'}
            </p>
          </div>
          {view === 'list' && (
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Aircraft
            </Button>
          )}
        </div>

        {isError && view === 'dashboard' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
            <p className="font-semibold">Database Connection Issue</p>
            <p className="text-sm mt-1">
              Unable to connect to database. Please ensure:
            </p>
            <ul className="text-sm mt-2 list-disc list-inside">
              <li>Your Supabase service role key is set in .env.local</li>
              <li>The database migrations have been applied</li>
              <li>You have restarted the dev server after updating .env.local</li>
            </ul>
            <p className="text-sm mt-2 text-red-600">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {view === 'dashboard' && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <Plane className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Aircraft</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{aircraft?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total listings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MessageSquare className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{newInquiriesCount}</p>
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

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setView('list')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    Manage Aircraft
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create, edit, and manage aircraft listings. Upload images and update specifications.
                  </p>
                  <Button variant="outline" size="sm">
                    View All Aircraft
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => window.location.href = '/admin/inquiries'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Inquiries
                    {newInquiriesCount > 0 && (
                      <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {newInquiriesCount} new
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review and respond to customer inquiries. Manage leads and communications.
                  </p>
                  <Button variant="outline" size="sm">
                    View All Inquiries
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {view === 'list' && <AircraftList onEdit={handleEdit} />}

        {view === 'form' && (
          <AircraftForm
            aircraft={editingAircraft}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        )}

        {view === 'inquiries' && <InquiryList />}
      </div>
    </div>
  )
}
