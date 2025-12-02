import { generateObject } from "ai"
import { z } from "zod"
import { google } from "@ai-sdk/google"

const jdImprovementSchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      type: z.enum(["vague", "missing", "unclear", "improvement"]),
      description: z.string(),
      suggestion: z.string(),
    }),
  ),
  improvedJD: z.object({
    title: z.string(),
    summary: z.string(),
    responsibilities: z.array(z.string()),
    requirements: z.array(z.string()),
    niceToHave: z.array(z.string()),
    benefits: z.array(z.string()),
  }),
})

export async function POST(req: Request) {
  const { jobDescription, jobTitle, requiredSkills } = await req.json()

  const { object } = await generateObject({
    model: google("gemini-1.5-flash"),
    schema: jdImprovementSchema,
    prompt: `Analyze this job description and provide improvements.

Title: ${jobTitle || "Not specified"}
Required Skills: ${requiredSkills || "Not specified"}

Current JD:
${jobDescription}

Provide:
1. A quality score (0-100)
2. List of issues with suggestions to fix them
3. A fully rewritten, professional job description`,
    maxOutputTokens: 3000,
  })

  return Response.json(object)
}
