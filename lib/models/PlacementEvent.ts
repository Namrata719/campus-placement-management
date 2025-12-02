import mongoose, { Schema, model, models } from "mongoose"

const PlacementEventSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    title: { type: String, required: true },
    type: { type: String, enum: ["ppt", "online_test", "gd", "technical_interview", "hr_interview", "other"], required: true },
    description: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    mode: { type: String, enum: ["online", "offline"], required: true },
    venue: { type: String },
    meetingLink: { type: String },
    eligibleStudents: [{ type: String }], // Student IDs
    registeredStudents: [{ type: String }],
    attendedStudents: [{ type: String }],
    status: { type: String, enum: ["scheduled", "ongoing", "completed", "cancelled"], default: "scheduled" },
    createdBy: { type: String, required: true },
}, { timestamps: true })

export const PlacementEvent = models.PlacementEvent || model("PlacementEvent", PlacementEventSchema)
