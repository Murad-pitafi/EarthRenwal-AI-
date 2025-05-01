import { NextResponse } from "next/server"

const API_KEY = process.env.WEATHERBIT_API_KEY

if (!API_KEY) {
  console.error("WEATHERBIT_API_KEY is not defined in environment variables")
}

const PAKISTAN_CITIES = {
  Karachi: [24.8607, 67.0011],
  Lahore: [31.5497, 74.3436],
  Islamabad: [33.6844, 73.0479],
  Faisalabad: [31.4504, 73.135],
  Multan: [30.1575, 71.5249],
  Peshawar: [34.0151, 71.5249],
  Quetta: [30.1798, 66.975],
}

async function fetch_weather_data(city: string) {
  const [lat, lon] = PAKISTAN_CITIES[city as keyof typeof PAKISTAN_CITIES]
  const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${API_KEY}`

  try {
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const weather_data = data.data[0]

      return {
        city: city,
        temperature: weather_data.temp,
        humidity: weather_data.rh,
        condition: weather_data.weather.description,
        wind_speed: weather_data.wind_spd,
        icon: weather_data.weather.icon,
      }
    } else {
      const errorText = await response.text()
      throw new Error(`API returned status: ${response.status}, message: ${errorText}`)
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")

    if (!city || !(city in PAKISTAN_CITIES)) {
      return NextResponse.json({ error: "Invalid city" }, { status: 400 })
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    const weatherData = await fetch_weather_data(city)
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error in weather API route:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
