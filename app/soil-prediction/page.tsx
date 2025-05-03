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
import { SoilQualityIndicator } from "@/components/SoilQualityIndicator"
import { SoilNutrientChart } from "@/components/SoilNutrientChart"

export default function SoilPrediction() {
  const { language } = useUser()
  const [prediction, setPrediction] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    airTemperature: 28.9,
    soilTemperature: 26.81,
    humidity: 42.0,
    moisture: 60.74,
    nitrogen: 0.18, // Updated to % format
    phosphorous: 15.0, // Updated to ppm
    potassium: 150.0, // Updated to ppm
    ph: 7.7, // Added pH for Pakistani soils
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
          ph: formData.ph,
        }),
      })

      if (!response.ok) throw new Error("API request failed")

      const data = await response.json()
      setPrediction(data.prediction)
      setRecommendations(data.recommendations || [])
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
              <div>
                <Label htmlFor="nitrogen">{language === "en" ? "Nitrogen (%)" : "نائٹروجن (%)"}</Label>
                <Input
                  id="nitrogen"
                  name="nitrogen"
                  type="number"
                  step="0.01"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === "en" ? "Optimal range: 0.15-0.25%" : "مثالی رینج: 0.15-0.25%"}
                </p>
              </div>
              <div>
                <Label htmlFor="phosphorous">{language === "en" ? "Phosphorous (ppm)" : "فاسفورس (ppm)"}</Label>
                <Input
                  id="phosphorous"
                  name="phosphorous"
                  type="number"
                  step="0.1"
                  value={formData.phosphorous}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === "en" ? "Optimal range: 10-20 ppm" : "مثالی رینج: 10-20 ppm"}
                </p>
              </div>
              <div>
                <Label htmlFor="potassium">{language === "en" ? "Potassium (ppm)" : "پوٹاشیم (ppm)"}</Label>
                <Input
                  id="potassium"
                  name="potassium"
                  type="number"
                  step="0.1"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === "en" ? "Optimal range: 100-200 ppm" : "مثالی رینج: 100-200 ppm"}
                </p>
              </div>
              <div>
                <Label htmlFor="ph">{language === "en" ? "Soil pH" : "مٹی کا pH"}</Label>
                <Input
                  id="ph"
                  name="ph"
                  type="number"
                  step="0.1"
                  value={formData.ph}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === "en"
                    ? "Typical Pakistani soil: 7.7-7.8 (alkaline)"
                    : "عام پاکستانی مٹی: 7.7-7.8 (الکلائن)"}
                </p>
              </div>
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
          <div className="mt-8 space-y-6">
            <SoilQualityIndicator quality={prediction} recommendations={recommendations} />

            <SoilNutrientChart
              nitrogen={formData.nitrogen}
              phosphorous={formData.phosphorous}
              potassium={formData.potassium}
              ph={formData.ph}
            />

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Pakistani Soil Reference Ranges" : "پاکستانی مٹی کے حوالہ رینج"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-md">
                    <h4 className="font-medium mb-2">{language === "en" ? "Nitrogen (N)" : "نائٹروجن (N)"}</h4>
                    <p className="text-sm">
                      <strong>{language === "en" ? "Optimal Range:" : "مثالی رینج:"}</strong> 0.15-0.25%
                    </p>
                    <p className="text-sm mt-1">
                      {language === "en"
                        ? "Essential for leaf growth and protein formation."
                        : "پتوں کی نشوونما اور پروٹین کی تشکیل کے لیے ضروری۔"}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-md">
                    <h4 className="font-medium mb-2">{language === "en" ? "Phosphorous (P)" : "فاسفورس (P)"}</h4>
                    <p className="text-sm">
                      <strong>{language === "en" ? "Optimal Range:" : "مثالی رینج:"}</strong> 10-20 ppm
                    </p>
                    <p className="text-sm mt-1">
                      {language === "en"
                        ? "Critical for root development and energy transfer."
                        : "جڑوں کی نشوونما اور توانائی کی منتقلی کے لیے اہم۔"}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-md">
                    <h4 className="font-medium mb-2">{language === "en" ? "Potassium (K)" : "پوٹاشیم (K)"}</h4>
                    <p className="text-sm">
                      <strong>{language === "en" ? "Optimal Range:" : "مثالی رینج:"}</strong> 100-200 ppm
                    </p>
                    <p className="text-sm mt-1">
                      {language === "en"
                        ? "Improves drought resistance and disease resistance."
                        : "خشک سالی اور بیماری سے مزاحمت کو بہتر بناتا ہے۔"}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-md">
                    <h4 className="font-medium mb-2">{language === "en" ? "Soil pH" : "مٹی کا pH"}</h4>
                    <p className="text-sm">
                      <strong>{language === "en" ? "Typical Range:" : "عام رینج:"}</strong> 7.7-7.8
                    </p>
                    <p className="text-sm mt-1">
                      {language === "en"
                        ? "Pakistani soils are typically alkaline, affecting nutrient availability."
                        : "پاکستانی مٹی عام طور پر الکلائن ہوتی ہے، جو غذائی اجزاء کی دستیابی کو متاثر کرتی ہے۔"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AgricultureLayout>
  )
}
