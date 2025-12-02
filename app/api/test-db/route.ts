import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"

export async function GET() {
    try {
        await connectDB()
        return NextResponse.json({ success: true, message: "MongoDB connection successful!" })
    } catch (error: any) {
        console.error("MongoDB connection error:", error)
        return NextResponse.json({
            success: false,
            error: error.message || "MongoDB connection failed",
            details: error.toString()
        }, { status: 500 })
    }
}
