"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SoilData {
  airTemperature: number
  soilTemperature: number
  humidity: number
  moisture: number
  nitrogen: number
  phosphorous: number
  potassium: number
  soilQuality: string
}

const generateMockData = (currentData: SoilData) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    airTemperature: currentData.airTemperature + Math.floor(Math.random() * 11) - 5,
    soilTemperature: currentData.soilTemperature + Math.floor(Math.random() * 7) - 3,
    humidity: Math.max(0, Math.min(100, currentData.humidity + Math.floor(Math.random() * 21) - 10)),
    moisture: Math.max(0, Math.min(100, currentData.moisture + Math.floor(Math.random() * 21) - 10)),
    nitrogen: Math.max(0, currentData.nitrogen + Math.floor(Math.random() * 11) - 5),
    phosphorous: Math.max(0, currentData.phosphorous + Math.floor(Math.random() * 9) - 4),
    potassium: Math.max(0, currentData.potassium + Math.floor(Math.random() * 9) - 4),
  }))
}

export default function SoilMonitoring() {
  const { language } = useUser()
  const [data, setData] = useState<any[]>([])
  const [currentData, setCurrentData] = useState<SoilData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/soil-data")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        if (result.error) {
          throw new Error(result.error)
        }
        setCurrentData(result)
        setData(generateMockData(result))
      } catch (error) {
        console.error("Error fetching soil data:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Fetch every minute

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{language === "en" ? "Error" : "خرابی"}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!currentData) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{language === "en" ? "Error" : "خرابی"}</AlertTitle>
        <AlertDescription>{language === "en" ? "No data available" : "کوئی ڈیٹا دستیاب نہیں ہے"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold mb-8">{language === "en" ? "Soil Monitoring" : "مٹی کی نگرانی"}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Current Soil Data" : "موجودہ مٹی کا ڈیٹا"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                {language === "en" ? "Air Temperature" : "ہوا کا درجہ حرارت"}: {currentData.airTemperature.toFixed(2)}
                °C
              </li>
              <li>
                {language === "en" ? "Soil Temperature" : "مٹی کا درجہ حرارت"}: {currentData.soilTemperature.toFixed(2)}
                °C
              </li>
              <li>
                {language === "en" ? "Humidity" : "نمی"}: {currentData.humidity.toFixed(2)}%
              </li>
              <li>
                {language === "en" ? "Moisture" : "رطوبت"}: {currentData.moisture.toFixed(2)}%
              </li>
              <li>
                {language === "en" ? "Nitrogen" : "نائٹروجن"}: {currentData.nitrogen.toFixed(2)} mg/kg
              </li>
              <li>
                {language === "en" ? "Phosphorous" : "فاسفورس"}: {currentData.phosphorous.toFixed(2)} mg/kg
              </li>
              <li>
                {language === "en" ? "Potassium" : "پوٹاشیم"}: {currentData.potassium.toFixed(2)} mg/kg
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Soil Quality" : "مٹی کی معیار"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {language === "en"
                ? currentData.soilQuality
                : currentData.soilQuality === "Poor"
                  ? "خراب"
                  : currentData.soilQuality === "Moderate"
                    ? "معتدل"
                    : "اچھا"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Soil Temperature" : "مٹی کا درجہ حرارت"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="soilTemperature" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Soil Moisture" : "مٹی کی نمی"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="moisture" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
