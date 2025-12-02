import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Student } from "@/lib/models/Student"
import { Company } from "@/lib/models/Company"
import { User } from "@/lib/models/User"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const { searchParams } = new URL(req.url)
        const branch = searchParams.get("branch")
        const status = searchParams.get("status")
        const search = searchParams.get("search")

        let query: any = {}

        if (branch && branch !== "all") {
            query.department = branch
        }

        if (status && status !== "all") {
            query.status = status
        }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { rollNumber: { $regex: search, $options: "i" } },
            ]
        }

        const students = await Student.find(query).sort({ createdAt: -1 }).lean()

        // Fetch company names for placed students
        const companyIds = students
            .filter((s: any) => s.currentOffer?.companyId)
            .map((s: any) => s.currentOffer.companyId)

        const companies = await Company.find({ _id: { $in: companyIds } }).lean()
        const companyMap = new Map(companies.map((c: any) => [c._id.toString(), c.name]))

        const formattedStudents = students.map((s: any) => ({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            email: s.email,
            rollNo: s.rollNumber,
            branch: s.department,
            batch: s.batch,
            cgpa: s.cgpa,
            backlogs: s.backlogs,
            status: s.status || "pending",
            placementStatus: s.placementStatus,
            company: s.currentOffer?.companyId ? companyMap.get(s.currentOffer.companyId.toString()) : null,
            ctc: s.currentOffer?.ctc ? `${s.currentOffer.ctc} LPA` : null,
        }))

        return NextResponse.json({ success: true, data: formattedStudents })
    } catch (error) {
        console.error("Error fetching students:", error)
        return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const body = await req.json()
        const { students } = body

        if (!students || !Array.isArray(students)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
        }

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        }

        for (const studentData of students) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ email: studentData.email })
                if (existingUser) {
                    results.failed++
                    results.errors.push(`User with email ${studentData.email} already exists`)
                    continue
                }

                // Create User
                const hashedPassword = await bcrypt.hash("Student@123", 10)
                const newUser = await User.create({
                    email: studentData.email,
                    password: hashedPassword,
                    role: "student",
                    isApproved: true
                })

                // Create Student
                await Student.create({
                    userId: newUser._id,
                    firstName: studentData.firstName,
                    lastName: studentData.lastName,
                    email: studentData.email,
                    phone: studentData.phone || "0000000000",
                    department: studentData.department,
                    batch: studentData.batch,
                    rollNumber: studentData.rollNumber,
                    cgpa: parseFloat(studentData.cgpa) || 0,
                    backlogs: parseInt(studentData.backlogs) || 0,
                    tenthPercentage: parseFloat(studentData.tenthPercentage) || 0,
                    twelfthPercentage: parseFloat(studentData.twelfthPercentage) || 0,
                    status: "approved"
                })

                results.success++
            } catch (err: any) {
                results.failed++
                results.errors.push(`Failed to import ${studentData.email}: ${err.message}`)
            }
        }

        return NextResponse.json({ success: true, results })

    } catch (error) {
        console.error("Error importing students:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
        const { studentIds, status } = body

        if (!studentIds || !Array.isArray(studentIds) || !status) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        await Student.updateMany(
            { _id: { $in: studentIds } },
            { $set: { status } }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating students:", error)
        return NextResponse.json({ error: "Failed to update students" }, { status: 500 })
    }
}
