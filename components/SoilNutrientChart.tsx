"use client"

import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SoilNutrientChartProps {
  nitrogen: number
  phosphorous: number
  potassium: number
  ph: number
}

export function SoilNutrientChart({ nitrogen, phosphorous, potassium, ph }: SoilNutrientChartProps) {
  const { language } = useUser()

  // Calculate percentage of optimal range for each nutrient
  const calculateOptimalPercentage = (value: number, min: number, max: number) => {
    if (value < min) {
      return (value / min) * 100
    } else if (value > max) {
      return 100 - ((value - max) / max) * 50 // Decrease beyond optimal, but not as drastically
    } else {
      return 100 // Within optimal range
    }
  }

  // Prepare data for the chart
  const data = [
    {
      name: "N",
      value: nitrogen,
      optimal: calculateOptimalPercentage(nitrogen, 0.15, 0.25),
      range: language === "en" ? "0.15-0.25%" : "%0.15-0.25",
      current: `${nitrogen.toFixed(2)}%`,
    },
    {
      name: "P",
      value: phosphorous,
      optimal: calculateOptimalPercentage(phosphorous, 10, 20),
      range: "10-20 ppm",
      current: `${phosphorous.toFixed(1)} ppm`,
    },
    {
      name: "K",
      value: potassium,
      optimal: calculateOptimalPercentage(potassium, 100, 200),
      range: "100-200 ppm",
      current: `${potassium.toFixed(1)} ppm`,
    },
    {
      name: "pH",
      value: ph,
      optimal: calculateOptimalPercentage(ph, 7.7, 7.8),
      range: "7.7-7.8",
      current: ph.toFixed(1),
    },
  ]

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-bold">{item.name}</p>
          <p>
            {language === "en" ? "Current Value: " : "موجودہ قیمت: "}
            <span className="font-medium">{item.current}</span>
          </p>
          <p>
            {language === "en" ? "Optimal Range: " : "مثالی رینج: "}
            <span className="font-medium">{item.range}</span>
          </p>
          <p>
            {language === "en" ? "Optimality: " : "مثالیت: "}
            <span className="font-medium">{Math.round(item.optimal)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{language === "en" ? "Soil Nutrient Analysis" : "مٹی کے غذائی اجزاء کا تجزیہ"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: language === "en" ? "% of Optimal" : "مثالی کا %", angle: -90, position: "insideLeft" }}
              />
              <Tooltip content={renderCustomTooltip} />
              <Legend />
              <Bar
                dataKey="optimal"
                name={language === "en" ? "% of Optimal Range" : "مثالی رینج کا %"}
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 px-4 py-3 bg-green-50 rounded-md border border-green-100 text-sm">
          <p>
            {language === "en"
              ? "This chart shows how your soil nutrients compare to optimal ranges for Pakistani soils. 100% indicates optimal range, while lower values indicate deficiency."
              : "یہ چارٹ دکھاتا ہے کہ آپ کی مٹی کے غذائی اجزاء پاکستانی مٹی کے لیے مثالی رینج سے کیسے موازنہ کرتے ہیں۔ 100٪ مثالی رینج کی نشاندہی کرتا ہے، جبکہ کم اقدار کمی کی نشاندہی کرتی ہیں۔"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
