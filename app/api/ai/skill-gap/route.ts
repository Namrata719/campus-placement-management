import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { studentProfile, targetRoles } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  })

  const prompt = `Analyze the skill gap for this student aiming for specific roles.

Student Profile:
${JSON.stringify(studentProfile, null, 2)}

Target Roles: ${targetRoles.join(", ")}

Provide a JSON object with the following structure:
{
  "currentSkillLevel": {
    "strong": ["skill1", "skill2"],
    "moderate": ["skill3"],
    "weak": ["skill4"]
  },
  "gapAnalysis": [
    {
      "skill": "skill_name",
      "importance": "critical" | "important" | "nice_to_have",
      "currentLevel": "none" | "basic" | "intermediate" | "advanced",
      "requiredLevel": "basic" | "intermediate" | "advanced",
      "learningPath": ["step1", "step2"]
    }
  ],
  "recommendedCourses": [
    {
      "topic": "topic_name",
      "reason": "reason",
      "estimatedTime": "time"
    }
  ],
  "overallReadiness": number (0-100),
  "summary": "summary text"
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json(JSON.parse(text))
  } catch (error: any) {
    console.error("Error generating skill gap analysis:", error)
    return Response.json({ error: error.message || "Failed to generate analysis" }, { status: 500 })
  }
}
