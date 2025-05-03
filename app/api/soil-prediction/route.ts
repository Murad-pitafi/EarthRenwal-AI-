import { NextResponse } from "next/server"

interface SoilData {
  nitrogen: number // percentage (%)
  phosphorous: number // parts per million (ppm)
  potassium: number // parts per million (ppm)
  ph?: number // pH value
}

function predictSoilQuality(data: SoilData): {
  quality: string
  recommendations: string[]
} {
  // Pakistani soil-specific constraints
  const nitrogenRange = { min: 0.15, max: 0.25 } // %
  const phosphorousRange = { min: 10, max: 20 } // ppm
  const potassiumRange = { min: 100, max: 200 } // ppm
  const optimalPh = { min: 7.7, max: 7.8 } // typical Pakistani alkaline soils

  // Check each nutrient level
  const nitrogenStatus =
    data.nitrogen < nitrogenRange.min ? "low" : data.nitrogen > nitrogenRange.max ? "high" : "optimal"

  const phosphorousStatus =
    data.phosphorous < phosphorousRange.min ? "low" : data.phosphorous > phosphorousRange.max ? "high" : "optimal"

  const potassiumStatus =
    data.potassium < potassiumRange.min ? "low" : data.potassium > potassiumRange.max ? "high" : "optimal"

  // Check pH if provided
  const phStatus = !data.ph ? "unknown" : data.ph < optimalPh.min ? "low" : data.ph > optimalPh.max ? "high" : "optimal"

  // Count optimal parameters
  const optimalCount = [nitrogenStatus, phosphorousStatus, potassiumStatus, phStatus].filter(
    (status) => status === "optimal",
  ).length

  // Generate quality assessment
  let quality = "Poor"
  if (optimalCount >= 3) {
    quality = "Good"
  } else if (optimalCount >= 1) {
    quality = "Moderate"
  }

  // Generate recommendations
  const recommendations: string[] = []

  if (nitrogenStatus === "low") {
    recommendations.push("Increase nitrogen through urea application or organic manures like farmyard manure")
  } else if (nitrogenStatus === "high") {
    recommendations.push("Reduce nitrogen application in next growing season")
  }

  if (phosphorousStatus === "low") {
    recommendations.push("Apply phosphate fertilizers like DAP or SSP to improve phosphorous levels")
  } else if (phosphorousStatus === "high") {
    recommendations.push("Limit phosphorous application in upcoming seasons")
  }

  if (potassiumStatus === "low") {
    recommendations.push("Apply potash fertilizers like SOP or MOP to increase potassium levels")
  } else if (potassiumStatus === "high") {
    recommendations.push("Reduce potassium application in next growing season")
  }

  if (phStatus === "low") {
    recommendations.push("Apply agricultural lime to neutralize soil acidity")
  } else if (phStatus === "high") {
    recommendations.push("Apply gypsum or organic matter to help reduce alkalinity")
  }

  return { quality, recommendations }
}

export async function POST(req: Request) {
  try {
    const data: SoilData = await req.json()
    const prediction = predictSoilQuality(data)

    return NextResponse.json({
      prediction: prediction.quality,
      recommendations: prediction.recommendations,
    })
  } catch (error) {
    console.error("Error in soil prediction:", error)
    return NextResponse.json({ error: "Soil prediction failed" }, { status: 500 })
  }
}
