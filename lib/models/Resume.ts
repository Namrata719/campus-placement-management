import mongoose from "mongoose"

const ResumeSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        aiScore: {
            type: Number,
            default: 0,
        },
        analysis: {
            strengths: [String],
            improvements: [String],
            missingSkills: [String],
        },
    },
    {
        timestamps: true,
    }
)

export const Resume = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema)
