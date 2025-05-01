import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audio = formData.get("audio") as File

    if (!audio) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await audio.arrayBuffer())
    const filename = `audio_${Date.now()}.wav`
    const filepath = path.join(process.cwd(), "tmp", filename)

    await writeFile(filepath, buffer)

    const { stdout, stderr } = await execAsync(`whisper ${filepath} --model base --language auto --output_dir tmp`)

    if (stderr) {
      console.error("Error in speech recognition:", stderr)
      return NextResponse.json({ error: "Speech recognition failed" }, { status: 500 })
    }

    const transcription = stdout.trim()
    return NextResponse.json({ text: transcription })
  } catch (error) {
    console.error("Error in speech-to-text:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
