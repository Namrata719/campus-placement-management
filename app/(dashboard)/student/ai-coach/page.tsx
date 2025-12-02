"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, Sparkles, BookOpen, MessageSquare, Code, FileText, Lightbulb, RefreshCw } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickPrompts = [
  { icon: Code, label: "DSA Practice", prompt: "Ask me a medium difficulty DSA question for interview prep" },
  {
    icon: MessageSquare,
    label: "HR Questions",
    prompt: "Give me common HR interview questions and how to answer them",
  },
  { icon: BookOpen, label: "Company Research", prompt: "How should I research a company before an interview?" },
  { icon: FileText, label: "Resume Tips", prompt: "Review best practices for a fresher's resume" },
  { icon: Lightbulb, label: "Placement Policy", prompt: "What is the typical placement policy for dream companies?" },
  {
    icon: Sparkles,
    label: "Tell me about yourself",
    prompt: "Help me craft a 'Tell me about yourself' answer for interviews",
  },
]

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI Career Coach. I can help you with:\n\n• **Interview Preparation** - Practice DSA, system design, or HR questions\n• **Resume Guidance** - Tips to improve your resume\n• **Placement Process** - Answer questions about eligibility, policies, and procedures\n• **Career Advice** - Help you choose the right roles and companies\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        dsa: "Here's a medium difficulty problem:\n\n**Two Sum**\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to target.\n\n**Example:**\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n```\n\n**Hint:** Think about using a hash map for O(n) time complexity.\n\nWould you like me to explain the solution or give you another problem?",
        hr: "Here are common HR questions:\n\n1. **Tell me about yourself**\n   - Keep it professional, 2-3 minutes\n   - Structure: Present → Past → Future\n\n2. **Why this company?**\n   - Research the company culture\n   - Align with your goals\n\n3. **What are your strengths/weaknesses?**\n   - Be honest but strategic\n   - Show self-awareness\n\n4. **Where do you see yourself in 5 years?**\n   - Show ambition but be realistic\n\nWant me to help you practice any of these?",
        resume:
          "**Resume Best Practices for Freshers:**\n\n1. **Keep it to 1 page** - Recruiters spend 6 seconds on average\n\n2. **Strong summary** - 2-3 lines highlighting your skills and goals\n\n3. **Projects section** - Most important! Include:\n   - Tech stack used\n   - Your role and contributions\n   - Quantifiable results\n\n4. **Skills** - List relevant technical skills\n\n5. **Education** - Include CGPA, relevant coursework\n\n6. **Action verbs** - Start bullets with: Developed, Implemented, Led, etc.\n\nWant me to review your resume?",
        default:
          "That's a great question! Based on your query, here are some thoughts:\n\nFor placement success, focus on:\n1. **Technical Skills** - DSA, core CS concepts\n2. **Projects** - Build real-world applications\n3. **Communication** - Practice articulating your thoughts\n4. **Research** - Know the companies you're applying to\n\nIs there a specific area you'd like to dive deeper into?",
      }

      let response = responses.default
      const lowerContent = content.toLowerCase()

      if (lowerContent.includes("dsa") || lowerContent.includes("question")) {
        response = responses.dsa
      } else if (lowerContent.includes("hr") || lowerContent.includes("interview question")) {
        response = responses.hr
      } else if (lowerContent.includes("resume") || lowerContent.includes("cv")) {
        response = responses.resume
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">AI Career Coach</h1>
        <p className="text-muted-foreground text-sm md:text-base">Your personal assistant for interview prep and career guidance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[500px] md:h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base md:text-lg">PlaceBot</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Powered by AI</CardDescription>
                </div>
                <Badge variant="outline" className="ml-auto text-xs">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  Online
                </Badge>
              </div>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-3 md:p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-lg p-3 md:p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                    >
                      <div className="whitespace-pre-wrap text-xs sm:text-sm break-words overflow-wrap-anywhere">
                        {message.content}
                      </div>
                      <p
                        className={`text-xs mt-2 ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 md:p-4">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 md:p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 text-sm"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="sm" className="md:size-default">
                  <Send className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 md:py-3 bg-transparent"
                  onClick={() => sendMessage(prompt.prompt)}
                  disabled={isLoading}
                >
                  <prompt.icon className="h-3 w-3 md:h-4 md:w-4 mr-2 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{prompt.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs md:text-sm text-muted-foreground space-y-2">
                <li>• Be specific in your questions</li>
                <li>• Ask for practice problems</li>
                <li>• Request feedback on answers</li>
                <li>• Explore different topics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
