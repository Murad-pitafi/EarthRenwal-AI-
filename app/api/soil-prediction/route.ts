import { NextResponse } from "next/server"

interface SoilData {
  nitrogen: number
  phosphorous: number
  potassium: number
}

function predictSoilQuality(data: SoilData): string {
  const averageNPK = (data.nitrogen + data.phosphorous + data.potassium) / 3

  if (averageNPK < 30) return "Poor"
  if (averageNPK < 60) return "Moderate"
  return "Good"
}

export async function POST(req: Request) {
  try {
    const data: SoilData = await req.json()
    const prediction = predictSoilQuality(data)
    return NextResponse.json({ prediction })
  } catch (error) {
    console.error("Error in soil prediction:", error)
    return NextResponse.json({ error: "Soil prediction failed" }, { status: 500 })
  }
}
