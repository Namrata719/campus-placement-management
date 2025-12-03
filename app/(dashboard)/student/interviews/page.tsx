"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Video, Building2, ExternalLink, MessageSquare, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function StudentInterviewsPage() {
    const [interviews, setInterviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchInterviews()
    }, [])

    const fetchInterviews = async () => {
        try {
            const res = await fetch("/api/student/schedule")
            const data = await res.json()
            if (data.success) {
                // Filter for interviews
                const interviewEvents = data.events.filter((e: any) =>
                    e.type.toLowerCase().includes("interview")
                )
                setInterviews(interviewEvents)
            } else {
                toast.error("Failed to load interviews")
            }
        } catch (error) {
            console.error("Error fetching interviews:", error)
            toast.error("Failed to load interviews")
        } finally {
            setLoading(false)
        }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcomingInterviews = interviews.filter((e) => new Date(e.date) >= today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const pastInterviews = interviews.filter((e) => new Date(e.date) < today).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <DashboardHeader title="My Interviews" subtitle="Manage your upcoming and past interviews" />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen space-y-6">
            <DashboardHeader title="My Interviews" subtitle="Manage your upcoming and past interviews" />

            <div className="px-4 lg:px-6">
                <Tabs defaultValue="upcoming" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="upcoming">Upcoming ({upcomingInterviews.length})</TabsTrigger>
                        <TabsTrigger value="past">Past ({pastInterviews.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                        {upcomingInterviews.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Calendar className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium">No upcoming interviews</h3>
                                    <p className="text-muted-foreground mt-1">You don't have any interviews scheduled at the moment.</p>
                                    <Button className="mt-4" asChild>
                                        <Link href="/student/jobs">Browse Jobs</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {upcomingInterviews.map((interview) => (
                                    <InterviewCard key={interview.id} interview={interview} isUpcoming={true} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4">
                        {pastInterviews.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Clock className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium">No past interviews</h3>
                                    <p className="text-muted-foreground mt-1">You haven't completed any interviews yet.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pastInterviews.map((interview) => (
                                    <InterviewCard key={interview.id} interview={interview} isUpcoming={false} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function InterviewCard({ interview, isUpcoming }: { interview: any, isUpcoming: boolean }) {
    const date = new Date(interview.date)

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <Badge variant={isUpcoming ? "default" : "secondary"} className="mb-2">
                        {interview.type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                    {isUpcoming && (
                        <Badge variant="outline" className="border-blue-500 text-blue-500">
                            Scheduled
                        </Badge>
                    )}
                </div>
                <CardTitle className="text-lg">{interview.company}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {interview.title}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{interview.startTime} - {interview.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    {interview.mode === 'online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                    <span>{interview.mode === 'online' ? 'Online' : interview.venue || 'Venue TBD'}</span>
                </div>

                {interview.description && (
                    <div className="bg-muted/50 p-2 rounded text-xs mt-2">
                        <p className="font-medium mb-1">Instructions:</p>
                        <p className="text-muted-foreground line-clamp-2">{interview.description}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-3 border-t">
                {isUpcoming ? (
                    interview.mode === 'online' && interview.meetingLink ? (
                        <Button className="w-full gap-2" asChild>
                            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4" />
                                Join Interview
                            </a>
                        </Button>
                    ) : (
                        <Button className="w-full gap-2" variant="outline" disabled>
                            <AlertCircle className="h-4 w-4" />
                            {interview.mode === 'online' ? 'Link Pending' : 'View Details'}
                        </Button>
                    )
                ) : (
                    <Button className="w-full gap-2" variant="outline" asChild>
                        <Link href="/student/feedback">
                            <MessageSquare className="h-4 w-4" />
                            Submit Feedback
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
