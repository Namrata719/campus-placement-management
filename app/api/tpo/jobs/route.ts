import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Job } from "@/lib/models/Job"
import { Company } from "@/lib/models/Company"
import { Application } from "@/lib/models/Application"
import { Student } from "@/lib/models/Student"
import { sendJobNotification } from "@/lib/mail"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status")
        const search = searchParams.get("search")

        let query: any = {}

        if (status && status !== "all") {
            if (status === "pending") {
                query.status = "pending_approval"
            } else {
                query.status = status
            }
        }

        if (search) {
            query.title = { $regex: search, $options: "i" }
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 }).lean()

        const companyIds = jobs.map((j: any) => j.companyId)
        const companies = await Company.find({ _id: { $in: companyIds } }).lean()
        const companyMap = new Map(companies.map((c: any) => [c._id.toString(), c]))

        const formattedJobs = await Promise.all(jobs.map(async (job: any) => {
            const company: any = companyMap.get(job.companyId.toString())
            const applicantsCount = await Application.countDocuments({ jobId: job._id })
            const shortlistedCount = await Application.countDocuments({ jobId: job._id, status: "shortlisted" })

            return {
                id: job._id,
                title: job.title,
                company: company ? company.name : "Unknown",
                type: job.roleType,
                ctc: job.ctc ? `${job.ctc} LPA` : "N/A",
                location: job.locations?.[0] || "N/A",
                status: job.status === "pending_approval" ? "pending" : job.status,
                applicants: applicantsCount,
                shortlisted: shortlistedCount,
                deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString() : null,
                postedDate: job.createdAt,
                eligibleBranches: job.eligibility?.branches || [],
                minCGPA: job.eligibility?.minCgpa || 0
            }
        }))

        return NextResponse.json({ success: true, data: formattedJobs })
    } catch (error) {
        console.error("Error fetching jobs:", error)
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const body = await req.json()
        const { jobId, status, minCGPA, eligibleBranches } = body

        if (!jobId) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
        }

        const updateData: any = {}

        if (status) {
            // Map frontend status to backend enum
            let dbStatus = status
            if (status === "pending") dbStatus = "pending_approval"
            if (status === "approved") dbStatus = "active"
            if (status === "rejected") dbStatus = "cancelled"

            updateData.status = dbStatus
            if (status === "approved") {
                updateData.approvedBy = userId
                updateData.approvedAt = new Date()
            }
        }

        if (minCGPA !== undefined || eligibleBranches !== undefined) {
            const job = await Job.findById(jobId)
            if (job) {
                updateData["eligibility.minCgpa"] = minCGPA !== undefined ? minCGPA : job.eligibility.minCgpa
                updateData["eligibility.branches"] = eligibleBranches !== undefined ? eligibleBranches : job.eligibility.branches
            }
        }

        await Job.findByIdAndUpdate(jobId, updateData)

        // Send notifications if approved
        if (status === "approved") {
            const job = await Job.findById(jobId).populate("companyId")
            if (job) {
                const companyName = (job.companyId as any).name
                // Find eligible students
                const eligibleStudents = await Student.find({
                    department: { $in: job.eligibility.branches },
                    cgpa: { $gte: job.eligibility.minCgpa },
                    // Add more criteria as needed
                }).select("email")

                console.log(`Sending job notifications to ${eligibleStudents.length} eligible students`)

                // Send emails in parallel with error handling
                const emailPromises = eligibleStudents.map(async (student: any) => {
                    if (student.email) {
                        try {
                            await sendJobNotification(student.email, job.title, companyName, job._id.toString())
                            return { success: true, email: student.email }
                        } catch (error) {
                            console.error(`Failed to send notification to ${student.email}:`, error)
                            return { success: false, email: student.email }
                        }
                    }
                    return { success: false, email: "no-email" }
                })

                const results = await Promise.all(emailPromises)
                const successCount = results.filter(r => r.success).length
                console.log(`Successfully sent ${successCount}/${eligibleStudents.length} job notifications`)
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating job:", error)
        return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
    }
}
