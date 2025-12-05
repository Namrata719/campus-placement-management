import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Job } from "@/lib/models/Job"
import { Company } from "@/lib/models/Company"
import { Application } from "@/lib/models/Application"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 }).lean()

        const formattedJobs = await Promise.all(jobs.map(async (job: any) => {
            const applicantsCount = await Application.countDocuments({ jobId: job._id })
            const shortlistedCount = await Application.countDocuments({ jobId: job._id, status: "shortlisted" })

            return {
                id: job._id,
                title: job.title,
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

export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        const body = await req.json()

        if (!body.title || !body.description || !body.roleType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const newJob = await Job.create({
            companyId: company._id,
            title: body.title,
            description: body.description,
            roleType: body.roleType,
            ctc: body.ctc ? parseFloat(body.ctc) : undefined,
            locations: body.location ? [body.location] : [],
            workMode: "onsite",
            responsibilities: body.responsibilities ? body.responsibilities.split('\n') : [],
            requirements: body.requirements ? body.requirements.split('\n') : [],
            preferredSkills: body.skills ? body.skills.split(',').map((s: string) => s.trim()) : [],
            eligibility: {
                branches: body.branches || [],
                minCgpa: body.minCgpa ? parseFloat(body.minCgpa) : 0,
                maxBacklogs: body.maxBacklogs ? parseInt(body.maxBacklogs) : 0,
                batch: body.batch ? [body.batch] : []
            },
            applicationDeadline: body.deadline ? new Date(body.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: "pending_approval"
        })

        return NextResponse.json({ success: true, data: newJob })
    } catch (error) {
        console.error("Error creating job:", error)
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        const body = await req.json()
        const { jobId } = body

        if (!jobId) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
        }

        const job = await Job.findOne({ _id: jobId, companyId: company._id })
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 })
        }

        const updateData: any = {
            title: body.title,
            description: body.description,
            roleType: body.roleType,
            ctc: body.ctc ? parseFloat(body.ctc) : undefined,
            locations: body.location ? [body.location] : [],
            responsibilities: body.responsibilities ? body.responsibilities.split('\n') : [],
            requirements: body.requirements ? body.requirements.split('\n') : [],
            preferredSkills: body.skills ? body.skills.split(',').map((s: string) => s.trim()) : [],
            eligibility: {
                branches: body.branches || [],
                minCgpa: body.minCgpa ? parseFloat(body.minCgpa) : 0,
                maxBacklogs: body.maxBacklogs ? parseInt(body.maxBacklogs) : 0,
                batch: body.batch ? [body.batch] : []
            },
            applicationDeadline: body.deadline ? new Date(body.deadline) : undefined,
            status: "pending_approval" // Reset status on edit
        }

        await Job.findByIdAndUpdate(jobId, updateData)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating job:", error)
        return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const jobId = searchParams.get("jobId")

        if (!jobId) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
        }

        await connectDB()
        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        const job = await Job.findOneAndDelete({ _id: jobId, companyId: company._id })
        if (!job) {
            return NextResponse.json({ error: "Job not found or unauthorized" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting job:", error)
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
    }
}
