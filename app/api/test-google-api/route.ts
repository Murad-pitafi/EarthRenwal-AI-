import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Google API key not found in environment variables",
        },
        { status: 500 },
      )
    }

    // Only show first and last 4 characters of the API key for security
    const maskedKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`

    return NextResponse.json({
      success: true,
      message: "Google API key is configured",
      keyInfo: {
        length: apiKey.length,
        maskedKey: maskedKey,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
