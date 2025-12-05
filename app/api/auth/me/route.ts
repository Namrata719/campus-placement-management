import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Student } from "@/lib/models/Student"
import { Company } from "@/lib/models/Company"

export async function GET() {
  try {
    const auth = await getAuthFromCookies()

    if (!auth) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(auth.userId)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    let name = "User"
    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id })
      if (student) name = `${student.firstName} ${student.lastName}`
    } else if (user.role === "company") {
      const company = await Company.findOne({ userId: user._id })
      if (company) name = company.name
    } else if (user.role === "tpo") {
      name = "Placement Officer"
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        name,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
