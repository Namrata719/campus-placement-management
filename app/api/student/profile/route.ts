import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Student } from "@/lib/models/Student"

export async function GET() {
    try {
        const auth = await getAuthFromCookies()
        if (!auth || auth.role !== "student") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const student = await Student.findOne({ userId: auth.userId })
        if (!student) {
            return NextResponse.json({ success: false, error: "Student profile not found" }, { status: 404 })
        }

        // Transform data to match frontend expectations if necessary
        // Currently, the model structure matches closely, but we might need to handle dates or missing fields
        const studentData = {
            ...student.toObject(),
            // Ensure arrays are initialized
            skills: student.skills || [],
            projects: student.projects || [],
            internships: student.internships || [],
            certifications: student.certifications || [],
            achievements: student.achievements || [],
            // Ensure address object exists
            address: student.address || { street: "", city: "", state: "", pincode: "", country: "" },
        }

        return NextResponse.json({ success: true, data: studentData })
    } catch (error) {
        console.error("Profile fetch error:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const auth = await getAuthFromCookies()
        if (!auth || auth.role !== "student") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        await connectDB()

        const student = await Student.findOneAndUpdate(
            { userId: auth.userId },
            { $set: body },
            { new: true }
        )

        if (!student) {
            return NextResponse.json({ success: false, error: "Student profile not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: student })
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    }
}
