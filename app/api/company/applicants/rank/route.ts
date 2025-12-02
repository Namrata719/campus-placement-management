import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Application } from "@/lib/models/Application"
import { Job } from "@/lib/models/Job"
import { Student } from "@/lib/models/Student"
import { Company } from "@/lib/models/Company"

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

        const body = await req.json().catch(() => ({}))
        const { jobId } = body

        let query: any = { companyId: company._id }
        if (jobId && jobId !== "all") {
            query.jobId = jobId
        }

        const applications = await Application.find(query)

        let updatedCount = 0

        for (const app of applications) {
            const job = await Job.findById(app.jobId)
            const student = await Student.findById(app.studentId)

            if (job && student) {
                let score = 0

                // 1. CGPA Score (Max 30)
                // Base 20 if met, +5 for every 1.0 above min
                if (student.cgpa >= job.eligibility.minCgpa) {
                    score += 20
                    const extra = Math.min(student.cgpa - job.eligibility.minCgpa, 2) * 5
                    score += extra
                }

                // 2. Skills Match (Max 50)
                const jobSkills = job.preferredSkills ? job.preferredSkills.map((s: string) => s.toLowerCase()) : []
                const studentSkills = student.skills ? student.skills.map((s: string) => s.toLowerCase()) : []

                if (jobSkills.length > 0) {
                    const matchedSkills = jobSkills.filter((s: string) => studentSkills.some((ss: string) => ss.includes(s) || s.includes(ss)))
                    const matchRatio = matchedSkills.length / jobSkills.length
                    score += matchRatio * 50
                } else {
                    score += 30 // Default if no skills specified
                }

                // 3. Branch Match (Max 20)
                if (job.eligibility.branches.includes(student.branch)) {
                    score += 20
                }

                // Cap at 100
                score = Math.min(Math.round(score), 100)

                app.aiMatchScore = score
                await app.save()
                updatedCount++
            }
        }

        return NextResponse.json({ success: true, updatedCount })

    } catch (error) {
        console.error("Error ranking candidates:", error)
        return NextResponse.json({ error: "Failed to rank candidates" }, { status: 500 })
    }
}
