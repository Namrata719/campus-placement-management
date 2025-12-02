import { generateObject } from "ai"
import { z } from "zod"
import { google } from "@ai-sdk/google"

const resumeDataSchema = z.object({
  personalInfo: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedIn: z.string().optional(),
    github: z.string().optional(),
  }),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string().optional(),
      gpa: z.string().optional(),
      year: z.string().optional(),
    }),
  ),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      duration: z.string().optional(),
      description: z.array(z.string()),
    }),
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
    }),
  ),
  certifications: z.array(z.string()),
  achievements: z.array(z.string()),
  suggestions: z.array(
    z.object({
      section: z.string(),
      issue: z.string(),
      suggestion: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  const { resumeText } = await req.json()

  const { object } = await generateObject({
    model: google("gemini-1.5-flash"),
    schema: resumeDataSchema,
    prompt: `Parse this resume and extract structured information. Also identify areas for improvement.

Resume Text:
${resumeText}

Extract all relevant information and provide suggestions for improving each section.`,
    maxOutputTokens: 3000,
  })

  return Response.json(object)
}
