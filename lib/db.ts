import type {
  User,
  Student,
  Company,
  Job,
  Application,
  PlacementEvent,
  Notification,
  Department,
  Batch,
  FAQ,
} from "./types"

// In-memory database stores
export const db = {
  users: new Map<string, User>(),
  students: new Map<string, Student>(),
  companies: new Map<string, Company>(),
  jobs: new Map<string, Job>(),
  applications: new Map<string, Application>(),
  events: new Map<string, PlacementEvent>(),
  notifications: new Map<string, Notification>(),
  departments: new Map<string, Department>(),
  batches: new Map<string, Batch>(),
  faqs: new Map<string, FAQ>(),
}

// Initialize with some default data
function initializeData() {
  // Default departments
  const departments: Department[] = [
    { _id: "dept-cse", name: "Computer Science & Engineering", code: "CSE", isActive: true },
    { _id: "dept-ece", name: "Electronics & Communication", code: "ECE", isActive: true },
    { _id: "dept-me", name: "Mechanical Engineering", code: "ME", isActive: true },
    { _id: "dept-ee", name: "Electrical Engineering", code: "EE", isActive: true },
    { _id: "dept-ce", name: "Civil Engineering", code: "CE", isActive: true },
    { _id: "dept-it", name: "Information Technology", code: "IT", isActive: true },
  ]

  departments.forEach((d) => db.departments.set(d._id, d))

  // Default batches
  const batches: Batch[] = [
    {
      _id: "batch-2024",
      year: "2024",
      startDate: new Date("2020-08-01"),
      endDate: new Date("2024-05-31"),
      isActive: true,
    },
    {
      _id: "batch-2025",
      year: "2025",
      startDate: new Date("2021-08-01"),
      endDate: new Date("2025-05-31"),
      isActive: true,
    },
    {
      _id: "batch-2026",
      year: "2026",
      startDate: new Date("2022-08-01"),
      endDate: new Date("2026-05-31"),
      isActive: true,
    },
  ]

  batches.forEach((b) => db.batches.set(b._id, b))

  // Default TPO user
  const tpoUser: User = {
    _id: "user-tpo-1",
    email: "tpo@college.edu",
    password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // 'admin'
    role: "tpo",
    isApproved: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  db.users.set(tpoUser._id, tpoUser)

  // Sample companies
  const companies: Company[] = [
    {
      _id: "company-1",
      userId: "user-company-1",
      name: "TechCorp Solutions",
      website: "https://techcorp.com",
      industry: "Information Technology",
      sector: "Software Development",
      description: "Leading software development company specializing in enterprise solutions.",
      locations: ["Bangalore", "Hyderabad", "Pune"],
      employeeCount: "1000-5000",
      foundedYear: 2010,
      contactPerson: {
        name: "Priya Sharma",
        email: "hr@techcorp.com",
        phone: "+91-9876543210",
        designation: "HR Manager",
      },
      isApproved: true,
      approvedBy: "user-tpo-1",
      approvedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "company-2",
      userId: "user-company-2",
      name: "InnovateTech",
      website: "https://innovatetech.io",
      industry: "Information Technology",
      sector: "AI/ML",
      description: "AI-first company building next-generation intelligent systems.",
      locations: ["Mumbai", "Bangalore"],
      employeeCount: "500-1000",
      foundedYear: 2015,
      contactPerson: {
        name: "Rahul Verma",
        email: "talent@innovatetech.io",
        phone: "+91-9876543211",
        designation: "Talent Acquisition Lead",
      },
      isApproved: true,
      approvedBy: "user-tpo-1",
      approvedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  companies.forEach((c) => {
    db.companies.set(c._id, c)
    // Create user for company
    const companyUser: User = {
      _id: c.userId,
      email: c.contactPerson.email,
      password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
      role: "company",
      isApproved: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    db.users.set(companyUser._id, companyUser)
  })

  // Sample jobs
  const jobs: Job[] = [
    {
      _id: "job-1",
      companyId: "company-1",
      title: "Software Development Engineer",
      description: "Join our engineering team to build scalable enterprise solutions using modern technologies.",
      roleType: "full-time",
      ctc: 1200000,
      currency: "INR",
      locations: ["Bangalore", "Hyderabad"],
      workMode: "hybrid",
      responsibilities: [
        "Design and develop high-quality software solutions",
        "Collaborate with cross-functional teams",
        "Participate in code reviews and technical discussions",
        "Write clean, maintainable, and efficient code",
      ],
      requirements: [
        "B.Tech/B.E. in Computer Science or related field",
        "Strong programming skills in Java, Python, or JavaScript",
        "Understanding of data structures and algorithms",
        "Good communication skills",
      ],
      preferredSkills: ["React", "Node.js", "AWS", "Docker"],
      eligibility: {
        branches: ["dept-cse", "dept-it", "dept-ece"],
        minCgpa: 7.0,
        maxBacklogs: 0,
        batch: ["2024", "2025"],
        gender: "any",
      },
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "active",
      applicationsCount: 45,
      shortlistedCount: 12,
      offersCount: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "job-2",
      companyId: "company-2",
      title: "Machine Learning Engineer",
      description: "Work on cutting-edge AI/ML projects to solve real-world problems.",
      roleType: "full-time",
      ctc: 1800000,
      currency: "INR",
      locations: ["Bangalore"],
      workMode: "onsite",
      responsibilities: [
        "Develop and deploy machine learning models",
        "Work with large datasets and big data technologies",
        "Research and implement state-of-the-art ML algorithms",
        "Optimize model performance and scalability",
      ],
      requirements: [
        "B.Tech/M.Tech in CS, AI/ML, or related field",
        "Strong foundation in mathematics and statistics",
        "Experience with Python and ML frameworks",
        "Knowledge of deep learning architectures",
      ],
      preferredSkills: ["TensorFlow", "PyTorch", "NLP", "Computer Vision"],
      eligibility: {
        branches: ["dept-cse", "dept-it"],
        minCgpa: 7.5,
        maxBacklogs: 0,
        batch: ["2024"],
        gender: "any",
      },
      applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: "active",
      applicationsCount: 32,
      shortlistedCount: 8,
      offersCount: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "job-3",
      companyId: "company-1",
      title: "Frontend Developer Intern",
      description: "Learn and grow with our frontend team while working on real projects.",
      roleType: "internship",
      stipend: 25000,
      currency: "INR",
      locations: ["Pune"],
      workMode: "hybrid",
      responsibilities: [
        "Develop responsive web interfaces",
        "Work with design team to implement UI/UX",
        "Learn and apply modern frontend technologies",
        "Participate in daily standups and team meetings",
      ],
      requirements: [
        "Currently pursuing B.Tech in CS/IT",
        "Basic knowledge of HTML, CSS, JavaScript",
        "Familiarity with React is a plus",
        "Eagerness to learn and grow",
      ],
      preferredSkills: ["React", "TypeScript", "Tailwind CSS"],
      eligibility: {
        branches: ["dept-cse", "dept-it"],
        minCgpa: 6.5,
        maxBacklogs: 1,
        batch: ["2025", "2026"],
        gender: "any",
      },
      applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: "active",
      applicationsCount: 78,
      shortlistedCount: 20,
      offersCount: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  jobs.forEach((j) => db.jobs.set(j._id, j))

  // Sample students
  const students: Student[] = [
    {
      _id: "student-1",
      userId: "user-student-1",
      firstName: "Amit",
      lastName: "Kumar",
      email: "amit.kumar@college.edu",
      phone: "+91-9876543212",
      gender: "male",
      department: "dept-cse",
      batch: "2024",
      rollNumber: "CSE2024001",
      cgpa: 8.5,
      backlogs: 0,
      tenthPercentage: 92,
      twelfthPercentage: 89,
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
      projects: [
        {
          title: "E-commerce Platform",
          description: "Full-stack e-commerce platform with payment integration",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        },
      ],
      internships: [
        {
          company: "StartupXYZ",
          role: "Frontend Developer Intern",
          description: "Worked on React-based dashboard applications",
          startDate: new Date("2023-05-01"),
          endDate: new Date("2023-07-31"),
          isCurrent: false,
        },
      ],
      certifications: [],
      achievements: ["Won 1st place in college hackathon"],
      githubUrl: "https://github.com/amitkumar",
      linkedinUrl: "https://linkedin.com/in/amitkumar",
      resumes: [],
      placementStatus: "unplaced",
      isEligible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  students.forEach((s) => {
    db.students.set(s._id, s)
    // Create user for student
    const studentUser: User = {
      _id: s.userId,
      email: s.email,
      password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
      role: "student",
      isApproved: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    db.users.set(studentUser._id, studentUser)
  })

  // Sample events
  const events: PlacementEvent[] = [
    {
      _id: "event-1",
      companyId: "company-1",
      jobId: "job-1",
      title: "TechCorp Pre-Placement Talk",
      type: "ppt",
      description: "Learn about TechCorp culture, projects, and career opportunities.",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      startTime: "10:00",
      endTime: "12:00",
      mode: "offline",
      venue: "Seminar Hall A",
      registeredStudents: [],
      attendedStudents: [],
      status: "scheduled",
      createdBy: "user-tpo-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "event-2",
      companyId: "company-2",
      jobId: "job-2",
      title: "InnovateTech Online Assessment",
      type: "online_test",
      description: "Online coding and aptitude test for ML Engineer position.",
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      startTime: "14:00",
      endTime: "16:00",
      mode: "online",
      meetingLink: "https://assessment.innovatetech.io/test-2024",
      registeredStudents: [],
      attendedStudents: [],
      status: "scheduled",
      createdBy: "user-tpo-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  events.forEach((e) => db.events.set(e._id, e))
}

// Initialize data on module load
initializeData()

// Helper functions
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function findUserByEmail(email: string): User | undefined {
  for (const user of db.users.values()) {
    if (user.email === email) {
      return user
    }
  }
  return undefined
}

export function findStudentByUserId(userId: string): Student | undefined {
  for (const student of db.students.values()) {
    if (student.userId === userId) {
      return student
    }
  }
  return undefined
}

export function findCompanyByUserId(userId: string): Company | undefined {
  for (const company of db.companies.values()) {
    if (company.userId === userId) {
      return company
    }
  }
  return undefined
}

export function getJobsForStudent(student: Student): Job[] {
  const jobs: Job[] = []

  for (const job of db.jobs.values()) {
    if (job.status !== "active") continue

    // Check eligibility
    const eligible =
      job.eligibility.branches.includes(student.department) &&
      student.cgpa >= job.eligibility.minCgpa &&
      student.backlogs <= job.eligibility.maxBacklogs &&
      job.eligibility.batch.includes(student.batch)

    if (eligible) {
      jobs.push(job)
    }
  }

  return jobs
}

export function getApplicationsForStudent(studentId: string): Application[] {
  const applications: Application[] = []

  for (const app of db.applications.values()) {
    if (app.studentId === studentId) {
      applications.push(app)
    }
  }

  return applications
}

export function getApplicationsForJob(jobId: string): Application[] {
  const applications: Application[] = []

  for (const app of db.applications.values()) {
    if (app.jobId === jobId) {
      applications.push(app)
    }
  }

  return applications
}
