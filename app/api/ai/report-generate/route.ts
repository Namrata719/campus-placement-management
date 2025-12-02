import { generateText } from "ai"

export async function POST(req: Request) {
  const { reportType, placementData, timePeriod } = await req.json()

  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `Generate a ${reportType} placement report for ${timePeriod}.

Placement Data:
${JSON.stringify(placementData, null, 2)}

Generate a comprehensive, well-formatted report including:
1. Executive Summary
2. Key Highlights and Metrics
3. Branch-wise Analysis
4. Top Recruiting Companies
5. Trends and Insights
6. Areas for Improvement
7. Recommendations

Use clear headings, bullet points, and include specific numbers from the data.`,
    maxOutputTokens: 4000,
  })

  return Response.json({ report: text })
}
