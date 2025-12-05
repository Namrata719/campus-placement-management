# 🔧 SMTP Configuration & Testing Guide

## ✅ Fixes Applied

### 1. Fixed 401 Unauthorized Error
**Problem**: "Send Email" button returned 401 Unauthorized  
**Solution**: Added `credentials: "include"` to fetch request  
**File**: `app/(dashboard)/tpo/students/page.tsx`

### 2. Enhanced Email Logging
**Added**: Clear console logs showing when SMTP is being used  
**File**: `lib/email.ts`

Now you'll see clear messages:
- `[SMTP] Sending email to:` - When using real SMTP
- `[MOCK EMAIL]` - When in mock mode
- `✅ [SMTP] Email sent successfully!` - Success
- `❌ [EMAIL ERROR]` - Errors with details

---

## 📧 Configure SMTP for Real Emails

### Step 1: Check Your `.env` File

Open: `c:\Users\akash\OneDrive\Desktop\Projects\campus_placement_management\campus-placement-management\.env`

You should have these variables:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM="Campus Placement" <noreply@yourschool.edu>
```

### Step 2: Get Gmail App Password (If Using Gmail)

1. **Visit**: https://myaccount.google.com/apppasswords
2. **Sign in** to your Google account
3. **Click** "Select app" → Choose "Mail"
4. **Click** "Select device" → Choose "Other"
5. **Enter** "Campus Placement System"
6. **Click** "Generate"
7. **Copy** the 16-character password (it looks like: `abcd efgh ijkl mnop`)
8. **Paste** into your `.env` file as `SMTP_PASS=abcdefghijklmnop` (no spaces)

### Step 3: Update Your `.env` File

Example with Gmail:
```env
# MongoDB Connection
MONGODB_URI=your_mongodb_uri_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Email Configuration (ADD THESE)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="Campus Placement System" <noreply@yourcollege.edu>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Restart the Server

**IMPORTANT**: After updating `.env`, you MUST restart:

```powershell
# In terminal where npm run dev is running:
# Press Ctrl+C to stop

# Then start again:
npm run dev
```

---

## 🧪 Test SMTP Configuration

### Quick Test 1: Check Console on Startup

After restarting, when you send an email, look for:

**If SMTP configured (you should see this):**
```
[SMTP] Sending email to: student@example.com
[SMTP] Subject: Campus Placement - Profile Approved
[SMTP] Using SMTP server: smtp.gmail.com:587
✅ [SMTP] Email sent successfully!
✅ [SMTP] Message ID: <some-id@gmail.com>
✅ [SMTP] Recipient: student@example.com
```

**If NOT configured (mock mode):**
```
---------------------------------------------------
[MOCK EMAIL] To: student@example.com
[MOCK EMAIL] Subject: Campus Placement - Profile Approved
[MOCK EMAIL] Body: <html>...</html>
---------------------------------------------------
```

### Quick Test 2: Send Email from Students Page

1. **Login as TPO**: http://localhost:3000/login
2. **Go to Students**: http://localhost:3000/tpo/students
3. **Select a student** (checkbox)
4. **Click "Send Email"** button
5. **Watch terminal** for logs
6. **Check email inbox** (if SMTP configured)

### Quick Test 3: Test Dashboard

1. **Go to**: http://localhost:3000/tpo/test-notifications
2. **Click** "Check Status"
3. Should show:
   - **"SMTP Configured"** if credentials are set
   - **"Mock Mode"** if not configured
4. **Run a test** and watch terminal

---

## 🔍 Troubleshooting

### Problem: Still Showing Mock Mode

**Check:**
1. ✅ SMTP_HOST is set in `.env`
2. ✅ Server was restarted after changing `.env`
3. ✅ No typos in variable names

**Solution:**
```powershell
# Stop server (Ctrl+C)
# Verify .env file has SMTP_HOST
# Start server again
npm run dev
```

### Problem: Authentication Failed

**Console shows:**
```
❌ [EMAIL ERROR] Authentication failed - check SMTP_USER and SMTP_PASS
```

**Solutions:**
1. For Gmail: Use App Password, NOT regular password
2. Check username is complete email: `user@gmail.com`
3. Check password has no spaces: `abcdefghijklmnop`
4. Enable "Less secure app access" (if needed)

### Problem: Connection Failed

**Console shows:**
```
❌ [EMAIL ERROR] Connection failed - check SMTP_HOST and SMTP_PORT
```

**Solutions:**
1. Check SMTP_HOST: `smtp.gmail.com`
2. Check SMTP_PORT: `587` (TLS) or `465` (SSL)
3. Check firewall isn't blocking
4. Try different port

### Problem: 401 Unauthorized (Fixed!)

This should be fixed now with `credentials: "include"`.

If still occurs:
1. Clear browser cache
2. Logout and login again
3. Check browser console for errors

---

## 📊 Email Configuration Examples

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourname@gmail.com
SMTP_PASS=yourapppassword
SMTP_FROM="Campus Placement" <placement@yourcollege.edu>
```

### Outlook/Office 365
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=yourname@outlook.com
SMTP_PASS=yourpassword
SMTP_FROM="Campus Placement" <placement@yourcollege.edu>
```

### SendGrid (Production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM="Campus Placement" <noreply@yourcollege.edu>
```

### Custom SMTP Server
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=yoursmtppassword
SMTP_FROM="Campus Placement" <noreply@yourdomain.com>
```

---

## ✅ Complete Testing Checklist

After configuring SMTP:

### 1. Server Restart
- [ ] Stopped server (Ctrl+C)
- [ ] Started server (`npm run dev`)
- [ ] Server started without errors

### 2. SMTP Status Check
- [ ] Go to `/tpo/test-notifications`
- [ ] Click "Check Status"
- [ ] Shows "SMTP Configured" ✅

### 3. Test Email Send
- [ ] Select student in `/tpo/students`
- [ ] Click "Send Email"
- [ ] No 401 error ✅
- [ ] Success message appears
- [ ] Terminal shows `[SMTP]` logs
- [ ] Email received in inbox ✅

### 4. Status Change Email
- [ ] Edit student status
- [ ] Change to "approved"
- [ ] Save changes
- [ ] Terminal shows email sent
- [ ] Student receives email ✅

### 5. Check Console Logs
- [ ] No `[MOCK EMAIL]` messages
- [ ] See `[SMTP]` messages instead
- [ ] See `✅ Email sent successfully!`
- [ ] See message IDs
- [ ] No error messages

---

## 🎯 Expected Console Output (Real SMTP)

```
[SMTP] Sending email to: student@college.edu
[SMTP] Subject: Important Update from TPO
[SMTP] Using SMTP server: smtp.gmail.com:587
✅ [SMTP] Email sent successfully!
✅ [SMTP] Message ID: <CABc...123@mail.gmail.com>
✅ [SMTP] Recipient: student@college.edu

Sent status update email to student@college.edu

[SMTP] Sending email to: another@college.edu
[SMTP] Subject: Campus Placement - Profile Approved
[SMTP] Using SMTP server: smtp.gmail.com:587
✅ [SMTP] Email sent successfully!
✅ [SMTP] Message ID: <CABc...456@mail.gmail.com>
✅ [SMTP] Recipient: another@college.edu
```

---

## 🚀 Next Steps

1. **Update `.env`** with your SMTP credentials
2. **Restart server**: `npm run dev`
3. **Test**: Send an email from students page
4. **Verify**: Check console for `[SMTP]` logs
5. **Confirm**: Check email inbox
6. **Celebrate**: Real emails are working! 🎉

---

## 📞 Quick Reference

**To switch between modes:**

**Mock Mode** (No real emails):
- Remove `SMTP_HOST` from `.env`
- OR set `SMTP_HOST=`

**Real SMTP Mode**:
- Set all SMTP_* variables in `.env`
- Restart server

**Current Files Modified:**
1. `app/(dashboard)/tpo/students/page.tsx` - Fixed 401 error
2. `lib/email.ts` - Enhanced logging

**Status**: ✅ Ready to send real emails!

---

**Last Updated**: 2025-12-03  
**Version**: 2.0 - SMTP & 401 Fix
