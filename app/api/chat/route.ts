import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json()

    const lastMessage = messages[messages.length - 1]

    // Create a farming-specific prompt with context
    const prompt = `
      You are Mali Agent, an AI assistant specializing in agriculture and soil science.
      Respond in ${language === "ur" ? "Urdu" : language} language.
      
      Focus on providing practical farming advice, crop management techniques, soil health recommendations,
      pest control strategies, and sustainable agricultural practices.
      
      If asked about weather, provide general agricultural implications rather than specific forecasts.
      
      User query: ${lastMessage.content}
    `

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
