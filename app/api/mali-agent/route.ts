import { NextResponse } from "next/server"
import { ChatGroq } from "@langchain/groq"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { BufferMemory } from "langchain/memory"

// Initialize the Groq model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-70b-8192",
  temperature: 0.7,
})

// Create a memory instance to store conversation history
const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
  inputKey: "input",
})

export async function POST(req: Request) {
  try {
    const { messages, language, sensorData, soilHealth } = await req.json()

    // Get the last user message
    const lastMessage = messages[messages.length - 1]

    // Format sensor data for context
    let sensorContext = ""
    if (sensorData && sensorData.length > 0) {
      sensorContext = `
Current Farm Sensor Data:
${sensorData}

Overall Soil Health Assessment:
${soilHealth}
`
    }

    // Create a prompt template with context
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are Mali Agent, an AI assistant specializing in agriculture and soil science.
Respond in ${language === "ur" ? "Urdu" : "English"} language.

You have access to real-time sensor data from the farm, which you should reference when answering questions about current conditions.

Focus on providing practical farming advice, crop management techniques, soil health recommendations,
pest control strategies, and sustainable agricultural practices.

${sensorContext}

When discussing soil nutrients:
- Nitrogen (N): Essential for leaf growth and green vegetation
- Phosphorus (P): Important for root development and flowering
- Potassium (K): Helps with overall plant health and disease resistance

For excessive nutrient levels:
- Excessive Nitrogen: Reduce nitrogen fertilizers, plant cover crops that use nitrogen, avoid over-irrigation
- Excessive Phosphorus: Stop phosphorus fertilization, plant cover crops, prevent soil erosion
- Excessive Potassium: Avoid potassium fertilizers, leach soil with irrigation if needed

Be helpful, practical, and provide actionable advice based on the sensor data.`,
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
    ])

    // Create a chain
    const chain = RunnableSequence.from([
      {
        input: (input) => input.input,
        chat_history: async () => {
          const memoryResult = await memory.loadMemoryVariables({})
          return memoryResult.chat_history || []
        },
      },
      prompt,
      model,
      new StringOutputParser(),
    ])

    // Run the chain
    const response = await chain.invoke({
      input: lastMessage.content,
    })

    // Save the conversation to memory
    await memory.saveContext({ input: lastMessage.content }, { output: response })

    return NextResponse.json({ text: response })
  } catch (error) {
    console.error("Error in Mali Agent API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
