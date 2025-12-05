"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Briefcase,
  MapPin,
  IndianRupee,
  Users,
  Calendar,
  Edit,
  Eye,
  MoreHorizontal,
  Clock,
  CheckCircle,
  Sparkles,
  Loader2,
  Trash2
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const branches = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "CHE"]

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["CSE", "IT"])
  const [editingJobId, setEditingJobId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    roleType: "full-time",
    ctc: "",
    location: "",
    description: "",
    responsibilities: "",
    requirements: "",
    skills: "",
    minCgpa: "7.0",
    maxBacklogs: "0",
    batch: "2025",
    deadline: ""
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/company/jobs")
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

  const handleCreateJob = async () => {
    try {
      const method = editingJobId ? "PUT" : "POST"
      const body = {
        ...formData,
        branches: selectedBranches,
        ...(editingJobId && { jobId: editingJobId })
      }

      const res = await fetch("/api/company/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Job posted successfully")
        setIsCreateOpen(false)
        fetchJobs()
      } else {
        toast.error(data.error || "Failed to post job")
      }
    } catch (error) {
      toast.error("Failed to post job")
    }
  }

  const toggleBranch = (branch: string) => {
    setSelectedBranches((prev) => (prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]))
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Additional State
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isGeneratingJD, setIsGeneratingJD] = useState(false)

  const handleViewDetails = (job: any) => {
    setSelectedJob(job)
    setIsViewDialogOpen(true)
  }

  const handleEditJob = (job: any) => {
    setEditingJobId(job.id)
    setFormData({
      title: job.title,
      roleType: job.type,
      ctc: job.ctc.replace(" LPA", ""),
      location: job.location,
      description: "Description fetched from backend...", // In real app, fetch full details
      responsibilities: "",
      requirements: "",
      skills: "",
      minCgpa: job.minCGPA,
      maxBacklogs: "0",
      batch: "2025",
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ""
    })
    setIsCreateOpen(true)
  }

  const handleViewApplicants = (job: any) => {
    // Redirect to applicants page with job filter
    window.location.href = `/company/applicants?jobId=${job.id}`
  }

  const handleAIGenerateJD = () => {
    if (!formData.title) {
      toast.error("Please enter a job title first")
      return
    }
    setIsGeneratingJD(true)
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        description: `We are looking for a skilled ${formData.title} to join our dynamic team. You will be responsible for developing high-quality software solutions.\n\nKey Responsibilities:\n- Design and implement scalable applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code`,
        responsibilities: "- Design and implement scalable applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code",
        requirements: "- Bachelor's degree in Computer Science or related field\n- Strong problem-solving skills\n- Proficiency in modern programming languages",
        skills: "React, Node.js, TypeScript, SQL"
      }))
      setIsGeneratingJD(false)
      toast.success("JD generated successfully")
    }, 1500)
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      const res = await fetch(`/api/company/jobs?jobId=${jobId}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Job deleted successfully")
        fetchJobs()
      } else {
        toast.error("Failed to delete job")
      }
    } catch (error) {
      toast.error("Failed to delete job")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-muted-foreground">Create and manage your job postings</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingJobId(null)
              setFormData({
                title: "", roleType: "full-time", ctc: "", location: "", description: "",
                responsibilities: "", requirements: "", skills: "", minCgpa: "7.0",
                maxBacklogs: "0", batch: "2025", deadline: ""
              })
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{formData.title ? "Edit Job Posting" : "Create Job Posting"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Software Development Engineer" />
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select value={formData.roleType} onValueChange={(val) => handleSelectChange("roleType", val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTC / Stipend (LPA/Month)</Label>
                  <Input name="ctc" value={formData.ctc} onChange={handleChange} placeholder="e.g., 12" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Bangalore" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the role..." rows={4} />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={handleAIGenerateJD}
                  disabled={isGeneratingJD}
                >
                  {isGeneratingJD ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isGeneratingJD ? "Generating..." : "AI Generate JD"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Responsibilities</Label>
                <Textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} placeholder="Enter key responsibilities (one per line)" rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Requirements</Label>
                <Textarea name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Enter requirements (one per line)" rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <Input name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., React, Node.js (comma separated)" />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Eligibility Criteria</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum CGPA</Label>
                    <Input name="minCgpa" value={formData.minCgpa} onChange={handleChange} type="number" step="0.1" placeholder="e.g., 7.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Backlogs Allowed</Label>
                    <Input name="maxBacklogs" value={formData.maxBacklogs} onChange={handleChange} type="number" placeholder="e.g., 0" />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label>Eligible Branches</Label>
                  <div className="flex flex-wrap gap-2">
                    {branches.map((branch) => (
                      <div
                        key={branch}
                        className={`px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${selectedBranches.includes(branch)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:border-primary"
                          }`}
                        onClick={() => toggleBranch(branch)}
                      >
                        <span className="text-sm">{branch}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Batch</Label>
                    <Select value={formData.batch} onValueChange={(val) => handleSelectChange("batch", val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Application Deadline</Label>
                    <Input name="deadline" value={formData.deadline} onChange={handleChange} type="date" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateJob}>Submit for Approval</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                <p className="text-2xl font-bold">{jobs.filter((j) => j.status === "active").length}</p>
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
                <p className="text-2xl font-bold">{jobs.filter((j) => j.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground">No jobs posted yet.</div>
        ) : (
          jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{job.type}</Badge>
                      <Badge
                        variant={job.status === "active" ? "default" : job.status === "pending" ? "secondary" : "outline"}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </div>
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
                      <DropdownMenuItem onClick={() => handleEditJob(job)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewApplicants(job)}>
                        <Users className="mr-2 h-4 w-4" />
                        View Applicants
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteJob(job.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    {job.ctc}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {job.applicants} applicants
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {job.eligibleBranches.map((branch: string) => (
                    <Badge key={branch} variant="secondary" className="text-xs">
                      {branch}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs">
                    Min CGPA: {job.minCGPA}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleViewDetails(job)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleViewApplicants(job)}>
                    <Users className="mr-2 h-4 w-4" />
                    {job.shortlisted} Shortlisted
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedJob.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="font-medium">{selectedJob.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">CTC</Label>
                <p className="font-medium">{selectedJob.ctc}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Location</Label>
                <p className="font-medium">{selectedJob.location}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Deadline</Label>
                <p className="font-medium">{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge>{selectedJob.status}</Badge>
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
