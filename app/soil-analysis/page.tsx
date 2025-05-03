"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2, Microscope, Droplets, Thermometer, Leaf } from "lucide-react"
import Image from "next/image"
import { useUser } from "@/contexts/UserContext"

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
    soilTemperature: currentData.soilTemperature + Math.floor(Math.random() * 7) - 3,
    moisture: Math.max(0, Math.min(100, currentData.moisture + Math.floor(Math.random() * 21) - 10)),
    nitrogen: Math.max(0, currentData.nitrogen + Math.floor(Math.random() * 11) - 5),
    phosphorous: Math.max(0, currentData.phosphorous + Math.floor(Math.random() * 9) - 4),
    potassium: Math.max(0, currentData.potassium + Math.floor(Math.random() * 9) - 4),
  }))
}

export default function SoilAnalysis() {
  const { language } = useUser()
  const [soilData, setSoilData] = useState<SoilData | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nitrogen: 45,
    phosphorous: 32,
    potassium: 28,
  })

  const translations = {
    en: {
      title: "Soil Analysis",
      subtitle: "Comprehensive soil monitoring and quality prediction",
      download: "Download Full Report",
      dashboard: "Dashboard",
      analysis: "Analysis",
      prediction: "Prediction",
      soilTemp: "Soil Temperature",
      soilMoisture: "Soil Moisture",
      nitrogenLevel: "Nitrogen Level",
      soilQuality: "Soil Quality",
      soilTemp24h: "Soil Temperature (24h)",
      soilMoisture24h: "Soil Moisture (24h)",
      npkAnalysis: "NPK Analysis",
      npkDesc: "Nitrogen, Phosphorous, Potassium levels",
      soilComp: "Soil Composition",
      soilCompDesc: "Current soil nutrient breakdown",
      recommendations: "Recommendations",
      rec1: "Consider adding nitrogen-rich fertilizer to improve soil quality",
      rec2: "Maintain current irrigation schedule to optimize moisture levels",
      rec3: "Monitor phosphorous levels which are slightly below optimal range",
      soilQualityPred: "Soil Quality Prediction",
      soilQualityDesc: "Enter soil parameters to predict quality",
      predictButton: "Predict Soil Quality",
      predictionResult: "Prediction Result",
      goodResult: "Your soil quality is excellent for most crops. Maintain current practices.",
      moderateResult: "Your soil has adequate quality but could benefit from some improvements.",
      poorResult: "Your soil needs significant improvement. Consider soil amendments and fertilization.",
      soilHealthGuide: "Soil Health Guide",
      soilHealthDesc: "Understanding soil quality parameters",
      soilQualityIndicators: "Soil Quality Indicators",
      nitrogenDesc: "Essential for leaf growth and green vegetation",
      phosphorousDesc: "Critical for root development and flowering",
      potassiumDesc: "Improves overall plant health and disease resistance",
      downloadGuide: "Download Soil Health Guide",
    },
    ur: {
      title: "مٹی کا تجزیہ",
      subtitle: "جامع مٹی کی نگرانی اور معیار کی پیش گوئی",
      download: "مکمل رپورٹ ڈاؤن لوڈ کریں",
      dashboard: "ڈیش بورڈ",
      analysis: "تجزیہ",
      prediction: "پیش گوئی",
      soilTemp: "مٹی کا درجہ حرارت",
      soilMoisture: "مٹی کی نمی",
      nitrogenLevel: "نائٹروجن کی سطح",
      soilQuality: "مٹی کا معیار",
      soilTemp24h: "مٹی کا درجہ حرارت (24 گھنٹے)",
      soilMoisture24h: "مٹی کی نمی (24 گھنٹے)",
      npkAnalysis: "این پی کے تجزیہ",
      npkDesc: "نائٹروجن، فاسفورس، پوٹاشیم کی سطح",
      soilComp: "مٹی کی ترکیب",
      soilCompDesc: "موجودہ مٹی کے غذائی اجزاء کی تفصیل",
      recommendations: "سفارشات",
      rec1: "مٹی کے معیار کو بہتر بنانے کے لیے نائٹروجن سے بھرپور کھاد شامل کرنے پر غور کریں",
      rec2: "نمی کی سطح کو بہتر بنانے کے لیے موجودہ آبپاشی کا شیڈول برقرار رکھیں",
      rec3: "فاسفورس کی سطح کی نگرانی کریں جو بہترین حد سے تھوڑی کم ہے",
      soilQualityPred: "مٹی کے معیار کی پیش گوئی",
      soilQualityDesc: "معیار کی پیش گوئی کے لیے مٹی کے پیرامیٹرز درج کریں",
      predictButton: "مٹی کے معیار کی پیش گوئی کریں",
      predictionResult: "پیش گوئی کا نتیجہ",
      goodResult: "آپ کی مٹی کا معیار زیادہ تر فصلوں کے لیے بہترین ہے۔ موجودہ طریقوں کو برقرار رکھیں۔",
      moderateResult: "آپ کی مٹی کا معیار مناسب ہے لیکن کچھ بہتری سے فائد�� ہو سکتا ہے۔",
      poorResult: "آپ کی مٹی کو نمایاں بہتری کی ضرورت ہے۔ مٹی میں ترمیم اور کھاد پر غور کریں۔",
      soilHealthGuide: "مٹی کی صحت کا رہنما",
      soilHealthDesc: "مٹی کے معیار کے پیرامیٹرز کو سمجھنا",
      soilQualityIndicators: "مٹی کے معیار کے اشارے",
      nitrogenDesc: "پتوں کی نشوونما اور سبز نباتات کے لیے ضروری",
      phosphorousDesc: "جڑوں کی نشوونما اور پھولوں کے لیے اہم",
      potassiumDesc: "پودوں کی مجموعی صحت اور بیماری سے مزاحمت کو بہتر بناتا ہے",
      downloadGuide: "مٹی کی صحت کا رہنما ڈاؤن لوڈ کریں",
    },
  }

  const t = translations[language]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: SoilData = {
        airTemperature: 28.5,
        soilTemperature: 26.2,
        humidity: 45.8,
        moisture: 58.3,
        nitrogen: 45,
        phosphorous: 32,
        potassium: 28,
        soilQuality: language === "en" ? "Moderate" : "معتدل",
      }
      setSoilData(mockData)
      setChartData(generateMockData(mockData))
      setIsLoading(false)
    }, 1500)
  }, [language])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple prediction logic
    const avgNPK = (formData.nitrogen + formData.phosphorous + formData.potassium) / 3
    let quality = language === "en" ? "Poor" : "خراب"

    if (avgNPK > 60) quality = language === "en" ? "Good" : "اچھا"
    else if (avgNPK > 30) quality = language === "en" ? "Moderate" : "معتدل"

    setPrediction(quality)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!soilData) return null

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{t.title}</h1>
          <p className="text-gray-500 mt-2">{t.subtitle}</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">{t.download}</Button>
      </div>

      <Tabs defaultValue="dashboard" className="bg-white rounded-lg p-4 shadow-sm">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
          <TabsTrigger value="analysis">{t.analysis}</TabsTrigger>
          <TabsTrigger value="prediction">{t.prediction}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t.soilTemp}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <div className="text-2xl font-bold">{soilData.soilTemperature.toFixed(1)}°C</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t.soilMoisture}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div className="text-2xl font-bold">{soilData.moisture.toFixed(1)}%</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t.nitrogenLevel}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Leaf className="h-5 w-5 text-green-500" />
                  <div className="text-2xl font-bold">{soilData.nitrogen.toFixed(1)} mg/kg</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t.soilQuality}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Microscope className="h-5 w-5 text-purple-500" />
                  <div className="text-2xl font-bold">{soilData.soilQuality}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle>{t.soilTemp24h}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="soilTemperature" stroke="#f97316" name="Temperature (°C)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle>{t.soilMoisture24h}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="moisture" stroke="#3b82f6" name="Moisture (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle>{t.npkAnalysis}</CardTitle>
                <CardDescription>{t.npkDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="nitrogen" stroke="#22c55e" name="Nitrogen (mg/kg)" />
                      <Line type="monotone" dataKey="phosphorous" stroke="#eab308" name="Phosphorous (mg/kg)" />
                      <Line type="monotone" dataKey="potassium" stroke="#8b5cf6" name="Potassium (mg/kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle>{t.soilComp}</CardTitle>
                <CardDescription>{t.soilCompDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{language === "en" ? "Nitrogen" : "نائٹروجن"}</span>
                      <span className="text-sm font-medium">{soilData.nitrogen} mg/kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, soilData.nitrogen)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{language === "en" ? "Phosphorous" : "فاسفورس"}</span>
                      <span className="text-sm font-medium">{soilData.phosphorous} mg/kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-500 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, soilData.phosphorous)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{language === "en" ? "Potassium" : "پوٹاشیم"}</span>
                      <span className="text-sm font-medium">{soilData.potassium} mg/kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-500 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, soilData.potassium)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">{t.recommendations}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </div>
                      <p className="text-sm">{t.rec1}</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </div>
                      <p className="text-sm">{t.rec2}</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </div>
                      <p className="text-sm">{t.rec3}</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prediction" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle>{t.soilQualityPred}</CardTitle>
                <CardDescription>{t.soilQualityDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nitrogen">{language === "en" ? "Nitrogen (mg/kg)" : "نائٹروجن (mg/kg)"}</Label>
                    <Input
                      id="nitrogen"
                      name="nitrogen"
                      type="number"
                      step="0.01"
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phosphorous">{language === "en" ? "Phosphorous (mg/kg)" : "فاسفورس (mg/kg)"}</Label>
                    <Input
                      id="phosphorous"
                      name="phosphorous"
                      type="number"
                      step="0.01"
                      value={formData.phosphorous}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="potassium">{language === "en" ? "Potassium (mg/kg)" : "پوٹاشیم (mg/kg)"}</Label>
                    <Input
                      id="potassium"
                      name="potassium"
                      type="number"
                      step="0.01"
                      value={formData.potassium}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {t.predictButton}
                  </Button>
                </form>

                {prediction && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold mb-2">{t.predictionResult}</h3>
                    <p className="text-2xl font-bold text-green-700">{prediction}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      {prediction === (language === "en" ? "Good" : "اچھا")
                        ? t.goodResult
                        : prediction === (language === "en" ? "Moderate" : "معتدل")
                          ? t.moderateResult
                          : t.poorResult}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle>{t.soilHealthGuide}</CardTitle>
                <CardDescription>{t.soilHealthDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <Image src="/images/background.jpg" alt="Healthy soil" fill className="object-cover" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{t.soilQualityIndicators}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-xs font-bold">N</span>
                      </div>
                      <div>
                        <p className="font-medium">{language === "en" ? "Nitrogen (N)" : "نائٹروجن (N)"}</p>
                        <p className="text-sm text-gray-600">{t.nitrogenDesc}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-xs font-bold">P</span>
                      </div>
                      <div>
                        <p className="font-medium">{language === "en" ? "Phosphorous (P)" : "فاسفورس (P)"}</p>
                        <p className="text-sm text-gray-600">{t.phosphorousDesc}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-600 text-xs font-bold">K</span>
                      </div>
                      <div>
                        <p className="font-medium">{language === "en" ? "Potassium (K)" : "پوٹاشیم (K)"}</p>
                        <p className="text-sm text-gray-600">{t.potassiumDesc}</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Button variant="outline" className="w-full">
                  {t.downloadGuide}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
