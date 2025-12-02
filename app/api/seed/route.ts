import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Student } from "@/lib/models/Student"
import { Company } from "@/lib/models/Company"
import { Job } from "@/lib/models/Job"
import { hashPassword } from "@/lib/auth"

export async function GET() {
    try {
        await connectDB()
        console.log("✓ Connected to MongoDB")

        // Clear existing data
        await User.deleteMany({})
        await Student.deleteMany({})
        await Company.deleteMany({})
        await Job.deleteMany({})
        console.log("✓ Cleared existing data")

        // 1. Create TPO User
        const tpoUser = await User.create({
            email: "tpo@college.edu",
            password: hashPassword("tpo123"),
            role: "tpo",
            isApproved: true,
            isActive: true,
        })
        console.log("✓ Created TPO user")

        // 2. Create Company User & Profile
        const companyUser = await User.create({
            email: "google@tech.com",
            password: hashPassword("company123"),
            role: "company",
            isApproved: true,
            isActive: true,
        })

        const company = await Company.create({
            userId: companyUser._id,
            name: "Google",
            industry: "Technology",
            sector: "Software",
            locations: ["Bangalore"],
            website: "https://google.com",
            description: "Organizing the world's information.",
            contactPerson: {
                name: "HR Manager",
                email: "hr@google.com",
                phone: "9876543210",
                designation: "HR",
            },
            isApproved: true,
        })
        console.log("✓ Created Google company")

        // 3. Create Student User & Profile
        const studentUser = await User.create({
            email: "student@college.edu",
            password: hashPassword("student123"),
            role: "student",
            isApproved: true,
            isActive: true,
        })

        const student = await Student.create({
            userId: studentUser._id,
            firstName: "Amit",
            lastName: "Kumar",
            email: "student@college.edu",
            phone: "9876543212",
            department: "dept-cse",
            batch: "2024",
            rollNumber: "CSE2024001",
            cgpa: 8.5,
            backlogs: 0,
            tenthPercentage: 92,
            twelfthPercentage: 89,
            skills: ["JavaScript", "React", "Node.js", "Python"],
            placementStatus: "unplaced",
            isEligible: true,
        })
        console.log("✓ Created Student")

        // 4. Create Job
        const job = await Job.create({
            companyId: company._id,
            title: "Software Engineer",
            description: "Join our core engineering team.",
            roleType: "full-time",
            workMode: "hybrid",
            locations: ["Bangalore"],
            ctc: 2500000,
            eligibility: {
                minCgpa: 8.0,
                maxBacklogs: 0,
                branches: ["dept-cse", "dept-it"],
                batch: ["2024"],
            },
            preferredSkills: ["React", "Node.js"],
            applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: "active",
            applicationsCount: 0,
        })
        console.log("✓ Created Job")

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully!",
            accounts: [
                { role: "TPO", email: "tpo@college.edu", password: "tpo123" },
                { role: "Company", email: "google@tech.com", password: "company123" },
                { role: "Student", email: "student@college.edu", password: "student123" },
            ],
        })
    } catch (error: any) {
        console.error("Seeding error:", error)
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                stack: error.stack
            },
            { status: 500 }
        )
    }
}
