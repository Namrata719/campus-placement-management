"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Video, Users, FileText, ExternalLink, CheckCircle2, Bell, Loader2 } from "lucide-react"
import { toast } from "sonner"

const typeConfig: Record<string, { label: string; color: string; icon: typeof Calendar }> = {
  ppt: { label: "Pre-Placement Talk", color: "bg-chart-1/10 text-chart-1", icon: Users },
  online_test: { label: "Online Test", color: "bg-chart-2/10 text-chart-2", icon: FileText },
  gd: { label: "Group Discussion", color: "bg-chart-3/10 text-chart-3", icon: Users },
  technical_interview: { label: "Technical Interview", color: "bg-chart-4/10 text-chart-4", icon: Video },
  hr_interview: { label: "HR Interview", color: "bg-chart-5/10 text-chart-5", icon: Video },
  placement_drive: { label: "Placement Drive", color: "bg-primary/10 text-primary", icon: Calendar },
  workshop: { label: "Workshop", color: "bg-accent/10 text-accent", icon: FileText },
}

interface Event {
  id: string
  title: string
  company: string
  type: string
  date: string
  startTime: string
  endTime: string
  mode: "online" | "offline"
  venue?: string
  meetingLink?: string
  description: string
  registered: boolean
  mandatory: boolean
  slot?: string
}

export default function StudentSchedulePage() {
  const [tab, setTab] = useState("upcoming")
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState({ upcoming: 0, registered: 0, mandatory: 0 })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/student/schedule")
      const data = await res.json()

      if (data.success) {
        setEvents(data.events || [])
        setStats(data.stats || { upcoming: 0, registered: 0, mandatory: 0 })
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

  const handleRegister = async (eventId: string) => {
    try {
      setActionLoading(eventId)
      const res = await fetch("/api/student/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        fetchSchedule() // Refresh
      } else {
        toast.error(data.error || "Failed to register")
      }
    } catch (error) {
      toast.error("Failed to register for event")
    } finally {
      setActionLoading(null)
    }
  }

  const handleSetReminder = async (eventId: string) => {
    try {
      setActionLoading(eventId)
      const res = await fetch("/api/student/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.error || "Failed to set reminder")
      }
    } catch (error) {
      toast.error("Failed to set reminder")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title="Schedule" subtitle="View upcoming placement events" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingEvents = events.filter((e) => new Date(e.date) >= today)
  const pastEvents = events.filter((e) => new Date(e.date) < today)
  const myEvents = events.filter((e) => e.registered)

  const displayEvents = tab === "upcoming" ? upcomingEvents : tab === "my" ? myEvents : pastEvents

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Schedule" subtitle="View upcoming placement events" />

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.upcoming}</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.registered}</p>
              <p className="text-sm text-muted-foreground">Registered</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.mandatory}</p>
              <p className="text-sm text-muted-foreground">Mandatory</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="my">My Events</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-6">
            <div className="space-y-4">
              {displayEvents.map((event) => {
                const typeInfo = typeConfig[event.type] || typeConfig.placement_drive
                const TypeIcon = typeInfo.icon
                const eventDate = new Date(event.date)
                const isToday = eventDate.toDateString() === today.toDateString()
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)
                const isTomorrow = eventDate.toDateString() === tomorrow.toDateString()

                return (
                  <Card key={event.id} className={`bg-card ${event.mandatory ? "border-warning/50" : ""}`}>
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* Date Block */}
                        <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0 lg:w-20 shrink-0">
                          <div className="text-center lg:text-left">
                            <p className="text-2xl font-bold">{eventDate.getDate()}</p>
                            <p className="text-sm text-muted-foreground">
                              {eventDate.toLocaleDateString("en-US", { month: "short" })}
                            </p>
                          </div>
                          {isToday && <Badge className="bg-success/10 text-success">Today</Badge>}
                          {isTomorrow && <Badge className="bg-warning/10 text-warning">Tomorrow</Badge>}
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                <Badge className={typeInfo.color} variant="secondary">
                                  <TypeIcon className="h-3 w-3 mr-1" />
                                  {typeInfo.label}
                                </Badge>
                                {event.mandatory && (
                                  <Badge variant="outline" className="border-warning text-warning">
                                    Mandatory
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground">{event.company}</p>
                            </div>

                            {event.registered && (
                              <Badge className="bg-success/10 text-success self-start">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Registered
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mt-2">{event.description}</p>

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {event.startTime} - {event.endTime}
                            </span>
                            {event.mode === "offline" ? (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {event.venue}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Video className="h-3.5 w-3.5" />
                                Online
                              </span>
                            )}
                            {event.slot && (
                              <span className="flex items-center gap-1 text-primary font-medium">
                                <Calendar className="h-3.5 w-3.5" />
                                Your slot: {event.slot}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2 shrink-0 flex-wrap">
                          {!event.registered && new Date(event.date) >= today && (
                            <Button
                              size="sm"
                              onClick={() => handleRegister(event.id)}
                              disabled={actionLoading === event.id}
                            >
                              {actionLoading === event.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Register"
                              )}
                            </Button>
                          )}
                          {event.registered && event.mode === "online" && event.meetingLink && (
                            <a href={event.meetingLink} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" className="w-full gap-1">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Join
                              </Button>
                            </a>
                          )}
                          {event.registered && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSetReminder(event.id)}
                              disabled={actionLoading === event.id}
                              className="gap-1"
                            >
                              {actionLoading === event.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Bell className="h-3.5 w-3.5" />
                                  Remind
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {displayEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No events found</h3>
                  <p className="text-muted-foreground">
                    {tab === "upcoming"
                      ? "No upcoming events scheduled"
                      : tab === "my"
                        ? "You haven't registered for any events yet"
                        : "No past events"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
