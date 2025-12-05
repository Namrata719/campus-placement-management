import { NextRequest, NextResponse } from "next/server"
import { sendCustomMessage } from "@/lib/mail"
import { verifyAuth } from "@/lib/auth"

export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { to, subject, message, type } = body

        if (!to || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Use the dedicated custom message function
        const success = await sendCustomMessage(to, subject, message)

        if (success) {
            return NextResponse.json({ success: true, message: "Email sent successfully" })
        } else {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
        }

    } catch (error) {
        console.error("Error in send-email API:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
