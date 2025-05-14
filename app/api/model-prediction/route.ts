import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const execPromise = promisify(exec)

// Define model paths - update these with your actual model file paths
const MODEL_PATHS = {
  soilQuality: {
    model: path.join(process.cwd(), "models/soil_quality_model.h5"),
    scaler: path.join(process.cwd(), "models/soil_quality_scaler.pkl"),
  },
  cropYield: {
    model: path.join(process.cwd(), "models/crop_yield_model.pkl"),
  },
  diseaseDetection: {
    model: path.join(process.cwd(), "models/plant_disease_model.keras"),
  },
}

// Validate if model files exist
function validateModelFiles(modelType: string) {
  const modelInfo = MODEL_PATHS[modelType as keyof typeof MODEL_PATHS]
  if (!modelInfo) {
    throw new Error(`Unknown model type: ${modelType}`)
  }

  // Check if model file exists
  if (modelInfo.model && !fs.existsSync(modelInfo.model)) {
    throw new Error(`Model file not found: ${modelInfo.model}`)
  }

  // Check if scaler file exists (if specified)
  if (modelInfo.scaler && !fs.existsSync(modelInfo.scaler)) {
    throw new Error(`Scaler file not found: ${modelInfo.scaler}`)
  }

  return modelInfo
}

export async function POST(req: Request) {
  try {
    const { modelType, inputData } = await req.json()

    // Validate request data
    if (!modelType || !inputData) {
      return NextResponse.json({ error: "Missing required parameters: modelType or inputData" }, { status: 400 })
    }

    // Validate model files
    let modelInfo
    try {
      modelInfo = validateModelFiles(modelType)
    } catch (error: any) {
      console.error("Model validation error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Prepare input data for Python script
    const inputDataString = JSON.stringify(inputData)

    // Run Python script with model paths and input data
    const scriptPath = path.join(process.cwd(), "scripts/run_prediction.py")

    const command = `python ${scriptPath} --model-path "${modelInfo.model}" ${
      modelInfo.scaler ? `--scaler-path "${modelInfo.scaler}"` : ""
    } --model-type "${modelType}" --input-data '${inputDataString}'`

    console.log("Executing command:", command)

    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error running prediction script", details: stderr }, { status: 500 })
    }

    // Parse the Python script output
    try {
      const result = JSON.parse(stdout.trim())
      return NextResponse.json(result)
    } catch (error) {
      console.error("Error parsing Python output:", stdout)
      return NextResponse.json({ error: "Invalid output from prediction script", raw: stdout }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Prediction API error:", error)
    return NextResponse.json({ error: "Prediction failed", message: error.message }, { status: 500 })
  }
}
