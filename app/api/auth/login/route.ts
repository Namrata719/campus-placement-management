import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Student } from "@/lib/models/Student"
import { Company } from "@/lib/models/Company"
import { z } from "zod"
import { verifyPassword, generateAccessToken, generateRefreshToken, setAuthCookies } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const schema = z.object({ email: z.string().email(), password: z.string().min(6) })
    const { email, password } = schema.parse(await request.json())

    await connectDB()
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    if (!verifyPassword(password, user.password)) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: "Account is deactivated" }, { status: 403 })
    }

    if (!user.isApproved && user.role !== "student") {
      return NextResponse.json({ success: false, error: "Account pending approval" }, { status: 403 })
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    }

    const accessToken = await generateAccessToken(tokenPayload)
    const refreshToken = await generateRefreshToken(tokenPayload)

    // Update user's refresh token and last login
    user.refreshToken = refreshToken
    user.lastLogin = new Date()
    await user.save()

    // Set cookies
    await setAuthCookies(accessToken, refreshToken)

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
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
