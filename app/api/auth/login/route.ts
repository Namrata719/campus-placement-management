import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Student } from "@/lib/models/Student"
import { Company } from "@/lib/models/Company"
import { z } from "zod"
import { verifyPassword, generateAccessToken, generateRefreshToken, setAuthCookies } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const schema = z.object({
      email: z.string().email("Invalid email format"),
      password: z.string().min(6, "Password must be at least 6 characters")
    })

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Invalid request format. Please send valid JSON data." },
        { status: 400 }
      )
    }

    // Validate email and password
    const validationResult = schema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(", ")
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // Check required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Connect to database
    try {
      await connectDB()
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json(
        { success: false, error: "Database connection failed. Please try again later." },
        { status: 503 }
      )
    }

    // Find user
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found. Please check your email or register." },
        { status: 404 }
      )
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { success: false, error: "Invalid password. Please try again." },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Your account has been deactivated. Contact the administrator." },
        { status: 403 }
      )
    }

    // Check if account is approved
    if (!user.isApproved && user.role !== "student") {
      return NextResponse.json(
        { success: false, error: "Your account is pending approval from the placement cell." },
        { status: 403 }
      )
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
      message: "Login successful",
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

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed. Please check your input." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
