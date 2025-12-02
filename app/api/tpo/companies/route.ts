import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Company } from "@/lib/models/Company"
import { Job } from "@/lib/models/Job"
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
        const status = searchParams.get("status")
        const search = searchParams.get("search")

        let query: any = {}

        if (status && status !== "all") {
            query.status = status
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { industry: { $regex: search, $options: "i" } },
            ]
        }

        const companies = await Company.find(query).sort({ createdAt: -1 }).lean()

        const formattedCompanies = await Promise.all(companies.map(async (c: any) => {
            let activeJobs = 0
            try {
                activeJobs = await Job.countDocuments({ companyId: c._id, status: "active" })
            } catch (e) {
                // Job model might not be ready or other error
            }

            return {
                id: c._id,
                name: c.name,
                website: c.website || "",
                industry: c.industry,
                location: c.locations?.[0] || "N/A",
                status: c.status || "pending",
                contactPerson: c.contactPerson?.name || "N/A",
                contactEmail: c.contactPerson?.email || "N/A",
                contactPhone: c.contactPerson?.phone || "N/A",
                activeJobs: activeJobs,
                totalHires: 0,
                avgCTC: "-",
                registeredAt: c.createdAt
            }
        }))

        return NextResponse.json({ success: true, data: formattedCompanies })
    } catch (error) {
        console.error("Error fetching companies:", error)
        return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
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

        // Check if user already exists
        const existingUser = await User.findOne({ email: body.contactEmail })
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
        }

        // Create User
        const hashedPassword = await bcrypt.hash("Company@123", 10)
        const newUser = await User.create({
            email: body.contactEmail,
            password: hashedPassword,
            role: "company",
            isApproved: true
        })

        // Create Company
        await Company.create({
            userId: newUser._id,
            name: body.name,
            website: body.website,
            industry: body.industry,
            sector: body.industry, // Defaulting to industry
            locations: [body.location],
            contactPerson: {
                name: body.contactPerson,
                email: body.contactEmail,
                phone: body.contactPhone,
                designation: "HR"
            },
            status: "approved",
            isApproved: true,
            approvedBy: userId,
            approvedAt: new Date()
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error adding company:", error)
        return NextResponse.json({ error: "Failed to add company" }, { status: 500 })
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
        const { companyId, status } = body

        if (!companyId || !status) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        await Company.findByIdAndUpdate(companyId, {
            status,
            isApproved: status === "approved",
            approvedBy: userId,
            approvedAt: new Date()
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating company:", error)
        return NextResponse.json({ error: "Failed to update company" }, { status: 500 })
    }
}
