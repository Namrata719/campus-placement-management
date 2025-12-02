"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ChevronRight, Users, Sparkles, ArrowRight, Building2, Loader2 } from "lucide-react"
import { toast } from "sonner"

type PipelineStage = "applied" | "shortlisted" | "interview" | "offered" | "rejected" | "accepted"

const stages: { key: PipelineStage; label: string; color: string }[] = [
  { key: "applied", label: "Applied", color: "bg-gray-500" },
  { key: "shortlisted", label: "Shortlisted", color: "bg-blue-500" },
  { key: "interview", label: "Interview", color: "bg-orange-500" },
  { key: "offered", label: "Offered", color: "bg-green-500" },
  { key: "accepted", label: "Accepted", color: "bg-emerald-600" },
  { key: "rejected", label: "Rejected", color: "bg-red-500" },
]

export default function TPOPipelinePage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    if (selectedJob) {
      fetchCandidates(selectedJob)
    }
  }, [selectedJob])

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/tpo/jobs?status=active")
      const json = await res.json()
      if (json.success && json.data.length > 0) {
        setJobs(json.data)
        setSelectedJob(json.data[0].id)
      }
    } catch (error) {
      console.error("Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  const fetchCandidates = async (jobId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/tpo/pipeline?jobId=${jobId}`)
      const json = await res.json()
      if (json.success) {
        setCandidates(json.data)
      }
    } catch (error) {
      console.error("Failed to fetch candidates")
    } finally {
      setLoading(false)
    }
  }

  const moveCandidateToStage = async (candidateId: string, newStage: PipelineStage) => {
    try {
      const res = await fetch("/api/tpo/pipeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: candidateId, status: newStage })
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`Candidate moved to ${newStage}`)
        fetchCandidates(selectedJob)
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCandidatesForStage = (stage: PipelineStage) => filteredCandidates.filter((c) => c.stage === stage)

  if (loading && jobs.length === 0) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Selection Pipeline</h1>
          <p className="text-muted-foreground">Track and manage candidate progression</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Shortlist Suggestions
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select Job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {job.title} - {job.company}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline">
                <Users className="mr-1 h-3 w-3" />
                {candidates.length} candidates
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {stages.map((stage, index) => (
              <div key={stage.key} className="flex items-center">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                  <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <span className="text-sm font-medium whitespace-nowrap">{stage.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {getCandidatesForStage(stage.key).length}
                  </Badge>
                </div>
                {index < stages.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />}
              </div>
            ))}
          </div>

          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4 min-w-max">
              {stages.map((stage) => (
                <div key={stage.key} className="w-[280px] flex-shrink-0">
                  <div className={`h-1 rounded-t ${stage.color} mb-2`} />
                  <div className="p-2 bg-muted/50 rounded-lg min-h-[400px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm">{stage.label}</h3>
                      <Badge variant="outline" className="text-xs">
                        {getCandidatesForStage(stage.key).length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {getCandidatesForStage(stage.key).map((candidate) => (
                        <Card key={candidate.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {candidate.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{candidate.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {candidate.branch} • {candidate.cgpa} CGPA
                                </p>
                                {candidate.matchScore && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Sparkles className="h-3 w-3 text-primary" />
                                    <span className="text-xs text-primary">{candidate.matchScore}% match</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-3">
                              {stages
                                .slice(
                                  stages.findIndex((s) => s.key === stage.key) + 1,
                                  stages.findIndex((s) => s.key === stage.key) + 2,
                                )
                                .map((nextStage) => (
                                  <Button
                                    key={nextStage.key}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs flex-1 bg-transparent"
                                    onClick={() => moveCandidateToStage(candidate.id, nextStage.key)}
                                  >
                                    <ChevronRight className="h-3 w-3 mr-1" />
                                    {nextStage.label}
                                  </Button>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
