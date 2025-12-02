import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Student } from "@/lib/models/Student"
import { Application } from "@/lib/models/Application"
import { Company } from "@/lib/models/Company"
import { Job } from "@/lib/models/Job"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Key Metrics
        const totalStudents = await Student.countDocuments()
        const placedStudents = await Student.countDocuments({ placementStatus: "placed" })
        const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0

        // Calculate Avg and Highest CTC from Jobs where students are placed
        // This is an approximation. Ideally, we should store offer details.
        // For now, we'll fetch accepted applications and their associated jobs.
        const acceptedApps = await Application.find({ status: "accepted" }).populate("jobId")

        let totalCTC = 0
        let highestCTC = 0
        let offerCount = acceptedApps.length

        acceptedApps.forEach((app: any) => {
            if (app.jobId && app.jobId.ctc) {
                const ctc = app.jobId.ctc
                totalCTC += ctc
                if (ctc > highestCTC) highestCTC = ctc
            }
        })

        const avgCTC = offerCount > 0 ? (totalCTC / offerCount).toFixed(1) : 0

        // Companies visited (approved companies)
        const companiesVisited = await Company.countDocuments({ isApproved: true })

        // Branch-wise Data
        const branches = ["CSE", "ECE", "ME", "EE", "CE", "IT"]
        const branchWiseData = await Promise.all(branches.map(async (branch) => {
            const total = await Student.countDocuments({ department: `dept-${branch.toLowerCase()}` })
            const placed = await Student.countDocuments({ department: `dept-${branch.toLowerCase()}`, placementStatus: "placed" })

            // Calculate avg CTC for this branch
            // Simplified: 0 for now as it requires complex aggregation
            return {
                branch,
                placed,
                total,
                avgCTC: 0,
                highestCTC: 0
            }
        }))

        // Top Recruiters
        // Aggregate applications to find companies with most accepted offers
        const topRecruitersAgg = await Application.aggregate([
            { $match: { status: "accepted" } },
            { $group: { _id: "$companyId", offers: { $sum: 1 } } },
            { $sort: { offers: -1 } },
            { $limit: 5 }
        ])

        const topRecruiters = await Promise.all(topRecruitersAgg.map(async (item) => {
            const company = await Company.findById(item._id).select("name")
            return {
                company: company ? company.name : "Unknown",
                offers: item.offers,
                avgCTC: 0, // Placeholder
                roles: [] // Placeholder
            }
        }))

        return NextResponse.json({
            success: true,
            data: {
                metrics: {
                    totalStudents,
                    placedStudents,
                    placementRate,
                    avgCTC,
                    highestCTC,
                    companiesVisited
                },
                branchWiseData,
                topRecruiters
            }
        })

    } catch (error) {
        console.error("Error fetching reports:", error)
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
    }
}
