import { NextResponse } from "next/server"
import { exec } from "child_process"
import path from "path"
import { promisify } from "util"
import { existsSync } from "fs"

const execPromise = promisify(exec)

export async function GET() {
  try {
    const modelPath = path.join(process.cwd(), "models", "soil_health_model.pkl")

    // Check if model exists
    if (!existsSync(modelPath)) {
      return NextResponse.json(
        {
          success: false,
          error: "Model file not found. Please upload a model first.",
        },
        { status: 404 },
      )
    }

    // Run Python script to verify model
    const scriptPath = path.join(process.cwd(), "scripts", "verify_model.py")
    const { stdout, stderr } = await execPromise(`python ${scriptPath} "${modelPath}"`)

    if (stderr) {
      console.error("Error verifying model:", stderr)
      return NextResponse.json({ success: false, error: stderr }, { status: 500 })
    }

    try {
      const result = JSON.parse(stdout.trim())
      return NextResponse.json(result)
    } catch (error) {
      console.error("Error parsing Python output:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse model verification result",
          output: stdout,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error verifying model:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify model",
      },
      { status: 500 },
    )
  }
}
