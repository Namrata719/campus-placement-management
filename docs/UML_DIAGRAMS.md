# UML Diagrams for Campus Placement Management System

## 1. System Architecture Diagram

This diagram illustrates the high-level architecture of the application, including the frontend, backend API, database, and external AI services.

```mermaid
graph TD
    subgraph Client_Side
        Browser[Web Browser]
        NextJS_Client[Next.js Client Components]
    end

    subgraph Server_Side
        NextJS_Server[Next.js Server Actions / API Routes]
        Auth[Authentication (NextAuth/Custom)]
        Gemini_Integration[Google Gemini Integration]
    end

    subgraph Database
        MongoDB[(MongoDB Atlas)]
    end

    subgraph External_Services
        Google_Gemini_API[Google Gemini API]
        Email_Service[SMTP / Email Service]
    end

    Browser -->|HTTP/HTTPS| NextJS_Server
    NextJS_Client -->|Fetch API| NextJS_Server
    NextJS_Server -->|Mongoose| MongoDB
    NextJS_Server -->|AI SDK| Google_Gemini_API
    NextJS_Server -->|Nodemailer| Email_Service
    NextJS_Server -->|Verify| Auth
```

## 2. Use Case Diagram

This diagram depicts the interactions between the primary actors (Student, TPO, Company) and the system's use cases.

```mermaid
usecaseDiagram
    actor Student
    actor TPO as "Training & Placement Officer"
    actor Company as "Company HR"

    package "Placement System" {
        usecase "Login/Register" as UC1
        usecase "Manage Profile" as UC2
        usecase "View Jobs" as UC3
        usecase "Apply for Job" as UC4
        usecase "Upload Resume" as UC5
        usecase "View AI Insights" as UC6
        
        usecase "Manage Students" as UC7
        usecase "Manage Companies" as UC8
        usecase "Post Jobs" as UC9
        usecase "Schedule Interviews" as UC10
        usecase "Generate Reports" as UC11
        usecase "Configure Policies" as UC12
        
        usecase "Shortlist Candidates" as UC13
        usecase "Send Offers" as UC14
    }

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6

    TPO --> UC1
    TPO --> UC7
    TPO --> UC8
    TPO --> UC9
    TPO --> UC10
    TPO --> UC11
    TPO --> UC12
    TPO --> UC6

    Company --> UC1
    Company --> UC9
    Company --> UC13
    Company --> UC14
```

## 3. Class Diagram

This diagram represents the data models and their relationships, based on the MongoDB schemas.

```mermaid
classDiagram
    class User {
        +String email
        +String password
        +String role
        +Date createdAt
    }

    class Student {
        +String firstName
        +String lastName
        +String usn
        +String department
        +Number cgpa
        +Array skills
        +String placementStatus
        +ObjectId userId
    }

    class Company {
        +String name
        +String industry
        +String website
        +String hrContact
        +ObjectId userId
    }

    class Job {
        +String title
        +String description
        +String type
        +Number salary
        +String location
        +Date deadline
        +ObjectId companyId
        +Array eligibility
    }

    class Application {
        +ObjectId studentId
        +ObjectId jobId
        +String status
        +Date appliedAt
    }

    class Resume {
        +ObjectId studentId
        +String fileUrl
        +String parsedContent
        +Number atsScore
    }

    User <|-- Student
    User <|-- Company
    Company "1" --> "*" Job : posts
    Student "1" --> "*" Application : applies
    Job "1" --> "*" Application : receives
    Student "1" --> "1" Resume : has
```

## 4. Sequence Diagram: Student Application Flow

This diagram details the sequence of operations when a student applies for a job.

```mermaid
sequenceDiagram
    participant S as Student
    participant FE as Frontend
    participant API as API Route
    participant DB as MongoDB
    participant AI as Gemini AI

    S->>FE: Click "Apply Now"
    FE->>API: POST /api/student/applications
    API->>DB: Check Eligibility (CGPA, Backlogs)
    alt Eligible
        API->>AI: Analyze Resume vs JD (Optional)
        AI-->>API: Match Score
        API->>DB: Create Application Record
        DB-->>API: Success
        API-->>FE: Application Submitted
        FE-->>S: Show Success Message
    else Not Eligible
        API-->>FE: Error: Not Eligible
        FE-->>S: Show Eligibility Error
    end
```

## 5. Sequence Diagram: TPO AI Insights Generation

This diagram shows how the TPO generates AI-driven insights and reports.

```mermaid
sequenceDiagram
    participant TPO
    participant FE as Dashboard UI
    participant API as /api/tpo/ai-insights
    participant DB as MongoDB
    participant AI as Google Gemini

    TPO->>FE: Request "Generate Report"
    FE->>API: POST { type: "generate_report" }
    API->>DB: Fetch Placement Data (Counts, Rates)
    DB-->>API: Raw Data
    API->>AI: Send Prompt with Data
    AI-->>API: Generated Summary & Insights
    API-->>FE: JSON Response
    FE-->>TPO: Display Report & Charts
```

## 6. Activity Diagram: Placement Drive Process

This diagram outlines the workflow of a typical placement drive.

```mermaid
stateDiagram-v2
    [*] --> JobPosted
    JobPosted --> ApplicationsOpen
    ApplicationsOpen --> ApplicationsClosed : Deadline Reached
    ApplicationsClosed --> ResumeScreening
    
    state ResumeScreening {
        [*] --> FilterByCriteria
        FilterByCriteria --> AIShortlisting
        AIShortlisting --> ManualReview
        ManualReview --> [*]
    }

    ResumeScreening --> InterviewRounds
    
    state InterviewRounds {
        [*] --> AptitudeTest
        AptitudeTest --> TechnicalRound
        TechnicalRound --> HRRound
        HRRound --> [*]
    }

    InterviewRounds --> Selection
    Selection --> OfferReleased
    OfferReleased --> OfferAccepted : Student Accepts
    OfferReleased --> OfferRejected : Student Rejects
    OfferAccepted --> [*]
    OfferRejected --> [*]
```
