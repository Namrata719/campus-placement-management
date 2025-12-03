import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, context }: { messages: any[]; context?: string } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

  let systemPrompt = ""

  // Check if this is a policy chatbot request (context will include "policy" keyword)
  if (context && context.toLowerCase().includes("policy")) {
    systemPrompt = `You are a Campus Placement Policy Assistant. Your role is to help students understand and navigate placement policies, rules, and procedures. You should:

- Answer questions about placement eligibility criteria
- Explain placement process steps and timelines
- Clarify dream company policies and offer acceptance rules
- Provide information about CGPA requirements and branch-specific criteria
- Explain application deadlines and procedures
- Help with FAQs about the placement process
- Guide students on documentation requirements

Be clear, concise, and authoritative in your responses. If you don't have specific information about a policy, suggest that the student contact the TPO office directly.

${context ? `Context Information: ${context}` : ""}`
  } else {
    systemPrompt = `You are an AI Career Coach for a college placement management system. Your role is to help students with:
- Interview preparation (DSA, system design, HR questions)
- Resume improvement tips
- Placement process guidance
- Career advice and company research
- Mock interview questions

${context ? `Additional Context: ${context}` : ""}

Be helpful, encouraging, and provide practical, actionable advice. When asked about technical topics, give clear explanations with examples.`
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    })

    // Convert messages to Gemini format
    // The last message is the new prompt, so we take everything before it as history
    // Gemini requires the first message in history to be from the user
    let historyMessages = messages.slice(0, -1);

    // If the first message is from the assistant (e.g. welcome message), remove it or skip it
    // Gemini history must start with a user message
    while (historyMessages.length > 0 && historyMessages[0].role !== "user") {
      historyMessages.shift();
    }

    const history = historyMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }))

    const lastMessage = messages[messages.length - 1].content

    const chatSession = model.startChat({
      history: history,
    })

    const result = await chatSession.sendMessageStream(lastMessage)

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText))
            }
          }
        } catch (error) {
          console.error("Stream error:", error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (error: any) {
    console.error("Chat API Error:", error)
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
