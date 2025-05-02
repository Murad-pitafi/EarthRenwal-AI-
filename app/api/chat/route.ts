import { NextResponse } from "next/server"
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { ChatMessageHistory } from "langchain/stores/message/in_memory"
import { HumanMessage, AIMessage } from "@langchain/core/messages"

// Initialize the model
const model = new ChatOpenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
  modelName: "gemini-1.5-flash",
})

// Create a session store to maintain conversation history
const sessions = new Map<string, ChatMessageHistory>()

// Create a powerful prompt template
const systemPromptTemplate = PromptTemplate.fromTemplate(`
You are Mali Agent, an expert AI assistant specializing in agriculture and soil science.
You have deep knowledge of:
- Crop management and rotation strategies
- Soil health analysis and improvement techniques
- Pest and disease identification and treatment
- Weather patterns and their impact on farming
- Sustainable agricultural practices
- Local farming techniques in Pakistan
- Water conservation methods
- Organic farming approaches

Respond in {language} language.

Guidelines:
1. Provide practical, actionable advice that farmers can implement
2. Use simple, clear language avoiding technical jargon when possible
3. Consider the local context of farming in Pakistan
4. Offer specific recommendations rather than general statements
5. When discussing treatments or solutions, mention both traditional and modern approaches
6. If you don't know something, admit it rather than providing incorrect information
7. Format your responses in plain text without any markdown or HTML formatting

Current conversation history:
{history}

User query: {query}
`)

export async function POST(req: Request) {
  try {
    const { messages, language, sessionId = "default" } = await req.json()

    // Get or create session history
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, new ChatMessageHistory())
    }

    const history = sessions.get(sessionId)!

    // Convert messages to LangChain format if history is empty
    if (history.getMessages().length === 0 && messages.length > 0) {
      for (const msg of messages) {
        if (msg.role === "user") {
          await history.addMessage(new HumanMessage(msg.content))
        } else if (msg.role === "assistant") {
          await history.addMessage(new AIMessage(msg.content))
        }
      }
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]

    // Add the new message to history
    if (lastMessage.role === "user") {
      await history.addMessage(new HumanMessage(lastMessage.content))
    }

    // Format history for the prompt
    const historyMessages = await history.getMessages()
    const formattedHistory = historyMessages
      .map((msg) => {
        if (msg._getType() === "human") {
          return `User: ${msg.content}`
        } else {
          return `Mali Agent: ${msg.content}`
        }
      })
      .join("\n\n")

    // Create the chain
    const chain = RunnableSequence.from([
      {
        query: (input: { query: string }) => input.query,
        language: () => (language === "ur" ? "Urdu" : "English"),
        history: () => formattedHistory,
      },
      systemPromptTemplate,
      model,
      new StringOutputParser(),
    ])

    // Run the chain
    const response = await chain.invoke({
      query: lastMessage.content,
    })

    // Add the response to history
    await history.addMessage(new AIMessage(response))

    return NextResponse.json({ text: response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
