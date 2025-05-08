import { NextResponse } from "next/server"

// Simple browser-compatible TTS solution
export async function POST(req: Request) {
  try {
    const { text, language } = await req.json()

    if (!text || !language) {
      return NextResponse.json({ error: "Text and language are required" }, { status: 400 })
    }

    // Return a response that instructs the client to use browser TTS
    return NextResponse.json({
      success: true,
      text,
      language,
      message: "Use browser TTS",
    })
  } catch (error) {
    console.error("Error in text-to-speech:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
