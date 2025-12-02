import { generateObject } from "ai"
import { z } from "zod"

const skillGapSchema = z.object({
  currentSkillLevel: z.object({
    strong: z.array(z.string()),
    moderate: z.array(z.string()),
    weak: z.array(z.string()),
  }),
  gapAnalysis: z.array(
    z.object({
      skill: z.string(),
      importance: z.enum(["critical", "important", "nice_to_have"]),
      currentLevel: z.enum(["none", "basic", "intermediate", "advanced"]),
      requiredLevel: z.enum(["basic", "intermediate", "advanced"]),
      learningPath: z.array(z.string()),
    }),
  ),
  recommendedCourses: z.array(
    z.object({
      topic: z.string(),
      reason: z.string(),
      estimatedTime: z.string(),
    }),
  ),
  overallReadiness: z.number().min(0).max(100),
  summary: z.string(),
})

export async function POST(req: Request) {
  const { studentProfile, targetRoles } = await req.json()

  const { object } = await generateObject({
    model: "google/gemini-2.5-flash",
    schema: skillGapSchema,
    prompt: `Analyze the skill gap for this student aiming for specific roles.

Student Profile:
${JSON.stringify(studentProfile, null, 2)}

Target Roles: ${targetRoles.join(", ")}

Provide:
1. Assessment of current skill levels
2. Gap analysis for each missing/weak skill
3. Recommended learning topics
4. Overall readiness percentage
5. Summary with actionable advice`,
    maxOutputTokens: 3000,
  })

  return Response.json(object)
}
