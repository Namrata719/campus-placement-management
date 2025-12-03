import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { resumeText, jobDescription } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  })

  const prompt = `Analyze this resume against the job description and provide a detailed match analysis.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide a JSON object with:
{
  "matchScore": number (0-100),
  "strengths": ["list of strengths"],
  "gaps": ["list of gaps"],
  "suggestions": ["list of suggestions"],
  "skillMatch": {
    "matched": ["list of matched skills"],
    "missing": ["list of missing skills"]
  },
  "overallFeedback": "summary text"
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json(JSON.parse(text))
  } catch (error: any) {
    console.error("Error scoring resume:", error)
    return Response.json({ error: error.message || "Failed to score resume" }, { status: 500 })
  }
}
