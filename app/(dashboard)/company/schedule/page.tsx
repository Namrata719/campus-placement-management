"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Plus, Users, Video, Send, CheckCircle } from "lucide-react"

const scheduleRequests = [
  {
    id: "1",
    type: "PPT",
    title: "Pre-Placement Talk",
    requestedDate: "2024-12-15",
    requestedTime: "10:00 AM",
    duration: "2 hours",
    mode: "Offline",
    venue: "Pending",
    status: "approved",
    expectedAttendees: 150,
    notes: "Need projector and mic setup",
  },
  {
    id: "2",
    type: "Test",
    title: "Online Assessment",
    requestedDate: "2024-12-16",
    requestedTime: "09:00 AM",
    duration: "1.5 hours",
    mode: "Online",
    venue: "HackerRank Platform",
    status: "approved",
    expectedAttendees: 45,
    notes: "Will share test link 1 day before",
  },
  {
    id: "3",
    type: "Interview",
    title: "Technical Interview R1",
    requestedDate: "2024-12-18",
    requestedTime: "11:00 AM",
    duration: "4 hours",
    mode: "Offline",
    venue: "Pending",
    status: "pending",
    expectedAttendees: 12,
    notes: "Need 4 separate interview rooms",
  },
  {
    id: "4",
    type: "Interview",
    title: "HR Round",
    requestedDate: "2024-12-19",
    requestedTime: "10:00 AM",
    duration: "3 hours",
    mode: "Online",
    venue: "MS Teams",
    status: "pending",
    expectedAttendees: 6,
    notes: "",
  },
]

const confirmedSchedule = scheduleRequests.filter((s) => s.status === "approved")
const pendingRequests = scheduleRequests.filter((s) => s.status === "pending")

export default function CompanySchedulePage() {
  const [isRequestOpen, setIsRequestOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">Request and manage your recruitment schedule</p>
        </div>
        <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Request Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Request Schedule Slot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ppt">Pre-Placement Talk</SelectItem>
                    <SelectItem value="test">Online Assessment</SelectItem>
                    <SelectItem value="gd">Group Discussion</SelectItem>
                    <SelectItem value="interview-tech">Technical Interview</SelectItem>
                    <SelectItem value="interview-hr">HR Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Time</Label>
                  <Input type="time" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="1.5">1.5 hours</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="full">Full Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Expected Participants</Label>
                <Input type="number" placeholder="e.g., 50" />
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea placeholder="Any specific requirements or preferences..." rows={3} />
              </div>

              <Button className="w-full" onClick={() => setIsRequestOpen(false)}>
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{confirmedSchedule.length}</p>
                <p className="text-sm text-muted-foreground">Confirmed Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {scheduleRequests.reduce((acc, s) => acc + s.expectedAttendees, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Expected Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Confirmed Schedule
            </CardTitle>
            <CardDescription>Your approved recruitment events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {confirmedSchedule.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No confirmed events yet</p>
            ) : (
              confirmedSchedule.map((event) => (
                <div key={event.id} className="p-4 rounded-lg border bg-green-500/5 border-green-500/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline" className="mt-1">
                        {event.type}
                      </Badge>
                    </div>
                    <Badge className="bg-green-500">Confirmed</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.requestedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {event.requestedTime} ({event.duration})
                    </div>
                    <div className="flex items-center gap-2">
                      {event.mode === "Online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {event.expectedAttendees} expected
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pending Requests
            </CardTitle>
            <CardDescription>Awaiting TPO approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending requests</p>
            ) : (
              pendingRequests.map((event) => (
                <div key={event.id} className="p-4 rounded-lg border bg-yellow-500/5 border-yellow-500/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline" className="mt-1">
                        {event.type}
                      </Badge>
                    </div>
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.requestedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {event.requestedTime} ({event.duration})
                    </div>
                    <div className="flex items-center gap-2">
                      {event.mode === "Online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      {event.mode}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {event.expectedAttendees} expected
                    </div>
                  </div>
                  {event.notes && (
                    <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">Note: {event.notes}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
