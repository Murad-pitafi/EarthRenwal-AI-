import { NextResponse } from "next/server"
import axios from "axios"

// Google Cloud TTS API endpoint
const GOOGLE_TTS_API = "https://texttospeech.googleapis.com/v1/text:synthesize"

export async function POST(req: Request) {
  try {
    const { text, language = "ur-PK" } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Only allow Urdu language to control costs
    if (!language.toLowerCase().startsWith("ur")) {
      return NextResponse.json({ error: "Google TTS is only enabled for Urdu language" }, { status: 400 })
    }

    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      console.error("Google API key not found")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Prepare request for Google TTS API
    const requestData = {
      input: { text },
      voice: {
        languageCode: "ur-PK",
        name: "ur-PK-Standard-A", // Use Standard voice to control costs
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 0.9, // Slightly slower for better clarity
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    }

    // Call Google TTS API
    const response = await axios.post(`${GOOGLE_TTS_API}?key=${apiKey}`, requestData)

    if (!response.data || !response.data.audioContent) {
      throw new Error("Invalid response from Google TTS API")
    }

    // Return audio content as base64
    return NextResponse.json({
      success: true,
      audioContent: response.data.audioContent,
    })
  } catch (error) {
    console.error("Error in Google TTS:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: error.response?.status || 500 })
  }
}
