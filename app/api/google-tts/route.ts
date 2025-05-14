import { NextResponse } from "next/server"
import axios from "axios"

// Google Cloud TTS API endpoint
const GOOGLE_TTS_API = "https://texttospeech.googleapis.com/v1/text:synthesize"

export async function POST(req: Request) {
  console.log("Google TTS API route called")

  try {
    const { text, language = "ur-PK" } = await req.json()
    console.log(`TTS Request: Language=${language}, Text="${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`)

    if (!text) {
      console.error("TTS Error: No text provided")
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Only allow Urdu language to control costs
    if (!language.toLowerCase().startsWith("ur")) {
      console.error(`TTS Error: Unsupported language ${language}`)
      return NextResponse.json({ error: "Google TTS is only enabled for Urdu language" }, { status: 400 })
    }

    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      console.error("TTS Error: Google API key not found in environment variables")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("Using Google TTS API for Urdu with ur-PK-Standard-A voice")

    // Prepare request for Google TTS API
    const requestData = {
      input: { text },
      voice: {
        languageCode: "ur-PK",
        name: "ur-PK-Standard-A", // Using the specified Standard female voice
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 0.9, // Slightly slower for better clarity
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    }

    console.log("Sending request to Google TTS API...")

    // Call Google TTS API
    const response = await axios.post(`${GOOGLE_TTS_API}?key=${apiKey}`, requestData)

    console.log("Google TTS API response received")

    if (!response.data) {
      console.error("TTS Error: Empty response from Google TTS API")
      throw new Error("Empty response from Google TTS API")
    }

    if (!response.data.audioContent) {
      console.error("TTS Error: No audioContent in response", response.data)
      throw new Error("No audioContent in response from Google TTS API")
    }

    console.log("TTS Success: Audio content received, length:", response.data.audioContent.length)

    // Return audio content as base64
    return NextResponse.json({
      success: true,
      audioContent: response.data.audioContent,
    })
  } catch (error) {
    console.error("TTS Error:", error)

    // Log more details about the error
    if (error.response) {
      console.error("TTS Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      })
    }

    return NextResponse.json(
      { error: "Failed to generate speech", details: error.message || "Unknown error" },
      { status: error.response?.status || 500 },
    )
  }
}
