import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Application } from "@/lib/models/Application"
import { Student } from "@/lib/models/Student"
import { Job } from "@/lib/models/Job"
import { Company } from "@/lib/models/Company"
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

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
            try {
                const { object } = await generateObject({
                    model: google("gemini-1.5-flash"),
                    schema: z.object({
                        description: z.string(),
                        insights: z.array(z.string()),
                        severity: z.enum(["warning", "critical", "good"])
                    }),
                    prompt: `Analyze this high rejection rate scenario:
                    Company: ${highRejectionJob.companyId.name}
                    Job: ${highRejectionJob.title}
                    Rejection Rate: ${rejectionRate.toFixed(1)}%
                    
                    Provide:
                    1. A professional description of the issue.
                    2. 3 actionable insights/recommendations for the TPO to improve this.
                    3. Severity level (warning or critical).`
                })

                anomalies.push({
                    type: "high_rejection",
                    title: "High Rejection Rate Detected",
                    severity: object.severity,
                    description: object.description,
                    insights: object.insights
                })
            } catch (e) {
                // Fallback if AI fails
                anomalies.push({
                    type: "high_rejection",
                    title: "High Rejection Rate Detected",
                    severity: "warning",
                    description: `${highRejectionJob.companyId.name} has rejected ${rejectionRate.toFixed(0)}% of candidates for ${highRejectionJob.title}.`,
                    insights: ["Check interview difficulty", "Review student preparation", "Contact company HR"]
                })
            }
        }

        // 2. Positive Trend
        // Check if placement rate is better than last year (mock comparison)
        const currentPlaced = await Student.countDocuments({ placementStatus: "placed" })
        const totalStudents = await Student.countDocuments()
        const currentRate = totalStudents > 0 ? (currentPlaced / totalStudents) * 100 : 0

        try {
            const { object } = await generateObject({
                model: google("gemini-1.5-flash"),
                schema: z.object({
                    description: z.string(),
                    insights: z.array(z.string())
                }),
                prompt: `Analyze this placement trend:
                Current Placement Rate: ${currentRate.toFixed(1)}%
                Context: This is a positive trend compared to last year.
                
                Provide:
                1. A celebratory description.
                2. 3 insights on why this might be happening (e.g., better training, more companies).`
            })

            anomalies.push({
                type: "positive_trend",
                title: "Positive Placement Trend",
                severity: "good",
                description: object.description,
                insights: object.insights
            })
        } catch (e) {
            anomalies.push({
                type: "positive_trend",
                title: "Positive Trend",
                severity: "good",
                description: `Placement rate is currently at ${currentRate.toFixed(1)}%.`,
                insights: ["Improved student skills", "Better market conditions", "More company visits"]
            })
        }


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
    } catch (error) {
        console.error("Error processing AI request:", error)
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
    }

    const body = await req.json()
    const { type, data } = body

    if (type === "jd_review") {
        const jdText = data

        try {
            const { object } = await generateObject({
                model: google("gemini-1.5-flash"),
                schema: z.object({
                    score: z.number(),
                    analysis: z.array(z.object({
                        type: z.enum(["error", "warning", "good"]),
                        title: z.string(),
                        description: z.string()
                    }))
                }),
                prompt: `Review this Job Description (JD) and provide a score (0-100) and analysis points.
                JD Content: "${jdText}"
                
                Rules:
                - Check for clarity, missing sections (salary, skills, roles), and bias.
                - 'error' for critical missing info.
                - 'warning' for vague info.
                - 'good' for well-written parts.`
            })

            return NextResponse.json({
                success: true,
                data: object
            })
        } catch (e) {
            // Fallback
            return NextResponse.json({
                success: true,
                data: {
                    score: 70,
                    analysis: [{ type: "warning", title: "AI Unavailable", description: "Using fallback analysis." }]
                }
            })
        }
    }

    if (type === "generate_report") {
        const { year } = data

        try {
            // Mock data gathering for the prompt
            const totalStudents = await Student.countDocuments()
            const placedStudents = await Student.countDocuments({ placementStatus: "placed" })
            const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0

            const { object } = await generateObject({
                model: google("gemini-1.5-flash"),
                schema: z.object({
                    summary: z.string(),
                    highlights: z.array(z.string()),
                    recommendations: z.array(z.string())
                }),
                prompt: `Generate a placement report summary for the year ${year}.
                
                Data:
                - Total Students: ${totalStudents}
                - Placed Students: ${placedStudents}
                - Placement Rate: ${placementRate}%
                
                Provide:
                1. An executive summary of the placement season.
                2. Key highlights (bullet points).
                3. Strategic recommendations for the next year.`
            })

            return NextResponse.json({
                success: true,
                data: object
            })
        } catch (e) {
            return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
        }
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
}
