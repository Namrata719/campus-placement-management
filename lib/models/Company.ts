import mongoose, { Schema, model, models } from "mongoose"

const CompanySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    website: { type: String },
    industry: { type: String, required: true },
    sector: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    locations: [{ type: String }],
    employeeCount: { type: String },
    foundedYear: { type: Number },
    contactPerson: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        designation: { type: String, required: true },
    },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: String }, // TPO userId
    approvedAt: { type: Date },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true })

export const Company = models.Company || model("Company", CompanySchema)
