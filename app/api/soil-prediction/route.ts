import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const execPromise = promisify(exec)

interface SoilData {
  gas_level: number
  humidity: number
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
}

export async function POST(req: Request) {
  try {
    // Parse request body
    const data: SoilData = await req.json()

    // Validate input data
    const requiredFields = ["gas_level", "humidity", "nitrogen", "phosphorus", "potassium", "temperature"]
    for (const field of requiredFields) {
      if (typeof data[field as keyof SoilData] !== "number") {
        return NextResponse.json({ error: `Invalid input data. ${field} must be a number.` }, { status: 400 })
      }
    }

    // Check if model file exists in any of the possible locations
    const possibleModelPaths = [
      path.join(process.cwd(), "models", "soil_quality_model.pkl"),
      path.join(process.cwd(), "scripts", "soil_quality_model.pkl"),
      path.join(process.cwd(), "soil_quality_model.pkl"),
    ]

    let modelExists = false
    let modelPath = ""

    for (const path of possibleModelPaths) {
      try {
        if (fs.existsSync(path)) {
          modelExists = true
          modelPath = path
          console.log(`Found model at: ${path}`)
          break
        }
      } catch (error) {
        console.error(`Error checking model at ${path}:`, error)
      }
    }

    if (!modelExists) {
      console.error("Model file not found in any of the expected locations")
      return NextResponse.json({
        prediction: "Moderate",
        recommendations: [
          "Model file not found. Please upload the soil_quality_model.pkl file.",
          "Using fallback prediction until model is available.",
        ],
      })
    }

    // Pass the data directly as a JSON string to avoid environment variable issues
    const scriptPath = path.join(process.cwd(), "scripts", "soil_model.py")
    const jsonData = JSON.stringify(data)

    // Escape single quotes in the JSON string to prevent command injection
    const escapedJsonData = jsonData.replace(/'/g, "'\\''")

    const command = `python ${scriptPath} '${escapedJsonData}'`

    console.log(`Executing command: ${command}`)

    // Execute the Python script
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error(`Error from Python script: ${stderr}`)
    }

    // Parse the output
    let result
    try {
      result = JSON.parse(stdout)
    } catch (e) {
      console.error("Error parsing Python output:", stdout)
      return NextResponse.json({
        prediction: "Moderate",
        recommendations: ["Error processing soil data. Using fallback prediction."],
      })
    }

    // Check for errors
    if (result.error) {
      console.error("Model prediction error:", result.error)

      // Return a simple response with just the prediction
      return NextResponse.json({
        prediction: result.prediction,
        recommendations: ["Based on available data. Consider regular soil testing."],
      })
    }

    // Generate simple recommendations based on the prediction
    const recommendations = getRecommendations(result.prediction)

    // Return the prediction with recommendations
    return NextResponse.json({
      prediction: result.prediction,
      recommendations,
    })
  } catch (error) {
    console.error("Error in soil model prediction:", error)

    // Return a fallback prediction in case of any error
    return NextResponse.json({
      prediction: "Moderate",
      recommendations: [
        "Error processing prediction. Using fallback prediction.",
        "Consider regular soil testing for more accurate results.",
      ],
    })
  }
}

// Simple function to generate recommendations based on prediction
function getRecommendations(prediction: string): string[] {
  switch (prediction) {
    case "Good":
      return [
        "Soil quality is good. Maintain current practices.",
        "Continue regular monitoring of soil nutrients.",
        "Apply balanced fertilization to maintain soil health.",
      ]
    case "Moderate":
      return [
        "Soil quality is moderate. Some improvements needed.",
        "Consider soil testing to identify specific deficiencies.",
        "Adjust fertilization based on crop requirements.",
      ]
    case "Poor":
      return [
        "Soil quality is poor. Immediate action recommended.",
        "Conduct comprehensive soil testing.",
        "Consider adding organic matter to improve soil structure.",
        "Implement a targeted fertilization plan based on deficiencies.",
      ]
    default:
      return ["Continue regular soil monitoring.", "Maintain balanced fertilization practices."]
  }
}
