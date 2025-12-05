import mongoose, { Schema, model, models } from "mongoose"

const FeedbackSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    experienceType: { type: String, enum: ["excellent", "good", "average", "poor"], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    processDescription: { type: String, required: true },
    tips: { type: String },
    additionalComments: { type: String },
    isAnonymous: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true })

export const Feedback = models.Feedback || model("Feedback", FeedbackSchema)
