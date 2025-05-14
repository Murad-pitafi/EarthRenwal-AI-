import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execPromise = promisify(exec)

interface SoilData {
  nitrogen: number
  phosphorous: number
  potassium: number
  ph?: number
}

export async function POST(req: Request) {
  try {
    // Parse request body
    const data: SoilData = await req.json()

    // Validate input data
    if (
      typeof data.nitrogen !== "number" ||
      typeof data.phosphorous !== "number" ||
      typeof data.potassium !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input data. Nitrogen, phosphorous, and potassium must be numbers." },
        { status: 400 },
      )
    }

    // Construct command to run the Python script
    const scriptPath = path.join(process.cwd(), "scripts", "soil_model.py")

    // Build command with arguments
    let command = `python ${scriptPath} ${data.nitrogen} ${data.phosphorous} ${data.potassium}`

    // Add pH if provided
    if (data.ph !== undefined) {
      command += ` ${data.ph}`
    }

    console.log(`Executing command: ${command}`)

    // Execute the Python script
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error(`Error from Python script: ${stderr}`)
    }

    // Parse the output
    const result = JSON.parse(stdout)

    // Check for errors
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Return the prediction
    return NextResponse.json({
      prediction: result.prediction,
      probability: result.probability,
      recommendations: result.recommendations,
    })
  } catch (error) {
    console.error("Error in soil model prediction:", error)
    return NextResponse.json({ error: "Failed to process soil prediction" }, { status: 500 })
  }
}
