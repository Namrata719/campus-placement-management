import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { events, constraints, examSchedule } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  })

  const prompt = `Optimize this placement event schedule to minimize conflicts and student fatigue.

Requested Events:
${JSON.stringify(events, null, 2)}

Constraints:
${JSON.stringify(constraints, null, 2)}

Student Exam Schedule:
${JSON.stringify(examSchedule, null, 2)}

Provide a JSON object with:
{
  "optimizedSchedule": [
    {
      "eventId": "id",
      "company": "name",
      "eventType": "type",
      "suggestedDate": "YYYY-MM-DD",
      "suggestedTime": "HH:MM",
      "reason": "reason text"
    }
  ],
  "conflicts": [
    {
      "description": "conflict description",
      "resolution": "suggested resolution"
    }
  ],
  "recommendations": ["list of general recommendations"]
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json(JSON.parse(text))
  } catch (error: any) {
    console.error("Error optimizing schedule:", error)
    return Response.json({ error: error.message || "Failed to optimize schedule" }, { status: 500 })
  }
}
