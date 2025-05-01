import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json()

    if (!text || !language) {
      return NextResponse.json({ error: "Text and language are required" }, { status: 400 })
    }

    const filename = `speech_${Date.now()}.mp3`
    const filepath = path.join(process.cwd(), "tmp", filename)

    await execAsync(`gtts-cli "${text}" --lang ${language} --output ${filepath}`)

    const audioBuffer = await readFile(filepath)

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error in text-to-speech:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
