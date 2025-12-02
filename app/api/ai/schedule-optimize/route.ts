import { generateObject } from "ai"
import { z } from "zod"

const scheduleSchema = z.object({
  optimizedSchedule: z.array(
    z.object({
      eventId: z.string(),
      company: z.string(),
      eventType: z.string(),
      suggestedDate: z.string(),
      suggestedTime: z.string(),
      reason: z.string(),
    }),
  ),
  conflicts: z.array(
    z.object({
      description: z.string(),
      resolution: z.string(),
    }),
  ),
  recommendations: z.array(z.string()),
})

export async function POST(req: Request) {
  const { events, constraints, examSchedule } = await req.json()

  const { object } = await generateObject({
    model: "google/gemini-2.5-flash",
    schema: scheduleSchema,
    prompt: `Optimize this placement event schedule to minimize conflicts and student fatigue.

Requested Events:
${JSON.stringify(events, null, 2)}

Constraints:
${JSON.stringify(constraints, null, 2)}

Student Exam Schedule:
${JSON.stringify(examSchedule, null, 2)}

Provide an optimized schedule with reasoning for each placement.`,
    maxOutputTokens: 2000,
  })

  return Response.json(object)
}
