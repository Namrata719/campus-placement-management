import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Student } from "@/lib/models/Student"
import { Company } from "@/lib/models/Company"
import { Job } from "@/lib/models/Job"
import { Application } from "@/lib/models/Application"
import { PlacementEvent } from "@/lib/models/PlacementEvent"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Stats
        const totalStudents = await Student.countDocuments()
        const totalCompanies = await Company.countDocuments({ isApproved: true })
        const activeJobs = await Job.countDocuments({ status: "active" })
        const placedStudents = await Student.countDocuments({ placementStatus: "placed" })
        const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0

        // Branch-wise Stats
        const branches = ["CSE", "ECE", "ME", "EE", "CE", "IT"]
        const branchWiseStats = await Promise.all(branches.map(async (branch) => {
            const total = await Student.countDocuments({ department: `dept-${branch.toLowerCase()}` })
            const placed = await Student.countDocuments({ department: `dept-${branch.toLowerCase()}`, placementStatus: "placed" })
            const percentage = total > 0 ? Math.round((placed / total) * 100) : 0
            return { branch, total, placed, percentage }
        }))

        // Top Recruiting Companies (Mock logic for now as we need offer data)
        // We will count accepted applications per company
        const topCompaniesAgg = await Application.aggregate([
            { $match: { status: "accepted" } },
            { $group: { _id: "$companyId", offers: { $sum: 1 } } },
            { $sort: { offers: -1 } },
            { $limit: 5 }
        ])

        const topCompanies = await Promise.all(topCompaniesAgg.map(async (item) => {
            const company = await Company.findById(item._id).select("name")
            return {
                name: company ? company.name : "Unknown",
                offers: item.offers,
                avgCtc: "N/A" // Placeholder
            }
        }))

        // Pending Approvals
        const pendingCompanies = await Company.find({ isApproved: false }).limit(3).select("name createdAt")
        const pendingJobs = await Job.find({ status: "pending" }).limit(3).populate("companyId", "name").select("title createdAt")

        const pendingApprovals = [
            ...pendingCompanies.map((c: any) => ({ id: c._id, name: c.name, type: "company", date: c.createdAt })),
            ...pendingJobs.map((j: any) => ({ id: j._id, name: `${j.title} at ${j.companyId?.name}`, type: "job", date: j.createdAt }))
        ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)


        // Upcoming Events
        const upcomingEvents = await PlacementEvent.find({ startTime: { $gte: new Date() } })
            .sort({ startTime: 1 })
            .limit(3)
            .lean()

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    totalStudents,
                    totalCompanies,
                    activeJobs,
                    placementRate
                },
                branchWiseStats,
                topCompanies,
                pendingApprovals,
                upcomingEvents
            }
        })

    } catch (error) {
        console.error("Error fetching TPO dashboard:", error)
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
    }
}
