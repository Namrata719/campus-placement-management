import mongoose, { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "tpo", "company"], required: true },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    refreshToken: { type: String },
}, { timestamps: true })

export const User = models.User || model("User", UserSchema)
