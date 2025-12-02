import { sendEmail as sendEmailBase } from './email';

export const sendEmail = async (to: string, subject: string, html: string) => {
    const result = await sendEmailBase({ to, subject, html });
    return result.success;
};

export const sendJobNotification = async (studentEmail: string, jobTitle: string, companyName: string, jobId: string) => {
    const subject = `New Job Alert: ${jobTitle} at ${companyName}`;
    const html = `
        <h1>New Job Opening</h1>
        <p>A new job opening matching your profile has been posted.</p>
        <p><strong>Role:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/student/jobs/${jobId}">View Job Details</a></p>
    `;
    await sendEmail(studentEmail, subject, html);
};

export const sendApplicationStatusUpdate = async (studentEmail: string, jobTitle: string, companyName: string, status: string) => {
    const subject = `Application Update: ${jobTitle} at ${companyName}`;
    const html = `
        <h1>Application Status Update</h1>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated.</p>
        <p><strong>New Status:</strong> ${status.toUpperCase()}</p>
        <p>Check your dashboard for more details.</p>
    `;
    await sendEmail(studentEmail, subject, html);
};

export const sendInterviewScheduled = async (studentEmail: string, jobTitle: string, companyName: string, date: string, time: string, venue: string) => {
    const subject = `Interview Scheduled: ${jobTitle} at ${companyName}`;
    const html = `
        <h1>Interview Scheduled</h1>
        <p>You have been shortlisted for an interview!</p>
        <p><strong>Role:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Venue:</strong> ${venue}</p>
        <p>Good luck!</p>
    `;
    await sendEmail(studentEmail, subject, html);
};
