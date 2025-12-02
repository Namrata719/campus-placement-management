import mongoose, { Schema, model, models } from "mongoose"

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    url: { type: String },
    githubUrl: { type: String },
})

const InternshipSchema = new Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    location: { type: String },
})

const CertificationSchema = new Schema({
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    credentialId: { type: String },
    url: { type: String },
})

const ResumeSchema = new Schema({
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    parsedData: {
        extractedSkills: [{ type: String }],
        extractedExperience: [{ type: String }],
        extractedEducation: [{ type: String }],
        suggestions: [{ type: String }],
    },
    aiScore: { type: Number },
})

const StudentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    dateOfBirth: { type: Date },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
    },
    profileImage: { type: String },
    department: { type: String, required: true },
    batch: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    cgpa: { type: Number, required: true },
    backlogs: { type: Number, required: true },
    tenthPercentage: { type: Number, required: true },
    twelfthPercentage: { type: Number, required: true },
    skills: [{ type: String }],
    projects: [ProjectSchema],
    internships: [InternshipSchema],
    certifications: [CertificationSchema],
    achievements: [{ type: String }],
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    portfolioUrl: { type: String },
    resumes: [ResumeSchema],
    activeResumeId: { type: String },
    placementStatus: { type: String, enum: ["unplaced", "placed", "not_interested"], default: "unplaced" },
    currentOffer: {
        companyId: String,
        jobId: String,
        ctc: Number,
        joiningStatus: { type: String, enum: ["pending", "accepted", "rejected", "joined"] },
    },
    isEligible: { type: Boolean, default: true },
    eligibilityRemarks: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true })

export const Student = models.Student || model("Student", StudentSchema)
