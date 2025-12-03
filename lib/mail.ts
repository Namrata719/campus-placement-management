import { sendEmail as sendEmailBase } from './email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://placeme-campus-placement-management.vercel.app';
const PRIMARY_COLOR = '#2563eb'; // Blue-600
const SUCCESS_COLOR = '#16a34a'; // Green-600
const WARNING_COLOR = '#ca8a04'; // Yellow-600
const DANGER_COLOR = '#dc2626'; // Red-600
const TEXT_COLOR = '#1f2937'; // Gray-800
const BG_COLOR = '#f3f4f6'; // Gray-100

// Base Email Template
export const getEmailTemplate = (title: string, content: string, actionButton?: { text: string, url: string }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${BG_COLOR}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: ${TEXT_COLOR};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <!-- Main Container -->
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color: ${PRIMARY_COLOR}; padding: 30px 40px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Campus Placement Portal</h1>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="margin-top: 0; margin-bottom: 20px; color: ${TEXT_COLOR}; font-size: 20px; font-weight: 600;">${title}</h2>
                                <div style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    ${content}
                                </div>

                                ${actionButton ? `
                                <div style="margin-top: 30px; text-align: center;">
                                    <a href="${actionButton.url}" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
                                        ${actionButton.text}
                                    </a>
                                </div>
                                ` : ''}
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                                    &copy; ${new Date().getFullYear()} Campus Placement Management System. All rights reserved.
                                </p>
                                <p style="margin: 10px 0 0; font-size: 12px; color: #9ca3af;">
                                    This is an automated message. Please do not reply directly to this email.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export const sendEmail = async (to: string, subject: string, html: string) => {
    const result = await sendEmailBase({ to, subject, html });
    return result.success;
};

export const sendJobNotification = async (studentEmail: string, jobTitle: string, companyName: string, jobId: string) => {
    const subject = `New Job Opportunity: ${jobTitle} at ${companyName}`;

    const content = `
        <p>Exciting news! A new job opportunity matching your profile has just been posted.</p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid ${PRIMARY_COLOR}; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 5px 0;"><strong>Role:</strong> ${jobTitle}</p>
            <p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
        </div>

        <p>Don't miss out on this opportunity. Log in to your dashboard to view the full job description, eligibility criteria, and apply.</p>
    `;

    const html = getEmailTemplate('New Job Alert 🚀', content, {
        text: 'View Job Details',
        url: `${APP_URL}/student/jobs/${jobId}`
    });

    await sendEmail(studentEmail, subject, html);
};

export const sendApplicationStatusUpdate = async (studentEmail: string, jobTitle: string, companyName: string, status: string) => {
    const subject = `Application Update: ${jobTitle} at ${companyName}`;

    let statusColor = PRIMARY_COLOR;
    let statusMessage = "Your application status has been updated.";

    switch (status.toLowerCase()) {
        case 'shortlisted':
        case 'selected':
        case 'hired':
            statusColor = SUCCESS_COLOR;
            statusMessage = "Congratulations! You have moved forward in the hiring process.";
            break;
        case 'rejected':
        case 'not_selected':
            statusColor = DANGER_COLOR;
            statusMessage = "Thank you for your interest. Unfortunately, you have not been selected for this round.";
            break;
        case 'pending':
        case 'under_review':
            statusColor = WARNING_COLOR;
            statusMessage = "Your application is currently under review.";
            break;
    }

    const content = `
        <p>We have an update regarding your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <span style="background-color: ${statusColor}; color: white; padding: 10px 20px; border-radius: 50px; font-weight: bold; font-size: 16px; text-transform: uppercase;">
                ${status.replace('_', ' ')}
            </span>
        </div>

        <p style="text-align: center; color: #4b5563; font-style: italic;">${statusMessage}</p>
        
        <p>Please check your dashboard for any additional feedback or next steps.</p>
    `;

    const html = getEmailTemplate('Application Status Update', content, {
        text: 'Check Dashboard',
        url: `${APP_URL}/student/dashboard`
    });

    await sendEmail(studentEmail, subject, html);
};

export const sendInterviewScheduled = async (studentEmail: string, jobTitle: string, companyName: string, date: string, time: string, venue: string) => {
    const subject = `Interview Invitation: ${jobTitle} at ${companyName}`;

    const content = `
        <p>Great news! You have been shortlisted for an interview for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
        
        <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0; color: ${PRIMARY_COLOR}; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Interview Details</h3>
            <table width="100%" cellpadding="5" border="0">
                <tr>
                    <td width="30%" style="color: #6b7280;"><strong>Date:</strong></td>
                    <td>${date}</td>
                </tr>
                <tr>
                    <td width="30%" style="color: #6b7280;"><strong>Time:</strong></td>
                    <td>${time}</td>
                </tr>
                <tr>
                    <td width="30%" style="color: #6b7280;"><strong>Venue:</strong></td>
                    <td>${venue}</td>
                </tr>
            </table>
        </div>

        <p>Please arrive 15 minutes early and bring a copy of your resume and college ID card.</p>
        <p><strong>Good luck! You've got this!</strong></p>
    `;

    const html = getEmailTemplate('Interview Scheduled 📅', content, {
        text: 'View Schedule',
        url: `https://placeme-campus-placement-management.vercel.app/student/interviews`
    });

    await sendEmail(studentEmail, subject, html);
};

export const sendStudentStatusUpdate = async (studentEmail: string, studentName: string, status: string) => {
    const statusMessages: { [key: string]: { title: string; message: string; color: string } } = {
        'approved': {
            title: 'Profile Approved 🎉',
            message: 'Congratulations! Your profile has been verified and approved by the TPO. You are now eligible to apply for upcoming placement drives.',
            color: SUCCESS_COLOR
        },
        'rejected': {
            title: 'Action Required: Profile Update',
            message: 'Your profile has been returned for corrections. Please contact the TPO office or check your dashboard for specific remarks regarding the rejection.',
            color: DANGER_COLOR
        },
        'pending': {
            title: 'Profile Under Review',
            message: 'Your profile is currently being reviewed by the Training & Placement Office. You will receive another notification once the verification is complete.',
            color: WARNING_COLOR
        }
    };

    const statusInfo = statusMessages[status.toLowerCase()] || {
        title: 'Profile Status Update',
        message: `Your profile status has been updated to: ${status}`,
        color: TEXT_COLOR
    };

    const subject = `Campus Placement - ${statusInfo.title}`;

    const content = `
        <p>Dear ${studentName},</p>
        
        <div style="border-left: 4px solid ${statusInfo.color}; padding-left: 15px; margin: 20px 0;">
            <p style="font-size: 18px; color: ${statusInfo.color}; font-weight: 600; margin: 0 0 10px 0;">
                Status: ${status.toUpperCase()}
            </p>
            <p style="margin: 0;">${statusInfo.message}</p>
        </div>

        <p>Keeping your profile updated increases your chances of getting shortlisted. Ensure all your academic records and resume are up to date.</p>
    `;

    const html = getEmailTemplate(statusInfo.title, content, {
        text: 'Go to Dashboard',
        url: `https://placeme-campus-placement-management.vercel.app/student/dashboard`
    });

    await sendEmail(studentEmail, subject, html);
};

export const sendCustomMessage = async (to: string, subject: string, message: string) => {
    // Format the message to preserve line breaks
    const formattedMessage = message.replace(/\n/g, '<br>');

    const content = `
        <div style="border-left: 4px solid ${PRIMARY_COLOR}; padding-left: 15px; margin: 20px 0;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                ${formattedMessage}
            </p>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px;">
            This is an official communication from the Training & Placement Office.
        </p>
    `;

    const html = getEmailTemplate(subject, content, {
        text: 'View Dashboard',
        url: `${APP_URL}/student/dashboard`
    });

    return await sendEmail(to, subject, html);
};
