import { convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: string } = await req.json()

  const systemPrompt = `You are an AI Career Coach for a college placement management system. Your role is to help students with:
- Interview preparation (DSA, system design, HR questions)
- Resume improvement tips
- Placement process guidance
- Career advice and company research
- Mock interview questions

${context ? `Additional Context: ${context}` : ""}

Be helpful, encouraging, and provide practical, actionable advice. When asked about technical topics, give clear explanations with examples.`

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "google/gemini-2.5-flash",
    system: systemPrompt,
    prompt,
    maxOutputTokens: 2000,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
