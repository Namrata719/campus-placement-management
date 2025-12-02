import mongoose, { Schema, model, models } from "mongoose"

const DepartmentSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
})

export const Department = models.Department || model("Department", DepartmentSchema)
