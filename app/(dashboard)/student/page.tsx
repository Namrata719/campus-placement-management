"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Briefcase,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Building2,
  MapPin,
  IndianRupee,
  Bell,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const [greeting, setGreeting] = useState("")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 17) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/student/dashboard")
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!data) {
    return <div className="flex items-center justify-center h-screen">Failed to load dashboard data</div>
  }

  const { profile = {}, stats = {}, recommendedJobs = [], upcomingEvents = [], recentNotifications = [] } = data || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {profile?.name?.split(" ")[0] || "Student"}!
          </h1>
          <p className="text-muted-foreground">Here&apos;s your placement dashboard overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/student/notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              {recentNotifications?.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {recentNotifications.length}
                </Badge>
              )}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/student/jobs">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Completion Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="/student-avatar.png" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {profile?.name?.split(" ").map((n: string) => n[0]).join("") || "ST"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{profile?.name || "Student"}</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.branch || "N/A"} • Batch {profile?.batch || "N/A"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">CGPA: {profile?.cgpa || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className="font-medium">{profile?.profileCompletion || 0}%</span>
              </div>
              <Progress value={profile?.profileCompletion || 0} className="h-2" />
              {(profile?.profileCompletion || 0) < 100 && (
                <Button variant="link" className="p-0 h-auto text-xs justify-start" asChild>
                  <Link href="/student/profile">Complete your profile to improve visibility</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.applied || 0}</div>
            <p className="text-xs text-muted-foreground">Jobs applied to</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats?.shortlisted || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting next round</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats?.interviews || 0}</div>
            <p className="text-xs text-muted-foreground">Scheduled this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.offers || 0}</div>
            <p className="text-xs text-muted-foreground">Congratulations!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recommended Jobs */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Recommended Jobs
              </CardTitle>
              <CardDescription>Personalized matches based on your profile</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/jobs">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedJobs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recommended jobs found.</p>
            ) : (
              recommendedJobs.map((job: any) => (
                <div
                  key={job.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarImage src={job.logo || "/placeholder.svg"} alt={job.company} />
                    <AvatarFallback className="rounded-lg bg-primary/10">{job.company[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{job.title}</h4>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 shrink-0">
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {job.ctc}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium">{job.deadline}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Your schedule this week</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/schedule">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming events.</p>
            ) : (
              upcomingEvents.map((event: any) => (
                <div key={event.id} className="flex gap-3 p-3 rounded-lg border">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary shrink-0">
                    <span className="text-xs font-medium">{event.date.split("/")[0]}</span>
                    <span className="text-lg font-bold">{event.date.split("/")[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {event.time} • {event.venue}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        event.type === "PPT"
                          ? "mt-1 text-blue-600 border-blue-200 bg-blue-50"
                          : event.type === "Test"
                            ? "mt-1 text-amber-600 border-amber-200 bg-amber-50"
                            : "mt-1 text-emerald-600 border-emerald-200 bg-emerald-50"
                      }
                    >
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Stay updated with your placement journey</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/student/notifications">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent notifications.</p>
            ) : (
              recentNotifications.map((notification: any) => (
                <div key={notification.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  {notification.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : notification.type === "warning" ? (
                    <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                  ) : (
                    <Bell className="h-5 w-5 text-primary shrink-0" />
                  )}
                  <p className="flex-1 text-sm">{notification.message}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{notification.time}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
