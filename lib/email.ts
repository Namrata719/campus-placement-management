import nodemailer from 'nodemailer';

// Create a transporter using environment variables or defaults for testing
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || "test_user",
        pass: process.env.SMTP_PASS || "test_pass",
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
    try {
        // In a real development environment without SMTP, we might just log it
        if (!process.env.SMTP_HOST) {
            console.log("---------------------------------------------------");
            console.log(`[MOCK EMAIL] To: ${to}`);
            console.log(`[MOCK EMAIL] Subject: ${subject}`);
            console.log(`[MOCK EMAIL] Body: ${text || html}`);
            console.log("---------------------------------------------------");
            return { success: true, message: "Mock email sent (check console)" };
        }

        // SMTP is configured - sending real email
        console.log(`[SMTP] Sending email to: ${to}`);
        console.log(`[SMTP] Subject: ${subject}`);
        console.log(`[SMTP] Using SMTP server: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Campus Placement" <noreply@campus.edu>',
            to,
            subject,
            text,
            html,
        });

        console.log("✅ [SMTP] Email sent successfully!");
        console.log(`✅ [SMTP] Message ID: ${info.messageId}`);
        console.log(`✅ [SMTP] Recipient: ${to}`);

        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("❌ [EMAIL ERROR] Failed to send email");
        console.error("❌ [EMAIL ERROR] To:", to);
        console.error("❌ [EMAIL ERROR] Subject:", subject);
        console.error("❌ [EMAIL ERROR] Error details:", error.message || error);

        if (error.code === 'EAUTH') {
            console.error("❌ [EMAIL ERROR] Authentication failed - check SMTP_USER and SMTP_PASS");
        } else if (error.code === 'ECONNECTION') {
            console.error("❌ [EMAIL ERROR] Connection failed - check SMTP_HOST and SMTP_PORT");
        }

        return { success: false, error };
    }
};

