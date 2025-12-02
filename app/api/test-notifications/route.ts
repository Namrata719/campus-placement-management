import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Student } from "@/lib/models/Student"
import { Job } from "@/lib/models/Job"
import { Company } from "@/lib/models/Company"
import { Application } from "@/lib/models/Application"
import { sendJobNotification, sendApplicationStatusUpdate, sendInterviewScheduled } from "@/lib/mail"

export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const body = await req.json()
        const { testType, email } = body

        if (!testType) {
            return NextResponse.json({ error: "Test type is required" }, { status: 400 })
        }

        let result = { success: false, message: "" }

        switch (testType) {
            case "job_notification": {
                // Test job notification email
                const targetEmail = email || "test@example.com"
                await sendJobNotification(
                    targetEmail,
                    "Senior Software Engineer",
                    "TechCorp Solutions",
                    "test-job-id-123"
                )
                result = {
                    success: true,
                    message: `Job notification test email sent to ${targetEmail}`
                }
                break
            }

            case "status_update": {
                // Test application status update email
                const targetEmail = email || "test@example.com"
                await sendApplicationStatusUpdate(
                    targetEmail,
                    "Full Stack Developer",
                    "InnovateTech Inc",
                    "shortlisted"
                )
                result = {
                    success: true,
                    message: `Status update test email sent to ${targetEmail}`
                }
                break
            }

            case "interview_scheduled": {
                // Test interview scheduled email
                const targetEmail = email || "test@example.com"
                await sendInterviewScheduled(
                    targetEmail,
                    "Data Scientist",
                    "AI Analytics Corp",
                    "2025-12-15",
                    "10:00 AM",
                    "Campus Placement Cell, Room 304"
                )
                result = {
                    success: true,
                    message: `Interview scheduled test email sent to ${targetEmail}`
                }
                break
            }

            case "bulk_job_notification": {
                // Test bulk job notification to eligible students
                const job = await Job.findOne({ status: "active" }).populate("companyId").lean()

                if (!job) {
                    result = {
                        success: false,
                        message: "No active jobs found for testing"
                    }
                    break
                }

                const eligibleStudents = await Student.find({
                    department: { $in: job.eligibility?.branches || [] },
                    cgpa: { $gte: job.eligibility?.minCgpa || 0 }
                }).select("email firstName lastName").limit(5).lean()

                if (eligibleStudents.length === 0) {
                    result = {
                        success: false,
                        message: "No eligible students found for testing"
                    }
                    break
                }

                const companyName = (job.companyId as any)?.name || "Test Company"
                let sentCount = 0

                for (const student of eligibleStudents) {
                    if (student.email) {
                        await sendJobNotification(
                            student.email,
                            job.title,
                            companyName,
                            job._id.toString()
                        )
                        sentCount++
                    }
                }

                result = {
                    success: true,
                    message: `Bulk job notification sent to ${sentCount} eligible students`
                }
                break
            }

            case "application_status_changes": {
                // Test notification for recent application status changes
                const recentApplications = await Application.find()
                    .populate("studentId")
                    .populate("jobId")
                    .populate("companyId")
                    .sort({ updatedAt: -1 })
                    .limit(3)
                    .lean()

                if (recentApplications.length === 0) {
                    result = {
                        success: false,
                        message: "No applications found for testing"
                    }
                    break
                }

                let sentCount = 0
                for (const app of recentApplications) {
                    const student = app.studentId as any
                    const job = app.jobId as any
                    const company = app.companyId as any

                    if (student?.email && job?.title && company?.name) {
                        await sendApplicationStatusUpdate(
                            student.email,
                            job.title,
                            company.name,
                            app.status
                        )
                        sentCount++
                    }
                }

                result = {
                    success: true,
                    message: `Status update notifications sent for ${sentCount} applications`
                }
                break
            }

            default:
                result = {
                    success: false,
                    message: "Invalid test type"
                }
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error in notification test:", error)
        return NextResponse.json({
            success: false,
            error: "Failed to test notification",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Return available test types
        const testTypes = [
            {
                type: "job_notification",
                description: "Test job posting notification email",
                params: "email (optional)"
            },
            {
                type: "status_update",
                description: "Test application status update email",
                params: "email (optional)"
            },
            {
                type: "interview_scheduled",
                description: "Test interview scheduled notification",
                params: "email (optional)"
            },
            {
                type: "bulk_job_notification",
                description: "Test bulk notification to eligible students",
                params: "none"
            },
            {
                type: "application_status_changes",
                description: "Test notifications for recent status changes",
                params: "none"
            }
        ]

        return NextResponse.json({
            success: true,
            testTypes,
            smtpConfigured: !!process.env.SMTP_HOST
        })
    } catch (error) {
        console.error("Error getting notification tests:", error)
        return NextResponse.json({ error: "Failed to get test types" }, { status: 500 })
    }
}
