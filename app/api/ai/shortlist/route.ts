import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { jobDescription, eligibilityCriteria, candidates } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  })

  const prompt = `Analyze and rank these candidates for the job position.

Job Description:
${jobDescription}

Eligibility Criteria:
${JSON.stringify(eligibilityCriteria, null, 2)}

Candidates:
${JSON.stringify(candidates, null, 2)}

Provide a JSON object with:
{
  "rankedCandidates": [
    {
      "candidateId": "id",
      "name": "name",
      "rank": number,
      "score": number (0-100),
      "reasoning": "reasoning text",
      "strengths": ["list of strengths"],
      "concerns": ["list of concerns"],
      "recommendation": "strong_yes" | "yes" | "maybe" | "no"
    }
  ],
  "borderlineCandidates": [
    {
      "candidateId": "id",
      "name": "name",
      "reason": "reason text"
    }
  ],
  "summary": "summary text"
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json(JSON.parse(text))
  } catch (error: any) {
    console.error("Error shortlisting candidates:", error)
    return Response.json({ error: error.message || "Failed to shortlist candidates" }, { status: 500 })
  }
}
