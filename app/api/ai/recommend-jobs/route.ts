import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { studentProfile, availableJobs } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  })

  const prompt = `Based on the student's profile and preferences, recommend the most suitable jobs with explanations.

Student Profile:
${JSON.stringify(studentProfile, null, 2)}

Available Jobs:
${JSON.stringify(availableJobs, null, 2)}

Provide a JSON object with:
{
  "recommendations": [
    {
      "jobId": "id_from_available_jobs",
      "matchScore": number (0-100),
      "reasons": ["list of reasons"],
      "fitSummary": "summary text"
    }
  ]
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json(JSON.parse(text))
  } catch (error) {
    console.error("Error recommending jobs:", error)
    return Response.json({ error: "Failed to recommend jobs" }, { status: 500 })
  }
}
