"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Briefcase,
  ClipboardList,
  Calendar,
  TrendingUp,
  ArrowRight,
  MapPin,
  Building2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
  applied: "bg-muted text-muted-foreground",
  shortlisted: "bg-chart-2/10 text-chart-2",
  interview: "bg-chart-4/10 text-chart-4",
  offered: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
}

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/student/dashboard")
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      } else {
        toast.error("Failed to fetch dashboard data")
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!data) return null

  const stats = [
    { title: "Jobs Available", value: data.stats.jobsAvailable, change: "Live", icon: Briefcase, color: "text-chart-1" },
    { title: "Applications", value: data.stats.applications, change: "Total", icon: ClipboardList, color: "text-chart-2" },
    { title: "Interviews", value: data.stats.interviews, change: "Scheduled", icon: Calendar, color: "text-chart-3" },
    { title: "Profile Score", value: `${data.stats.profileScore}%`, change: "Completion", icon: TrendingUp, color: "text-chart-4" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Student Dashboard" subtitle="Welcome back! Here's your placement overview." />

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recommended Jobs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Recommended Jobs</h2>
                <p className="text-sm text-muted-foreground">Based on your profile and preferences</p>
              </div>
              <Link href="/student/jobs">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {data.recommendedJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recommended jobs found.</p>
              ) : (
                data.recommendedJobs.map((job: any) => (
                  <Card key={job.id} className="bg-card hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                            {job.company.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary shrink-0">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {job.match}% Match
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {job.ctc}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {job.deadline}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Link href={`/student/jobs/${job.id}`}>
                          <Button size="sm">Apply</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{data.stats.profileScore}% Complete</span>
                    <span className="text-muted-foreground">{100 - data.stats.profileScore}% remaining</span>
                  </div>
                  <Progress value={data.stats.profileScore} className="h-2" />
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Basic Information</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Academic Details</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Add Resume</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Add Projects</span>
                    </div>
                  </div>
                  <Link href="/student/profile">
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Upcoming Events</CardTitle>
                  <Link href="/student/schedule">
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming events.</p>
                ) : (
                  data.upcomingEvents.map((event: any) => (
                    <div key={event.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.date} • {event.time}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.venue}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recent Applications</CardTitle>
                  <Link href="/student/applications">
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent applications.</p>
                ) : (
                  data.applications.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-sm">{app.company}</p>
                        <p className="text-xs text-muted-foreground">{app.role}</p>
                      </div>
                      <Badge className={statusColors[app.status] || "bg-secondary text-secondary-foreground"} variant="secondary">
                        {app.status}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
