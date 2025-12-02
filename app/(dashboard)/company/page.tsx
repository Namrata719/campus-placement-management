"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Plus,
  Eye,
  FileText,
  Sparkles,
  Clock,
  UserCheck,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
  new: "bg-chart-1/10 text-chart-1",
  reviewed: "bg-muted text-muted-foreground",
  shortlisted: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
  interview: "bg-blue-500/10 text-blue-500",
  offered: "bg-green-500/10 text-green-500",
}

export default function CompanyDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/company/dashboard")
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
    { title: "Active Jobs", value: data.stats.activeJobs, icon: Briefcase, color: "text-chart-1" },
    { title: "Total Applicants", value: data.stats.totalApplicants, icon: Users, color: "text-chart-2" },
    { title: "Shortlisted", value: data.stats.shortlisted, icon: UserCheck, color: "text-chart-3" },
    { title: "Offers Made", value: data.stats.offersMade, icon: CheckCircle2, color: "text-success" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Company Dashboard" subtitle="Campus Hiring Overview" />

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
                  </div>
                  <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/company/jobs">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </Link>
          <Link href="/company/ai-tools">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Sparkles className="h-4 w-4" />
              AI Tools
            </Button>
          </Link>
          <Link href="/company/schedule">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              Schedule Events
            </Button>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Jobs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Job Postings</h2>
              <Link href="/company/jobs">
                <Button variant="ghost" size="sm" className="gap-1">
                  Manage All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {data.activeJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active jobs found.</p>
              ) : (
                data.activeJobs.map((job: any) => (
                  <Card key={job.id} className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{job.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {job.applicants} applicants
                            </span>
                            <span className="flex items-center gap-1">
                              <UserCheck className="h-3.5 w-3.5" />
                              {job.shortlisted} shortlisted
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {job.deadline}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/company/applicants?jobId=${job.id}`}>
                            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Recent Applicants */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Applicants</h2>
                <Link href="/company/applicants">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <Card className="bg-card">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {data.recentApplicants.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground">No recent applicants.</div>
                    ) : (
                      data.recentApplicants.map((applicant: any) => (
                        <div key={applicant.id} className="flex items-center gap-4 p-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {applicant.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{applicant.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {applicant.role} • CGPA: {applicant.cgpa}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {applicant.match}% Match
                          </Badge>
                          <Badge className={statusColors[applicant.status] || "bg-secondary text-secondary-foreground"} variant="secondary">
                            {applicant.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Scheduled Events</CardTitle>
                  <Link href="/company/schedule">
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No scheduled events.</p>
                ) : (
                  data.upcomingEvents.map((event: any) => (
                    <div key={event.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.date} • {event.time}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.venue}</p>
                      </div>
                    </div>
                  ))
                )}
                <Link href="/company/schedule">
                  <Button variant="outline" size="sm" className="w-full gap-1 bg-transparent">
                    <Plus className="h-3.5 w-3.5" />
                    Request New Slot
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Tools */}
            <Card className="bg-card border-primary/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">AI Tools</CardTitle>
                </div>
                <CardDescription>Powered by Gemini AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/company/ai-tools?tool=jd">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                    <FileText className="h-4 w-4" />
                    JD Writing Assistant
                  </Button>
                </Link>
                <Link href="/company/ai-tools?tool=shortlist">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                    <UserCheck className="h-4 w-4" />
                    Smart Shortlisting
                  </Button>
                </Link>
                <Link href="/company/ai-tools?tool=questions">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                    <Sparkles className="h-4 w-4" />
                    Interview Questions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Hiring Pipeline */}
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Hiring Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Applied</span>
                    <span className="text-muted-foreground">{data.pipeline.applied}</span>
                  </div>
                  <Progress value={data.pipeline.applied > 0 ? 100 : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Shortlisted</span>
                    <span className="text-muted-foreground">{data.pipeline.shortlisted}</span>
                  </div>
                  <Progress value={data.pipeline.applied > 0 ? (data.pipeline.shortlisted / data.pipeline.applied) * 100 : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Interviewed</span>
                    <span className="text-muted-foreground">{data.pipeline.interviewed}</span>
                  </div>
                  <Progress value={data.pipeline.applied > 0 ? (data.pipeline.interviewed / data.pipeline.applied) * 100 : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Offered</span>
                    <span className="text-muted-foreground">{data.pipeline.offered}</span>
                  </div>
                  <Progress value={data.pipeline.applied > 0 ? (data.pipeline.offered / data.pipeline.applied) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
