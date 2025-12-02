import { generateObject } from "ai"
import { z } from "zod"

const questionsSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      type: z.enum(["technical", "behavioral", "situational"]),
      difficulty: z.enum(["easy", "medium", "hard"]),
      topic: z.string(),
      expectedAnswer: z.string().optional(),
    }),
  ),
})

export async function POST(req: Request) {
  const { role, skills, questionType, difficulty, count } = await req.json()

  const { object } = await generateObject({
    model: "openai/gpt-5-mini",
    schema: questionsSchema,
    prompt: `Generate ${count || 10} interview questions for the following role:

Role: ${role}
Skills to test: ${skills}
Question type: ${questionType || "mixed"}
Difficulty: ${difficulty || "medium"}

Generate diverse, practical questions that would help assess a candidate's suitability for this role.`,
    maxOutputTokens: 3000,
  })

  return Response.json(object)
}
