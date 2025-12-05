import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { candidateName, interviewRound, feedbackText } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  })

  const prompt = `Summarize this interview feedback for ${candidateName}.

Interview Round: ${interviewRound}

Raw Feedback:
${feedbackText}

Provide a structured JSON summary with:
{
  "candidateName": "${candidateName}",
  "overallScore": number (1-10),
  "strengths": ["list of strengths"],
  "areasForImprovement": ["list of areas for improvement"],
  "technicalAssessment": {
    "score": number (1-10),
    "summary": "summary text"
  },
  "communicationAssessment": {
    "score": number (1-10),
    "summary": "summary text"
  },
  "recommendation": "strong_hire" | "hire" | "maybe" | "no_hire",
  "recommendationReasoning": "reasoning text",
  "nextSteps": "suggested next steps",
  "summary": "A brief professional summary of the candidate's performance"
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json(JSON.parse(text))
  } catch (error) {
    console.error("Error summarizing feedback:", error)
    return Response.json({ error: "Failed to summarize feedback" }, { status: 500 })
  }
}
