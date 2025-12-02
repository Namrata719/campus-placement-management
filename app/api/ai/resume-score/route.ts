import { generateObject } from "ai"
import { z } from "zod"

const resumeScoreSchema = z.object({
  matchScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  suggestions: z.array(z.string()),
  skillMatch: z.object({
    matched: z.array(z.string()),
    missing: z.array(z.string()),
  }),
  overallFeedback: z.string(),
})

export async function POST(req: Request) {
  const { resumeText, jobDescription } = await req.json()

  const { object } = await generateObject({
    model: "openai/gpt-5-mini",
    schema: resumeScoreSchema,
    prompt: `Analyze this resume against the job description and provide a detailed match analysis.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide:
1. A match score from 0-100
2. Key strengths that align with the role
3. Gaps or missing requirements
4. Specific suggestions to improve the resume for this role
5. Skill matching analysis
6. Overall feedback summary`,
    maxOutputTokens: 2000,
  })

  return Response.json(object)
}
