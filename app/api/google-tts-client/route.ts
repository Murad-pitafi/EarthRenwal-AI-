import { NextResponse } from "next/server"
import { TextToSpeechClient } from "@google-cloud/text-to-speech"

// Credentials configuration
const credentials = {
  type: "service_account",
  project_id: "gen-lang-client-0000763878",
  private_key_id: "da6990c23e8e9f483055a971a48da0b3ff0141b3",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDSxc+WEpzOWrhF\njSEAq+yI/K/FcDxD8pTZFwiXgDlC68Jd0CuUyN8hRRaPioav0tZ1K32erTf4Gotc\nS3bMIyHpV5OA0bL4w/WaBiEOXf1rVUNTOcNCUJudMG1Hb1itwDsA535jJEb7izwt\nUsVMN5acyXE/x3LTyEZE40DK0lK2AgcqsnC5wnUSn2GbnpeINSs6BKdfvyg2CIke\nqVD60JFwqc22emF6bRi9K5m65MQNp0GlrSPZPoQ9gssHEpT2aCL5wiWNg3Rc14oQ\nM9XgTQc/dbev/fTERaYjR41jXzOLZY+bYvacNwGKZ43bUsUWSQc2rssjc203XxUO\nb4k3Af+9AgMBAAECggEAT9lYt0X92b9MqCy7IAIB7jOsc2P9sNApy8SKILsW9l9S\nly/SEt+2iGggD+ku9VUuod0EDiUZWwjTWvfL3bJBmqDu5JKM9ulmFh/UThkVdKAs\njU8Ixgq7qWU7QSDRu6FjuQf6PZz0tz8cYR9GV4WHrYYzPTJWMh1hYZ+mYDAl3YVe\nobXXSodRRLT+hT0+cB4WqHpnni6406O1l2O/wMEjMJqbK/H4HuetsDthJb3S16Mo\nojgT+RsCkz/6dPOw8z5M6vkB/A/xtmX1xh1qwjsNBlgxU+rhmKk8lyBnlttD+dT0\nW8AoRMvpfMdRnoHThOWcOVCRlwYN3Xi0AwS698IzkQKBgQD7ANUtYo/YGsmYgSRw\npyFTQM2UBMh4XI3KPgbKuCL4BFJEw66frOh1rec2mbAvlyE0SaLM1STaufWAZCsa\nj14oYb0QEbgQrZnqQjI15oS7xa30TJtMIYdL2i6FL1b+BvxWpEgLBU1uTUXUTbGE\nq0rJLdcXckZHA3Oar3WTO7ws+wKBgQDW9/RZZveYblio85Yzccviy0zE0jdomOLf\nl9NoOtUnE9sFuckIxjhUczCTdLGAUirRdZqrotETkcvCHCOCai5lPK+zEJ+R+iSL\n14rAWw7Jv+xkHS+1A3jiojccqvMaso2eQK2/cuec9xduLpwoYtCymblGe5q5h8h8\n7lUBsJF4pwKBgQCJyUM8zsY30zynQv1F+fkJQqGXh6ikqeoMA1CnJ73KeFTQ+rp5\nXOme7//ksSlOdp/7nBCKcNbyWvKxsEsZIWqGsGCg2Zk5TpMXTY9Sl2B102ZSnVsC\nx8UFlpfC9OHEQQF0bmo94oNG8ZRLnvq74WwEU+2nKUv636IuX/MjB7+c0QKBgQCA\na2omynNZNXpzm+j73JxvZQH8hpShQMwvxLR/jL3vdVYfiohFXJ0kHhhDzq+HOA7q\nSHZY2JBMP4nY8RRpgWMsCV/w+hpJi4Svodj65qrj7WqbuC/a1DMwOLXxw1ItfcNK\nadsiBtPEmnv9z4xsN/Py7hCXwZmCAlLMB1jzBHcy+wKBgE9qQjXVMc8tCWASkFpz\nxStznn9d7wFREsKceS6i3TIjWnbpYqbRiPHnxNFLeX2aLev2LNNdqnZessTvhtf7\naU1rhelcF398KWgyUSfHtdjPZm11DR394DCT5hr6FcPuNllre1/P+RhtUDvD3j01\n7IG/yVR4cQe2hsxeRB1TqOzB\n-----END PRIVATE KEY-----\n",
  client_email: "earthrenewalai@gen-lang-client-0000763878.iam.gserviceaccount.com",
  client_id: "102733956305713357697",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/earthrenewalai%40gen-lang-client-0000763878.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

export async function POST(req: Request) {
  console.log("Google TTS Client API route called")

  try {
    // Check if the @google-cloud/text-to-speech package is installed
    try {
      require("@google-cloud/text-to-speech")
    } catch (err) {
      console.error("Package @google-cloud/text-to-speech is not installed:", err)
      return NextResponse.json(
        {
          error: "Required package not installed",
          details: "Please install @google-cloud/text-to-speech: npm install @google-cloud/text-to-speech",
        },
        { status: 500 },
      )
    }

    // Parse request body
    let text, language
    try {
      const body = await req.json()
      text = body.text
      language = body.language || "en-US"
    } catch (err) {
      console.error("Failed to parse request body:", err)
      return NextResponse.json({ error: "Invalid request", details: "Failed to parse request body" }, { status: 400 })
    }

    console.log(
      `Speech Request: Language=${language}, Text="${text?.substring(0, 50)}${text?.length > 50 ? "..." : ""}"`,
    )

    if (!text) {
      console.error("Speech Error: No text provided")
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Create a client with inline credentials
    let client
    try {
      client = new TextToSpeechClient({ credentials })
      console.log("TTS Client created successfully")
    } catch (err) {
      console.error("Failed to create TTS client:", err)
      return NextResponse.json(
        {
          error: "Failed to initialize Text-to-Speech client",
          details: err.message,
        },
        { status: 500 },
      )
    }

    // For Urdu, use the appropriate voice
    const voiceParams = language.startsWith("ur")
      ? { languageCode: "ur-PK", name: "ur-PK-Standard-A", ssmlGender: "FEMALE" }
      : { languageCode: language, ssmlGender: "NEUTRAL" }

    // Construct the request
    const request = {
      input: { text },
      voice: voiceParams,
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: language.startsWith("ur") ? 0.9 : 1.0, // Slightly slower for Urdu
      },
    }

    console.log("Sending request to Google TTS Client:", JSON.stringify(request, null, 2))

    // Call the Text-to-Speech API
    let response
    try {
      ;[response] = await client.synthesizeSpeech(request)
      console.log("Google TTS Client response received")
    } catch (err) {
      console.error("TTS API error:", err)
      return NextResponse.json(
        {
          error: "Text-to-Speech API error",
          details: err.message,
          code: err.code,
        },
        { status: 500 },
      )
    }

    if (!response.audioContent) {
      console.error("Speech Error: No audioContent in response")
      return NextResponse.json({ error: "No audio content in response" }, { status: 500 })
    }

    // Convert Buffer to Base64
    let audioContentBase64
    try {
      audioContentBase64 = Buffer.from(response.audioContent as Uint8Array).toString("base64")
      console.log("Speech Success: Audio content received and converted to base64")
    } catch (err) {
      console.error("Failed to convert audio content to base64:", err)
      return NextResponse.json({ error: "Failed to process audio content", details: err.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      audioContent: audioContentBase64,
    })
  } catch (error) {
    console.error("Unhandled Speech Error:", error)

    // Ensure we always return a valid JSON response
    return NextResponse.json(
      {
        error: "Failed to generate speech",
        details: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
