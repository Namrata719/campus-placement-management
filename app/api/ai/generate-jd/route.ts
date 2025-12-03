import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
    const { title, type, experience, skills, description } = await req.json()

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
    })

    const prompt = `Generate a professional job description for the following role:

Job Title: ${title}
Job Type: ${type}
Experience Level: ${experience}
Key Skills: ${skills}
Additional Context: ${description || "None"}

The JD should be attractive to candidates and clearly outline expectations.

Provide a JSON object with:
{
  "title": "Job Title",
  "type": "Job Type",
  "location": "Location (e.g., Remote/City)",
  "about": "About the role paragraph",
  "responsibilities": ["list of responsibilities"],
  "requirements": ["list of requirements"],
  "niceToHave": ["list of nice-to-have skills"]
}`

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        return Response.json(JSON.parse(text))
    } catch (error: any) {
        console.error("Error generating JD:", error)
        return Response.json({ error: error.message || "Failed to generate JD" }, { status: 500 })
    }
}
