"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  IndianRupee,
  Building2,
  Briefcase,
  Clock,
  Save,
  Download,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function TPOJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Dialog States
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApplicantsDialogOpen, setIsApplicantsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Edit State
  const [editFormData, setEditFormData] = useState<any>({})
  const [applicants, setApplicants] = useState<any[]>([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/tpo/jobs")
      const data = await res.json()
      if (data.success) {
        setJobs(data.data)
      } else {
        toast.error("Failed to fetch jobs")
      }
    } catch (error) {
      toast.error("Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/tpo/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id, status }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Job ${status} successfully`)
        fetchJobs()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const handleViewDetails = (job: any) => {
    setSelectedJob(job)
    setIsViewDialogOpen(true)
  }

  const fetchApplicants = async (jobId: string) => {
    setLoadingApplicants(true)
    try {
      const res = await fetch(`/api/tpo/jobs/${jobId}/applicants`)
      const data = await res.json()
      if (data.success) {
        setApplicants(data.data)
      } else {
        toast.error("Failed to fetch applicants")
      }
    } catch (error) {
      toast.error("Failed to fetch applicants")
    } finally {
      setLoadingApplicants(false)
    }
  }

  const handleViewApplicants = (job: any) => {
    setSelectedJob(job)
    setIsApplicantsDialogOpen(true)
    fetchApplicants(job.id)
  }

  const handleEditEligibility = (job: any) => {
    setSelectedJob(job)
    setEditFormData({
      minCGPA: job.minCGPA,
      eligibleBranches: job.eligibleBranches.join(", ")
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEligibility = async () => {
    try {
      const res = await fetch("/api/tpo/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob.id,
          minCGPA: parseFloat(editFormData.minCGPA),
          eligibleBranches: editFormData.eligibleBranches.split(",").map((s: string) => s.trim())
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Eligibility updated successfully")
        setIsEditDialogOpen(false)
        fetchJobs()
      } else {
        toast.error(data.error || "Failed to update eligibility")
      }
    } catch (error) {
      toast.error("Failed to update eligibility")
    }
  }

  const handleExport = () => {
    const headers = ["Title", "Company", "Type", "Location", "CTC", "Deadline", "Status", "Applicants"]
    const csvContent = [
      headers.join(","),
      ...jobs.map(j => [
        `"${j.title}"`,
        `"${j.company}"`,
        j.type,
        `"${j.location}"`,
        `"${j.ctc}"`,
        j.deadline ? new Date(j.deadline).toLocaleDateString() : "",
        j.status,
        j.applicants
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "jobs_export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Export started")
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by tab
    if (activeTab === "pending" && job.status !== "pending") return false
    if (activeTab === "active" && job.status !== "active") return false
    if (activeTab === "closed" && job.status !== "closed" && job.status !== "cancelled") return false

    // Filter by dropdown
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingJobs = jobs.filter((j) => j.status === "pending")
  const activeJobs = jobs.filter((j) => j.status === "active")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-muted-foreground">Review and manage job postings</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeJobs.length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
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
                <p className="text-2xl font-bold">{pendingJobs.length}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
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
                <p className="text-2xl font-bold">{jobs.reduce((acc, j) => acc + j.applicants, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Applicants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <Tabs defaultValue="all" className="w-full lg:w-auto" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingJobs.length > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {pendingJobs.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[250px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No jobs found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Details</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>CTC</TableHead>
                    <TableHead>Eligibility</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {job.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{job.location}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {job.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3" />
                          {job.ctc}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{job.eligibleBranches.join(", ")}</p>
                          <p className="text-xs text-muted-foreground">Min CGPA: {job.minCGPA}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium">{job.applicants}</p>
                          <p className="text-xs text-muted-foreground">{job.shortlisted} shortlisted</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            job.status === "active" ? "default" : job.status === "pending" ? "secondary" : "outline"
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(job)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewApplicants(job)}>
                              <Users className="mr-2 h-4 w-4" />
                              View Applicants
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditEligibility(job)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Eligibility
                            </DropdownMenuItem>
                            {job.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => handleStatusUpdate(job.id, "approved")}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleStatusUpdate(job.id, "rejected")}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
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

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>Full details for {selectedJob?.title}</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedJob.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Company</Label>
                <p className="font-medium">{selectedJob.company}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="font-medium">{selectedJob.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Location</Label>
                <p className="font-medium">{selectedJob.location}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">CTC</Label>
                <p className="font-medium">{selectedJob.ctc}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Deadline</Label>
                <p className="font-medium">{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : "N/A"}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Eligibility</Label>
                <p className="font-medium">
                  Branches: {selectedJob.eligibleBranches.join(", ")} <br />
                  Min CGPA: {selectedJob.minCGPA}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Applicants Dialog */}
      <Dialog open={isApplicantsDialogOpen} onOpenChange={setIsApplicantsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Applicants</DialogTitle>
            <DialogDescription>Applicants for {selectedJob?.title}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedJob?.applicants > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingApplicants ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : applicants.length > 0 ? (
                    applicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>{applicant.name}</TableCell>
                        <TableCell>{applicant.branch}</TableCell>
                        <TableCell>{applicant.cgpa}</TableCell>
                        <TableCell>
                          <Badge variant={applicant.status === "shortlisted" ? "secondary" : "outline"}>
                            {applicant.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No applicants found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No applicants yet.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsApplicantsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Eligibility Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Eligibility</DialogTitle>
            <DialogDescription>Update eligibility criteria for {selectedJob?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Minimum CGPA</Label>
              <Input
                type="number"
                value={editFormData.minCGPA || ""}
                onChange={(e) => setEditFormData({ ...editFormData, minCGPA: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Eligible Branches (comma separated)</Label>
              <Textarea
                value={editFormData.eligibleBranches || ""}
                onChange={(e) => setEditFormData({ ...editFormData, eligibleBranches: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEligibility}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
