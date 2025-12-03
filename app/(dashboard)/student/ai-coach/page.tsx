"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, Sparkles, BookOpen, MessageSquare, Code, FileText, Lightbulb, RefreshCw } from "lucide-react"

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

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI Career Coach. I can help you with:\n\n• **Interview Preparation** - Practice DSA, system design, or HR questions\n• **Resume Guidance** - Tips to improve your resume\n• **Placement Process** - Answer questions about eligibility, policies, and procedures\n• **Career Advice** - Help you choose the right roles and companies\n\nHow can I assist you today?",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to send message")
      }
      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage: Message = {
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
      // toast.error("Failed to get response")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt)
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
                  <CardDescription className="text-xs md:text-sm">Powered by Gemini 2.5 Flash</CardDescription>
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
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1].role === "user" && (
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
                  onChange={handleInputChange}
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
                  onClick={() => handleQuickPrompt(prompt.prompt)}
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

