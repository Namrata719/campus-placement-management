import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Company } from "@/lib/models/Company"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: company })
    } catch (error) {
        console.error("Error fetching company profile:", error)
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        await connectDB()

        const updatedCompany = await Company.findOneAndUpdate(
            { userId },
            {
                $set: {
                    name: body.name,
                    industry: body.industry,
                    website: body.website,
                    description: body.description,
                    employeeCount: body.employeeCount,
                    locations: Array.isArray(body.locations) ? body.locations : body.locations.split(",").map((l: string) => l.trim()),
                    contactPerson: body.contactPerson,
                    logo: body.logo
                }
            },
            { new: true }
        )

        if (!updatedCompany) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: updatedCompany })
    } catch (error) {
        console.error("Error updating company profile:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
