import mongoose, { Schema, model, models } from "mongoose"

const BatchSchema = new Schema({
    year: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
})

export const Batch = models.Batch || model("Batch", BatchSchema)
