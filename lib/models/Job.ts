import mongoose, { Schema, model, models } from "mongoose"

const JobSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    roleType: { type: String, enum: ["full-time", "internship", "contract"], required: true },
    ctc: { type: Number },
    stipend: { type: Number },
    currency: { type: String, default: "INR" },
    locations: [{ type: String }],
    workMode: { type: String, enum: ["onsite", "remote", "hybrid"], required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    preferredSkills: [{ type: String }],
    eligibility: {
        branches: [{ type: String }], // Department IDs
        minCgpa: { type: Number, default: 0 },
        maxBacklogs: { type: Number, default: 0 },
        batch: [{ type: String }],
        gender: { type: String, enum: ["male", "female", "any"], default: "any" },
        minTenthPercentage: { type: Number },
        minTwelfthPercentage: { type: Number },
    },
    applicationDeadline: { type: Date, required: true },
    maxApplications: { type: Number },
    status: { type: String, enum: ["draft", "pending_approval", "active", "closed", "cancelled"], default: "draft" },
    approvedBy: { type: String },
    approvedAt: { type: Date },
    applicationsCount: { type: Number, default: 0 },
    shortlistedCount: { type: Number, default: 0 },
    offersCount: { type: Number, default: 0 },
}, { timestamps: true })

export const Job = models.Job || model("Job", JobSchema)
