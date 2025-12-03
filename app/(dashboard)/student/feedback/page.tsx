"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Building2, MessageSquare, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [pastFeedback, setPastFeedback] = useState<any[]>([])

  // Form State
  const [selectedCompany, setSelectedCompany] = useState("")
  const [role, setRole] = useState("")
  const [experienceType, setExperienceType] = useState("")
  const [processDescription, setProcessDescription] = useState("")
  const [tips, setTips] = useState("")
  const [additionalComments, setAdditionalComments] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)

  useEffect(() => {
    fetchFeedbackData()
  }, [])

  const fetchFeedbackData = async () => {
    try {
      const res = await fetch("/api/student/feedback")
      const json = await res.json()
      if (json.success) {
        setPastFeedback(json.data)
        setCompanies(json.companies)
      }
    } catch (error) {
      console.error("Failed to fetch feedback data", error)
      toast.error("Failed to load feedback data")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCompany || !role || !experienceType || rating === 0 || !processDescription) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    try {
      const company = companies.find(c => c._id === selectedCompany)
      const res = await fetch("/api/student/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: selectedCompany,
          companyName: company?.name || "Unknown Company",
          role,
          experienceType,
          rating,
          processDescription,
          tips,
          additionalComments,
          isAnonymous
        })
      })

      const json = await res.json()
      if (json.success) {
        setSubmitted(true)
        toast.success("Feedback submitted successfully")
        fetchFeedbackData() // Refresh list
        setTimeout(() => {
          setSubmitted(false)
          // Reset form
          setSelectedCompany("")
          setRole("")
          setExperienceType("")
          setRating(0)
          setProcessDescription("")
          setTips("")
          setAdditionalComments("")
          setIsAnonymous(false)
        }, 3000)
      } else {
        toast.error(json.error || "Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback", error)
      toast.error("Failed to submit feedback")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-muted-foreground">Share your interview experiences to help future students</p>
      </div>

      <Tabs defaultValue="submit">
        <TabsList>
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          <TabsTrigger value="history">My Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Interview Feedback Form
              </CardTitle>
              <CardDescription>Your feedback helps improve the placement process</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
                  <p className="text-muted-foreground">Your feedback has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company <span className="text-red-500">*</span></Label>
                      <Select value={selectedCompany} onValueChange={setSelectedCompany} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company._id} value={company._id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Role Applied For <span className="text-red-500">*</span></Label>
                      <Select value={role} onValueChange={setRole} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SDE">Software Development Engineer</SelectItem>
                          <SelectItem value="Frontend">Frontend Developer</SelectItem>
                          <SelectItem value="Backend">Backend Developer</SelectItem>
                          <SelectItem value="Fullstack">Full Stack Developer</SelectItem>
                          <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                          <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                          <SelectItem value="QA">QA Engineer</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Interview Experience <span className="text-red-500">*</span></Label>
                    <Select value={experienceType} onValueChange={setExperienceType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="How was it?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Overall Rating <span className="text-red-500">*</span></Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                              }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-muted-foreground">{rating > 0 ? `${rating}/5` : "Select rating"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Interview Process Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      placeholder="Describe the interview rounds, types of questions asked, etc."
                      rows={3}
                      value={processDescription}
                      onChange={(e) => setProcessDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tips for Future Candidates</Label>
                    <Textarea
                      placeholder="What should students prepare? Any specific topics or resources?"
                      rows={3}
                      value={tips}
                      onChange={(e) => setTips(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Comments</Label>
                    <Textarea
                      placeholder="Any other feedback about the company or process?"
                      rows={3}
                      value={additionalComments}
                      onChange={(e) => setAdditionalComments(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      className="rounded"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <Label htmlFor="anonymous" className="text-sm font-normal">
                      Submit feedback anonymously
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : "Submit Feedback"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {pastFeedback.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No feedback submitted yet.
              </div>
            ) : (
              pastFeedback.map((feedback) => (
                <Card key={feedback._id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{feedback.companyName}</h3>
                          <p className="text-sm text-muted-foreground">{feedback.role}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                    }`}
                                />
                              ))}
                            </div>
                            <Badge variant="outline">{feedback.experienceType}</Badge>
                            <Badge variant={feedback.status === 'approved' ? 'default' : feedback.status === 'rejected' ? 'destructive' : 'secondary'}>
                              {feedback.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Submitted on {new Date(feedback.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{feedback.processDescription}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
