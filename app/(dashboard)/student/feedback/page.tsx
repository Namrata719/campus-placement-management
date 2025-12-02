"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Building2, MessageSquare, CheckCircle } from "lucide-react"

const pastFeedback = [
  {
    id: "1",
    company: "TechCorp Solutions",
    role: "Software Development Engineer",
    rating: 4,
    interviewExperience: "Good",
    feedback: "The interview process was well-organized. Technical round was challenging but fair.",
    submittedAt: "2024-12-05",
  },
  {
    id: "2",
    company: "InnovateTech",
    role: "Data Analyst",
    rating: 5,
    interviewExperience: "Excellent",
    feedback: "Very professional team. HR was supportive and the process was transparent.",
    submittedAt: "2024-11-28",
  },
]

const companies = [
  { id: "1", name: "TechCorp Solutions", role: "SDE" },
  { id: "2", name: "InnovateTech", role: "ML Engineer" },
  { id: "3", name: "Global Systems", role: "Frontend Developer" },
]

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
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
                      <Label>Company</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name} - {company.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Interview Experience</Label>
                      <Select required>
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
                  </div>

                  <div className="space-y-2">
                    <Label>Overall Rating</Label>
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
                            className={`h-8 w-8 transition-colors ${
                              star <= (hoveredRating || rating)
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
                    <Label>Interview Process</Label>
                    <Textarea placeholder="Describe the interview rounds, types of questions asked, etc." rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label>Tips for Future Candidates</Label>
                    <Textarea placeholder="What should students prepare? Any specific topics or resources?" rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Comments</Label>
                    <Textarea placeholder="Any other feedback about the company or process?" rows={3} />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="anonymous" className="rounded" />
                    <Label htmlFor="anonymous" className="text-sm font-normal">
                      Submit feedback anonymously
                    </Label>
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Feedback
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {pastFeedback.map((feedback) => (
              <Card key={feedback.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feedback.company}</h3>
                        <p className="text-sm text-muted-foreground">{feedback.role}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant="outline">{feedback.interviewExperience}</Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(feedback.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{feedback.feedback}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
