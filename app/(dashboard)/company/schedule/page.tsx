"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Plus, Users, Video, Send, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function CompanySchedulePage() {
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [eventType, setEventType] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("")
  const [mode, setMode] = useState("")
  const [participants, setParticipants] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const res = await fetch("/api/company/schedule")
      const data = await res.json()
      if (data.success) {
        setEvents(data.events)
      } else {
        toast.error("Failed to load schedule")
      }
    } catch (error) {
      console.error("Error fetching schedule:", error)
      toast.error("Failed to load schedule")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!eventType || !date || !time || !duration || !mode || !participants) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    try {
      const endTime = calculateEndTime(time, duration)

      const res = await fetch("/api/company/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${getEventLabel(eventType)}`,
          type: eventType,
          date,
          startTime: time,
          endTime,
          mode,
          venue: mode === "online" ? "Online" : "Pending",
          description: notes,
          status: "scheduled" // In a real flow, this might be 'pending' approval
        })
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Schedule request submitted")
        setIsRequestOpen(false)
        fetchSchedule()
        // Reset form
        setEventType("")
        setDate("")
        setTime("")
        setDuration("")
        setMode("")
        setParticipants("")
        setNotes("")
      } else {
        toast.error(data.error || "Failed to submit request")
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      toast.error("Failed to submit request")
    } finally {
      setSubmitting(false)
    }
  }

  const calculateEndTime = (start: string, duration: string) => {
    // Simple calculation, can be improved
    return "17:00" // Placeholder
  }

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      ppt: "Pre-Placement Talk",
      test: "Online Assessment",
      gd: "Group Discussion",
      technical_interview: "Technical Interview",
      hr_interview: "HR Interview"
    }
    return labels[type] || "Event"
  }

  const confirmedSchedule = events.filter((s) => s.status === "scheduled" || s.status === "ongoing" || s.status === "completed")
  const pendingRequests = events.filter((s) => s.status === "pending")

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

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
                <Label>Event Type <span className="text-red-500">*</span></Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ppt">Pre-Placement Talk</SelectItem>
                    <SelectItem value="online_test">Online Assessment</SelectItem>
                    <SelectItem value="gd">Group Discussion</SelectItem>
                    <SelectItem value="technical_interview">Technical Interview</SelectItem>
                    <SelectItem value="hr_interview">HR Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Time <span className="text-red-500">*</span></Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration <span className="text-red-500">*</span></Label>
                  <Select value={duration} onValueChange={setDuration}>
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
                  <Label>Mode <span className="text-red-500">*</span></Label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Expected Participants <span className="text-red-500">*</span></Label>
                <Input type="number" placeholder="e.g., 50" value={participants} onChange={(e) => setParticipants(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea placeholder="Any specific requirements or preferences..." rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
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
                  {events.reduce((acc, s) => acc + (s.registeredStudents?.length || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Registered</p>
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
                        {getEventLabel(event.type)}
                      </Badge>
                    </div>
                    <Badge className="bg-green-500">{event.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {event.startTime} - {event.endTime}
                    </div>
                    <div className="flex items-center gap-2">
                      {event.mode === "online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      {event.venue || event.mode}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {event.registeredStudents?.length || 0} registered
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
                        {getEventLabel(event.type)}
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
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {event.startTime}
                    </div>
                    <div className="flex items-center gap-2">
                      {event.mode === "online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      {event.mode}
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">Note: {event.description}</p>
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
