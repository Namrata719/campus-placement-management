"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    MapPin,
    Building2,
    Clock,
    Briefcase,
    IndianRupee,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Loader2,
} from "lucide-react"
import { toast } from "sonner"

export default function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
    const router = useRouter()
    const [jobId, setJobId] = useState<string>("")
    const [job, setJob] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isApplying, setIsApplying] = useState(false)

    useEffect(() => {
        params.then((p) => setJobId(p.jobId))
    }, [params])

    useEffect(() => {
        if (jobId) {
            fetchJobDetails()
        }
    }, [jobId])

    const fetchJobDetails = async () => {
        try {
            const res = await fetch("/api/student/jobs")
            const json = await res.json()
            if (json.success) {
                const foundJob = json.data.find((j: any) => j.id === jobId)
                if (foundJob) {
                    setJob(foundJob)
                } else {
                    toast.error("Job not found")
                    router.push("/student/jobs")
                }
            }
        } catch (error) {
            console.error("Failed to fetch job details", error)
            toast.error("Failed to load job details")
        } finally {
            setLoading(false)
        }
    }

    const handleApply = async () => {
        if (!job) return

        // Check eligibility first with detailed messages
        if (!job.isEligible) {
            toast.error("You are not eligible for this job", {
                description: job.eligibilityReason,
                duration: 5000,
            })
            return
        }

        setIsApplying(true)
        try {
            const res = await fetch("/api/student/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: job.id }),
            })
            const data = await res.json()

            if (data.success) {
                toast.success("Application submitted successfully!", {
                    description: "You can track your application status in the Applications page.",
                    duration: 5000,
                })
                router.push("/student/applications")
            } else {
                // Show specific error messages
                if (data.error.includes("resume")) {
                    toast.error("Resume Required", {
                        description: "Please upload your resume before applying to jobs.",
                        action: {
                            label: "Upload Resume",
                            onClick: () => router.push("/student/resume"),
                        },
                        duration: 7000,
                    })
                } else if (data.error.includes("already applied")) {
                    toast.warning("Already Applied", {
                        description: "You have already applied to this job. Check your applications page for status.",
                        action: {
                            label: "View Applications",
                            onClick: () => router.push("/student/applications"),
                        },
                        duration: 7000,
                    })
                } else {
                    toast.error(data.error || "Failed to apply")
                }
            }
        } catch (error) {
            toast.error("Failed to apply", {
                description: "An unexpected error occurred. Please try again later.",
            })
        } finally {
            setIsApplying(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Job not found</h2>
                    <Button onClick={() => router.push("/student/jobs")}>Back to Jobs</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <DashboardHeader title="Job Details" subtitle={job.company} />

            <div className="flex-1 p-4 lg:p-6">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header Card */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 rounded-lg shrink-0">
                                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xl">
                                        {job.companyLogo}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div>
                                            <h1 className="text-2xl font-bold">{job.title}</h1>
                                            <p className="text-lg text-muted-foreground">{job.company}</p>
                                        </div>

                                        {job.isEligible ? (
                                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 gap-1 self-start">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Eligible
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-destructive/10 text-destructive gap-1 self-start">
                                                <XCircle className="h-3 w-3" />
                                                {job.eligibilityReason}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Location</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {job.location}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">CTC</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <IndianRupee className="h-4 w-4" />
                                                {job.ctc}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Type</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Briefcase className="h-4 w-4" />
                                                {job.roleType}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Work Mode</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Building2 className="h-4 w-4" />
                                                {job.workMode}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        Application Deadline: {job.deadline}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description Card */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Job Description</h2>
                                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                            </div>

                            <Separator />

                            <div>
                                <h2 className="text-lg font-semibold mb-3">Skills Required</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill: string) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Apply Section */}
                    <Card>
                        <CardContent className="p-6">
                            {job.isEligible ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        By clicking "Apply", you confirm that you have read and agree to submit your application for this
                                        position.
                                    </p>
                                    <Button className="w-full" size="lg" onClick={handleApply} disabled={isApplying}>
                                        {isApplying ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Applying...
                                            </>
                                        ) : (
                                            "Apply for this Job"
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-center">
                                    <p className="font-medium">You are not eligible for this job</p>
                                    <p className="text-sm mt-1">{job.eligibilityReason}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
