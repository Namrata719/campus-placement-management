# 🎓 PlaceMe - Campus Placement Management System

<div align="center">

![SKN Sinhgad Logo](public/images/skn-logo.png)

**A comprehensive placement management platform for educational institutions**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

</div>

---

## 📖 About

PlaceMe is a modern, feature-rich Campus Placement Management System developed by **Akash Chandrashekhar Katte**, a B.Tech Electronics & Telecommunication Engineering student from **SKN Sinhgad College of Engineering, Korti**. The platform streamlines the entire placement process by connecting students, companies, and placement officers through an intuitive web application.

### 👨‍💻 Developer

**Akash Chandrashekhar Katte**
- B.Tech Electronics & Telecommunication Engineering (2022-26)
- SKN Sinhgad College of Engineering, Korti, Pandharpur

---

## ✨ Features

### 🎓 For Students
- ✅ Personalized dashboard with placement statistics
- ✅ Browse and apply for jobs matching your profile
- ✅ Track application status in real-time
- ✅ Manage multiple resumes
- ✅ **AI-powered Career Coach & Policy Assistant**
- ✅ Resume analysis and skill gap identification
- ✅ Interview schedule management
- ✅ **Real-time Email Notifications**

### 🏢 For Companies
- ✅ Post job openings with detailed requirements
- ✅ Set eligibility criteria (CGPA, department, backlogs)
- ✅ View and shortlist applicants
- ✅ Schedule interviews
- ✅ Send offers to selected candidates
- ✅ Track recruitment pipeline
- ✅ Access candidate analytics

### 👨‍💼 For TPO (Training & Placement Officer)
- ✅ Comprehensive analytics dashboard
- ✅ Student profile management
- ✅ Company verification and approval
- ✅ Job posting moderation
- ✅ Placement drive scheduling
- ✅ **Automated & Manual Email Broadcasts**
- ✅ **Notification Testing Dashboard**
- ✅ Generate placement reports
- ✅ Department-wise statistics

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui (Radix UI)
- **State Management:** React Context API
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **AI Integration:** Vercel AI SDK

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Password Hashing:** bcrypt / SHA-256
- **Email Service:** Nodemailer (SMTP)
- **AI Model:** Google Gemini 1.5 Flash

### Database
- **Primary DB:** MongoDB Atlas
- **ODM:** Mongoose
- **Storage:** Document-based NoSQL

### DevOps & Tools
- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Deployment:** Vercel
- **Code Editor:** VS Code

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campus-placement-management.git
   cd campus-placement-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement_db

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   SMTP_FROM="Campus Placement" <noreply@college.edu>

   # Google AI (Gemini)
   GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key

   # Node Environment
   NODE_ENV=development
   ```

4. **Seed the database** (optional but recommended for testing)
   ```bash
   # Visit in browser:
   http://localhost:3000/api/seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   ```
   http://localhost:3000
   ```

---

## 📊 Database Schema

### Collections

1. **Users** - Authentication and role management
2. **Students** - Student profiles and academic details
3. **Companies** - Company profiles and contact information
4. **Jobs** - Job postings with eligibility criteria
5. **Applications** - Student applications and tracking
6. **PlacementEvents** - Interview schedules and events
7. **Notifications** - System-wide announcements

See [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for detailed schema documentation.

---

## 🔐 Authentication & Authorization

- **JWT-based authentication** with access and refresh tokens
- **Role-based access control (RBAC):** Student, Company, TPO
- **Secure password storage** using bcrypt hashing
- **HTTP-only cookies** for token storage
- **Protected routes** with middleware authentication

---

## 🎯 Core Functionality

### Job Matching Algorithm
```
1. Fetch student profile (CGPA, department, batch, backlogs)
2. Query jobs with matching eligibility criteria
3. Filter by:
   - Department match
   - CGPA >= minimum requirement
   - Backlogs <= maximum allowed
   - Batch year match
4. Calculate skill relevance score
5. Return ranked job recommendations
```

### Application Pipeline
```
Applied → Shortlisted → Interviewed → Offered → Accepted/Rejected
```

Each stage includes:
- Timestamp tracking
- Status notifications
- Comments/feedback
- Automated emails

---

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page
- `/about` - About the platform and developers
- `/login` - User authentication
- `/register` - New user registration

### Student Routes (Protected)
- `/student` - Dashboard
- `/student/jobs` - Browse jobs
- `/student/applications` - Application tracking
- `/student/profile` - Profile management
- `/student/resume` - Resume manager
- `/student/schedule` - Interview calendar

### Company Routes (Protected)
- `/company` - Dashboard
- `/company/jobs` - Manage job postings
- `/company/applicants` - View applicants
- `/company/schedule` - Interview scheduling
- `/company/profile` - Company profile

### TPO Routes (Protected)
- `/tpo` - Dashboard with analytics
- `/tpo/students` - Student management
- `/tpo/companies` - Company approval
- `/tpo/jobs` - Job moderation
- `/tpo/reports` - Generate reports

---

## 🧪 Testing

### Test Accounts (After seeding)

| Role | Email | Password |
|------|-------|----------|
| TPO | `tpo@college.edu` | `tpo123` |
| Student | `student@college.edu` | `student123` |
| Company | `google@tech.com` | `company123` |

### Running Tests
```bash
# Run TypeScript type check
npm run type-check

# Build for production (validates code)
npm run build
```

---

## 📦 Project Structure

```
campus-placement-management/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── about/               # About page
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/              # Reusable React components
│   ├── ui/                  # Shadcn/ui components
│   ├── footer.tsx           # Footer component
│   └── sidebar.tsx          # Dashboard sidebar
├── contexts/                # React Context providers
│   └── auth-context.tsx     # Authentication context
├── lib/                     # Utility libraries
│   ├── models/              # Mongoose models
│   ├── auth.ts              # Auth helpers
│   ├── mongodb.ts           # DB connection
│   └── types.ts             # TypeScript types
├── public/                  # Static assets
│   └── images/              # Images and logos
├── .env                     # Environment variables
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Student APIs
- `GET /api/student/dashboard` - Dashboard data
- `GET /api/student/jobs` - Eligible jobs
- `GET /api/student/profile` - Student profile
- `PUT /api/student/profile` - Update profile
- `POST /api/student/apply` - Apply for job

### Company APIs
- `GET /api/company/dashboard` - Dashboard data
- `GET /api/company/jobs` - Posted jobs
- `POST /api/company/jobs` - Create job
- `GET /api/company/applicants` - View applicants

### TPO APIs
- `GET /api/tpo/dashboard` - Analytics data
- `GET /api/tpo/students` - All students
- `GET /api/tpo/companies` - All companies
- `PUT /api/tpo/approve-company` - Approve company

See [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for complete API reference.

---

## 🎨 UI/UX Features

- **Responsive Design:** Mobile, tablet, and desktop optimized
- **Dark Mode Support:** System preference detection
- **Accessible:** ARIA labels and keyboard navigation
- **Modern Design:** Glassmorphism, gradients, animations
- **Fast Loading:** Optimized images and code splitting
- **Real-time Updates:** Dynamic data fetching

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Set Environment Variables in Vercel Dashboard**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 📈 Future Enhancements

- [x] **Email notification system (SMTP integration)**
- [x] **AI chatbot for student queries**
- [ ] Mobile application (React Native)
- [ ] Video interview feature (WebRTC)
- [ ] Resume builder integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Payment gateway for placement fees
- [ ] Alumni portal
- [ ] Document verification system

---

## 🤝 Contributing

While this is a final year project, we welcome suggestions and feedback!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Institution:** SKN Sinhgad College of Engineering, Korti  
**Department:** Electronics & Telecommunication Engineering  
**Email:** info@sinhgad.edu

**Developer:**
- Akash Chandrashekhar Katte

---

## 🙏 Acknowledgments

- Department of ENTC, SKN Sinhgad College of Engineering for guidance and support
- Open-source community for amazing tools and libraries
- MongoDB Atlas for database hosting
- Vercel for seamless deployment
- Shadcn/ui for beautiful UI components

---

## 📚 Documentation

- [Project Report](PROJECT_REPORT.md) - Comprehensive project documentation
- [Database Schema](docs/DATABASE_SCHEMA.md) - Database design
- [API Documentation](docs/API_DOCUMENTATION.md) - API reference
- [User Guide](docs/USER_GUIDE.md) - How to use the platform
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- **[SMTP Setup Guide](SMTP_SETUP_GUIDE.md)** - Email configuration
- **[Testing Guide](TESTING_GUIDE.md)** - How to test notifications
- **[Notification System](NOTIFICATION_SYSTEM.md)** - Technical details

---

