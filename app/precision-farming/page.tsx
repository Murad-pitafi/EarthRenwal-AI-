"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface NutrientData {
  nitrogen: number
  phosphorous: number
  potassium: number
}

function getNutrientStatus(value: number): string {
  if (value < 30) return "Low"
  if (value < 60) return "Moderate"
  return "Optimal"
}

function getNutrientRecommendation(status: string): string {
  switch (status) {
    case "Low":
      return "Increase application"
    case "Moderate":
      return "Maintain current levels"
    case "Optimal":
      return "Reduce application"
    default:
      return "Unable to determine"
  }
}

export default function PrecisionFarming() {
  const { language } = useUser()
  const [nutrientData, setNutrientData] = useState<NutrientData | null>(null)
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
        setNutrientData({
          nitrogen: result.nitrogen,
          phosphorous: result.phosphorous,
          potassium: result.potassium,
        })
      } catch (error) {
        console.error("Error fetching nutrient data:", error)
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

  if (!nutrientData) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{language === "en" ? "Error" : "خرابی"}</AlertTitle>
        <AlertDescription>{language === "en" ? "No data available" : "کوئی ڈیٹا دستیاب نہیں ہے"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold mb-8">{language === "en" ? "Precision Farming" : "درست کاشتکاری"}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(nutrientData).map(([nutrient, value]) => (
          <Card key={nutrient}>
            <CardHeader>
              <CardTitle>
                {language === "en"
                  ? nutrient.charAt(0).toUpperCase() + nutrient.slice(1)
                  : nutrient === "nitrogen"
                    ? "نائٹروجن"
                    : nutrient === "phosphorous"
                      ? "فاسفورس"
                      : "پوٹاشیم"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={value} className="mb-2" />
              <p>
                {language === "en" ? "Status" : "حالت"}: {getNutrientStatus(value)}
              </p>
              <p>
                {language === "en" ? "Recommendation" : "سفارش"}: {getNutrientRecommendation(getNutrientStatus(value))}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
