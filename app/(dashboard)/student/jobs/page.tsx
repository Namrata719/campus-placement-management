"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Clock,
  Sparkles,
  Briefcase,
  IndianRupee,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

const roleTypes = ["Full-time", "Internship", "Contract"]
const workModes = ["Onsite", "Remote", "Hybrid"]

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoleTypes, setSelectedRoleTypes] = useState<string[]>([])
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([])
  const [showEligibleOnly, setShowEligibleOnly] = useState(false)
  const [sortBy, setSortBy] = useState("match")

  // Job Details Sheet State
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/student/jobs")
      const json = await res.json()
      if (json.success) {
        setJobs(json.data)
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs
    .filter((job) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !job.title.toLowerCase().includes(query) &&
          !job.company.toLowerCase().includes(query) &&
          !job.skills.some((s: string) => s.toLowerCase().includes(query))
        ) {
          return false
        }
      }
      if (selectedRoleTypes.length && !selectedRoleTypes.includes(job.roleType)) return false
      if (selectedWorkModes.length && !selectedWorkModes.includes(job.workMode)) return false
      if (showEligibleOnly && !job.isEligible) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.match - a.match
      if (sortBy === "deadline") return a.deadline.localeCompare(b.deadline)
      return 0
    })

  const toggleFilter = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const handleViewDetails = (job: any) => {
    setSelectedJob(job)
    setIsDetailsOpen(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }



  const handleApply = async () => {
    if (!selectedJob) return

    // Check eligibility first with detailed messages
    if (!selectedJob.isEligible) {
      toast.error("You are not eligible for this job", {
        description: selectedJob.eligibilityReason,
        duration: 5000,
      })
      return
    }

    setIsApplying(true)
    try {
      const res = await fetch("/api/student/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob.id }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success("Application submitted successfully!", {
          description: "You can track your application status in the Applications page.",
          duration: 5000,
        })
        setIsDetailsOpen(false)
        // Optionally refresh the jobs list to update application status
      } else {
        // Show specific error messages
        if (data.error.includes("resume")) {
          toast.error("Resume Required", {
            description: "Please upload your resume before applying to jobs.",
            action: {
              label: "Upload Resume",
              onClick: () => window.location.href = "/student/resume",
            },
            duration: 7000,
          })
        } else if (data.error.includes("already applied")) {
          toast.warning("Already Applied", {
            description: "You have already applied to this job. Check your applications page for status.",
            action: {
              label: "View Applications",
              onClick: () => window.location.href = "/student/applications",
            },
            duration: 7000,
          })
        } else {
          toast.error(data.error || "Failed to apply")
        }
      }
    } catch (error) {
      toast.error("Failed to apply", {
        description: "An unexpected error occurred. Please try again later.",
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Job Listings" subtitle="Find your perfect opportunity" />

      <div className="flex-1 p-4 lg:p-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, or skills..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="ctc">CTC</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Jobs</SheetTitle>
                  <SheetDescription>Narrow down your job search</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Eligible Only */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="eligible"
                      checked={showEligibleOnly}
                      onCheckedChange={(checked) => setShowEligibleOnly(checked as boolean)}
                    />
                    <Label htmlFor="eligible">Show eligible jobs only</Label>
                  </div>

                  {/* Role Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Role Type</Label>
                    <div className="space-y-2">
                      {roleTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={selectedRoleTypes.includes(type)}
                            onCheckedChange={() => toggleFilter(type, selectedRoleTypes, setSelectedRoleTypes)}
                          />
                          <Label htmlFor={type} className="font-normal">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Work Mode */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Work Mode</Label>
                    <div className="space-y-2">
                      {workModes.map((mode) => (
                        <div key={mode} className="flex items-center space-x-2">
                          <Checkbox
                            id={mode}
                            checked={selectedWorkModes.includes(mode)}
                            onCheckedChange={() => toggleFilter(mode, selectedWorkModes, setSelectedWorkModes)}
                          />
                          <Label htmlFor={mode} className="font-normal">
                            {mode}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setSelectedRoleTypes([])
                      setSelectedWorkModes([])
                      setShowEligibleOnly(false)
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={`bg-card hover:border-primary/50 transition-colors ${!job.isEligible ? "opacity-75" : ""}`}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <Avatar className="h-14 w-14 rounded-lg shrink-0">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-lg">
                      {job.companyLogo}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          {job.isEligible ? (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Eligible
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-destructive/10 text-destructive gap-1">
                              <XCircle className="h-3 w-3" />
                              {job.eligibilityReason}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>

                      <Badge variant="secondary" className="bg-primary/10 text-primary shrink-0 self-start">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {job.match}% Match
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {job.ctc}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {job.roleType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {job.workMode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {job.deadline}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:shrink-0">
                    <Button
                      className="w-full"
                      disabled={!job.isEligible}
                      onClick={() => handleViewDetails(job)}
                    >
                      {job.isEligible ? "Apply Now" : "Not Eligible"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleViewDetails(job)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Job Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Job Details</SheetTitle>
            <SheetDescription>Review job details and apply</SheetDescription>
          </SheetHeader>
          {selectedJob && (
            <div className="py-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xl">
                    {selectedJob.companyLogo}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                  <p className="text-muted-foreground">{selectedJob.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Location</Label>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {selectedJob.location}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">CTC</Label>
                  <p className="font-medium flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" /> {selectedJob.ctc}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Type</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> {selectedJob.roleType}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Deadline</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {selectedJob.deadline}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                {selectedJob.isEligible ? (
                  <Button className="w-full size-lg" onClick={handleApply} disabled={isApplying}>
                    {isApplying ? "Applying..." : "Apply for this Job"}
                  </Button>
                ) : (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-center">
                    <p className="font-medium">You are not eligible for this job</p>
                    <p className="text-sm mt-1">{selectedJob.eligibilityReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

