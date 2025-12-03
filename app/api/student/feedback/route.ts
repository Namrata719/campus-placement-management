import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Feedback } from "@/lib/models/Feedback"
import { Student } from "@/lib/models/Student"
import { Company } from "@/lib/models/Company"

export async function GET() {
    try {
        const auth = await getAuthFromCookies()
        if (!auth || auth.role !== "student") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const student = await Student.findOne({ userId: auth.userId })
        if (!student) {
            return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
        }

        const feedbacks = await Feedback.find({ studentId: student._id }).sort({ createdAt: -1 })

        // Also fetch companies for the dropdown
        const companies = await Company.find({ status: "approved" }, { name: 1, _id: 1 })

        return NextResponse.json({ success: true, data: feedbacks, companies })
    } catch (error) {
        console.error("Feedback fetch error:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const auth = await getAuthFromCookies()
        if (!auth || auth.role !== "student") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        await connectDB()

        const student = await Student.findOne({ userId: auth.userId })
        if (!student) {
            return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
        }

        const feedback = await Feedback.create({
            ...body,
            studentId: student._id,
            status: "pending"
        })

        return NextResponse.json({ success: true, data: feedback })
    } catch (error) {
        console.error("Feedback creation error:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    }
}
