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
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  BarChart3,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

export default function TPODashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/tpo/dashboard")
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
    { title: "Total Students", value: data.stats.totalStudents, change: "Live", trend: "neutral", icon: Users },
    { title: "Companies", value: data.stats.totalCompanies, change: "Live", trend: "neutral", icon: Building2 },
    { title: "Active Jobs", value: data.stats.activeJobs, change: "Live", trend: "neutral", icon: Briefcase },
    { title: "Placement Rate", value: `${data.stats.placementRate}%`, change: "Live", trend: "neutral", icon: TrendingUp },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="TPO Dashboard" subtitle="Placement season overview" />

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
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Branch-wise Placement Stats */}
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Branch-wise Placement</CardTitle>
                    <CardDescription>Current placement statistics by department</CardDescription>
                  </div>
                  <Link href="/tpo/reports">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <BarChart3 className="h-4 w-4" />
                      Full Report
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.branchWiseStats.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data available</p>
                  ) : (
                    data.branchWiseStats.map((branch: any) => (
                      <div key={branch.branch} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{branch.branch}</span>
                          <span className="text-muted-foreground">
                            {branch.placed}/{branch.total} ({branch.percentage}%)
                          </span>
                        </div>
                        <Progress value={branch.percentage} className="h-2" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Recruiting Companies */}
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Recruiting Companies</CardTitle>
                    <CardDescription>Companies with most offers this season</CardDescription>
                  </div>
                  <Link href="/tpo/companies">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topCompanies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data available yet.</p>
                  ) : (
                    data.topCompanies.map((company: any, index: number) => (
                      <div key={company.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">{company.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">Avg CTC: {company.avgCtc}</p>
                        </div>
                        <Badge variant="secondary">{company.offers} offers</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pending Approvals */}
            <Card className="bg-card border-warning/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <CardTitle className="text-base">Pending Approvals</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.pendingApprovals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending approvals.</p>
                ) : (
                  data.pendingApprovals.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.type} • {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Link href={item.type === 'company' ? '/tpo/companies' : '/tpo/jobs'}>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-primary hover:text-primary">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
                <Link href="/tpo/companies?status=pending">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View All Pending
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Upcoming Events</CardTitle>
                  <Link href="/tpo/schedule">
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                      Manage
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
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.startTime).toLocaleDateString()} • {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
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
