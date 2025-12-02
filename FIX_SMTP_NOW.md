# 🔧 URGENT: SMTP Not Working - Fix Guide

## ❌ Current Status
**SMTP Configuration**: NOT WORKING  
**Mode**: MOCK MODE (emails logged to console only)  
**Problem**: SMTP_PASS environment variable not loading

## 🔍 Diagnosis Results
```json
{
  "mode": "MOCK MODE - Console Only",
  "configured": false,
  "SMTP_HOST": "NOT SET" or detected but SMTP_PASS missing
  "hasPassword": false  ← THIS IS THE PROBLEM
}
```

---

## ✅ SOLUTION: Fix Your .env File

### Step 1: Check Your .env File Format

Open: `.env` (in project root)

**CORRECT FORMAT** (No quotes, no spaces around =):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="Campus Placement" <noreply@college.edu>
```

**WRONG FORMATS** (Don't use these):
```env
# ❌ WRONG - No quotes around values
SMTP_PASS="abcdefghijklmnop"

# ❌ WRONG - Spaces around =
SMTP_PASS = abcdefghijklmnop

# ❌ WRONG - Missing value
SMTP_PASS=

# ❌ WRONG - Commented out
# SMTP_PASS=abcdefghijklmnop
```

### Step 2: Get Gmail App Password

**IMPORTANT**: You CANNOT use your regular Gmail password!

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in
3. Select app: **Mail**
4. Select device: **Other (Custom name)**
5. Enter: "Campus Placement"
6. Click **Generate**
7. You'll get a 16-character code like: `abcd efgh ijkl mnop`
8. **Remove the spaces**: `abcdefghijklmnop`

### Step 3: Update .env File

```env
# MongoDB (keep your existing value)
MONGODB_URI=your_mongodb_connection_string

# JWT (keep your existing value)
JWT_SECRET=your_jwt_secret

# Email Configuration - ADD THESE EXACTLY
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM="Campus Placement System" <noreply@yourcollege.edu>

# App URL (add if not present)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**IMPORTANT RULES**:
- ✅ NO quotes around SMTP_PASS
- ✅ NO spaces in the password
- ✅ Remove ALL spaces from the app password
- ✅ One variable per line
- ✅ NO spaces before or after =

### Step 4: Save and Restart

1. **Save** the `.env` file (Ctrl+S)
2. **Stop** the server (It's already stopped)
3. **Start** again:
   ```powershell
   npm run dev
   ```
4. **Wait** for "Ready in..." message

### Step 5: Verify SMTP is Working

1. **Open**: http://localhost:3000/api/check-smtp

You should see:
```json
{
  "mode": "SMTP CONFIGURED - Real Emails",
  "configured": true,
  "details": {
    "SMTP_HOST": true,
    "SMTP_PASS": true,
    "hasPassword": true
  }
}
```

---

## 🧪 Test Real Email Sending

### Quick Test:
1. Login as TPO
2. Go to: http://localhost:3000/tpo/students
3. Edit any student
4. Change status to "approved"
5. Save changes
6. **Watch terminal** - should see:

```
[SMTP] Sending email to: student@college.edu
[SMTP] Subject: Campus Placement - Profile Approved
[SMTP] Using SMTP server: smtp.gmail.com:587
✅ [SMTP] Email sent successfully!
✅ [SMTP] Message ID: <...@mail.gmail.com>
✅ [SMTP] Recipient: student@college.edu
```

7. **Check email inbox** - student should receive the email!

---

## 🔍 Troubleshooting

### Still Seeing MOCK MODE?

**Check**:
1. ✅ .env file is in PROJECT ROOT (not in a subfolder)
2. ✅ File is named exactly `.env` (not `.env.txt`)
3. ✅ Server was restarted AFTER editing .env
4. ✅ SMTP_PASS has NO quotes
5. ✅ SMTP_PASS has NO spaces

**Solution**:
```powershell
# Stop server (Ctrl+C)
# Edit .env file
# Save (Ctrl+S)
# Start server
npm run dev
# Wait for "Ready in..."
```

### Getting Authentication Errors?

**Terminal shows**:
```
❌ [EMAIL ERROR] Authentication failed - check SMTP_USER and SMTP_PASS
```

**Solutions**:
1. Use App Password (NOT regular password)
2. Remove ALL spaces from app password
3. Remove quotes from password value
4. Check username is complete: `user@gmail.com`

### Still Getting MOCK EMAIL?

**Terminal shows**:
```
---------------------------------------------------
[MOCK EMAIL] To: ...
[MOCK EMAIL] Subject: ...
---------------------------------------------------
```

**This means SMTP_HOST is still not detected!**

**Fix**:
1. Verify .env file location
2. Check spelling: `SMTP_HOST` (exact case)
3. Ensure no leading spaces
4. Restart server

---

## 📋 Complete .env Template

Copy this EXACT format:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Authentication  
JWT_SECRET=your_very_long_random_secret_key_here

# Email - SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourname@gmail.com
SMTP_PASS=yourapppasswordhere
SMTP_FROM="Campus Placement System" <noreply@college.edu>

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✅ Success Checklist

After fixing:
- [ ] .env file updated with SMTP credentials
- [ ] Gmail app password generated (16 characters)
- [ ] Password has NO quotes, NO spaces
- [ ] Server restarted
- [ ] Check endpoint shows "SMTP CONFIGURED"
- [ ] Terminal shows `[SMTP]` logs (not `[MOCK EMAIL]`)
- [ ] Test email sent successfully
- [ ] Email received in inbox

---

## 🆘 If Still Not Working

If you've done everything above and it's STILL not working:

### Option 1: Use Ethereal (Test SMTP)
Temporarily use a test SMTP server:

1. Go to: https://ethereal.email/create
2. Copy the credentials
3. Update .env:
   ```env
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=(from ethereal)
   SMTP_PASS=(from ethereal)
   ```
4. Restart server
5. Send test email
6. Check: https://ethereal.email/messages (to view emails)

### Option 2: Check Gmail Settings

1. Enable 2-Factor Authentication on Gmail
2. Generate new App Password
3. Use the new app password in .env
4. Restart server

### Option 3: Manual Test

Run this in browser console (after  logging in):
```javascript
fetch('/api/check-smtp')
  .then(r => r.json())
  .then(console.log)
```

Should show `configured: true`

---

## 🎯 Expected Results

### Before Fix (Current):
```
Mode: MOCK MODE - Console Only
Logs: [MOCK EMAIL] ...
Result: No real emails sent
```

### After Fix (Goal):
```
Mode: SMTP CONFIGURED - Real Emails  
Logs: [SMTP] Sending email...
       ✅ [SMTP] Email sent successfully!
Result: Real emails delivered to inbox!
```

---

**Created**: 2025-12-03  
**Priority**: HIGH - Real emails not working  
**Status**: Follow steps above to fix
