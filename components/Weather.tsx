"use client"

import { useState, useEffect, useCallback } from "react"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, Thermometer, Droplets, MapPin, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WeatherData {
  city: string
  temperature: number
  humidity: number
  condition: string
}

const PAKISTAN_CITIES = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Multan", "Peshawar", "Quetta"]

export function Weather() {
  const { language } = useUser()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState("Karachi")

  const fetchWeather = useCallback(
    async (city: string) => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/weather?city=${city}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        setWeather(data)
      } catch (err) {
        console.error("Error fetching weather data:", err)
        setError(
          language === "en"
            ? `Failed to load weather data: ${err instanceof Error ? err.message : String(err)}`
            : `موسم کی معلومات لوڈ کرنے میں ناکام: ${err instanceof Error ? err.message : String(err)}`,
        )
      } finally {
        setLoading(false)
      }
    },
    [language],
  )

  useEffect(() => {
    fetchWeather(selectedCity)
    const interval = setInterval(() => fetchWeather(selectedCity), 600000) // Fetch every 10 minutes
    return () => clearInterval(interval)
  }, [selectedCity, fetchWeather])

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
  }

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
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTitle>{language === "en" ? "Error" : "خرابی"}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!weather) return null

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("clear") || lowerCondition.includes("sunny")) {
      return <Sun className="h-8 w-8 text-yellow-500" />
    } else if (lowerCondition.includes("cloud")) {
      return <Cloud className="h-8 w-8 text-gray-500" />
    } else if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    } else {
      return <Thermometer className="h-8 w-8 text-red-500" />
    }
  }

  const getWeatherAlert = () => {
    const temp = weather.temperature
    const humidity = weather.humidity

    if (temp > 35) {
      return language === "en"
        ? "High temperature alert: Consider additional irrigation"
        : "زیادہ درجہ حرارت: اضافی آبپاشی پر غور کریں"
    }
    if (humidity > 80) {
      return language === "en"
        ? "High humidity alert: Monitor for potential fungal diseases"
        : "زیادہ نمی: فنگل بیماریوں کی نگرانی کریں"
    }
    return null
  }

  const alert = getWeatherAlert()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === "en" ? "Current Weather" : "موجودہ موسم"}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {weather.city}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {PAKISTAN_CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-between">
          {getWeatherIcon(weather.condition)}
          <div className="text-right">
            <div className="text-2xl font-bold">{Math.round(weather.temperature)}°C</div>
            <div className="text-sm text-gray-500">{language === "en" ? weather.condition : "موسم کی تفصیل"}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {language === "en" ? "Temperature" : "درجہ حرارت"}: {Math.round(weather.temperature)}°C
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {language === "en" ? "Humidity" : "نمی"}: {Math.round(weather.humidity)}%
            </span>
          </div>
        </div>

        {alert && (
          <Alert>
            <AlertTitle>{language === "en" ? "Weather Alert" : "موسمی انتباہ"}</AlertTitle>
            <AlertDescription>{alert}</AlertDescription>
          </Alert>
        )}

        <Button onClick={() => fetchWeather(selectedCity)} variant="outline" className="w-full">
          {language === "en" ? "Refresh Weather" : "موسم ریفریش کریں"}
        </Button>
      </CardContent>
    </Card>
  )
}
