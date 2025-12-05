import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { jobDescription, jobTitle, requiredSkills } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  })

  const prompt = `Analyze this job description and provide improvements.

Title: ${jobTitle || "Not specified"}
Required Skills: ${requiredSkills || "Not specified"}

Current JD:
${jobDescription}

Provide a JSON object with:
{
  "score": number (0-100),
  "issues": [
    {
      "type": "vague" | "missing" | "unclear" | "improvement",
      "description": "issue description",
      "suggestion": "fix suggestion"
    }
  ],
  "improvedJD": {
    "title": "Job Title",
    "summary": "About the role",
    "responsibilities": ["list of responsibilities"],
    "requirements": ["list of requirements"],
    "niceToHave": ["list of nice-to-have skills"],
    "benefits": ["list of benefits"]
  }
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json(JSON.parse(text))
  } catch (error: any) {
    console.error("Error improving JD:", error)
    return Response.json({ error: error.message || "Failed to improve JD" }, { status: 500 })
  }
}
