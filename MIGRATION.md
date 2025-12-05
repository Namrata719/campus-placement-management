# Database Migration Guide

This application has been migrated from using static/in-memory data to using a MongoDB database.

## What has been done:

1.  **MongoDB Setup**:
    *   Installed `mongoose` and `mongodb`.
    *   Created `lib/mongodb.ts` for database connection.
    *   Created Mongoose models in `lib/models` for all entities (User, Student, Company, Job, Application, etc.).

2.  **Authentication**:
    *   Updated `app/api/auth/register/route.ts` to store users in MongoDB.
    *   Updated `app/api/auth/login/route.ts` to verify credentials against MongoDB.
    *   Updated `app/api/auth/me/route.ts` to fetch current user from MongoDB.

3.  **Dashboards**:
    *   **Student Dashboard**: Created `app/api/student/dashboard/route.ts` and updated `app/(dashboard)/student/page.tsx` to fetch dynamic data.
    *   **TPO Dashboard**: Created `app/api/tpo/dashboard/route.ts` and updated `app/(dashboard)/tpo/page.tsx` to fetch dynamic data.

## Next Steps (How to continue):

To make the rest of the application dynamic, follow this pattern for each page:

1.  **Identify the Data**: Look at the page (e.g., `app/(dashboard)/student/jobs/page.tsx`) and identify the static data being used (e.g., `const jobs = [...]`).
2.  **Create an API Endpoint**:
    *   Create a new route file, e.g., `app/api/student/jobs/route.ts`.
    *   Import necessary models (e.g., `Job`, `Company`).
    *   Connect to DB using `connectDB()`.
    *   Fetch data using Mongoose queries (e.g., `Job.find()`).
    *   Return the data as JSON.
3.  **Update the Frontend Page**:
    *   Remove the static data.
    *   Add `useState` and `useEffect` to fetch data from your new API endpoint.
    *   Render the fetched data.

## Environment Variables

Make sure your `.env` file contains the MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/campus-placement
```

(Or your MongoDB Atlas URI)
