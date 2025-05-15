import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const execPromise = promisify(exec)

// Define model path - update this with your actual model file path
const MODEL_PATH = path.join(process.cwd(), "models/rice_classification_model.h5")

// Validate if model file exists
function validateModelFile() {
  if (!fs.existsSync(MODEL_PATH)) {
    throw new Error(`Model file not found: ${MODEL_PATH}`)
  }
  return MODEL_PATH
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const formData = await req.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Validate model file
    let modelPath
    try {
      modelPath = validateModelFile()
    } catch (error: any) {
      console.error("Model validation error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Convert image to base64
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
    const base64Image = imageBuffer.toString("base64")

    // Run Python script with model path and base64 image
    const scriptPath = path.join(process.cwd(), "scripts/rice_classifier.py")

    const command = `python ${scriptPath} --model-path "${modelPath}" --image-base64 "${base64Image}"`

    console.log("Executing rice classification...")

    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error running classification script", details: stderr }, { status: 500 })
    }

    // Parse the Python script output
    try {
      const result = JSON.parse(stdout.trim())
      return NextResponse.json(result)
    } catch (error) {
      console.error("Error parsing Python output:", stdout)
      return NextResponse.json({ error: "Invalid output from classification script", raw: stdout }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Rice classification API error:", error)
    return NextResponse.json({ error: "Classification failed", message: error.message }, { status: 500 })
  }
}
