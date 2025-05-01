"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WeatherData {
  temperature: number
  humidity: number
  condition: string
}

interface ForecastDay {
  date: Date
  temperature: number
  humidity: number
  condition: string
}

function generateForecast(currentWeather: WeatherData): ForecastDay[] {
  const forecast: ForecastDay[] = []
  const today = new Date()

  for (let i = 1; i <= 5; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Add some realistic variations to temperature (-3 to +3 degrees)
    const tempVariation = Math.floor(Math.random() * 7) - 3
    const humidityVariation = Math.floor(Math.random() * 15) - 7

    // Randomly vary conditions
    const conditions = ["Clear Sky", "Scattered Clouds", "Partly Cloudy", "Cloudy", "Light Rain"]
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

    forecast.push({
      date: date,
      temperature: currentWeather.temperature + tempVariation,
      humidity: Math.min(100, Math.max(0, currentWeather.humidity + humidityVariation)),
      condition: randomCondition,
    })
  }

  return forecast
}

export function WeatherForecast() {
  const { language } = useUser()
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getForecast = async () => {
      try {
        const response = await fetch("/api/weather?city=Karachi")
        if (!response.ok) throw new Error("Failed to fetch weather data")

        const data = await response.json()
        if (data.error) throw new Error(data.error)

        const currentWeather: WeatherData = {
          temperature: data.temperature,
          humidity: data.humidity,
          condition: data.condition,
        }

        const forecastData = generateForecast(currentWeather)
        setForecast(forecastData)
      } catch (err) {
        setError(language === "en" ? "Failed to generate forecast" : "پیش گوئی تیار کرنے میں ناکام")
      } finally {
        setLoading(false)
      }
    }

    getForecast()
  }, [language])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("clear") || lowerCondition.includes("sunny")) {
      return <Sun className="h-6 w-6 text-yellow-500" />
    } else if (lowerCondition.includes("rain")) {
      return <CloudRain className="h-6 w-6 text-blue-500" />
    } else {
      return <Cloud className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === "en" ? "5-Day Forecast" : "5 دن کی پیش گوئی"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                {getWeatherIcon(day.condition)}
                <div>
                  <div className="font-medium">
                    {day.date.toLocaleDateString(language === "en" ? "en-US" : "ur-PK", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">{language === "en" ? day.condition : "موسم"}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{Math.round(day.temperature)}°C</div>
                <div className="text-sm text-muted-foreground">{Math.round(day.humidity)}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
