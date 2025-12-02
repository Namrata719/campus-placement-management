import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
  const { purpose, keyPoints, recipientType, studentName } = await req.json()

  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    prompt: `Write a professional email for a student in the placement process.

Student Name: ${studentName || "Student"}
Recipient: ${recipientType || "HR"}
Purpose: ${purpose}
Key Points to Include: ${keyPoints}

Write a polished, professional email that is appropriate for the placement context. Include proper greeting, body, and sign-off.`,
    maxOutputTokens: 1000,
  })

  return Response.json({ email: text })
}
