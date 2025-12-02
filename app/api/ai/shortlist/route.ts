import { generateObject } from "ai"
import { z } from "zod"

const shortlistSchema = z.object({
  rankedCandidates: z.array(
    z.object({
      candidateId: z.string(),
      name: z.string(),
      rank: z.number(),
      score: z.number(),
      reasoning: z.string(),
      strengths: z.array(z.string()),
      concerns: z.array(z.string()),
      recommendation: z.enum(["strong_yes", "yes", "maybe", "no"]),
    }),
  ),
  borderlineCandidates: z.array(
    z.object({
      candidateId: z.string(),
      name: z.string(),
      reason: z.string(),
    }),
  ),
  summary: z.string(),
})

export async function POST(req: Request) {
  const { jobDescription, eligibilityCriteria, candidates } = await req.json()

  const { object } = await generateObject({
    model: "google/gemini-2.5-flash",
    schema: shortlistSchema,
    prompt: `Analyze and rank these candidates for the job position.

Job Description:
${jobDescription}

Eligibility Criteria:
${JSON.stringify(eligibilityCriteria, null, 2)}

Candidates:
${JSON.stringify(candidates, null, 2)}

Provide:
1. Ranked list of top candidates with detailed reasoning
2. Borderline candidates who may have lower CGPA but strong skills/projects
3. Summary of the overall candidate pool quality`,
    maxOutputTokens: 4000,
  })

  return Response.json(object)
}
