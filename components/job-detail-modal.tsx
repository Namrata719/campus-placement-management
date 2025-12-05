"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  Clock,
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

interface JobDetailModalProps {
  job: {
    id: string
    title: string
    company: string
    companyLogo?: string
    location: string
    type: string
    ctc: string
    deadline: string
    postedDate: string
    description: string
    eligibility: {
      branches: string[]
      minCGPA: number
      backlogs: number
      batch: string
    }
    skills: string[]
    responsibilities: string[]
    requirements: string[]
    applicants: number
    matchScore?: number
    isEligible: boolean
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobDetailModal({ job, open, onOpenChange }: JobDetailModalProps) {
  if (!job) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{job.title}</DialogTitle>
              <p className="text-muted-foreground">{job.company}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                </Badge>
                <Badge variant="outline">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {job.type}
                </Badge>
                <Badge variant="secondary">
                  <IndianRupee className="h-3 w-3 mr-1" />
                  {job.ctc}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* AI Match Score */}
          {job.matchScore && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-medium">AI Match Score</span>
                </div>
                <span className="text-2xl font-bold text-primary">{job.matchScore}%</span>
              </div>
              <Progress value={job.matchScore} className="h-2 mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Strengths</p>
                    <p className="text-muted-foreground">Strong React skills, relevant projects</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Areas to Improve</p>
                    <p className="text-muted-foreground">Add more backend experience</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Eligibility Status */}
          <div
            className={`p-4 rounded-lg border ${
              job.isEligible ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {job.isEligible ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-600">You are eligible for this position</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-600">You do not meet eligibility criteria</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Deadline</p>
              <p className="font-medium text-sm">{job.deadline}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Applicants</p>
              <p className="font-medium text-sm">{job.applicants}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <GraduationCap className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Min CGPA</p>
              <p className="font-medium text-sm">{job.eligibility.minCGPA}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Batch</p>
              <p className="font-medium text-sm">{job.eligibility.batch}</p>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About the Role</h3>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="font-semibold mb-2">Responsibilities</h3>
            <ul className="space-y-1">
              {job.responsibilities.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="font-semibold mb-2">Requirements</h3>
            <ul className="space-y-1">
              {job.requirements.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <Badge key={i} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Eligible Branches */}
          <div>
            <h3 className="font-semibold mb-2">Eligible Branches</h3>
            <div className="flex flex-wrap gap-2">
              {job.eligibility.branches.map((branch, i) => (
                <Badge key={i} variant="outline">
                  {branch}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" disabled={!job.isEligible}>
              {job.isEligible ? "Apply Now" : "Not Eligible"}
            </Button>
            <Button variant="outline">Save for Later</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
