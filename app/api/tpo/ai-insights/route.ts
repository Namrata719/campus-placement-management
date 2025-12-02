import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Application } from "@/lib/models/Application"
import { Student } from "@/lib/models/Student"
import { Job } from "@/lib/models/Job"
import { Company } from "@/lib/models/Company"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Mock AI Insights Logic (since we don't have a real AI engine connected)
        // In a real app, this would call an AI service or run complex aggregations

        // 1. Anomaly Detection: High Rejection Rate
        // Find jobs with high application count but low acceptance rate
        const jobs = await Job.find({ status: "active" }).populate("companyId")
        let highRejectionJob = null
        let rejectionRate = 0

        for (const job of jobs) {
            const totalApps = await Application.countDocuments({ jobId: job._id })
            const rejectedApps = await Application.countDocuments({ jobId: job._id, status: "rejected" })

            if (totalApps > 5) { // Threshold
                const rate = (rejectedApps / totalApps) * 100
                if (rate > 70) {
                    highRejectionJob = job
                    rejectionRate = rate
                    break // Just find one for the demo
                }
            }
        }

        const anomalies = []
        if (highRejectionJob) {
            anomalies.push({
                type: "high_rejection",
                title: "High Rejection Rate Detected",
                severity: "warning",
                description: `${highRejectionJob.companyId.name} has rejected ${rejectionRate.toFixed(0)}% of candidates for ${highRejectionJob.title}.`,
                insights: [
                    "Interview questions may be too advanced for fresh graduates",
                    "Mismatch between JD expectations and actual interview difficulty",
                    "Consider requesting the company to share interview topics in advance"
                ]
            })
        }

        // 2. Positive Trend
        // Check if placement rate is better than last year (mock comparison)
        const currentPlaced = await Student.countDocuments({ placementStatus: "placed" })
        const totalStudents = await Student.countDocuments()
        const currentRate = totalStudents > 0 ? (currentPlaced / totalStudents) * 100 : 0

        anomalies.push({
            type: "positive_trend",
            title: "Positive Trend",
            severity: "good",
            description: `Placement rate is currently at ${currentRate.toFixed(1)}%.`,
            insights: [
                "New DSA training program is showing results",
                "More product companies visited this year",
                "Consider replicating training model for other branches"
            ]
        })


        return NextResponse.json({
            success: true,
            data: {
                anomalies
            }
        })

    } catch (error) {
        console.error("Error fetching AI insights:", error)
        return NextResponse.json({ error: "Failed to fetch AI insights" }, { status: 500 })
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

        if (type === "jd_review") {
            // Rule-based JD Review Logic
            const jdText = data.toLowerCase()
            let score = 100
            const analysis = []

            if (!jdText.includes("salary") && !jdText.includes("ctc") && !jdText.includes("package")) {
                score -= 20
                analysis.push({
                    type: "error",
                    title: "Unclear Compensation",
                    description: "Specify a clear CTC range or salary expectations."
                })
            }

            if (!jdText.includes("skills") && !jdText.includes("requirements") && !jdText.includes("technologies")) {
                score -= 20
                analysis.push({
                    type: "warning",
                    title: "Missing Skills Section",
                    description: "Clearly list the required technical skills."
                })
            }

            if (!jdText.includes("responsibilities") && !jdText.includes("role") && !jdText.includes("work")) {
                score -= 10
                analysis.push({
                    type: "warning",
                    title: "Vague Responsibilities",
                    description: "Describe the day-to-day responsibilities."
                })
            }

            if (jdText.length < 100) {
                score -= 30
                analysis.push({
                    type: "error",
                    title: "Too Short",
                    description: "The job description is too brief. Add more details."
                })
            }

            return NextResponse.json({
                success: true,
                data: {
                    score: Math.max(0, score),
                    analysis
                }
            })
        }

        return NextResponse.json({ error: "Invalid request type" }, { status: 400 })

    } catch (error) {
        console.error("Error processing AI request:", error)
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
    }
}
