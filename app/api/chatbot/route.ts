import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { query, language } = await req.json()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create a farming-specific prompt with context and formatting instructions
    const prompt = `
      You are Mali Agent, an AI assistant specializing in agriculture and soil science.
      Respond in ${language === "ur" ? "Urdu" : "English"} language.
      
      Focus on providing practical farming advice, crop management techniques, soil health recommendations,
      pest control strategies, and sustainable agricultural practices.
      
      IMPORTANT: Format your response using markdown:
      - Use double asterisks for bold text like **soil quality**, **crop rotation**, **pest control**, etc.
      - Make sure to highlight important agricultural terms with bold formatting
      - DO NOT use HTML tags like <strong> or <em>
      - Use plain text with double asterisks for bold, like: **soil health** is important
      
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
