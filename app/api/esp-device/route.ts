import { NextResponse } from "next/server"

// Mock data for when the ESP device is not available
const mockSensorData = [
  {
    name: "Temperature",
    value: Math.round((20 + Math.random() * 15) * 10) / 10, // Random between 20-35°C
    unit: "°C",
    type: "environment",
    icon: "thermometer",
    min: 0,
    max: 50,
  },
  {
    name: "Humidity",
    value: Math.round((40 + Math.random() * 50) * 10) / 10, // Random between 40-90%
    unit: "%",
    type: "environment",
    icon: "droplet",
    min: 0,
    max: 100,
  },
  {
    name: "Soil Moisture",
    value: Math.round((30 + Math.random() * 40) * 10) / 10, // Random between 30-70%
    unit: "%",
    type: "soil",
    icon: "droplet",
    min: 0,
    max: 100,
  },
  {
    name: "Light Level",
    value: Math.round((500 + Math.random() * 1000) * 10) / 10, // Random between 500-1500 lux
    unit: "lux",
    type: "environment",
    icon: "sun",
    min: 0,
    max: 2000,
  },
  {
    name: "Soil pH",
    value: Math.round((5.5 + Math.random() * 2) * 10) / 10, // Random between 5.5-7.5
    unit: "pH",
    type: "soil",
    icon: "flask",
    min: 0,
    max: 14,
  },
  {
    name: "Nitrogen",
    value: Math.round((20 + Math.random() * 60) * 10) / 10, // Random between 20-80 mg/kg
    unit: "mg/kg",
    type: "soil",
    icon: "leaf",
    min: 0,
    max: 100,
  },
  {
    name: "Phosphorus",
    value: Math.round((10 + Math.random() * 30) * 10) / 10, // Random between 10-40 mg/kg
    unit: "mg/kg",
    type: "soil",
    icon: "leaf",
    min: 0,
    max: 50,
  },
  {
    name: "Potassium",
    value: Math.round((100 + Math.random() * 200) * 10) / 10, // Random between 100-300 mg/kg
    unit: "mg/kg",
    type: "soil",
    icon: "leaf",
    min: 0,
    max: 400,
  },
]

export async function GET() {
  console.log("[SERVER]\nAttempting to connect to ESP device at 192.168.43.105...")

  try {
    // Set a timeout for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`http://192.168.43.105/data`, {
      signal: controller.signal,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`ESP device returned status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: data,
    })
  } catch (error) {
    console.error("[SERVER]\nError connecting to ESP device:", error)

    // Return mock data for testing when ESP is not available
    return NextResponse.json({
      success: true, // Set to true to make the app work with mock data
      error: "Using simulated data - ESP device not connected",
      timestamp: new Date().toISOString(),
      data: mockSensorData,
    })
  }
}
