import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Student } from "@/lib/models/Student"
import { Job } from "@/lib/models/Job"
import { Application } from "@/lib/models/Application"
import { PlacementEvent } from "@/lib/models/PlacementEvent"
import { Company } from "@/lib/models/Company"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const student = await Student.findOne({ userId })
        if (!student) {
            return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
        }

        // 1. Stats
        const activeJobsCount = await Job.countDocuments({ status: "active" })
        const applicationsCount = await Application.countDocuments({ studentId: student._id })
        const interviewsCount = await Application.countDocuments({ studentId: student._id, status: "interview" })

        // Calculate profile score (simple logic)
        let profileScore = 0
        if (student.firstName) profileScore += 10
        if (student.lastName) profileScore += 10
        if (student.email) profileScore += 10
        if (student.phone) profileScore += 10
        if (student.cgpa) profileScore += 20
        if (student.resume) profileScore += 20
        if (student.skills && student.skills.length > 0) profileScore += 20
        profileScore = Math.min(profileScore, 100)

        // 2. Recommended Jobs (Simple matching based on branch)
        const recommendedJobs = await Job.find({
            status: "active",
            "eligibility.branches": student.department
        }).limit(3).sort({ createdAt: -1 }).lean()

        const companyIds = recommendedJobs.map((j: any) => j.companyId)
        const companies = await Company.find({ _id: { $in: companyIds } }).lean()
        const companyMap = new Map(companies.map((c: any) => [c._id.toString(), c]))

        const formattedRecommendedJobs = recommendedJobs.map((job: any) => {
            const company: any = companyMap.get(job.companyId.toString())
            return {
                id: job._id,
                title: job.title,
                company: company ? company.name : "Unknown",
                location: job.locations?.[0] || "N/A",
                ctc: job.ctc ? `${job.ctc} LPA` : "N/A",
                match: 85, // Mock match score for now
                deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "No deadline",
                tags: job.preferredSkills || []
            }
        })

        // 3. Upcoming Events
        const upcomingEvents = await PlacementEvent.find({
            startTime: { $gte: new Date() }
        }).sort({ startTime: 1 }).limit(2).lean()

        // 4. Recent Applications
        const recentApps = await Application.find({ studentId: student._id })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean()

        const appCompanyIds = recentApps.map((a: any) => a.companyId)
        const appCompanies = await Company.find({ _id: { $in: appCompanyIds } }).lean()
        const appCompanyMap = new Map(appCompanies.map((c: any) => [c._id.toString(), c]))

        const formattedApps = await Promise.all(recentApps.map(async (app: any) => {
            const company: any = appCompanyMap.get(app.companyId.toString())
            const job = await Job.findById(app.jobId).select("title").lean()
            return {
                id: app._id,
                company: company ? company.name : "Unknown",
                role: job ? (job as any).title : "Unknown Role",
                status: app.status,
                date: new Date(app.createdAt).toLocaleDateString()
            }
        }))

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    jobsAvailable: activeJobsCount,
                    applications: applicationsCount,
                    interviews: interviewsCount,
                    profileScore
                },
                recommendedJobs: formattedRecommendedJobs,
                upcomingEvents: upcomingEvents.map((e: any) => ({
                    id: e._id,
                    title: e.title,
                    date: new Date(e.startTime).toLocaleDateString(),
                    time: new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    venue: e.location || "Online"
                })),
                applications: formattedApps
            }
        })

    } catch (error) {
        console.error("Error fetching student dashboard:", error)
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
    }
}
