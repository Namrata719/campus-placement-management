import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Application } from "@/lib/models/Application"
import { Company } from "@/lib/models/Company"
import { Job } from "@/lib/models/Job"
import { Student } from "@/lib/models/Student"
import { sendApplicationStatusUpdate, sendInterviewScheduled } from "@/lib/mail"

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

        const { searchParams } = new URL(req.url)
        const jobId = searchParams.get("jobId")
        const status = searchParams.get("status")

        let query: any = { companyId: company._id }
        if (jobId && jobId !== "all") query.jobId = jobId
        if (status && status !== "all") query.status = status

        const applications = await Application.find(query).sort({ createdAt: -1 }).lean()

        const studentIds = applications.map((a: any) => a.studentId)
        const students = await Student.find({ _id: { $in: studentIds } }).lean()
        const studentMap = new Map(students.map((s: any) => [s._id.toString(), s]))

        const jobIds = applications.map((a: any) => a.jobId)
        const jobs = await Job.find({ _id: { $in: jobIds } }).lean()
        const jobMap = new Map(jobs.map((j: any) => [j._id.toString(), j]))

        const formattedApplications = applications.map((app: any) => {
            const student: any = studentMap.get(app.studentId.toString())
            const job: any = jobMap.get(app.jobId.toString())
            return {
                id: app._id,
                studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
                studentEmail: student?.email,
                jobTitle: job ? job.title : "Unknown Job",
                status: app.status,
                appliedDate: app.createdAt,
                resumeUrl: student?.resume || "",
                cgpa: student?.cgpa || 0,
                matchScore: app.aiMatchScore || 0
            }
        })

        return NextResponse.json({ success: true, data: formattedApplications })
    } catch (error) {
        console.error("Error fetching applicants:", error)
        return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 })
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
        const { applicationId, status, interviewDetails } = body

        if (!applicationId || !status) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        ).populate("studentId").populate("jobId").populate("companyId")

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }

        // Send Email Notification
        const student = application.studentId
        const job = application.jobId
        const company = application.companyId

        if (student && student.email) {
            if (status === "interview" && interviewDetails) {
                await sendInterviewScheduled(
                    student.email,
                    job.title,
                    company.name,
                    interviewDetails.date,
                    interviewDetails.time,
                    interviewDetails.venue
                )
            } else {
                await sendApplicationStatusUpdate(
                    student.email,
                    job.title,
                    company.name,
                    status
                )
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating application:", error)
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
    }
}
