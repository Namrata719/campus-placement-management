"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  GraduationCap,
  IndianRupee,
  BarChart3,
  Bell,
} from "lucide-react"
import Link from "next/link"

export default function TPODashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/tpo/dashboard")
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

  const { stats, branchWiseStats, topCompanies, pendingApprovals, upcomingEvents } = data
  const placementRate = stats.placementRate || 0

  // Transform API data to match UI expectations
  const branchStats = branchWiseStats || []

  const alerts = (pendingApprovals || []).map((item: any) => ({
    type: "warning",
    message: `Pending approval for ${item.type}: ${item.name}`,
    action: "Review",
    link: item.type === 'company' ? '/tpo/companies' : '/tpo/jobs'
  }))

  const recentActivity = (pendingApprovals || []).map((item: any) => ({
    type: item.type === 'company' ? 'company' : 'approval',
    message: `New ${item.type} registration: ${item.name}`,
    time: new Date(item.date).toLocaleDateString()
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TPO Dashboard</h1>
          <p className="text-muted-foreground">Academic Year 2024-25 Placement Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/tpo/reports">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Link>
          </Button>
          <Button asChild>
            <Link href="/tpo/students">
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Eligible for placement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Placed Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.placedStudents}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              {placementRate}% placement rate
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registeredCompanies}</div>
            <p className="text-xs text-muted-foreground">Registered this year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingApprovals} pending approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Bell className="h-5 w-5" />
            Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending actions.</p>
            ) : (
              alerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                  <div className="flex items-center gap-2">
                    {alert.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : alert.type === "info" ? (
                      <Clock className="h-4 w-4 text-blue-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                    <Link href={alert.link || '#'}>{alert.action}</Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Branch-wise Stats */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Branch-wise Placement</CardTitle>
              <CardDescription>Current placement status by department</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tpo/reports">
                Details <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {branchStats.map((branch: any) => (
              <div key={branch.branch} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-10">{branch.branch}</span>
                    <span className="text-muted-foreground">
                      {branch.placed}/{branch.total}
                    </span>
                  </div>
                  <span
                    className={branch.percentage >= 80 ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}
                  >
                    {branch.percentage}%
                  </span>
                </div>
                <Progress value={branch.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Recruiters</CardTitle>
              <CardDescription>By number of offers</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tpo/companies">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCompanies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data available.</p>
            ) : (
              topCompanies.map((company: any, index: number) => (
                <div key={company.name} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.offers} offers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      {company.avgCTC} LPA
                    </p>
                    <p className="text-xs text-muted-foreground">Avg CTC</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from the placement drive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${activity.type === "company"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "student"
                        ? "bg-emerald-100 text-emerald-600"
                        : activity.type === "approval"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                  >
                    {activity.type === "company" ? (
                      <Building2 className="h-4 w-4" />
                    ) : activity.type === "student" ? (
                      <Users className="h-4 w-4" />
                    ) : activity.type === "approval" ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
