"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Plus, Users, ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

const eventTypes = [
  { value: "PPT", label: "Pre-Placement Talk", color: "bg-blue-500" },
  { value: "Test", label: "Online Test", color: "bg-purple-500" },
  { value: "GD", label: "Group Discussion", color: "bg-orange-500" },
  { value: "Interview", label: "Interview", color: "bg-green-500" },
  { value: "HR", label: "HR Round", color: "bg-pink-500" },
]

export default function TPOSchedulePage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [companies, setCompanies] = useState<any[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    companyId: "",
    type: "PPT",
    date: "",
    time: "",
    duration: "2 hours",
    mode: "offline",
    venue: "",
    instructions: ""
  })

  useEffect(() => {
    fetchEvents()
    fetchCompanies()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/tpo/schedule")
      const json = await res.json()
      if (json.success) {
        setEvents(json.data)
      }
    } catch (error) {
      console.error("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/tpo/companies?status=approved")
      const json = await res.json()
      if (json.success) {
        setCompanies(json.data)
      }
    } catch (error) {
      console.error("Failed to fetch companies")
    }
  }

  const handleCreateEvent = async () => {
    try {
      const res = await fetch("/api/tpo/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
      })
      const json = await res.json()
      if (json.success) {
        toast.success("Event created successfully")
        setIsCreateModalOpen(false)
        fetchEvents()
      } else {
        toast.error("Failed to create event")
      }
    } catch (error) {
      toast.error("Failed to create event")
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    return { daysInMonth, firstDayOfMonth }
  }

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate)

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.date === dateStr)
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">Manage placement drives and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Optimize Schedule
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input
                    placeholder="e.g., TechCorp Solutions - Technical Interview"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Select onValueChange={(v) => setNewEvent({ ...newEvent, companyId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input placeholder="e.g., 2 hours" value={newEvent.duration} onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <Select onValueChange={(v) => setNewEvent({ ...newEvent, mode: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
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
                  <Label>Venue / Link</Label>
                  <Input placeholder="e.g., Seminar Hall A or Teams link" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Instructions (Optional)</Label>
                  <Textarea placeholder="Any special instructions for students..." rows={3} value={newEvent.instructions} onChange={(e) => setNewEvent({ ...newEvent, instructions: e.target.value })} />
                </div>
                <Button className="w-full" onClick={handleCreateEvent}>Create Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24 p-1" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayEvents = getEventsForDay(day)
                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()

                return (
                  <div
                    key={day}
                    className={`h-24 p-1 border rounded-lg ${isToday ? "border-primary bg-primary/5" : "border-border"
                      }`}
                  >
                    <div className={`text-sm mb-1 ${isToday ? "font-bold text-primary" : ""}`}>{day}</div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => {
                        const typeInfo = eventTypes.find((t) => t.value === event.type)
                        return (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate text-white ${typeInfo?.color || "bg-gray-500"}`}
                          >
                            {event.type}
                          </div>
                        )
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Event Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {eventTypes.map((type) => (
                <div key={type.value} className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded ${type.color}`} />
                  <span className="text-sm">{type.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              ) : (
                events.slice(0, 4).map((event) => {
                  const typeInfo = eventTypes.find((t) => t.value === event.type)
                  return (
                    <div key={event.id} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={typeInfo?.color}>{event.type}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.mode}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.venue}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendees} expected
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
