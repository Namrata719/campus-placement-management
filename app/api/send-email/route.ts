import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"
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

        const result = await sendEmail({
            to,
            subject,
            text: message,
            html: `<p>${message}</p>` // Basic HTML wrapper
        })

        if (result.success) {
            return NextResponse.json({ success: true, message: "Email sent successfully" })
        } else {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
        }

    } catch (error) {
        console.error("Error in send-email API:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
