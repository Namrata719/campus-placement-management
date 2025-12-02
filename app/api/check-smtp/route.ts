import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    // Check which environment variables are set
    const smtpConfig = {
        SMTP_HOST: !!process.env.SMTP_HOST,
        SMTP_PORT: !!process.env.SMTP_PORT,
        SMTP_USER: !!process.env.SMTP_USER,
        SMTP_PASS: !!process.env.SMTP_PASS,
        SMTP_FROM: !!process.env.SMTP_FROM,
        // Show actual values (masked for security)
        host: process.env.SMTP_HOST || 'NOT SET',
        port: process.env.SMTP_PORT || 'NOT SET',
        user: process.env.SMTP_USER ? process.env.SMTP_USER.substring(0, 3) + '***@***' : 'NOT SET',
        hasPassword: !!process.env.SMTP_PASS
    }

    const mode = process.env.SMTP_HOST ? 'SMTP CONFIGURED - Real Emails' : 'MOCK MODE - Console Only'

    return NextResponse.json({
        mode,
        configured: !!process.env.SMTP_HOST,
        details: smtpConfig
    })
}
