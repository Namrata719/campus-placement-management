"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Mail,
    Send,
    CheckCircle,
    AlertCircle,
    Loader2,
    Users,
    BellRing,
    Calendar,
    RefreshCw
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function NotificationTestPage() {
    const [loading, setLoading] = useState(false)
    const [testType, setTestType] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [testResults, setTestResults] = useState<any[]>([])
    const [smtpConfigured, setSmtpConfigured] = useState<boolean>(false)

    const testOptions = [
        {
            value: "job_notification",
            label: "Job Notification",
            description: "Test email sent when a new job is posted",
            icon: BellRing,
            color: "text-blue-500"
        },
        {
            value: "status_update",
            label: "Status Update",
            description: "Test email for application status changes",
            icon: RefreshCw,
            color: "text-green-500"
        },
        {
            value: "interview_scheduled",
            label: "Interview Scheduled",
            description: "Test email when interview is scheduled",
            icon: Calendar,
            color: "text-purple-500"
        },
        {
            value: "bulk_job_notification",
            label: "Bulk Job Notification",
            description: "Test bulk emails to eligible students",
            icon: Users,
            color: "text-orange-500"
        },
        {
            value: "application_status_changes",
            label: "Recent Status Changes",
            description: "Test notifications for recent application updates",
            icon: Mail,
            color: "text-pink-500"
        }
    ]

    const checkConfiguration = async () => {
        try {
            const res = await fetch("/api/test-notifications")
            const data = await res.json()
            if (data.success) {
                setSmtpConfigured(data.smtpConfigured)
                if (!data.smtpConfigured) {
                    toast.info("SMTP not configured - emails will be logged to console")
                } else {
                    toast.success("SMTP is configured and ready")
                }
            }
        } catch (error) {
            console.error("Error checking configuration:", error)
            toast.error("Failed to check email configuration")
        }
    }

    const runTest = async () => {
        if (!testType) {
            toast.error("Please select a test type")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/test-notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ testType, email: email || undefined })
            })

            const data = await res.json()

            const result = {
                testType,
                timestamp: new Date().toISOString(),
                success: data.success,
                message: data.message || data.error || "Unknown result"
            }

            setTestResults(prev => [result, ...prev])

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message || "Test failed")
            }
        } catch (error) {
            console.error("Error running test:", error)
            toast.error("Failed to run notification test")

            setTestResults(prev => [{
                testType,
                timestamp: new Date().toISOString(),
                success: false,
                message: error instanceof Error ? error.message : "Unknown error"
            }, ...prev])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Email Notification Testing</h1>
                <p className="text-muted-foreground">
                    Test the email notification system for different events
                </p>
            </div>

            {/* Configuration Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Configuration
                    </CardTitle>
                    <CardDescription>Check your email service configuration</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant={smtpConfigured ? "default" : "secondary"}>
                                {smtpConfigured ? "SMTP Configured" : "Mock Mode"}
                            </Badge>
                            {!smtpConfigured && (
                                <span className="text-sm text-muted-foreground">
                                    Emails will be logged to console
                                </span>
                            )}
                        </div>
                        <Button variant="outline" onClick={checkConfiguration}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Check Status
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Test Controls */}
            <Card>
                <CardHeader>
                    <CardTitle>Run Notification Test</CardTitle>
                    <CardDescription>Select a test scenario and run it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testOptions.map((option) => {
                            const Icon = option.icon
                            return (
                                <Card
                                    key={option.value}
                                    className={`cursor-pointer transition-all ${testType === option.value
                                            ? "border-primary shadow-md"
                                            : "hover:border-muted-foreground/50"
                                        }`}
                                    onClick={() => setTestType(option.value)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Icon className={`h-5 w-5 mt-0.5 ${option.color}`} />
                                            <div>
                                                <h4 className="font-medium">{option.label}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {option.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Email Address (Optional)
                        </label>
                        <Input
                            type="email"
                            placeholder="test@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Leave empty to use default test email
                        </p>
                    </div>

                    <Button
                        onClick={runTest}
                        disabled={loading || !testType}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Running Test...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Run Test
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Test Results */}
            {testResults.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Test Results</CardTitle>
                        <CardDescription>Recent notification test results</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {testResults.map((result, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 border rounded-lg"
                                >
                                    {result.success ? (
                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">
                                                {testOptions.find(o => o.value === result.testType)?.label}
                                            </h4>
                                            <Badge variant={result.success ? "default" : "destructive"}>
                                                {result.success ? "Success" : "Failed"}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {result.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(result.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
