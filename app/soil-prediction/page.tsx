"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@/contexts/UserContext"
import { AgricultureLayout } from "@/components/AgricultureLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function SoilPrediction() {
  const { language } = useUser()
  const [prediction, setPrediction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    airTemperature: 28.9,
    soilTemperature: 26.81,
    humidity: 42.0,
    moisture: 60.74,
    nitrogen: 4.97,
    phosphorous: 32.24,
    potassium: 24.44,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/soil-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen: formData.nitrogen,
          phosphorous: formData.phosphorous,
          potassium: formData.potassium,
        }),
      })

      if (!response.ok) throw new Error("API request failed")

      const data = await response.json()
      setPrediction(data.prediction)
    } catch (error) {
      console.error("Error in soil prediction:", error)
      toast({
        title: "Prediction Error",
        description: "Failed to predict soil quality. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AgricultureLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">
          {language === "en" ? "Soil Quality Prediction" : "مٹی کی معیار کی پیش گوئی"}
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Enter Soil Parameters" : "مٹی کے پیرامیٹرز درج کریں"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                  <Input
                    id={key}
                    name={key}
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? language === "en"
                    ? "Predicting..."
                    : "پیش گوئی کر رہا ہے..."
                  : language === "en"
                    ? "Predict Soil Quality"
                    : "مٹی کی معیار کی پیش گوئی کریں"}
              </Button>
            </form>
          </CardContent>
        </Card>
        {prediction && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Soil Quality Prediction Results" : "مٹی کی معیار کی پیش گوئی کے نتائج"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">{prediction}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AgricultureLayout>
  )
}
