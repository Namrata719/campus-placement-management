import mongoose, { Schema, model, models } from "mongoose"

const StatusChangeSchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    changedBy: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    remarks: { type: String },
})

const InterviewFeedbackSchema = new Schema({
    round: { type: String, required: true },
    interviewerId: { type: String, required: true },
    rating: { type: Number, required: true },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    comments: { type: String, required: true },
    recommendation: { type: String, enum: ["strong_yes", "yes", "maybe", "no", "strong_no"], required: true },
    submittedAt: { type: Date, default: Date.now },
})

const ApplicationSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    resumeId: { type: String, required: true },
    coverLetter: { type: String },
    status: { type: String, required: true, default: "applied" },
    statusHistory: [StatusChangeSchema],
    aiMatchScore: { type: Number },
    aiAnalysis: {
        strengths: [{ type: String }],
        gaps: [{ type: String }],
        suggestions: [{ type: String }],
    },
    interviewFeedback: [InterviewFeedbackSchema],
    offer: {
        ctc: Number,
        role: String,
        location: String,
        joiningDate: Date,
        offerLetterUrl: String,
        status: { type: String, enum: ["pending", "accepted", "rejected"] },
        respondedAt: Date,
    },
    appliedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const Application = models.Application || model("Application", ApplicationSchema)
