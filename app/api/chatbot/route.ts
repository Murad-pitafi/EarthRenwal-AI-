import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "")

// Function to check if a query is about soil conditions
function isAboutSoilCondition(query: string): boolean {
  const soilKeywords = [
    "soil",
    "nutrient",
    "nitrogen",
    "phosphorus",
    "potassium",
    "fertilizer",
    "pH",
    "moisture",
    "dirt",
    "ground",
    "earth",
    "land quality",
    "soil health",
    "soil condition",
    "soil status",
    "soil test",
    "soil analysis",
    "soil report",
    "مٹی",
    "زمین",
    "کھاد",
    "نائٹروجن",
    "فاسفورس",
    "پوٹاشیم",
  ]

  const queryLower = query.toLowerCase()
  return soilKeywords.some((keyword) => queryLower.includes(keyword.toLowerCase()))
}

export async function POST(req: Request) {
  try {
    const { query, language, sensorData, soilHealth } = await req.json()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Check if the query is about soil conditions
    const isSoilQuery = isAboutSoilCondition(query)

    // Format sensor data for context, but only include if the query is about soil
    let sensorContext = ""
    if (isSoilQuery && sensorData) {
      sensorContext = `
CURRENT FARM SENSOR DATA:
${sensorData}

SOIL HEALTH ASSESSMENT:
${soilHealth}

When discussing soil nutrients:
- Nitrogen (N): Essential for leaf growth and green vegetation
- Phosphorus (P): Important for root development and flowering
- Potassium (K): Helps with overall plant health and disease resistance

For excessive nutrient levels:
- Excessive Nitrogen: Reduce nitrogen fertilizers, plant cover crops that use nitrogen, avoid over-irrigation
- Excessive Phosphorus: Stop phosphorus fertilization, plant cover crops, prevent soil erosion
- Excessive Potassium: Avoid potassium fertilizers, leach soil with irrigation if needed
`
    }

    // Update the prompt to include sensor data and formatting instructions
    const prompt = `
You are Mali Agent, an AI assistant specializing in agriculture and soil science.
Respond in ${language === "ur" ? "Urdu" : "English"} language.

${
  isSoilQuery && sensorContext
    ? `You have access to real-time sensor data from the farm. USE THIS DATA when answering questions about current soil conditions:
${sensorContext}`
    : "You are a helpful agricultural assistant. For general questions, provide friendly, conversational responses."
}

IMPORTANT: Keep your responses VERY BRIEF - maximum 3-4 lines only.

Focus on providing practical farming advice, crop management techniques, soil health recommendations,
pest control strategies, and sustainable agricultural practices.

Format your response with:
- Clear, concise sentences
- Use ** for important terms (like **crop rotation**)
- No lengthy explanations

If asked about weather, provide general agricultural implications rather than specific forecasts.
If asked about soil conditions, reference the sensor data provided.
For general greetings or non-soil related questions, respond in a friendly, conversational manner.

User query: ${query}
`

    console.log("Is soil query:", isSoilQuery)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chatbot API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
