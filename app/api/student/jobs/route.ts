import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Job } from "@/lib/models/Job"
import { Student } from "@/lib/models/Student"
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
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        // Fetch active jobs
        const jobs = await Job.find({ status: "active" }).sort({ createdAt: -1 }).lean()

        const companyIds = jobs.map((j: any) => j.companyId)
        const companies = await Company.find({ _id: { $in: companyIds } }).lean()
        const companyMap = new Map(companies.map((c: any) => [c._id.toString(), c]))

        const formattedJobs = jobs.map((job: any) => {
            const company: any = companyMap.get(job.companyId.toString())

            // Check eligibility
            let isEligible = true
            let eligibilityReason = ""

            if (job.eligibility) {
                if (job.eligibility.branches && job.eligibility.branches.length > 0) {
                    if (!job.eligibility.branches.includes(student.department)) {
                        isEligible = false
                        eligibilityReason = "Department not eligible"
                    }
                }
                if (job.eligibility.minCgpa && student.cgpa < job.eligibility.minCgpa) {
                    isEligible = false
                    eligibilityReason = "CGPA criteria not met"
                }
            }

            return {
                id: job._id,
                title: job.title,
                company: company ? company.name : "Unknown",
                companyLogo: company ? company.name.charAt(0) : "C",
                location: job.locations?.[0] || "N/A",
                ctc: job.ctc ? `${job.ctc} LPA` : "N/A",
                roleType: job.roleType,
                workMode: job.workMode,
                deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "No deadline",
                skills: job.preferredSkills || [],
                description: job.description,
                match: 85, // Mock match score
                isEligible,
                eligibilityReason
            }
        })

        return NextResponse.json({ success: true, data: formattedJobs })

    } catch (error) {
        console.error("Error fetching student jobs:", error)
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
    }
}
