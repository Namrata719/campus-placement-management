import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { purpose, keyPoints, recipientType, studentName } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `Write a professional email for a student in the placement process.

Student Name: ${studentName || "Student"}
Recipient: ${recipientType || "HR"}
Purpose: ${purpose}
Key Points to Include: ${keyPoints}

Write a polished, professional email that is appropriate for the placement context. Include proper greeting, body, and sign-off.
Return only the email text.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json({ email: text })
  } catch (error: any) {
    console.error("Error generating email:", error)
    return Response.json({ error: error.message || "Failed to generate email" }, { status: 500 })
  }
}
