# Campus Placement Management System
## Project Report

---

### **Project Overview**

**Project Title:** PlaceMe - Campus Placement Management System

**Institution:** Sanjay Bhokare Group of Institutes, Miraj  
**Department:** Computer Science & Engineering  
**Academic Year:** 2022-2026 
**Project Type:** Final Year Project

---

### **Developed By**

**Team Members:**
1. **Mayuri Vitthal Auji** - Full Stack Development
2. **Mohini Kerba Dhulgunde** - Backend Development  
3. **Namrata Prakash Mane** - Frontend Development
4. **Nikhil Patil** - Database & API Development

**Under the Guidance of:**  
Department of Computer Science & Engineering, SBGI Miraj

---

### **1. Introduction**

#### 1.1 Project Background
The Campus Placement Management System (PlaceMe) is a comprehensive web-based platform designed to streamline and automate the entire placement process in educational institutions. Traditional placement processes involve manual coordination, paper-based records, and time-consuming communication between students, companies, and placement officers. This system addresses these challenges by providing a centralized, digital solution.

#### 1.2 Problem Statement
Educational institutions face several challenges in managing campus placements:
- Manual tracking of student applications and company requirements
- Difficulty in matching students with suitable job opportunities
- Inefficient communication between stakeholders
- Lack of real-time placement analytics and insights
- Time-consuming resume screening and shortlisting processes
- Limited visibility into the placement pipeline

#### 1.3 Project Objectives
- Develop a centralized platform for managing the entire placement cycle
- Automate job posting, application tracking, and student-company matching
- Provide role-based dashboards for Students, Companies, and TPO
- Implement AI-powered features for job recommendations and resume analysis
- Generate real-time placement statistics and reports
- Ensure secure authentication and data privacy

---

### **2. System Architecture**

#### 2.1 Technology Stack

**Frontend:**
- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui (Radix UI primitives)
- **State Management:** React Context API
- **Charts & Visualization:** Recharts
- **Form Handling:** React Hook Form with Zod validation

**Backend:**
- **Framework:** Next.js API Routes (Server-side)
- **Runtime:** Node.js
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt / SHA-256
- **Data Validation:** Zod

**Database:**
- **Primary Database:** MongoDB
- **ODM (Object-Document Mapper):** Mongoose
- **Cloud Hosting:** MongoDB Atlas

**Development Tools:**
- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Code Editor:** VS Code
- **Deployment:** Vercel (Frontend) / Vercel Serverless (Backend)

#### 2.2 Architecture Pattern
The system follows a modern **Full-Stack JavaScript Architecture** with:
- **Frontend:** Server-Side Rendering (SSR) and Client-Side Rendering (CSR) with Next.js
- **Backend:** RESTful API using Next.js API Routes
- **Database:** NoSQL document-based storage with MongoDB
- **Authentication:** Stateless JWT-based authentication with HTTP-only cookies

---

### **3. System Features**

#### 3.1 User Roles

**1. Student**
- Profile management with academic details
- Browse and apply for jobs
- Track application status
- Resume upload and management
- Receive personalized job recommendations
- View placement events and schedules
- Communication with recruiters

**2. Training & Placement Officer (TPO)**
- Dashboard with placement analytics
- Student management and eligibility verification
- Company approval and verification
- Job posting moderation
- Schedule placement drives and events
- Generate placement reports
- Send notifications to students

**3. Company/Recruiter**
- Company profile management
- Post job requirements
- View and shortlist applicants
- Schedule interviews
- Send offers to selected candidates
- Track hiring pipeline
- Access candidate analytics

#### 3.2 Core Functionalities

**Authentication & Authorization:**
- Secure user registration with email verification
- Role-based access control (RBAC)
- JWT token-based session management
- Password encryption and secure storage

**Job Management:**
- Dynamic job posting with eligibility criteria
- Automatic student-job matching based on:
  - Department/Branch
  - CGPA requirements
  - Backlog restrictions
  - Batch year
  - Skills matching
- Application deadline management
- Real-time application tracking

**Student Management:**
- Comprehensive student profiles
- Academic record tracking
- Skill inventory
- Resume repository
- Placement status monitoring
- Eligibility verification

**Application Tracking:**
- Multi-stage application pipeline:
  - Applied → Shortlisted → Interviewed → Offered → Accepted/Rejected
- Timeline tracking for each application
- Status notifications
- Interview scheduling

**Analytics & Reporting:**
- Real-time placement statistics
- Department-wise placement analysis
- Company recruitment trends
- Salary package distributions
- Placement success rates
- Exportable reports

**AI-Powered Features:**
- Job recommendation engine
- Resume parsing and analysis
- Skill gap identification
- Career guidance chatbot
- Automated email generation

---

### **4. Database Design**

#### 4.1 Collections & Schema

**Users Collection:**
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: Enum ["student", "tpo", "company"],
  isApproved: Boolean,
  isActive: Boolean,
  refreshToken: String,
  lastLogin: Date,
  timestamps: { createdAt, updatedAt }
}
```

**Students Collection:**
```javascript
{
  userId: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  rollNumber: String (unique),
  department: String,
  batch: String,
  cgpa: Number,
  backlogs: Number,
  tenthPercentage: Number,
  twelfthPercentage: Number,
  skills: [String],
  projects: [Object],
  internships: [Object],
  certifications: [Object],
  placementStatus: Enum ["unplaced", "placed", "not_interested"],
  isEligible: Boolean
}
```

**Companies Collection:**
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  industry: String,
  sector: String,
  website: String,
  locations: [String],
  contactPerson: Object,
  isApproved: Boolean,
  approvedBy: ObjectId (ref: User),
  approvedAt: Date
}
```

**Jobs Collection:**
```javascript
{
  companyId: ObjectId (ref: Company),
  title: String,
  description: String,
  roleType: Enum ["full-time", "internship", "contract"],
  workMode: Enum ["onsite", "remote", "hybrid"],
  ctc: Number,
  locations: [String],
  eligibility: {
    minCgpa: Number,
    maxBacklogs: Number,
    branches: [String],
    batch: [String]
  },
  preferredSkills: [String],
  applicationDeadline: Date,
  status: Enum ["draft", "active", "closed"],
  applicationsCount: Number
}
```

**Applications Collection:**
```javascript
{
  jobId: ObjectId (ref: Job),
  studentId: ObjectId (ref: Student),
  companyId: ObjectId (ref: Company),
  status: Enum ["applied", "shortlisted", "interviewed", "offered", "accepted", "rejected"],
  appliedAt: Date,
  timeline: [{ status, date, comment }],
  offer: {
    ctc: Number,
    role: String,
    location: String,
    joiningDate: Date,
    status: Enum ["pending", "accepted", "rejected"]
  }
}
```

---

### **5. Implementation Details**

#### 5.1 Authentication Flow
1. User registers with email and password
2. Password is hashed using bcrypt/SHA-256
3. User data is stored in MongoDB
4. Upon login, JWT access token (15min) and refresh token (7 days) are generated
5. Tokens are stored in HTTP-only cookies for security
6. Protected routes verify JWT before granting access
7. Refresh token is used to obtain new access token when expired

#### 5.2 Job Matching Algorithm
```
For each active job:
  1. Fetch job eligibility criteria
  2. Query students where:
     - department IN job.eligibility.branches
     - batch IN job.eligibility.batch
     - cgpa >= job.eligibility.minCgpa
     - backlogs <= job.eligibility.maxBacklogs
  3. Calculate skill match percentage
  4. Rank students by relevance
  5. Display eligible jobs to students
```

#### 5.3 Security Measures
- Passwords stored as salted hashes
- JWT tokens with expiration
- HTTP-only cookies to prevent XSS
- Input validation using Zod schemas
- SQL/NoSQL injection prevention
- CORS policy implementation
- Rate limiting on API endpoints

---

### **6. Testing & Validation**

#### 6.1 Testing Strategy
- **Unit Testing:** Individual component and function testing
- **Integration Testing:** API endpoint testing
- **User Acceptance Testing:** Real-world scenario validation
- **Security Testing:** Penetration testing for vulnerabilities
- **Performance Testing:** Load testing with concurrent users

#### 6.2 Test Scenarios Covered
✅ User registration for all roles  
✅ Login/Logout functionality  
✅ Job posting and editing  
✅ Student profile management  
✅ Application submission and tracking  
✅ Dashboard data loading  
✅ Search and filter operations  
✅ Role-based access control  
✅ Database CRUD operations  

---

### **7. Results & Achievements**

#### 7.1 Key Accomplishments
- **Fully Functional Platform:** Complete end-to-end placement management
- **Modern UI/UX:** Responsive design with dark mode support
- **Scalable Architecture:** MongoDB for horizontal scalability
- **Real-Time Data:** Dynamic dashboards with live statistics
- **Secure Authentication:** Industry-standard JWT implementation
- **AI Integration:** Smart job recommendations

#### 7.2 System Statistics
- **3 User Roles** with distinct functionalities
- **15+ API Endpoints** for data management
- **8+ Database Collections** with relationships
- **50+ UI Components** (reusable Shadcn/ui)
- **TypeScript Coverage:** 100% for type safety

---

### **8. Future Enhancements**

#### 8.1 Planned Features
1. **Email Integration:** Automated email notifications
2. **Mobile Application:** React Native mobile app
3. **Video Interviews:** In-platform video calling
4. **Document Verification:** Digital signature support
5. **Alumni Portal:** Connect with placed alumni
6. **Analytics Dashboard:** Advanced data visualization
7. **Multi-Language Support:** Internationalization (i18n)
8. **Payment Gateway:** Placement fees and registration
9. **Chatbot Integration:** AI-powered support
10. **Resume Builder:** Integrated resume creation tool

#### 8.2 Scalability Improvements
- Implement Redis caching for faster data retrieval
- Add Elasticsearch for advanced search capabilities
- Set up CDN for static asset delivery
- Implement database sharding for large-scale deployment
- Add WebSocket support for real-time notifications

---

### **9. Conclusion**

The Campus Placement Management System successfully addresses the challenges faced by educational institutions in managing placements. By leveraging modern web technologies, the system provides:

- **Efficiency:** Automated workflows reduce manual effort
- **Transparency:** Real-time tracking and visibility
- **Accuracy:** Data-driven matching and analytics
- **Scalability:** Cloud-based architecture for growth
- **Security:** Industry-standard authentication and encryption

This project demonstrates the practical application of full-stack web development, database design, API development, and UI/UX principles. It serves as a comprehensive solution that can be deployed in educational institutions to modernize their placement processes.

---

### **10. References**

1. **Next.js Documentation:** https://nextjs.org/docs
2. **MongoDB Manual:** https://docs.mongodb.com/
3. **Mongoose ODM:** https://mongoosejs.com/
4. **React Documentation:** https://react.dev/
5. **TypeScript Handbook:** https://www.typescriptlang.org/docs/
6. **JWT.io:** https://jwt.io/introduction
7. **Shadcn/ui:** https://ui.shadcn.com/
8. **Tailwind CSS:** https://tailwindcss.com/docs

---

### **Appendix**

#### A. System Screenshots
- Login Page
- Student Dashboard
- TPO Dashboard
- Company Dashboard
- Job Listings
- Application Tracking
- Profile Management

#### B. Code Repository
- GitHub: [\[Project Repository Link\]](https://github.com/Namrata719/campus-placement-management)
- Live Demo: https://place-me.vercel.app/ (Development)

#### C. Installation Guide
See README.md for detailed setup instructions.

---

**Declaration:**

We hereby declare that this project work titled "Campus Placement Management System (PlaceMe)" is our original work and has been carried out under the guidance of the Department of Computer Science & Engineering, Sanjay Bhokare Group of Institutes, Miraj.

**Team Members:**
- Mayuri Vitthal Auji
- Mohini Kerba Dhulgunde
- Namrata Prakash Mane
- Nikhil Patil

**Date:** December 2025

---

*This project is submitted in partial fulfillment of the requirements for the Bachelor of Engineering (Computer Science) degree.*
