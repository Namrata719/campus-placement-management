import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Student } from "@/lib/models/Student"
import { Company } from "@/lib/models/Company"
import { z } from "zod"
import { hashPassword, generateAccessToken, generateRefreshToken, setAuthCookies } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const schema = z.discriminatedUnion("role", [
      z.object({
        role: z.literal("student"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        department: z.string().min(1, "Department is required"),
        batch: z.string().min(1, "Batch is required"),
        rollNumber: z.string().min(1, "Roll number is required"),
        phone: z.string().min(10, "Phone number must be at least 10 digits").max(15).optional(),
        cgpa: z.number().optional(),
      }),
      z.object({
        role: z.literal("company"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        companyName: z.string().min(1, "Company name is required"),
        industry: z.string().optional(),
        sector: z.string().optional(),
        phone: z.string().min(10, "Phone number must be at least 10 digits").max(15).optional(),
        designation: z.string().optional(),
      }),
    ])

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Invalid request format. Please send valid JSON data." },
        { status: 400 }
      )
    }

    // Validate request body
    const validationResult = schema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(", ")
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      )
    }

    const validatedBody = validationResult.data
    const { email, password, role } = validatedBody

    // Check required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Email, password, and role are required" },
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

    // Check if user already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists. Please login instead." },
        { status: 409 }
      )
    }

    // For students, check if roll number exists
    if (role === "student" && validatedBody.role === "student") {
      const existingStudent = await Student.findOne({ rollNumber: validatedBody.rollNumber })
      if (existingStudent) {
        return NextResponse.json(
          { success: false, error: "A student with this roll number already exists." },
          { status: 409 }
        )
      }
    }

    // Create user
    const user = new User({
      email,
      password: hashPassword(password),
      role,
      isApproved: role === "student", // Students are auto-approved, companies need TPO approval
      isActive: true,
    })
    await user.save()

    // Create role-specific profile
    if (role === "student" && validatedBody.role === "student") {
      const student = new Student({
        userId: user._id,
        firstName: validatedBody.firstName,
        lastName: validatedBody.lastName,
        email,
        phone: validatedBody.phone || "",
        department: validatedBody.department,
        batch: validatedBody.batch,
        rollNumber: validatedBody.rollNumber,
        cgpa: validatedBody.cgpa || 0,
        backlogs: 0,
        tenthPercentage: 0,
        twelfthPercentage: 0,
        skills: [],
        projects: [],
        internships: [],
        certifications: [],
        achievements: [],
        resumes: [],
        placementStatus: "unplaced",
        isEligible: true,
      })
      await student.save()
    } else if (role === "company" && validatedBody.role === "company") {
      const company = new Company({
        userId: user._id,
        name: validatedBody.companyName,
        industry: validatedBody.industry || "Technology",
        sector: validatedBody.sector || "Private",
        locations: [],
        contactPerson: {
          name: `${validatedBody.firstName || ""} ${validatedBody.lastName || ""}`.trim(),
          email,
          phone: validatedBody.phone || "",
          designation: validatedBody.designation || "",
        },
        isApproved: false,
      })
      await company.save()
    }

    // For students, auto-login
    if (role === "student") {
      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      }

      const accessToken = await generateAccessToken(tokenPayload)
      const refreshToken = await generateRefreshToken(tokenPayload)

      user.refreshToken = refreshToken
      await user.save()

      await setAuthCookies(accessToken, refreshToken)

      let name = "User"
      if (validatedBody.role === "student") {
        name = `${validatedBody.firstName} ${validatedBody.lastName}`
      }

      return NextResponse.json({
        success: true,
        message: "Registration successful. Welcome!",
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
          name,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Your account is pending approval from the placement cell.",
    })
  } catch (error) {
    console.error("Registration error:", error)

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed. Please check your input." },
        { status: 400 }
      )
    }

    // Handle mongoose duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Email or Roll Number already exists." },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during registration. Please try again later." },
      { status: 500 }
    )
  }
}
