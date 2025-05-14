import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text, voice_id = "21m00Tcm4TlvDq8ikWAM" } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Get API key from environment variable
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      console.error("ELEVENLABS_API_KEY is not set")
      return NextResponse.json({ error: "ElevenLabs API key is not configured" }, { status: 500 })
    }

    console.log(`ElevenLabs TTS Request: Text="${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`)

    // Call ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ElevenLabs API error:", errorText)
      return NextResponse.json({ error: `ElevenLabs API error: ${response.status}` }, { status: response.status })
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer()

    // Return audio data
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Error in ElevenLabs TTS API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
