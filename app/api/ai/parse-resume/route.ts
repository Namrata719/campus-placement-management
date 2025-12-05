import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { resumeText } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  })

  const prompt = `Parse this resume and extract structured information. Also identify areas for improvement.

Resume Text:
${resumeText}

Extract all relevant information and provide suggestions for improving each section.

Provide a JSON object with:
{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedIn": "string",
    "github": "string"
  },
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "gpa": "string",
      "year": "string"
    }
  ],
  "skills": ["list of skills"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "description": ["list of points"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["list of techs"]
    }
  ],
  "certifications": ["list of certs"],
  "achievements": ["list of achievements"],
  "suggestions": [
    {
      "section": "string",
      "issue": "string",
      "suggestion": "string"
    }
  ]
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json(JSON.parse(text))
  } catch (error: any) {
    console.error("Error parsing resume:", error)
    return Response.json({ error: error.message || "Failed to parse resume" }, { status: 500 })
  }
}
