import mongoose, { Schema, model, models } from "mongoose"

const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "success", "warning", "error"], default: "info" },
    category: { type: String, enum: ["application", "event", "announcement", "system"], required: true },
    referenceType: { type: String, enum: ["job", "application", "event", "company"] },
    referenceId: { type: String },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
}, { timestamps: true })

export const Notification = models.Notification || model("Notification", NotificationSchema)
