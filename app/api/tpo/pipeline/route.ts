import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Application } from "@/lib/models/Application"
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

        const { searchParams } = new URL(req.url)
        const jobId = searchParams.get("jobId")

        if (!jobId) {
            return NextResponse.json({ error: "Job ID required" }, { status: 400 })
        }

        const applications = await Application.find({ jobId })
            .populate("studentId")
            .lean()

        const formattedCandidates = applications.map((app: any) => ({
            id: app._id,
            name: `${app.studentId.firstName} ${app.studentId.lastName}`,
            email: app.studentId.email,
            branch: app.studentId.department,
            cgpa: app.studentId.cgpa,
            stage: app.status,
            matchScore: 85 // Mock score
        }))

        return NextResponse.json({ success: true, data: formattedCandidates })
    } catch (error) {
        console.error("Error fetching pipeline:", error)
        return NextResponse.json({ error: "Failed to fetch pipeline" }, { status: 500 })
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
        const { applicationId, status } = body

        await Application.findByIdAndUpdate(applicationId, {
            status,
            $push: {
                timeline: {
                    status,
                    date: new Date(),
                    comment: `Moved to ${status} by TPO`
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating pipeline:", error)
        return NextResponse.json({ error: "Failed to update pipeline" }, { status: 500 })
    }
}
