"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, MoreHorizontal, Eye, CheckCircle, XCircle, FileText, Sparkles, Loader2, Calendar } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { useSearchParams } from "next/navigation"

export default function CompanyApplicantsPage() {
  const searchParams = useSearchParams()
  const jobIdParam = searchParams.get("jobId")

  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState(jobIdParam || "all")
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])

  // Interview Modal State
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)
  const [currentApplicantId, setCurrentApplicantId] = useState<string | null>(null)
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    venue: "Online"
  })

  useEffect(() => {
    fetchJobs()
    // fetchApplicants is called by the other useEffect when selectedJob changes
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/company/jobs")
      const data = await res.json()
      if (data.success) {
        setJobs(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch jobs")
    }
  }

  const fetchApplicants = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/company/applicants?jobId=${selectedJob}&status=${statusFilter}`)
      const data = await res.json()
      if (data.success) {
        setApplicants(data.data)
      } else {
        toast.error("Failed to fetch applicants")
      }
    } catch (error) {
      toast.error("Failed to fetch applicants")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplicants()
  }, [selectedJob, statusFilter])

  const handleStatusUpdate = async (id: string, status: string, details?: any) => {
    try {
      const res = await fetch("/api/company/applicants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: id,
          status,
          interviewDetails: details
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Applicant status updated to ${status}`)
        fetchApplicants()
        setIsInterviewModalOpen(false)
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const openInterviewModal = (id: string) => {
    setCurrentApplicantId(id)
    setIsInterviewModalOpen(true)
  }

  const handleScheduleInterview = () => {
    if (currentApplicantId) {
      handleStatusUpdate(currentApplicantId, "interview", interviewDetails)
    }
  }

  const handleAIRank = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/company/applicants/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`AI Ranking complete. Updated ${data.updatedCount} candidates.`)
        fetchApplicants()
      } else {
        toast.error("Failed to rank candidates")
      }
    } catch (error) {
      toast.error("Failed to rank candidates")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (applicants.length === 0) {
      toast.error("No applicants to export")
      return
    }

    const headers = ["Candidate Name", "Email", "Job Role", "CGPA", "AI Score", "Status", "Applied Date"]
    const csvContent = [
      headers.join(","),
      ...applicants.map(app => [
        `"${app.studentName}"`,
        `"${app.studentEmail}"`,
        `"${app.jobTitle}"`,
        app.cgpa,
        app.matchScore,
        app.status,
        new Date(app.appliedDate).toLocaleDateString()
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "applicants_export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Applicants exported successfully")
  }

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.studentEmail && applicant.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const toggleSelectAll = () => {
    if (selectedApplicants.length === filteredApplicants.length) {
      setSelectedApplicants([])
    } else {
      setSelectedApplicants(filteredApplicants.map((a) => a.id))
    }
  }

  const toggleApplicant = (id: string) => {
    setSelectedApplicants((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-blue-500/10 text-blue-500"
      case "offered":
        return "bg-green-500/10 text-green-500"
      case "rejected":
        return "bg-red-500/10 text-red-500"
      case "interview":
        return "bg-purple-500/10 text-purple-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Applicants</h1>
          <p className="text-muted-foreground">Review and manage job applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAIRank}>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Rank Candidates
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offered">Offered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedApplicants.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedApplicants.length} selected</span>
                <Button size="sm" variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Shortlist
                </Button>
                <Button size="sm" variant="outline">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No applicants found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedApplicants.length === filteredApplicants.length && filteredApplicants.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job Role</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>AI Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedApplicants.includes(applicant.id)}
                          onCheckedChange={() => toggleApplicant(applicant.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {applicant.studentName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{applicant.studentName}</p>
                            <p className="text-xs text-muted-foreground">{applicant.studentEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{applicant.jobTitle}</TableCell>
                      <TableCell>
                        <span className={applicant.cgpa >= 8 ? "text-green-600 font-medium" : ""}>{applicant.cgpa}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span
                            className={`font-medium ${applicant.matchScore >= 85
                              ? "text-green-600"
                              : applicant.matchScore >= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                              }`}
                          >
                            {applicant.matchScore}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(applicant.status)} variant="secondary">{applicant.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(applicant.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info("View Profile functionality coming soon")}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success("Resume download started")}>
                              <FileText className="mr-2 h-4 w-4" />
                              Download Resume
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => handleStatusUpdate(applicant.id, "shortlisted")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Shortlist
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-purple-600"
                              onClick={() => openInterviewModal(applicant.id)}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => handleStatusUpdate(applicant.id, "offered")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Offer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleStatusUpdate(applicant.id, "rejected")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interview Modal */}
      <Dialog open={isInterviewModalOpen} onOpenChange={setIsInterviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={interviewDetails.date} onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={interviewDetails.time} onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Venue/Link</Label>
              <Input value={interviewDetails.venue} onChange={(e) => setInterviewDetails({ ...interviewDetails, venue: e.target.value })} />
            </div>
            <Button onClick={handleScheduleInterview} className="w-full">Schedule & Notify</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
