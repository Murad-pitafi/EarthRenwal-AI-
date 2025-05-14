"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, Gauge, AlertTriangle } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { toast } from "@/components/ui/use-toast"

interface SoilData {
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  humidity: number
  gas_level: number
}

interface GroqAnalysisResult {
  prediction: string
  assessment?: string
  recommendations: string[]
  suitableCrops?: string[]
}

// Change from named export to default export to match the import in soil-test/page.tsx
export default function GroqSoilTest() {
  const { language } = useUser()
  const isUrdu = language === "ur"

  const [formData, setFormData] = useState<SoilData>({
    nitrogen: 350,
    phosphorus: 450,
    potassium: 500,
    temperature: 28,
    humidity: 65,
    gas_level: 450,
  })

  const [result, setResult] = useState<GroqAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Log the data being sent
      console.log("Soil parameters:", formData)
      console.log("Using Groq analysis with values:", formData)

      const response = await fetch("/api/groq-soil-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Groq soil analysis:", data)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${data.message || "Unknown error"}`)
      }

      if (!data || data.error) {
        throw new Error(data.message || "Failed to get soil analysis")
      }

      setResult(data)
    } catch (error) {
      console.error("Error analyzing soil:", error)
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Failed to analyze soil data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Excessive":
        return "bg-purple-500"
      case "Good":
        return "bg-green-500"
      case "Moderate":
        return "bg-yellow-500"
      case "Poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case "Excessive":
        return <AlertTriangle className="h-4 w-4 text-white" />
      case "Good":
        return <CheckCircle className="h-4 w-4 text-white" />
      default:
        return null
    }
  }

  const getQualityText = (quality: string) => {
    if (isUrdu) {
      switch (quality) {
        case "Excessive":
          return "زیادہ"
        case "Good":
          return "اچھا"
        case "Moderate":
          return "معتدل"
        case "Poor":
          return "خراب"
        default:
          return "نامعلوم"
      }
    } else {
      return quality || "Unknown"
    }
  }

  const hasCompleteResult =
    result && (result.assessment || (result.recommendations && result.recommendations.length > 0))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className={isUrdu ? "font-urdu" : ""}>
            {isUrdu ? "مٹی کی صحت کا تجزیہ" : "Soil Health Analysis"}
          </CardTitle>
          <CardDescription className={isUrdu ? "font-urdu" : ""}>
            {isUrdu
              ? "اپنے مٹی کے پیرامیٹرز درج کریں اور مٹی کی صحت کا تجزیہ کریں"
              : "Enter your soil parameters and analyze soil health"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nitrogen" className={isUrdu ? "font-urdu" : ""}>
                  {isUrdu ? "نائٹروجن (mg/kg)" : "Nitrogen (mg/kg)"}
                </Label>
                <Input
                  id="nitrogen"
                  name="nitrogen"
                  type="number"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Excessive: &gt;450, Good: 300-450, Moderate: 150-300, Poor: 0-150
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phosphorus" className={isUrdu ? "font-urdu" : ""}>
                  {isUrdu ? "فاسفورس (mg/kg)" : "Phosphorus (mg/kg)"}
                </Label>
                <Input
                  id="phosphorus"
                  name="phosphorus"
                  type="number"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Excessive: &gt;600, Good: 400-600, Moderate: 200-400, Poor: 0-200
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="potassium" className={isUrdu ? "font-urdu" : ""}>
                  {isUrdu ? "پوٹاشیم (mg/kg)" : "Potassium (mg/kg)"}
                </Label>
                <Input
                  id="potassium"
                  name="potassium"
                  type="number"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Excessive: &gt;600, Good: 400-600, Moderate: 200-400, Poor: 0-200
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature" className={isUrdu ? "font-urdu" : ""}>
                  {isUrdu ? "درجہ حرارت (°C)" : "Temperature (°C)"}
                </Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Excessive: &gt;45, Good: 20-30, Moderate: 30-35, Poor: 35-45
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="humidity" className={isUrdu ? "font-urdu" : ""}>
                  {isUrdu ? "نمی (%)" : "Humidity (%)"}
                </Label>
                <Input
                  id="humidity"
                  name="humidity"
                  type="number"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Excessive: &gt;90, Good: 60-90, Moderate: 30-60, Poor: 10-30
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gas_level" className={isUrdu ? "font-urdu" : ""}>
                  {isUrdu ? "گیس کی سطح (ppm)" : "Gas Level (ppm)"}
                </Label>
                <Input
                  id="gas_level"
                  name="gas_level"
                  type="number"
                  value={formData.gas_level}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Excessive: &gt;900, Good: 300-500, Moderate: 500-700, Poor: 700-900
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Analyzing..." : isUrdu ? "مٹی کی صحت کا تجزیہ کریں" : "Analyze Soil Health"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isUrdu ? "تجزیہ کے نتائج" : "Analysis Results"}</span>
              <Badge className={`flex items-center gap-1 ${getQualityColor(result.prediction)}`}>
                {getQualityIcon(result.prediction)}
                {getQualityText(result.prediction)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasCompleteResult && (
              <div className="p-3 bg-amber-50 rounded-md">
                <p className="text-amber-800">We received a partial analysis result. Here's what we know:</p>
              </div>
            )}

            {/* Assessment */}
            {result.assessment && (
              <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-md">
                <Gauge className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">{isUrdu ? "مٹی کا تجزیہ" : "Soil Assessment"}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{result.assessment}</p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 ? (
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">{isUrdu ? "تجاویز" : "Recommendations"}</h4>
                  <ul className="mt-2 space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-muted-foreground">No specific recommendations available.</p>
              </div>
            )}

            {/* Suitable Crops */}
            {result.suitableCrops && result.suitableCrops.length > 0 ? (
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">{isUrdu ? "موزوں فصلیں" : "Suitable Crops"}</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.suitableCrops.map((crop, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-muted-foreground">No crop recommendations available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
