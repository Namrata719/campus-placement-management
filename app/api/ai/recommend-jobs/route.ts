import { generateObject } from "ai"
import { z } from "zod"

const jobRecommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      jobId: z.string(),
      matchScore: z.number(),
      reasons: z.array(z.string()),
      fitSummary: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  const { studentProfile, availableJobs } = await req.json()

  const { object } = await generateObject({
    model: "google/gemini-2.5-flash",
    schema: jobRecommendationSchema,
    prompt: `Based on the student's profile and preferences, recommend the most suitable jobs with explanations.

Student Profile:
${JSON.stringify(studentProfile, null, 2)}

Available Jobs:
${JSON.stringify(availableJobs, null, 2)}

For each recommended job, provide:
1. Match score (0-100)
2. Clear reasons why this job is a good fit
3. A brief summary of the fit`,
    maxOutputTokens: 2000,
  })

  return Response.json(object)
}
