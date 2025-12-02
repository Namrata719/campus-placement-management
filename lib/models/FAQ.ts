import mongoose, { Schema, model, models } from "mongoose"

const FAQSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
}, { timestamps: true })

export const FAQ = models.FAQ || model("FAQ", FAQSchema)
