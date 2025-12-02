import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Application } from "@/lib/models/Application"
import { Job } from "@/lib/models/Job"
import { Company } from "@/lib/models/Company"
import { Student } from "@/lib/models/Student"

// GET: Fetch student's applications
export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Get student record
        const student = await Student.findOne({ userId }).lean()
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        // Fetch all applications for this student
        const applications = await Application.find({ studentId: student._id })
            .populate({
                path: "jobId",
                select: "title roleType ctc locations applicationDeadline",
            })
            .populate({
                path: "companyId",
                select: "name industry",
            })
            .sort({ appliedAt: -1 })
            .lean()

        // Transform data for frontend
        const transformedApplications = applications.map((app: any) => ({
            id: app._id.toString(),
            job: {
                title: app.jobId?.title || "N/A",
                company: app.companyId?.name || "N/A",
                location: app.jobId?.locations?.[0] || "N/A",
                ctc: app.jobId?.ctc ? `${(app.jobId.ctc / 100000).toFixed(1)} LPA` : "N/A",
            },
            status: app.status,
            appliedAt: app.appliedAt,
            statusHistory: app.timeline || [],
            nextStep: getNextStep(app.status),
            offer: app.offer,
        }))

        // Calculate stats
        const stats = {
            total: applications.length,
            active: applications.filter((a: any) => !["rejected", "withdrawn", "accepted"].includes(a.status)).length,
            offers: applications.filter((a: any) => ["offered", "accepted"].includes(a.status)).length,
            rejected: applications.filter((a: any) => a.status === "rejected").length,
        }

        return NextResponse.json({
            success: true,
            applications: transformedApplications,
            stats,
        })
    } catch (error: any) {
        console.error("Error fetching applications:", error)
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
    }
}

// POST: Submit new application
export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { jobId } = await req.json()

        await connectDB()

        // Get student record
        const student = await Student.findOne({ userId })
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        // Get job details
        const job = await Job.findById(jobId)
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 })
        }

        // Check if already applied
        const existingApp = await Application.findOne({
            studentId: student._id,
            jobId,
        })

        if (existingApp) {
            return NextResponse.json({ error: "Already applied to this job" }, { status: 400 })
        }

        // Create application
        const application = await Application.create({
            jobId,
            studentId: student._id,
            companyId: job.companyId,
            status: "applied",
            appliedAt: new Date(),
            timeline: [
                {
                    status: "applied",
                    date: new Date(),
                    comment: "Application submitted",
                },
            ],
        })

        // Increment job application count
        await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } })

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully",
            applicationId: application._id,
        })
    } catch (error: any) {
        console.error("Error submitting application:", error)
        return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
    }
}

// PUT: Update application (withdraw, accept offer, etc.)
export async function PUT(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { applicationId, action } = await req.json()

        await connectDB()

        const student = await Student.findOne({ userId })
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        const application = await Application.findOne({
            _id: applicationId,
            studentId: student._id,
        })

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }

        if (action === "withdraw") {
            application.status = "withdrawn"
            application.timeline.push({
                status: "withdrawn",
                date: new Date(),
                comment: "Application withdrawn by student",
            })
            await application.save()

            return NextResponse.json({
                success: true,
                message: "Application withdrawn successfully",
            })
        }

        if (action === "accept_offer") {
            if (application.status !== "offered") {
                return NextResponse.json({ error: "No offer to accept" }, { status: 400 })
            }

            application.status = "accepted"
            application.timeline.push({
                status: "accepted",
                date: new Date(),
                comment: "Offer accepted by student",
            })

            // Update student placement status
            await Student.findByIdAndUpdate(student._id, {
                placementStatus: "placed",
            })

            await application.save()

            return NextResponse.json({
                success: true,
                message: "Offer accepted! Congratulations!",
            })
        }

        if (action === "decline_offer") {
            if (application.status !== "offered") {
                return NextResponse.json({ error: "No offer to decline" }, { status: 400 })
            }

            application.status = "declined"
            application.timeline.push({
                status: "declined",
                date: new Date(),
                comment: "Offer declined by student",
            })

            await application.save()

            return NextResponse.json({
                success: true,
                message: "Offer declined successfully",
            })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (error: any) {
        console.error("Error updating application:", error)
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
    }
}

function getNextStep(status: string): string | null {
    const nextSteps: Record<string, string | null> = {
        applied: "Awaiting review",
        shortlisted: "Prepare for next round",
        interview_r1: "Technical interview scheduled",
        interview_r2: "Second round interview",
        interview_hr: "HR interview scheduled",
        offered: "Accept or reject offer",
        accepted: "Placement confirmed",
        rejected: null,
        withdrawn: null,
    }

    return nextSteps[status] || "Pending update"
}
