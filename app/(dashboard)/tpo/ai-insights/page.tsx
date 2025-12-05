"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, FileText, AlertTriangle, TrendingUp, RefreshCw, CheckCircle, Bot, Send, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


export default function TPOAIInsightsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [jdText, setJdText] = useState(`Software Development Engineer
                
We are looking for a passionate developer to join our team.

Requirements:
- Good programming skills
- Team player
- Fast learner

Salary: Competitive`)
  const [jdAnalysis, setJdAnalysis] = useState<any>(null)
  const [analyzingJd, setAnalyzingJd] = useState(false)

  // Dialog States
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null)
  const [anomalyDialogOpen, setAnomalyDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [improvedJdOpen, setImprovedJdOpen] = useState(false)

  // Chat State
  const [messages, setMessages] = useState<any[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm the placement policy assistant. I can help students with questions about eligibility criteria, placement rules, and FAQs."
    }
  ])
  const [input, setInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsChatLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: "policy - Campus Placement Policy Assistant"
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to send message")
      }
      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantMessage = {
          ...assistantMessage,
          content: assistantMessage.content + chunk
        }

        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = assistantMessage
          return newMessages
        })
      }
    } catch (error) {
      console.error("Chat error:", error)
      toast.error("Failed to send message")
    } finally {
      setIsChatLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/tpo/ai-insights")
      const json = await res.json()
      if (json.success) {
        setAnomalies(json.data.anomalies)
        if (json.data.anomalies.length > 0) {
          toast.success(`Found ${json.data.anomalies.length} insights`)
        }
      } else {
        toast.error("Failed to fetch insights")
      }
    } catch (error) {
      console.error("Failed to fetch insights")
      toast.error("Failed to fetch insights")
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch("/api/tpo/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "generate_report", data: { year: "2024-25" } })
      })
      const json = await res.json()
      if (json.success) {
        setReportGenerated(true)
        toast.success("Report generated successfully")
      } else {
        toast.error("Failed to generate report")
      }
    } catch (error) {
      toast.error("Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnalyzeJD = async () => {
    setAnalyzingJd(true)
    try {
      const res = await fetch("/api/tpo/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "jd_review", data: jdText })
      })
      const json = await res.json()
      if (json.success) {
        setJdAnalysis(json.data)
        toast.success("JD Analysis complete")
      } else {
        toast.error("Failed to analyze JD")
      }
    } catch (error) {
      toast.error("Failed to analyze JD")
    } finally {
      setAnalyzingJd(false)
    }
  }

  const handleSendReminder = async () => {
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "students@campus.edu", // Mock group email
          subject: "Reminder: Low Attendance Alert",
          message: "This is a reminder to attend the upcoming sessions. Attendance is mandatory."
        })
      })
      const json = await res.json()
      if (json.success) {
        toast.success("Reminder sent successfully")
      } else {
        toast.error("Failed to send reminder")
      }
    } catch (error) {
      toast.error("Failed to send reminder")
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }



  const handleViewAnomaly = (anomaly: any) => {
    setSelectedAnomaly(anomaly)
    setAnomalyDialogOpen(true)
  }

  const handleAnomalyAction = (anomaly: any) => {
    toast.success("Action initiated for: " + anomaly.title)
    // In a real app, this would trigger a specific workflow
  }

  const handleUploadDocument = () => {
    toast.success("Document uploaded successfully")
    setUploadDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Insights</h1>
          <p className="text-muted-foreground">AI-powered analytics and recommendations</p>
        </div>
        <Button variant="outline" onClick={fetchInsights} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Insights
        </Button>
      </div>

      <Tabs defaultValue="anomalies">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="reports">Report Generation</TabsTrigger>
          <TabsTrigger value="jd-review">JD Validation</TabsTrigger>
          <TabsTrigger value="chatbot">Policy Chatbot</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="mt-6 space-y-4">
          {anomalies.map((anomaly, index) => (
            <Card key={index} className={anomaly.severity === 'warning' ? "border-yellow-500/30 bg-yellow-500/5" : anomaly.severity === 'good' ? "" : "border-red-500/30 bg-red-500/5"}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {anomaly.severity === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    {anomaly.severity === 'good' && <TrendingUp className="h-5 w-5 text-green-500" />}
                    {anomaly.severity === 'critical' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    <CardTitle className="text-lg">{anomaly.title}</CardTitle>
                  </div>
                  <Badge variant={anomaly.severity === 'critical' ? "destructive" : anomaly.severity === 'good' ? "default" : "outline"} className={anomaly.severity === 'warning' ? "text-yellow-600" : anomaly.severity === 'good' ? "bg-green-500" : ""}>
                    {anomaly.severity === 'good' ? 'Good' : anomaly.severity === 'warning' ? 'Warning' : 'Critical'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {anomaly.description}
                </p>
                <div className={anomaly.severity === 'good' ? "bg-muted p-4 rounded-lg" : "bg-muted p-4 rounded-lg mb-4"}>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {anomaly.severity === 'good' ? 'AI Insights' : 'AI Analysis'}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {anomaly.insights.map((insight: string, i: number) => (
                      <li key={i}>• {insight}</li>
                    ))}
                  </ul>
                </div>
                {anomaly.severity !== 'good' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewAnomaly(anomaly)}>
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => handleAnomalyAction(anomaly)}>Action</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {anomalies.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
              <p>No anomalies detected. Everything looks good!</p>
            </div>
          )}

        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generate Placement Report
                </CardTitle>
                <CardDescription>AI-generated summary with trends and insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <select className="w-full p-2 rounded-md border bg-background">
                    <option>Annual Placement Summary</option>
                    <option>Branch-wise Analysis</option>
                    <option>Company Performance Report</option>
                    <option>Student Success Stories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Period</label>
                  <select className="w-full p-2 rounded-md border bg-background">
                    <option>2024-25 Academic Year</option>
                    <option>2023-24 Academic Year</option>
                    <option>Last 6 Months</option>
                    <option>Custom Range</option>
                  </select>
                </div>
                <Button onClick={generateReport} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {reportGenerated && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Report Preview</CardTitle>
                    <Badge className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Ready
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm dark:prose-invert">
                    <h4>Annual Placement Summary 2024-25</h4>
                    <p className="text-muted-foreground text-sm">
                      The placement season 2024-25 has shown remarkable improvement across all metrics. Key highlights
                      include:
                    </p>
                    <ul className="text-sm text-muted-foreground">
                      <li>
                        <strong>Overall Placement:</strong> 85% (up from 78% last year)
                      </li>
                      <li>
                        <strong>Average CTC:</strong> ₹12.5 LPA (up 15%)
                      </li>
                      <li>
                        <strong>Highest Package:</strong> ₹45 LPA (InnovateTech)
                      </li>
                      <li>
                        <strong>Companies Visited:</strong> 42 (up from 35)
                      </li>
                    </ul>
                    <p className="text-muted-foreground text-sm">
                      CSE and IT branches led the placements with 92% and 88% rates respectively...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => toast.success("PDF Downloaded")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button className="flex-1" onClick={() => toast.info("Edit mode enabled")}>Edit & Finalize</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="jd-review" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                JD Validation & Improvement
              </CardTitle>
              <CardDescription>Paste a job description to get AI-powered suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste the job description here..."
                rows={8}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
              <Button className="w-full" onClick={handleAnalyzeJD} disabled={analyzingJd}>
                {analyzingJd ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {analyzingJd ? "Analyzing..." : "Analyze & Improve JD"}
              </Button>

              {jdAnalysis && (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">AI Analysis Results</h4>
                    <Badge variant="secondary">Score: {jdAnalysis.score}/100</Badge>
                  </div>

                  <div className="space-y-3">
                    {jdAnalysis.analysis.map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className={`h-4 w-4 mt-1 ${item.type === 'error' ? 'text-red-500' : 'text-yellow-500'}`} />
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setImprovedJdOpen(true)}>
                    View Improved Version
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Policy Chatbot Configuration
                </CardTitle>
                <CardDescription>This chatbot helps students with placement policies and FAQs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50 h-[300px] overflow-y-auto space-y-4">
                  {messages.map((m: any) => (
                    <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                      {m.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div className={`${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'} p-3 rounded-lg max-w-[80%]`}>
                        <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <form onSubmit={handleChatSubmit} className="flex w-full gap-2">
                    <Input
                      placeholder="Type a question about placement policies..."
                      value={input}
                      onChange={handleInputChange}
                    />
                    <Button type="submit">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Knowledge Base</CardTitle>
                <CardDescription>Documents the chatbot uses to answer questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {[
                    { name: "Placement Policy 2024-25.pdf", status: "active" },
                    { name: "Eligibility Criteria.pdf", status: "active" },
                    { name: "Dream Company Rules.pdf", status: "active" },
                    { name: "FAQ Document.pdf", status: "processing" },
                  ].map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{doc.name}</span>
                      </div>
                      <Badge variant={doc.status === "active" ? "default" : "secondary"} className="text-xs">
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Anomaly Details Dialog */}
      <Dialog open={anomalyDialogOpen} onOpenChange={setAnomalyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAnomaly?.title}</DialogTitle>
            <DialogDescription>{selectedAnomaly?.description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="font-medium mb-2">Insights</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {selectedAnomaly?.insights.map((insight: string, i: number) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setAnomalyDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new policy document or FAQ.</DialogDescription>
          </DialogHeader>
          <div className="py-8 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-muted/50">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to select a file</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadDocument}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Improved JD Dialog */}
      <Dialog open={improvedJdOpen} onOpenChange={setImprovedJdOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Improved Job Description</DialogTitle>
            <DialogDescription>AI suggested improvements for your JD</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={jdText + "\n\n[AI Suggested Improvements Added]"}
              readOnly
              className="h-[300px]"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setJdText(jdText + "\n\n[AI Suggested Improvements Added]")
              setImprovedJdOpen(false)
              toast.success("Applied improvements to JD")
            }}>Apply Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
