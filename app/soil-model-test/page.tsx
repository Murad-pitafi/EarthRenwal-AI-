"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SoilPredictionResponse {
  prediction: string
  probability?: number
  recommendations: string[]
}

export default function SoilModelTest() {
  const [formData, setFormData] = useState({
    gas_level: 500,
    humidity: 65,
    nitrogen: 45,
    phosphorus: 15,
    potassium: 150,
    temperature: 28,
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SoilPredictionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/soil-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Soil Quality Model Testing</h1>
      <p className="text-muted-foreground mb-8">
        Use this interface to test the soil quality prediction model with different input parameters.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Enter soil sensor values to predict soil quality</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gas_level">Gas Level (ppm)</Label>
                  <Input
                    id="gas_level"
                    name="gas_level"
                    type="number"
                    value={formData.gas_level}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input
                    id="humidity"
                    name="humidity"
                    type="number"
                    value={formData.humidity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nitrogen">Nitrogen (mg/kg)</Label>
                  <Input
                    id="nitrogen"
                    name="nitrogen"
                    type="number"
                    value={formData.nitrogen}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phosphorus">Phosphorus (mg/kg)</Label>
                  <Input
                    id="phosphorus"
                    name="phosphorus"
                    type="number"
                    value={formData.phosphorus}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium (mg/kg)</Label>
                  <Input
                    id="potassium"
                    name="potassium"
                    type="number"
                    value={formData.potassium}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? "Predicting..." : "Predict Soil Quality"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>Soil quality prediction based on input parameters</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="bg-red-50 p-4 rounded-md flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Error</h4>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Soil Quality</h3>
                  <Badge className={`text-lg py-1 px-3 ${getStatusColor(result.prediction)}`}>
                    {result.prediction}
                  </Badge>
                  {result.probability !== null && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Confidence: {Math.round((result.probability || 0) * 100)}%
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <p>Enter soil parameters and click "Predict" to see results</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <p>
              This prediction uses an XGBoost model trained on soil quality data. Results are for guidance only and
              should be verified with laboratory testing.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
