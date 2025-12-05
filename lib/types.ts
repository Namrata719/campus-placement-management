export type UserRole = "student" | "tpo" | "company"

export interface User {
  _id: string
  email: string
  password: string // hashed with bcrypt
  role: UserRole
  isApproved: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  refreshToken?: string
}

export interface Student {
  _id: string
  userId: string // Reference to User
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  gender?: "male" | "female" | "other"
  dateOfBirth?: Date
  address?: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  profileImage?: string

  // Academic Details
  department: string // Reference to Department
  batch: string // e.g., "2024"
  rollNumber: string
  cgpa: number
  backlogs: number
  tenthPercentage: number
  twelfthPercentage: number

  // Professional Info
  skills: string[]
  projects: Project[]
  internships: Internship[]
  certifications: Certification[]
  achievements: string[]
  githubUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string

  // Resume
  resumes: Resume[]
  activeResumeId?: string

  // Placement Status
  placementStatus: "unplaced" | "placed" | "not_interested"
  currentOffer?: {
    companyId: string
    jobId: string
    ctc: number
    joiningStatus: "pending" | "accepted" | "rejected" | "joined"
  }

  // Eligibility
  isEligible: boolean
  eligibilityRemarks?: string

  createdAt: Date
  updatedAt: Date
}

export interface Project {
  title: string
  description: string
  technologies: string[]
  startDate?: Date
  endDate?: Date
  url?: string
  githubUrl?: string
}

export interface Internship {
  company: string
  role: string
  description: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  location?: string
}

export interface Certification {
  name: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  credentialId?: string
  url?: string
}

export interface Resume {
  _id: string
  name: string
  fileUrl: string
  uploadedAt: Date
  parsedData?: ParsedResumeData
  aiScore?: number
}

export interface ParsedResumeData {
  extractedSkills: string[]
  extractedExperience: string[]
  extractedEducation: string[]
  suggestions: string[]
}

export interface Company {
  _id: string
  userId: string // Reference to User
  name: string
  website?: string
  industry: string
  sector: string
  description?: string
  logo?: string
  locations: string[]
  employeeCount?: string
  foundedYear?: number

  // Contact
  contactPerson: {
    name: string
    email: string
    phone: string
    designation: string
  }

  // Status
  isApproved: boolean
  approvedBy?: string // TPO userId
  approvedAt?: Date

  createdAt: Date
  updatedAt: Date
}

export interface Job {
  _id: string
  companyId: string // Reference to Company

  // Basic Info
  title: string
  description: string
  roleType: "full-time" | "internship" | "contract"

  // Compensation
  ctc?: number // for full-time
  stipend?: number // for internship
  currency: string

  // Location
  locations: string[]
  workMode: "onsite" | "remote" | "hybrid"

  // Requirements
  responsibilities: string[]
  requirements: string[]
  preferredSkills: string[]

  // Eligibility Criteria
  eligibility: {
    branches: string[] // Department IDs
    minCgpa: number
    maxBacklogs: number
    batch: string[]
    gender?: "male" | "female" | "any"
    minTenthPercentage?: number
    minTwelfthPercentage?: number
  }

  // Application
  applicationDeadline: Date
  maxApplications?: number

  // Status
  status: "draft" | "pending_approval" | "active" | "closed" | "cancelled"
  approvedBy?: string
  approvedAt?: Date

  // Stats
  applicationsCount: number
  shortlistedCount: number
  offersCount: number

  createdAt: Date
  updatedAt: Date
}

export interface Application {
  _id: string
  studentId: string // Reference to Student
  jobId: string // Reference to Job
  companyId: string // Reference to Company

  // Application Details
  resumeId: string // Reference to Resume used
  coverLetter?: string

  // Status Tracking
  status: ApplicationStatus
  statusHistory: StatusChange[]

  // AI Analysis
  aiMatchScore?: number
  aiAnalysis?: {
    strengths: string[]
    gaps: string[]
    suggestions: string[]
  }

  // Interview Feedback
  interviewFeedback?: InterviewFeedback[]

  // Offer Details
  offer?: {
    ctc: number
    role: string
    location: string
    joiningDate?: Date
    offerLetterUrl?: string
    status: "pending" | "accepted" | "rejected"
    respondedAt?: Date
  }

  appliedAt: Date
  updatedAt: Date
}

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "test_scheduled"
  | "test_cleared"
  | "gd_scheduled"
  | "gd_cleared"
  | "interview_r1"
  | "interview_r2"
  | "interview_hr"
  | "offered"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "joined"

export interface StatusChange {
  from: ApplicationStatus
  to: ApplicationStatus
  changedBy: string
  changedAt: Date
  remarks?: string
}

export interface InterviewFeedback {
  round: string
  interviewerId: string
  rating: number
  strengths: string[]
  weaknesses: string[]
  comments: string
  recommendation: "strong_yes" | "yes" | "maybe" | "no" | "strong_no"
  submittedAt: Date
}

export interface PlacementEvent {
  _id: string
  companyId: string
  jobId?: string

  // Event Details
  title: string
  type: "ppt" | "online_test" | "gd" | "technical_interview" | "hr_interview" | "other"
  description?: string

  // Schedule
  date: Date
  startTime: string
  endTime: string

  // Location
  mode: "online" | "offline"
  venue?: string
  meetingLink?: string

  // Participants
  eligibleStudents?: string[] // Student IDs
  registeredStudents: string[]
  attendedStudents: string[]

  // Status
  status: "scheduled" | "ongoing" | "completed" | "cancelled"

  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  _id: string
  userId: string

  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "application" | "event" | "announcement" | "system"

  // Reference
  referenceType?: "job" | "application" | "event" | "company"
  referenceId?: string

  isRead: boolean
  readAt?: Date

  createdAt: Date
}

export interface Department {
  _id: string
  name: string
  code: string // e.g., "CSE", "ECE"
  description?: string
  isActive: boolean
}

export interface Batch {
  _id: string
  year: string // e.g., "2024"
  startDate: Date
  endDate: Date
  isActive: boolean
}

export interface FAQ {
  _id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PlacementReport {
  _id: string
  batch: string
  academicYear: string

  stats: {
    totalStudents: number
    eligibleStudents: number
    placedStudents: number
    unplacedStudents: number
    placementPercentage: number

    totalCompanies: number
    totalOffers: number

    highestCtc: number
    averageCtc: number
    medianCtc: number

    branchWiseStats: {
      branch: string
      total: number
      placed: number
      percentage: number
      averageCtc: number
    }[]

    companyWiseStats: {
      companyId: string
      companyName: string
      offers: number
      averageCtc: number
    }[]
  }

  generatedAt: Date
  generatedBy: string
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  role: UserRole
  // Additional fields based on role
  firstName?: string
  lastName?: string
  companyName?: string
  phone?: string
  department?: string
  batch?: string
  rollNumber?: string
  cgpa?: number
  industry?: string
  designation?: string
  sector?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  iat: number
  exp: number
}

// Filter Types
export interface JobFilters {
  search?: string
  branches?: string[]
  minCtc?: number
  maxCtc?: number
  roleType?: string[]
  workMode?: string[]
  locations?: string[]
  status?: string
}

export interface StudentFilters {
  search?: string
  branches?: string[]
  batch?: string[]
  minCgpa?: number
  maxCgpa?: number
  placementStatus?: string[]
  skills?: string[]
}
