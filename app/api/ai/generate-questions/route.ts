import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { role, skills, questionType, difficulty, count } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  })

  const prompt = `Generate ${count || 10} interview questions for the following role:

Role: ${role}
Skills to test: ${skills}
Question type: ${questionType || "mixed"}
Difficulty: ${difficulty || "medium"}

Generate diverse, practical questions that would help assess a candidate's suitability for this role.

Provide a JSON object with:
{
  "questions": [
    {
      "question": "Question text",
      "type": "technical" | "behavioral" | "situational",
      "difficulty": "easy" | "medium" | "hard",
      "topic": "Topic (e.g., React, DSA)",
      "expectedAnswer": "Brief expected answer"
    }
  ]
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json(JSON.parse(text))
  } catch (error: any) {
    console.error("Error generating questions:", error)
    return Response.json({ error: error.message || "Failed to generate questions" }, { status: 500 })
  }
}
