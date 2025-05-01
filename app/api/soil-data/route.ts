import { NextResponse } from "next/server"

function getRandomValue(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function getSoilQuality(npk: number[]): string {
  const average = npk.reduce((a, b) => a + b, 0) / npk.length
  if (average < 30) return "Poor"
  if (average < 60) return "Moderate"
  return "Good"
}

export async function GET() {
  try {
    const data = {
      airTemperature: getRandomValue(15, 35),
      soilTemperature: getRandomValue(10, 30),
      humidity: getRandomValue(30, 80),
      moisture: getRandomValue(20, 60),
      nitrogen: getRandomValue(0, 100),
      phosphorous: getRandomValue(0, 100),
      potassium: getRandomValue(0, 100),
    }

    const soilQuality = getSoilQuality([data.nitrogen, data.phosphorous, data.potassium])

    return NextResponse.json({ ...data, soilQuality })
  } catch (error) {
    console.error("Error generating soil data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
