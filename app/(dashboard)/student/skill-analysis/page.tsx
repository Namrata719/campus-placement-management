"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Sparkles,
  Brain,
  TrendingUp,
  BookOpen,
  Target,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react"

export default function SkillAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [targetRoles, setTargetRoles] = useState("")
  const [skills, setSkills] = useState("")
  const [skillAnalysis, setSkillAnalysis] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!targetRoles || !skills) {
      toast.error("Please fill in all fields")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/skill-gap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentProfile: {
            skills: skills.split(",").map(s => s.trim()),
          },
          targetRoles: targetRoles.split(",").map(s => s.trim()),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze skills")
      }

      const data = await response.json()
      setSkillAnalysis(data)
      setAnalysisComplete(true)
      toast.success("Analysis complete!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to analyze skills. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Skill Analysis</h1>
          <p className="text-muted-foreground">Identify skill gaps and get personalized learning recommendations</p>
        </div>
      </div>

      {!analysisComplete ? (
        <Card>
          <CardHeader>
            <CardTitle>Start New Analysis</CardTitle>
            <CardDescription>Enter your target roles and current skills to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-roles">Target Roles (comma separated)</Label>
              <Input
                id="target-roles"
                placeholder="e.g. Software Engineer, Frontend Developer, Data Scientist"
                value={targetRoles}
                onChange={(e) => setTargetRoles(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Current Skills (comma separated)</Label>
              <Textarea
                id="skills"
                placeholder="e.g. JavaScript, React, Python, SQL, Git"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Skills
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setAnalysisComplete(false)}>
              Start New Analysis
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-flex">
                    <svg className="w-20 h-20">
                      <circle
                        className="text-muted"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="32"
                        cx="40"
                        cy="40"
                      />
                      <circle
                        className="text-primary"
                        strokeWidth="8"
                        strokeDasharray={201}
                        strokeDashoffset={201 - (201 * skillAnalysis.overallReadiness) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="32"
                        cx="40"
                        cy="40"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                      {skillAnalysis.overallReadiness}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Overall Readiness</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{skillAnalysis.currentSkillLevel.strong.length}</p>
                    <p className="text-sm text-muted-foreground">Strong Skills</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{skillAnalysis.currentSkillLevel.moderate.length}</p>
                    <p className="text-sm text-muted-foreground">Moderate Skills</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{skillAnalysis.gapAnalysis.length}</p>
                    <p className="text-sm text-muted-foreground">Skills to Develop</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Current Skill Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Strong Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillAnalysis.currentSkillLevel.strong.map((skill: string) => (
                      <Badge key={skill} className="bg-green-500/10 text-green-600 border-green-500/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Moderate Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillAnalysis.currentSkillLevel.moderate.map((skill: string) => (
                      <Badge key={skill} className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Needs Improvement</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillAnalysis.currentSkillLevel.weak.map((skill: string) => (
                      <Badge key={skill} className="bg-red-500/10 text-red-600 border-red-500/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommended Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillAnalysis.recommendedCourses.map((rec: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{rec.topic}</h4>
                      <Badge variant="outline">{rec.estimatedTime}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detailed Gap Analysis
              </CardTitle>
              <CardDescription>Specific skills you need to develop for your target roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillAnalysis.gapAnalysis.map((gap: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-lg">{gap.skill}</h4>
                        <Badge
                          variant={
                            gap.importance === "critical"
                              ? "destructive"
                              : gap.importance === "important"
                                ? "default"
                                : "secondary"
                          }
                          className="mt-1"
                        >
                          {gap.importance}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Current: {gap.currentLevel}</p>
                        <p className="text-sm font-medium">Target: {gap.requiredLevel}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Learning Path
                      </p>
                      <ol className="list-decimal list-inside space-y-1">
                        {gap.learningPath.map((step: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

