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

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Campus Placement" <noreply@campus.edu>',
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};
