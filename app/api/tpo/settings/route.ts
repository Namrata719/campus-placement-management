import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Student } from "@/lib/models/Student"

// Mock settings storage (in a real app, this would be in a DB)
let instituteSettings = {
    name: "National Institute of Technology",
    code: "NIT-001",
    location: "New Delhi, India",
    website: "https://nit.edu.in",
    address: "123 University Road, New Delhi - 110001",
    tpoEmail: "tpo@nit.edu.in",
    tpoPhone: "+91 11 2345 6789",
    academicYear: "2024-25",
    currentBatch: "2025"
}

let departments = [
    { id: "1", name: "Computer Science", code: "CSE", students: 160 },
    { id: "2", name: "Information Technology", code: "IT", students: 95 },
    { id: "3", name: "Electronics & Communication", code: "ECE", students: 120 },
    { id: "4", name: "Electrical Engineering", code: "EE", students: 90 },
    { id: "5", name: "Mechanical Engineering", code: "ME", students: 100 },
    { id: "6", name: "Civil Engineering", code: "CE", students: 70 },
]

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Fetch actual student counts for departments
        const updatedDepartments = await Promise.all(departments.map(async (dept) => {
            const count = await Student.countDocuments({ department: `dept-${dept.code.toLowerCase()}` })
            return { ...dept, students: count }
        }))

        return NextResponse.json({
            success: true,
            data: {
                institute: instituteSettings,
                departments: updatedDepartments
            }
        })

    } catch (error) {
        console.error("Error fetching settings:", error)
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { type, data } = body

        if (type === "institute") {
            instituteSettings = { ...instituteSettings, ...data }
            return NextResponse.json({ success: true, data: instituteSettings })
        } else if (type === "department_add") {
            const newDept = {
                id: Date.now().toString(),
                name: data.name,
                code: data.code,
                students: 0
            }
            departments.push(newDept)
            return NextResponse.json({ success: true, data: departments })
        } else if (type === "department_remove") {
            departments = departments.filter(d => d.id !== data.id)
            return NextResponse.json({ success: true, data: departments })
        }

        return NextResponse.json({ error: "Invalid request type" }, { status: 400 })

    } catch (error) {
        console.error("Error updating settings:", error)
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }
}
