import { NextResponse } from "next/server"
import { writeFile, readFile } from "fs/promises"
import path from "path"
import { mkdir, access } from "fs/promises"
import { constants } from "fs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const modelFile = formData.get("model") as File

    if (!modelFile) {
      return NextResponse.json({ success: false, error: "No model file provided" }, { status: 400 })
    }

    console.log("Received file:", modelFile.name, modelFile.size)

    // Check file size (limit to 10MB)
    if (modelFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await modelFile.arrayBuffer())

    // Define multiple possible directories to save the model
    const possibleDirs = [path.join(process.cwd(), "models"), path.join(process.cwd(), "scripts"), process.cwd()]

    let savedPath = null
    let savedError = null

    // Try to save the file in each directory
    for (const dir of possibleDirs) {
      try {
        // Ensure directory exists
        await mkdir(dir, { recursive: true })

        // Save the file
        const filePath = path.join(dir, "soil_quality_model.pkl")
        await writeFile(filePath, buffer)

        // Verify the file was saved
        await access(filePath, constants.F_OK)

        console.log(`Model successfully saved to ${filePath}`)
        savedPath = filePath
        break
      } catch (error) {
        console.error(`Error saving to ${dir}:`, error)
        savedError = error
      }
    }

    if (!savedPath) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to save model file: ${savedError?.message || "Unknown error"}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Model uploaded successfully",
      filePath: savedPath,
    })
  } catch (error) {
    console.error("Error uploading model:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload model",
      },
      { status: 500 },
    )
  }
}

// Add a GET endpoint to check if the model exists
export async function GET() {
  try {
    // Define possible model locations
    const possiblePaths = [
      path.join(process.cwd(), "models", "soil_quality_model.pkl"),
      path.join(process.cwd(), "scripts", "soil_quality_model.pkl"),
      path.join(process.cwd(), "soil_quality_model.pkl"),
    ]

    // Check each location
    const modelLocations = []

    for (const modelPath of possiblePaths) {
      try {
        await access(modelPath, constants.F_OK)
        const stats = await readFile(modelPath)
        modelLocations.push({
          path: modelPath,
          exists: true,
          size: stats.length,
        })
      } catch {
        modelLocations.push({
          path: modelPath,
          exists: false,
        })
      }
    }

    return NextResponse.json({
      success: true,
      modelLocations,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to check model existence",
    })
  }
}
