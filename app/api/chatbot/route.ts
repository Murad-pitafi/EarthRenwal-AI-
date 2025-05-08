import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { query, language } = await req.json()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Update the prompt to include formatting instructions
    const prompt = `
  You are Mali Agent, an AI assistant specializing in agriculture and soil science.
  Respond in ${language === "ur" ? "Urdu" : "English"} language.
  
  IMPORTANT: Keep your responses VERY BRIEF - maximum 3-4 lines only.
  
  Focus on providing practical farming advice, crop management techniques, soil health recommendations,
  pest control strategies, and sustainable agricultural practices.
  
  Format your response with:
  - Clear, concise sentences
  - Use ** for important terms (like **crop rotation**)
  - No lengthy explanations
  
  If asked about weather, provide general agricultural implications rather than specific forecasts.
  
  User query: ${query}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chatbot API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
