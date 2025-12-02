import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Company } from "@/lib/models/Company"
import { Job } from "@/lib/models/Job"
import { Application } from "@/lib/models/Application"
import { PlacementEvent } from "@/lib/models/PlacementEvent"
import { Student } from "@/lib/models/Student"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Find company by userId
        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company profile not found" }, { status: 404 })
        }

        const companyId = company._id

        // 1. Stats
        const activeJobsCount = await Job.countDocuments({ companyId, status: "active" })

        const totalApplicants = await Application.countDocuments({ companyId })
        const shortlisted = await Application.countDocuments({ companyId, status: "shortlisted" })
        const offersMade = await Application.countDocuments({ companyId, status: "offered" })
        const interviewed = await Application.countDocuments({ companyId, status: "interview" })

        // 2. Active Jobs List
        const activeJobsList = await Job.find({ companyId, status: "active" }).limit(3).sort({ createdAt: -1 }).lean()

        const formattedActiveJobs = await Promise.all(activeJobsList.map(async (job: any) => {
            const applicantsCount = await Application.countDocuments({ jobId: job._id })
            const shortlistedCount = await Application.countDocuments({ jobId: job._id, status: "shortlisted" })

            return {
                id: job._id,
                title: job.title,
                applicants: applicantsCount,
                shortlisted: shortlistedCount,
                status: job.status,
                deadline: job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"
            }
        }))

        // 3. Recent Applicants
        const recentApps = await Application.find({ companyId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()

        const studentIds = recentApps.map((a: any) => a.studentId)
        const students = await Student.find({ _id: { $in: studentIds } }).lean()
        const studentMap = new Map(students.map((s: any) => [s._id.toString(), s]))

        const formattedRecentApplicants = recentApps.map((app: any) => {
            const student: any = studentMap.get(app.studentId.toString())
            return {
                id: app._id,
                name: student ? `${student.firstName} ${student.lastName}` : "Unknown",
                role: "Applicant",
                cgpa: student?.cgpa || 0,
                match: app.aiScore || 0,
                status: app.status
            }
        })

        // 4. Scheduled Events
        const upcomingEvents = await PlacementEvent.find({
            companyId,
            startTime: { $gte: new Date() }
        }).sort({ startTime: 1 }).limit(3).lean()

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    activeJobs: activeJobsCount,
                    totalApplicants,
                    shortlisted,
                    offersMade
                },
                activeJobs: formattedActiveJobs,
                recentApplicants: formattedRecentApplicants,
                upcomingEvents: upcomingEvents.map((e: any) => ({
                    id: e._id,
                    title: e.title,
                    date: new Date(e.startTime).toLocaleDateString(),
                    time: new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    venue: e.location || "Online"
                })),
                pipeline: {
                    applied: totalApplicants,
                    shortlisted,
                    interviewed,
                    offered: offersMade
                }
            }
        })

    } catch (error) {
        console.error("Error fetching company dashboard:", error)
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
    }
}
