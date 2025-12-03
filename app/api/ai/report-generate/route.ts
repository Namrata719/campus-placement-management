import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  const { reportType, placementData, timePeriod } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `Generate a ${reportType} placement report for ${timePeriod}.

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

Use clear headings, bullet points, and include specific numbers from the data.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return Response.json({ report: text })
  } catch (error: any) {
    console.error("Error generating report:", error)
    return Response.json({ error: error.message || "Failed to generate report" }, { status: 500 })
  }
}
