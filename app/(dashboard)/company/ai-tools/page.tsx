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

const QUESTION_BANK = [
  { q: "Explain the difference between let, const, and var in JavaScript.", difficulty: "easy", topic: "javascript", role: "sde" },
  { q: "How would you implement a debounce function from scratch?", difficulty: "medium", topic: "javascript", role: "sde" },
  { q: "Explain the Virtual DOM in React and how it improves performance.", difficulty: "medium", topic: "react", role: "frontend" },
  { q: "Given an array of integers, find two numbers that add up to a target sum.", difficulty: "medium", topic: "dsa", role: "sde" },
  { q: "What is the time complexity of your solution and can you optimize it?", difficulty: "medium", topic: "dsa", role: "sde" },
  { q: "Explain React hooks and when you would use useCallback vs useMemo.", difficulty: "medium", topic: "react", role: "frontend" },
  { q: "Design a URL shortening service. What would be your approach?", difficulty: "hard", topic: "system design", role: "sde" },
  { q: "How do you handle state management in large React applications?", difficulty: "medium", topic: "react", role: "frontend" },
  { q: "Implement a function to reverse a linked list.", difficulty: "medium", topic: "dsa", role: "sde" },
  { q: "Explain closures in JavaScript with a practical example.", difficulty: "medium", topic: "javascript", role: "sde" },
  { q: "What is the difference between SQL and NoSQL databases?", difficulty: "easy", topic: "database", role: "data" },
  { q: "Explain the concept of normalization in databases.", difficulty: "medium", topic: "database", role: "data" },
  { q: "How do you handle missing data in a dataset?", difficulty: "medium", topic: "data analysis", role: "data" },
  { q: "What is overfitting and how can you prevent it?", difficulty: "medium", topic: "machine learning", role: "data" },
  { q: "Describe a challenging project you worked on and how you overcame obstacles.", difficulty: "medium", topic: "behavioral", role: "all" },
  { q: "Where do you see yourself in 5 years?", difficulty: "easy", topic: "behavioral", role: "all" },
  { q: "Tell me about a time you had a conflict with a team member.", difficulty: "medium", topic: "behavioral", role: "all" },
]

export default function CompanyAIToolsPage() {
  const [isGeneratingJD, setIsGeneratingJD] = useState(false)
  const [jdGenerated, setJdGenerated] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [questionsGenerated, setQuestionsGenerated] = useState(false)

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

  const generateJD = () => {
    if (!jdTitle || !jdSkills) {
      toast.error("Please fill in Job Title and Skills")
      return
    }

    setIsGeneratingJD(true)
    setTimeout(() => {
      const jd = {
        title: jdTitle,
        type: jdType === "fulltime" ? "Full-time" : "Internship",
        location: "Bangalore", // Mock location
        about: `We are seeking a talented ${jdTitle} to join our engineering team. You will work on challenging problems and have the opportunity to make a significant impact.`,
        responsibilities: [
          `Design and develop scalable applications using ${jdSkills.split(",")[0] || "modern technologies"}`,
          "Write clean, efficient, and well-documented code",
          "Collaborate with cross-functional teams",
          "Participate in code reviews"
        ],
        requirements: [
          "Bachelor's degree in Computer Science or related field",
          `Strong proficiency in ${jdSkills}`,
          "Strong problem-solving skills",
          "Excellent communication abilities"
        ],
        niceToHave: [
          "Experience with cloud platforms",
          "Knowledge of CI/CD pipelines"
        ]
      }

      if (jdDesc) {
        jd.about += ` ${jdDesc}`
      }

      setGeneratedJD(jd)
      setIsGeneratingJD(false)
      setJdGenerated(true)
      toast.success("JD Generated successfully")
    }, 1500)
  }

  const generateQuestions = () => {
    setIsGeneratingQuestions(true)
    setTimeout(() => {
      let filtered = QUESTION_BANK.filter(q => {
        if (q.role !== "all" && q.role !== qRole) return false
        if (qType !== "mixed" && qType === "behavioral" && q.topic !== "behavioral") return false
        if (qType !== "mixed" && qType === "technical" && q.topic === "behavioral") return false
        if (qDiff !== "mixed" && q.difficulty !== qDiff) return false
        return true
      })

      // If not enough questions, relax filters
      if (filtered.length < parseInt(qCount)) {
        filtered = QUESTION_BANK.filter(q => q.role === qRole || q.role === "all")
      }

      const selected = filtered.slice(0, parseInt(qCount))
      setGeneratedQuestions(selected)
      setIsGeneratingQuestions(false)
      setQuestionsGenerated(true)
      toast.success("Questions generated successfully")
    }, 1500)
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
                      const text = generatedQuestions.map((q, i) => `${i + 1}. ${q.q}`).join("\n")
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
                          <p className="text-sm">{item.q}</p>
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
              <div className="p-10 text-center text-muted-foreground">
                <p>Feedback summarization requires an active AI service connection.</p>
                <p className="text-sm mt-2">Please contact administrator to enable this feature.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
