import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Application } from "@/lib/models/Application"
import { Student } from "@/lib/models/Student"

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ jobId: string }> }
) {
    try {
        const params = await props.params
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const { jobId } = params

        const applications = await Application.find({ jobId }).lean()

        const studentIds = applications.map((app: any) => app.studentId)
        const students = await Student.find({ _id: { $in: studentIds } }).lean()
        const studentMap = new Map(students.map((s: any) => [s._id.toString(), s]))

        const formattedApplicants = applications.map((app: any) => {
            const student: any = studentMap.get(app.studentId.toString())
            return {
                id: app._id,
                studentId: app.studentId,
                name: student ? `${student.firstName} ${student.lastName}` : "Unknown",
                branch: student ? student.department : "N/A",
                cgpa: student ? student.cgpa : "N/A",
                status: app.status,
                appliedAt: app.createdAt
            }
        })

        return NextResponse.json({ success: true, data: formattedApplicants })
    } catch (error) {
        console.error("Error fetching applicants:", error)
        return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 })
    }
}
