"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud } from "lucide-react"

export default function WeatherWidget() {
  const [weather, setWeather] = useState({ temp: 0, description: "" })

  useEffect(() => {
    // Replace with actual API call
    const mockWeather = { temp: 25, description: "Sunny" }
    setWeather(mockWeather)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Cloud className="h-8 w-8 text-blue-500" />
          <div className="text-right">
            <div className="text-2xl font-bold">{weather.temp}°C</div>
            <div className="text-sm text-gray-500">{weather.description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
