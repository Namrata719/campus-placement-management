# Vercel Deployment Guide - Campus Placement Management

## Issue: Cannot Login After Deployment

### Root Cause
The most common reason you can login locally but not on Vercel is:
1. **Empty Production Database** - No users exist in the production MongoDB
2. **Missing Environment Variables** - Environment variables not set in Vercel
3. **MongoDB Network Access** - IP whitelist blocking Vercel's servers

---

## Step-by-Step Fix

### 1. ✅ Set Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: **placeme-campus-placement-management**
3. Navigate to: **Settings** → **Environment Variables**
4. Add these variables (one by one):

```bash
JWT_SECRET=campus-placement-2025
```

```bash
MONGODB_URI=mongodb+srv://namratamane601_db_user:sQb7LCLPP4p3AvJp@cluster0.tvsgofv.mongodb.net/campus-placement?retryWrites=true&w=majority&appName=Cluster0
```

```bash
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyDnT869T-_P7jONKPhiS9Jb0VzxmJJ
```

```bash
NODE_ENV=production
```

```bash
NEXT_PUBLIC_APP_URL=https://placeme-campus-placement-management.vercel.app
```

5. **Important:** Click **"Redeploy"** button after adding variables!

---

### 2. ✅ Allow Vercel IPs in MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Select your cluster: **Cluster0**
3. Navigate to: **Network Access** (left sidebar)
4. Click: **"Add IP Address"**
5. Select: **"Allow Access from Anywhere"** (0.0.0.0/0)
   - OR add Vercel's IP ranges (less secure but works everywhere)
6. Click: **"Confirm"**

---

### 3. ✅ Seed the Production Database

**After** completing steps 1 and 2, visit this URL in your browser:

```
https://placeme-campus-placement-management.vercel.app/api/seed
```

This will:
- Clear existing data
- Create test users with proper bcrypt hashed passwords
- Create a sample company and job

You should see this response:
```json
{
  "success": true,
  "message": "Database seeded successfully!",
  "accounts": [
    { "role": "TPO", "email": "tpo@college.edu", "password": "tpo123" },
    { "role": "Company", "email": "google@tech.com", "password": "company123" },
    { "role": "Student", "email": "student@college.edu", "password": "student123" }
  ]
}
```

---

### 4. ✅ Test Login

Now try logging in with:

**Student Account:**
- Email: `student@college.edu`
- Password: `student123`

**TPO Account:**
- Email: `tpo@college.edu`
- Password: `tpo123`

**Company Account:**
- Email: `google@tech.com`
- Password: `company123`

---

## Debugging Steps

If login still fails:

### Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click on the latest **Deployment**
3. Go to **Functions** tab
4. Click on the `/api/auth/login` function
5. Look for errors in the logs

### Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `MongoServerSelectionError` | Check MongoDB network access, allow 0.0.0.0/0 |
| `Invalid credentials` | Database not seeded, visit `/api/seed` |
| `Environment variable not found` | Add missing variables in Vercel, redeploy |
| `Cookie not set` | Already handled, cookies work with HTTPS on Vercel |

---

## Verification Checklist

- [ ] All environment variables added in Vercel
- [ ] Vercel project redeployed after adding variables
- [ ] MongoDB Network Access allows 0.0.0.0/0
- [ ] Visited `/api/seed` endpoint successfully
- [ ] Received JSON response with test accounts
- [ ] Tried logging in with `student@college.edu` / `student123`

---

## Production URLs

- **App:** https://placeme-campus-placement-management.vercel.app
- **Seed API:** https://placeme-campus-placement-management.vercel.app/api/seed
- **Login:** https://placeme-campus-placement-management.vercel.app/login

---

## Need More Help?

If login still doesn't work after following all steps:

1. Check Vercel function logs for the exact error
2. Verify MongoDB connection string is correct
3. Ensure IP whitelist includes 0.0.0.0/0
4. Try redeploying the entire project

The most common fix is **step 3** - seeding the database!
