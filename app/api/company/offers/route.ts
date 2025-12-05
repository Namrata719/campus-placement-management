import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Application } from "@/lib/models/Application"
import { Company } from "@/lib/models/Company"
import { Job } from "@/lib/models/Job"
import { Student } from "@/lib/models/Student"

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

        // Fetch applications with offer-related statuses
        const applications = await Application.find({
            companyId: company._id,
            status: { $in: ["offered", "accepted", "declined"] }
        }).sort({ createdAt: -1 }).lean()

        const studentIds = applications.map((a: any) => a.studentId)
        const students = await Student.find({ _id: { $in: studentIds } }).lean()
        const studentMap = new Map(students.map((s: any) => [s._id.toString(), s]))

        const jobIds = applications.map((a: any) => a.jobId)
        const jobs = await Job.find({ _id: { $in: jobIds } }).lean()
        const jobMap = new Map(jobs.map((j: any) => [j._id.toString(), j]))

        const formattedOffers = applications.map((app: any) => {
            const student: any = studentMap.get(app.studentId.toString())
            const job: any = jobMap.get(app.jobId.toString())
            return {
                id: app._id,
                candidateName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
                email: student?.email,
                branch: student?.department || "N/A",
                role: job ? job.title : "Unknown Job",
                ctc: job?.ctc ? `${job.ctc} LPA` : "N/A",
                joiningDate: "2025-07-01", // Mock or add to Application model
                offerDate: app.createdAt,
                status: app.status,
                joiningStatus: app.status === "accepted" ? "confirmed" : null,
            }
        })

        return NextResponse.json({ success: true, data: formattedOffers })
    } catch (error) {
        console.error("Error fetching offers:", error)
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
    }
}
