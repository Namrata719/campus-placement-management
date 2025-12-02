import { generateObject } from "ai"
import { z } from "zod"

const feedbackSummarySchema = z.object({
  candidateName: z.string(),
  overallScore: z.number().min(1).max(10),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  technicalAssessment: z.object({
    score: z.number().min(1).max(10),
    summary: z.string(),
  }),
  communicationAssessment: z.object({
    score: z.number().min(1).max(10),
    summary: z.string(),
  }),
  recommendation: z.enum(["strong_hire", "hire", "maybe", "no_hire"]),
  recommendationReasoning: z.string(),
  nextSteps: z.string(),
})

export async function POST(req: Request) {
  const { candidateName, interviewRound, feedbackText } = await req.json()

  const { object } = await generateObject({
    model: "google/gemini-2.5-flash",
    schema: feedbackSummarySchema,
    prompt: `Summarize this interview feedback for ${candidateName}.

Interview Round: ${interviewRound}

Raw Feedback:
${feedbackText}

Provide a structured summary with:
1. Overall score
2. Key strengths
3. Areas for improvement
4. Technical and communication assessments
5. Final recommendation with reasoning
6. Suggested next steps`,
    maxOutputTokens: 2000,
  })

  return Response.json(object)
}
