import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      console.error("Google API key not found in environment variables")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Mask the API key for security
    const maskedKey = apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4)

    return NextResponse.json({
      success: true,
      message: "Google API key is configured",
      keyInfo: {
        length: apiKey.length,
        prefix: apiKey.substring(0, 4),
        suffix: apiKey.substring(apiKey.length - 4),
        masked: maskedKey,
      },
    })
  } catch (error) {
    console.error("API test error:", error)
    return NextResponse.json({ error: "Failed to test API key", details: error.message }, { status: 500 })
  }
}
