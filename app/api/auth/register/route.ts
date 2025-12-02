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
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        department: z.string().min(1),
        batch: z.string().min(1),
        rollNumber: z.string().min(1),
        phone: z.string().min(10).max(15).optional(),
        cgpa: z.number().optional(),
      }),
      z.object({
        role: z.literal("company"),
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        companyName: z.string().min(1),
        industry: z.string().optional(),
        sector: z.string().optional(),
        phone: z.string().min(10).max(15).optional(),
        designation: z.string().optional(),
      }),
    ])
    const body = schema.parse(await request.json())
    const { email, password, role } = body

    await connectDB()
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 })
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
    if (role === "student" && body.role === "student") {
      const student = new Student({
        userId: user._id,
        firstName: body.firstName,
        lastName: body.lastName,
        email,
        phone: body.phone || "",
        department: body.department,
        batch: body.batch,
        rollNumber: body.rollNumber,
        cgpa: body.cgpa || 0,
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
    } else if (role === "company" && body.role === "company") {
      const company = new Company({
        userId: user._id,
        name: body.companyName,
        industry: body.industry || "Technology",
        sector: body.sector || "Private",
        locations: [],
        contactPerson: {
          name: `${body.firstName || ""} ${body.lastName || ""}`.trim(),
          email,
          phone: body.phone || "",
          designation: body.designation || "",
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
      if (body.role === "student") {
        name = `${body.firstName} ${body.lastName}`
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
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Pending approval from placement cell.",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
