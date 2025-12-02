"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { MapPin, IndianRupee, Calendar, Clock, CheckCircle2, XCircle, ArrowRight, FileText, Loader2 } from "lucide-react"

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  applied: { label: "Applied", color: "bg-muted text-muted-foreground", icon: Clock },
  shortlisted: { label: "Shortlisted", color: "bg-chart-2/10 text-chart-2", icon: CheckCircle2 },
  test_scheduled: { label: "Test Scheduled", color: "bg-chart-4/10 text-chart-4", icon: Calendar },
  test_cleared: { label: "Test Cleared", color: "bg-chart-2/10 text-chart-2", icon: CheckCircle2 },
  gd_scheduled: { label: "GD Scheduled", color: "bg-chart-4/10 text-chart-4", icon: Calendar },
  gd_cleared: { label: "GD Cleared", color: "bg-chart-2/10 text-chart-2", icon: CheckCircle2 },
  interview_r1: { label: "Interview R1", color: "bg-chart-1/10 text-chart-1", icon: Calendar },
  interview_r2: { label: "Interview R2", color: "bg-chart-1/10 text-chart-1", icon: Calendar },
  interview_hr: { label: "HR Interview", color: "bg-chart-1/10 text-chart-1", icon: Calendar },
  offered: { label: "Offered", color: "bg-success/10 text-success", icon: CheckCircle2 },
  accepted: { label: "Accepted", color: "bg-success/10 text-success", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive", icon: XCircle },
  withdrawn: { label: "Withdrawn", color: "bg-muted text-muted-foreground", icon: XCircle },
}

interface Application {
  id: string
  job: {
    title: string
    company: string
    location: string
    ctc: string
  }
  status: string
  appliedAt: string
  statusHistory: Array<{ status: string; date: string; note?: string; comment?: string }>
  nextStep: string | null
  offer?: {
    ctc: number
    role: string
    location: string
    joiningDate: string
  }
}

export default function StudentApplicationsPage() {
  const [filter, setFilter] = useState("all")
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, offers: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/student/applications")
      const data = await res.json()

      if (data.success) {
        setApplications(data.applications || [])
        setStats(data.stats || { total: 0, active: 0, offers: 0, rejected: 0 })
      } else {
        toast.error("Failed to load applications")
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true
    if (filter === "active") return !["rejected", "withdrawn", "accepted"].includes(app.status)
    if (filter === "offers") return app.status === "offered" || app.status === "accepted"
    return app.status === filter
  })

  const handleWithdraw = async (appId: string) => {
    try {
      const res = await fetch("/api/student/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, action: "withdraw" }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        fetchApplications() // Refresh
      } else {
        toast.error(data.error || "Failed to withdraw application")
      }
    } catch (error) {
      toast.error("Failed to withdraw application")
    }
  }

  const handleAcceptOffer = async (appId: string) => {
    try {
      const res = await fetch("/api/student/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, action: "accept_offer" }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        fetchApplications() // Refresh
      } else {
        toast.error(data.error || "Failed to accept offer")
      }
    } catch (error) {
      toast.error("Failed to accept offer")
    }
  }

  const handleDeclineOffer = async (appId: string) => {
    try {
      const res = await fetch("/api/student/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, action: "decline_offer" }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        fetchApplications() // Refresh
      } else {
        toast.error(data.error || "Failed to decline offer")
      }
    } catch (error) {
      toast.error("Failed to decline offer")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title="My Applications" subtitle="Track your job applications" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="My Applications" subtitle="Track your job applications" />

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Applications</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-chart-2">{stats.active}</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Offers</p>
              <p className="text-2xl font-bold text-success">{stats.offers}</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="offers">Offers</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Showing {filteredApplications.length} applications</p>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const statusInfo = statusConfig[application.status]
            const StatusIcon = statusInfo.icon

            return (
              <Card key={application.id} className="bg-card">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <Avatar className="h-12 w-12 rounded-lg shrink-0">
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                        {application.job.company[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{application.job.title}</h3>
                          <p className="text-muted-foreground">{application.job.company}</p>
                        </div>
                        <Badge className={statusInfo.color} variant="secondary">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {application.job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {application.job.ctc}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {application.nextStep && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          <span className="text-primary font-medium">{application.nextStep}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0 flex-wrap">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{application.job.title}</DialogTitle>
                            <DialogDescription>{application.job.company}</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Timeline */}
                            <div>
                              <h4 className="font-semibold mb-4">Application Timeline</h4>
                              <div className="space-y-4">
                                {application.statusHistory.map((history, index) => {
                                  const historyStatus = statusConfig[history.status]
                                  return (
                                    <div key={index} className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                        <div
                                          className={`h-8 w-8 rounded-full flex items-center justify-center ${historyStatus.color}`}
                                        >
                                          <historyStatus.icon className="h-4 w-4" />
                                        </div>
                                        {index < application.statusHistory.length - 1 && (
                                          <div className="w-0.5 h-full bg-border mt-2" />
                                        )}
                                      </div>
                                      <div className="pb-4">
                                        <p className="font-medium">{historyStatus.label}</p>
                                        <p className="text-sm text-muted-foreground">{history.note || history.comment}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {new Date(history.date).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Offer Details */}
                            {application.offer && (
                              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                                <h4 className="font-semibold text-success mb-2">Offer Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">CTC</p>
                                    <p className="font-medium">₹{(application.offer.ctc / 100000).toFixed(1)} LPA</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Role</p>
                                    <p className="font-medium">{application.offer.role}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Location</p>
                                    <p className="font-medium">{application.offer.location}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Joining Date</p>
                                    <p className="font-medium">
                                      {new Date(application.offer.joiningDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button onClick={() => handleAcceptOffer(application.id)} className="flex-1">
                                    Accept Offer
                                  </Button>
                                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => handleDeclineOffer(application.id)}>
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {!["rejected", "withdrawn", "offered", "accepted"].includes(application.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleWithdraw(application.id)}
                        >
                          Withdraw
                        </Button>
                      )}

                      {application.status === "offered" && (
                        <Button size="sm" onClick={() => handleAcceptOffer(application.id)}>
                          Accept Offer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No applications found</h3>
            <p className="text-muted-foreground">
              {applications.length === 0
                ? "You haven't applied to any jobs yet"
                : "Try changing your filter"}
            </p>
            <Link href="/student/jobs">
              <Button className="mt-4">Browse Jobs</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
