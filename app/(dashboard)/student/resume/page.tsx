"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star,
  Loader2,
  RefreshCw,
} from "lucide-react"

interface Resume {
  id: string
  name: string
  uploadedAt: string
  isActive: boolean
  aiScore: number
  fileUrl: string
  fileSize: number
  analysis: {
    strengths: string[]
    improvements: string[]
    missingSkills: string[]
  }
}

export default function StudentResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [builderInput, setBuilderInput] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/student/resume")
      const data = await res.json()

      if (data.success) {
        setResumes(data.resumes || [])
      } else {
        toast.error("Failed to load resumes")
      }
    } catch (error) {
      console.error("Error fetching resumes:", error)
      toast.error("Failed to load resumes")
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and DOC files are allowed")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    await handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/student/resume", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        fetchResumes() // Refresh list
      } else {
        toast.error(data.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload resume")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSetActive = async (id: string) => {
    try {
      const res = await fetch("/api/student/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: id, action: "set_active" }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        fetchResumes()
      } else {
        toast.error(data.error || "Failed to set active")
      }
    } catch (error) {
      toast.error("Failed to set active resume")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return

    try {
      const res = await fetch(`/api/student/resume?id=${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        fetchResumes()
      } else {
        toast.error(data.error || "Failed to delete")
      }
    } catch (error) {
      toast.error("Failed to delete resume")
    }
  }

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, "_blank")
  }

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Download started")
  }

  const handleAnalyze = async (id: string) => {
    try {
      setIsAnalyzing(true)
      const res = await fetch("/api/student/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: id, action: "re_analyze" }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        fetchResumes()
      } else {
        toast.error(data.error || "Analysis failed")
      }
    } catch (error) {
      toast.error("Failed to analyze resume")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateContent = () => {
    if (!builderInput.trim()) return

    setIsAnalyzing(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(`• Led development of ${builderInput.substring(0, 50)}... with measurable impact on project success.

• Architected and implemented scalable solutions handling 10,000+ daily transactions with 99.9% uptime.

• Collaborated with cross-functional teams to deliver features on schedule, utilizing Agile methodologies.

• Optimized performance metrics, reducing response times by 60% through strategic improvements.

• Mentored junior team members, conducting code reviews and establishing best practices.`)
      setIsAnalyzing(false)
      toast.success("Content generated!")
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader title="Resume Manager" subtitle="Upload, analyze, and optimize your resumes" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const activeResume = resumes.find((r) => r.isActive)

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Resume Manager" subtitle="Upload, analyze, and optimize your resumes" />

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Upload Section */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Resume
            </CardTitle>
            <CardDescription>Upload your resume (PDF, DOC, DOCX) for AI-powered analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Click to upload your resume</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
              />
              <Button asChild disabled={isUploading}>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading & Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resume
                    </>
                  )}
                </label>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Resumes List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">My Resumes ({resumes.length})</h2>

            {resumes.map((resume) => (
              <Card key={resume.id} className={`bg-card ${resume.isActive ? "border-primary" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium truncate">{resume.name}</h3>
                        {resume.isActive && (
                          <Badge className="bg-primary/10 text-primary">
                            <Star className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">AI Score:</span>
                          <div className="flex items-center gap-2">
                            <Progress value={resume.aiScore} className="w-24 h-2" />
                            <span className="text-sm font-medium">{resume.aiScore}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => handleView(resume.fileUrl)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(resume.fileUrl, resume.name)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAnalyze(resume.id)}
                          disabled={isAnalyzing}
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          Re-Analyze
                        </Button>
                        {!resume.isActive && (
                          <>
                            <Button size="sm" onClick={() => handleSetActive(resume.id)}>
                              <Star className="h-4 w-4 mr-1" />
                              Set Active
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDelete(resume.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2 text-success mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {resume.analysis.strengths.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium flex items-center gap-2 text-warning mb-2">
                        <AlertCircle className="h-4 w-4" />
                        Suggested Improvements
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {resume.analysis.improvements.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Missing Skills for Target Roles</p>
                      <div className="flex flex-wrap gap-1.5">
                        {resume.analysis.missingSkills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {resumes.length === 0 && (
              <Card className="bg-card">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium">No resumes uploaded</h3>
                  <p className="text-sm text-muted-foreground">Upload your first resume to get AI-powered feedback</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* AI Tools Sidebar */}
          <div className="space-y-4">
            <Card className="bg-card border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Resume Builder
                </CardTitle>
                <CardDescription>Generate professional resume content with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Describe your experience</Label>
                  <Textarea
                    placeholder="E.g., I worked on a React e-commerce project with payment integration..."
                    value={builderInput}
                    onChange={(e) => setBuilderInput(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={handleGenerateContent}
                  disabled={isAnalyzing || !builderInput.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>

                {generatedContent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Generated Content</Label>
                      <Button size="sm" variant="ghost" onClick={() => setGeneratedContent("")}>
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Clear
                      </Button>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                      {generatedContent}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent)
                        toast.success("Copied to clipboard!")
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Resume Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Use action verbs like "Led", "Developed", "Implemented"</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Quantify achievements with numbers and percentages</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Tailor your resume for each job application</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Keep it to 1-2 pages maximum</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Use ATS-friendly formatting</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
