"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Sparkles, Copy, RefreshCw, CheckCircle } from "lucide-react"

const emailTemplates = [
  { id: "reschedule", label: "Request Interview Reschedule" },
  { id: "thankyou", label: "Thank You After Interview" },
  { id: "followup", label: "Follow-up on Application" },
  { id: "accept", label: "Accept Offer Letter" },
  { id: "decline", label: "Decline Offer Politely" },
  { id: "query", label: "General Query to HR" },
]

export default function EmailHelperPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedEmail(`Dear Hiring Manager,

I hope this email finds you well. I am writing to express my sincere gratitude for the opportunity to interview for the Software Development Engineer position at TechCorp Solutions on December 15, 2024.

I thoroughly enjoyed our conversation about the team's current projects and the company's vision for innovation. The discussion about the microservices architecture and the challenges you're tackling was particularly engaging, and it reinforced my enthusiasm for potentially joining your team.

I was especially impressed by the collaborative culture at TechCorp and the emphasis on continuous learning and growth. My experience with React and Node.js, combined with my passion for building scalable applications, aligns well with the role's requirements.

Thank you again for considering my application. I look forward to hearing from you regarding the next steps. Please don't hesitate to reach out if you need any additional information from my end.

Best regards,
Rahul Sharma
rahul.sharma@college.edu
+91 98765 43210`)
      setIsGenerating(false)
    }, 1500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Email Helper</h1>
        <p className="text-muted-foreground">Generate professional emails for your placement journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Generator
            </CardTitle>
            <CardDescription>Fill in the details and let AI craft a professional email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email Purpose</Label>
              <Select defaultValue="thankyou">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Recipient</Label>
              <Input placeholder="e.g., HR Manager, Recruiter" defaultValue="Hiring Manager" />
            </div>

            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input placeholder="e.g., TechCorp Solutions" defaultValue="TechCorp Solutions" />
            </div>

            <div className="space-y-2">
              <Label>Position Applied For</Label>
              <Input placeholder="e.g., Software Development Engineer" defaultValue="Software Development Engineer" />
            </div>

            <div className="space-y-2">
              <Label>Key Points to Include</Label>
              <Textarea
                placeholder="Any specific points you want to mention..."
                rows={3}
                defaultValue="Interview was on Dec 15, discussed microservices architecture, impressed by collaborative culture"
              />
            </div>

            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input placeholder="Your full name" defaultValue="Rahul Sharma" />
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Email</CardTitle>
              {generatedEmail && (
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {generatedEmail ? (
              <div className="p-4 rounded-lg bg-muted">
                <pre className="whitespace-pre-wrap text-sm font-sans">{generatedEmail}</pre>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your generated email will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Common email scenarios for placement activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {emailTemplates.map((template) => (
              <Button key={template.id} variant="outline" className="justify-start h-auto py-3 bg-transparent">
                <Mail className="mr-2 h-4 w-4" />
                {template.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
