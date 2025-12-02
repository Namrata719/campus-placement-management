# Notification System & Policy Chatbot - Testing Guide

## Quick Start Testing

### 1. Test Email Notification System

#### Access the Test Dashboard
1. Login as TPO (Training & Placement Officer)
2. Navigate to: **http://localhost:3000/tpo/test-notifications**
3. You should see the "Email Notification Testing" page

#### Run Tests
1. **Check SMTP Configuration**
   - Click "Check Status" button
   - You should see either "SMTP Configured" or "Mock Mode"
   - If Mock Mode: Emails will be logged to console (check terminal)

2. **Test Job Notification**
   - Click on "Job Notification" card
   - (Optional) Enter an email address
   - Click "Run Test"
   - Check results in the "Test Results" section
   - If Mock Mode: Check your terminal for email output

3. **Test Status Update**
   - Click on "Status Update" card
   - Click "Run Test"
   - Verify success message appears

4. **Test Interview Scheduled**
   - Click on "Interview Scheduled" card
   - Click "Run Test"
   - Check for success confirmation

5. **Test Bulk Notifications** (requires data in database)
   - Click on "Bulk Job Notification" card
   - Click "Run Test"
   - This will send to actual eligible students in database
   - Check terminal logs for count: "Sending job notifications to X eligible students"

### 2. Test Policy Chatbot

#### Access AI Insights
1. Login as TPO
2. Navigate to: **http://localhost:3000/tpo/ai-insights**
3. Click on the "Policy Chatbot" tab

#### Test Chatbot
1. You should see a welcome message: "Hello! I'm the placement policy assistant..."
2. Try asking policy-related questions:
   - "What is the eligibility criteria for placements?"
   - "What are the CGPA requirements?"
   - "How does the dream company policy work?"
   - "What is the application deadline process?"
3. Verify the chatbot responds as a Policy Assistant (not career coach)
4. Responses should be clear and policy-focused

### 3. Test Real Notification Triggers

#### Test TPO Status Change Notification
1. Go to **http://localhost:3000/tpo/pipeline**
2. Select a job that has applicants
3. Change an applicant's status (e.g., from "applied" to "shortlisted")
4. Check your terminal console for email notification log
5. Look for: `[MOCK EMAIL] To: student@email.com`

#### Test Company Status Change Notification
1. Login as Company (if you have company credentials)
2. Go to **http://localhost:3000/company/applicants**
3. Update an applicant's status
4. Check console for email notification
5. If scheduling interview, provide date/time/venue

#### Test Job Approval Notification
1. Login as TPO
2. Go to **http://localhost:3000/tpo/jobs**
3. Find a pending job
4. Approve the job
5. Check console logs for:
   - "Sending job notifications to X eligible students"
   - "Successfully sent Y/X job notifications"
6. Eligible students should receive job notification

## Console Output Examples

### Mock Email Output (No SMTP Configured)
```
---------------------------------------------------
[MOCK EMAIL] To: student@example.com
[MOCK EMAIL] Subject: Application Update: Software Engineer at TechCorp
[MOCK EMAIL] Body: <h1>Application Status Update</h1>...
---------------------------------------------------
```

### Job Approval Notification Logs
```
Sending job notifications to 15 eligible students
Successfully sent 15/15 job notifications
```

### Status Update Logs
```
[MOCK EMAIL] To: john.doe@college.edu
[MOCK EMAIL] Subject: Application Update: Data Scientist at AI Corp
[MOCK EMAIL] Body: <h1>Application Status Update</h1><p>Your application... has been updated.</p><p><strong>New Status:</strong> SHORTLISTED</p>
```

## What to Check

### ✅ Email Notifications Working
- [ ] Test dashboard loads at `/tpo/test-notifications`
- [ ] Can run all 5 test types successfully
- [ ] Console shows mock email output
- [ ] Success messages appear in UI
- [ ] Test results display correctly

### ✅ Status Change Notifications
- [ ] TPO changing status triggers email
- [ ] Company changing status triggers email
- [ ] Interview scheduling includes all details
- [ ] Console logs show email being sent
- [ ] No errors in terminal

### ✅ Job Approval Notifications
- [ ] Approving job triggers bulk notification
- [ ] Only eligible students receive notification
- [ ] Success count logged
- [ ] No errors for students without emails

### ✅ Policy Chatbot
- [ ] Chatbot tab loads in AI Insights
- [ ] Welcome message shows policy assistant greeting
- [ ] Responds to policy questions appropriately
- [ ] Uses policy-focused language
- [ ] No errors when sending messages

## Troubleshooting

### If Test Dashboard Page Not Found
- Make sure you're logged in as TPO
- Check the URL: `http://localhost:3000/tpo/test-notifications`
- Verify the file exists at: `app/(dashboard)/tpo/test-notifications/page.tsx`

### If No Email Logs in Console
1. Check terminal where `npm run dev` is running
2. Scroll up to find `[MOCK EMAIL]` entries
3. Try running a test again
4. If still nothing, check for errors in console

### If Policy Chatbot Shows Career Coach Message
- The old welcome message might be cached
- Refresh the page (Ctrl+R or Cmd+R)
- Clear browser cache if needed
- Check browser console for errors

### If Job Approval Doesn't Send Notifications
- Check console logs for "Sending job notifications to X eligible students"
- Verify students exist in database with matching criteria
- Ensure job has eligibility criteria set
- Check for errors in terminal

### If APIs Return 401 Unauthorized
- You're not logged in
- Login credentials expired
- Login as TPO and try again

## SMTP Configuration (Optional - For Real Emails)

### Using Gmail
1. Create a `.env.local` file (not tracked by git)
2. Add these variables:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Get from Google App Passwords
SMTP_FROM="Campus Placement" <noreply@college.edu>
```

3. Restart the server
4. Run tests again - emails will be sent for real

### Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Create new app password
3. Use that password in `SMTP_PASS`

## Expected Behavior Summary

### When TPO Changes Application Status
1. Application status updates in database
2. Timeline entry added
3. Email sent to student with:
   - Job title
   - Company name
   - New status
4. Console logs confirmation

### When Company Changes Application Status
1. Application status updates
2. If status = "interview" AND interview details provided:
   - Interview notification sent with date/time/venue
3. Otherwise:
   - Standard status update notification sent
4. Console logs confirmation

### When TPO Approves Job
1. Job status changes to "active"
2. System finds eligible students:
   - Matching department/branch
   - Meeting minimum CGPA
3. Sends notification to each eligible student
4. Logs: "Sending job notifications to X students"
5. Logs: "Successfully sent Y/X job notifications"
6. Each notification includes job link

### When Using Policy Chatbot
1. System detects "policy" context
2. Uses Policy Assistant prompt
3. Provides policy-focused responses
4. Recommends contacting TPO for specifics

## Quick Test Checklist

Run these in order for a complete test:

1. ✅ Navigate to `/tpo/test-notifications`
2. ✅ Click "Check Status" button
3. ✅ Test "Job Notification" 
4. ✅ Test "Status Update"
5. ✅ Check console for mock emails
6. ✅ Navigate to `/tpo/ai-insights`
7. ✅ Click "Policy Chatbot" tab
8. ✅ Send a test message
9. ✅ Go to `/tpo/pipeline`, change a status
10. ✅ Check console for notification log
11. ✅ Approve a pending job (if available)
12. ✅ Check console for bulk notification logs

## Success Indicators

You'll know everything works when:
- ✅ All test types show "Success" badge
- ✅ Console shows `[MOCK EMAIL]` entries
- ✅ Policy chatbot responds appropriately
- ✅ Status changes trigger console logs
- ✅ Job approvals show "Sending job notifications..." log
- ✅ No errors in browser console or terminal

## Need Help?

Check `NOTIFICATION_SYSTEM.md` for complete documentation including:
- Detailed architecture
- Email templates
- Error handling
- Future enhancements
- Production deployment guide
