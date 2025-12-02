import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { Resume } from "@/lib/models/Resume"
import { Student } from "@/lib/models/Student"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

// GET: Fetch student's resumes
export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const student = await Student.findOne({ userId }).lean()
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        const resumes = await Resume.find({ studentId: student._id }).sort({ createdAt: -1 }).lean()

        const transformedResumes = resumes.map((r: any) => ({
            id: r._id.toString(),
            name: r.fileName,
            uploadedAt: r.createdAt,
            isActive: r.isActive,
            aiScore: r.aiScore || 0,
            fileUrl: r.fileUrl,
            fileSize: r.fileSize,
            analysis: r.analysis || {
                strengths: [],
                improvements: [],
                missingSkills: [],
            },
        }))

        return NextResponse.json({
            success: true,
            resumes: transformedResumes,
        })
    } catch (error: any) {
        console.error("Error fetching resumes:", error)
        return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 })
    }
}

// POST: Upload new resume
export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Only PDF and DOC files are allowed" }, { status: 400 })
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
        }

        await connectDB()

        const student = await Student.findOne({ userId })
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes")
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const ext = file.name.split(".").pop()
        const fileName = `${student._id}_${timestamp}.${ext}`
        const filePath = path.join(uploadsDir, fileName)

        // Save file
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        // Simulate AI analysis (in production, use actual AI service)
        const aiScore = Math.floor(Math.random() * 30) + 70 // 70-100
        const analysis = {
            strengths: [
                "Clear and structured format",
                "Relevant technical skills listed",
                "Good project descriptions",
            ],
            improvements: [
                "Add more quantifiable achievements",
                "Include leadership experiences",
                "Optimize keywords for ATS",
            ],
            missingSkills: ["Docker", "Kubernetes", "System Design"],
        }

        // Create resume record
        const resume = await Resume.create({
            studentId: student._id,
            userId,
            fileName: file.name,
            fileUrl: `/uploads/resumes/${fileName}`,
            fileSize: file.size,
            fileType: file.type,
            isActive: false,
            aiScore,
            analysis,
        })

        return NextResponse.json({
            success: true,
            message: "Resume uploaded and analyzed successfully!",
            resume: {
                id: resume._id.toString(),
                name: resume.fileName,
                uploadedAt: resume.createdAt,
                isActive: resume.isActive,
                aiScore: resume.aiScore,
                analysis: resume.analysis,
            },
        })
    } catch (error: any) {
        console.error("Error uploading resume:", error)
        return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 })
    }
}

// PUT: Update resume (set active, re-analyze, etc.)
export async function PUT(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { resumeId, action } = await req.json()

        await connectDB()

        const student = await Student.findOne({ userId })
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        const resume = await Resume.findOne({ _id: resumeId, studentId: student._id })
        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 })
        }

        if (action === "set_active") {
            // Deactivate all other resumes
            await Resume.updateMany({ studentId: student._id }, { isActive: false })

            // Set this one as active
            resume.isActive = true
            await resume.save()

            return NextResponse.json({
                success: true,
                message: "Active resume updated",
            })
        }

        if (action === "re_analyze") {
            // Simulate re-analysis
            const aiScore = Math.floor(Math.random() * 30) + 70
            resume.aiScore = aiScore
            resume.analysis = {
                strengths: [
                    "Improved formatting detected",
                    "Strong technical background",
                    "Clear communication",
                ],
                improvements: [
                    "Consider adding certifications",
                    "Expand on team collaboration",
                ],
                missingSkills: ["Cloud platforms", "CI/CD tools"],
            }
            await resume.save()

            return NextResponse.json({
                success: true,
                message: "Resume re-analyzed successfully",
                aiScore: resume.aiScore,
                analysis: resume.analysis,
            })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (error: any) {
        console.error("Error updating resume:", error)
        return NextResponse.json({ error: "Failed to update resume" }, { status: 500 })
    }
}

// DELETE: Delete resume
export async function DELETE(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const resumeId = searchParams.get("id")

        if (!resumeId) {
            return NextResponse.json({ error: "Resume ID required" }, { status: 400 })
        }

        await connectDB()

        const student = await Student.findOne({ userId })
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        const resume = await Resume.findOne({ _id: resumeId, studentId: student._id })
        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 })
        }

        // Don't allow deleting active resume if it's the only one
        if (resume.isActive) {
            const count = await Resume.countDocuments({ studentId: student._id })
            if (count === 1) {
                return NextResponse.json(
                    { error: "Cannot delete your only active resume" },
                    { status: 400 }
                )
            }
        }

        await Resume.deleteOne({ _id: resumeId })

        return NextResponse.json({
            success: true,
            message: "Resume deleted successfully",
        })
    } catch (error: any) {
        console.error("Error deleting resume:", error)
        return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 })
    }
}
