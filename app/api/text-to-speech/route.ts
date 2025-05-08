import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"
import os from "os"

const execAsync = promisify(exec)

// Ensure temp directory exists
const getTempFilePath = () => {
  const tempDir = path.join(os.tmpdir(), "earth-renewal-tts")
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }
  return path.join(tempDir, `speech_${Date.now()}.mp3`)
}

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json()

    if (!text || !language) {
      return NextResponse.json({ error: "Text and language are required" }, { status: 400 })
    }

    // Limit text length for quicker processing
    const limitedText = text.length > 500 ? text.substring(0, 500) + "..." : text

    const filepath = getTempFilePath()
    const langCode = language === "ur" ? "ur" : "en"

    // Use gTTS for better language support
    await execAsync(`gtts-cli "${limitedText.replace(/"/g, '\\"')}" --lang ${langCode} --output ${filepath}`)

    // Read the file and return it
    const audioBuffer = fs.readFileSync(filepath)

    // Clean up the file
    fs.unlinkSync(filepath)

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="speech.mp3"`,
      },
    })
  } catch (error) {
    console.error("Error in text-to-speech:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
