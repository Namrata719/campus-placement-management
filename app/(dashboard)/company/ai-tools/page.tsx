"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, FileText, MessageSquare, RefreshCw, Copy, CheckCircle, Brain, Lightbulb } from "lucide-react"
import { toast } from "sonner"

export default function CompanyAIToolsPage() {
  const [isGeneratingJD, setIsGeneratingJD] = useState(false)
  const [jdGenerated, setJdGenerated] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [questionsGenerated, setQuestionsGenerated] = useState(false)
  const [isSummarizingFeedback, setIsSummarizingFeedback] = useState(false)
  const [feedbackSummary, setFeedbackSummary] = useState<any>(null)

  // JD State
  const [jdTitle, setJdTitle] = useState("")
  const [jdType, setJdType] = useState("fulltime")
  const [jdExp, setJdExp] = useState("fresher")
  const [jdSkills, setJdSkills] = useState("")
  const [jdDesc, setJdDesc] = useState("")
  const [generatedJD, setGeneratedJD] = useState<any>(null)

  // Questions State
  const [qRole, setQRole] = useState("sde")
  const [qType, setQType] = useState("technical")
  const [qDiff, setQDiff] = useState("medium")
  const [qCount, setQCount] = useState("5")
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([])

  // Feedback State
  const [candidateName, setCandidateName] = useState("")
  const [interviewRound, setInterviewRound] = useState("Technical Round 1")
  const [feedbackText, setFeedbackText] = useState("")

  const generateJD = async () => {
    if (!jdTitle || !jdSkills) {
      toast.error("Please fill in Job Title and Skills")
      return
    }

    setIsGeneratingJD(true)
    try {
      const response = await fetch("/api/ai/generate-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jdTitle,
          type: jdType === "fulltime" ? "Full-time" : "Internship",
          experience: jdExp,
          skills: jdSkills,
          description: jdDesc,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate JD")
      }

      const data = await response.json()
      setGeneratedJD(data)
      setJdGenerated(true)
      toast.success("JD Generated successfully")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to generate JD")
    } finally {
      setIsGeneratingJD(false)
    }
  }

  const generateQuestions = async () => {
    setIsGeneratingQuestions(true)
    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: qRole,
          skills: "Relevant skills for the role", // You might want to add a skills input for questions too
          questionType: qType,
          difficulty: qDiff,
          count: parseInt(qCount),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate questions")
      }

      const data = await response.json()
      setGeneratedQuestions(data.questions)
      setQuestionsGenerated(true)
      toast.success("Questions generated successfully")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to generate questions")
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  const summarizeFeedback = async () => {
    if (!candidateName || !feedbackText) {
      toast.error("Please fill in Candidate Name and Feedback")
      return
    }

    setIsSummarizingFeedback(true)
    try {
      const response = await fetch("/api/ai/feedback-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName,
          interviewRound,
          feedbackText,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to summarize feedback")
      }

      const data = await response.json()
      setFeedbackSummary(data)
      toast.success("Feedback summarized successfully")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to summarize feedback")
    } finally {
      setIsSummarizingFeedback(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Tools</h1>
          <p className="text-muted-foreground">AI-powered tools to streamline your recruitment</p>
        </div>
      </div>

      <Tabs defaultValue="jd-writer">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jd-writer">JD Writer</TabsTrigger>
          <TabsTrigger value="questions">Interview Questions</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Summarizer</TabsTrigger>
        </TabsList>

        <TabsContent value="jd-writer" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  JD Writing Assistant
                </CardTitle>
                <CardDescription>Generate professional job descriptions with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    placeholder="e.g., Software Development Engineer"
                    value={jdTitle}
                    onChange={(e) => setJdTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Job Type</Label>
                    <Select value={jdType} onValueChange={setJdType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fulltime">Full-time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <Select value={jdExp} onValueChange={setJdExp}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fresher">Fresher</SelectItem>
                        <SelectItem value="junior">0-2 years</SelectItem>
                        <SelectItem value="mid">2-5 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Key Skills Required</Label>
                  <Input
                    placeholder="e.g., React, Node.js, AWS, Python"
                    value={jdSkills}
                    onChange={(e) => setJdSkills(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rough Description (Optional)</Label>
                  <Textarea
                    placeholder="Add any specific points you want included..."
                    rows={3}
                    value={jdDesc}
                    onChange={(e) => setJdDesc(e.target.value)}
                  />
                </div>

                <Button onClick={generateJD} disabled={isGeneratingJD} className="w-full">
                  {isGeneratingJD ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate JD
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {jdGenerated && generatedJD && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated JD</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(generatedJD, null, 2))
                      toast.success("Copied to clipboard")
                    }}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-h-[500px] overflow-y-auto">
                    <h3>{generatedJD.title}</h3>
                    <p>
                      <strong>Location:</strong> {generatedJD.location} | <strong>Type:</strong> {generatedJD.type}
                    </p>

                    <h4>About the Role</h4>
                    <p>{generatedJD.about}</p>

                    <h4>Responsibilities</h4>
                    <ul>
                      {generatedJD.responsibilities.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>

                    <h4>Requirements</h4>
                    <ul>
                      {generatedJD.requirements.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>

                    <h4>Nice to Have</h4>
                    <ul>
                      {generatedJD.niceToHave.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Interview Question Generator
                </CardTitle>
                <CardDescription>Generate customized interview questions for your roles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={qRole} onValueChange={setQRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sde">Software Development Engineer</SelectItem>
                      <SelectItem value="frontend">Frontend Developer</SelectItem>
                      <SelectItem value="data">Data Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select value={qType} onValueChange={setQType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="behavioral">Behavioral/HR</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select value={qDiff} onValueChange={setQDiff}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (Screening)</SelectItem>
                      <SelectItem value="medium">Medium (R1)</SelectItem>
                      <SelectItem value="hard">Hard (Final Round)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Questions</Label>
                  <Select value={qCount} onValueChange={setQCount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 questions</SelectItem>
                      <SelectItem value="10">10 questions</SelectItem>
                      <SelectItem value="15">15 questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={generateQuestions} disabled={isGeneratingQuestions} className="w-full">
                  {isGeneratingQuestions ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Questions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {questionsGenerated && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Questions</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => {
                      const text = generatedQuestions.map((q, i) => `${i + 1}. ${q.question}`).join("\n")
                      navigator.clipboard.writeText(text)
                      toast.success("Copied to clipboard")
                    }}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {generatedQuestions.length === 0 ? (
                      <p className="text-muted-foreground">No matching questions found. Try different filters.</p>
                    ) : (
                      generatedQuestions.map((item, index) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-sm font-medium">Q{index + 1}</span>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {item.topic}
                              </Badge>
                              <Badge
                                variant={
                                  item.difficulty === "easy"
                                    ? "secondary"
                                    : item.difficulty === "medium"
                                      ? "default"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {item.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm">{item.question}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Interview Feedback Summarizer
                </CardTitle>
                <CardDescription>
                  Paste interviewer feedback to get AI-generated summaries and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Candidate Name</Label>
                  <Input
                    placeholder="e.g., John Doe"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interview Round</Label>
                  <Select value={interviewRound} onValueChange={setInterviewRound}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical Round 1">Technical Round 1</SelectItem>
                      <SelectItem value="Technical Round 2">Technical Round 2</SelectItem>
                      <SelectItem value="HR Round">HR Round</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Raw Feedback</Label>
                  <Textarea
                    placeholder="Paste the raw feedback notes here..."
                    rows={6}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>
                <Button onClick={summarizeFeedback} disabled={isSummarizingFeedback} className="w-full">
                  {isSummarizingFeedback ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Summarize Feedback
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {feedbackSummary && (
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Summary</h4>
                    <p className="text-sm text-muted-foreground">{feedbackSummary.summary}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Strengths</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {feedbackSummary.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Areas for Improvement</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {feedbackSummary.areasForImprovement?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Recommendation</h4>
                    <Badge variant={
                      feedbackSummary.recommendation === "strong_hire" || feedbackSummary.recommendation === "hire"
                        ? "default"
                        : feedbackSummary.recommendation === "no_hire"
                          ? "destructive"
                          : "secondary"
                    }>
                      {feedbackSummary.recommendation?.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
