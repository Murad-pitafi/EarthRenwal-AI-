"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

interface SensorData {
  id: string
  variableId: string
  name: string
  value: number | null
  unit: string
  timestamp: string | null
  type?: "soil" | "environment" | "other"
  icon?: string
  description?: string
  min?: number
  max?: number
}

interface SensorInsightsProps {
  sensorData: SensorData[]
}

export function SensorInsights({ sensorData }: SensorInsightsProps) {
  const { language } = useUser()
  const isUrdu = language === "ur"

  // Generate insights based on sensor data
  const generateInsights = () => {
    const insights = []

    // Check temperature
    const tempSensor = sensorData.find((s) => s.variableId === "temp")
    if (tempSensor && tempSensor.value !== null) {
      if (tempSensor.value > 35) {
        insights.push({
          type: "warning",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          message: isUrdu
            ? "درجہ حرارت بہت زیادہ ہے، پودوں کو پانی دیں"
            : "Temperature is very high, consider watering plants",
        })
      } else if (tempSensor.value < 15) {
        insights.push({
          type: "warning",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          message: isUrdu ? "درجہ حرارت کم ہے، پودوں کو گرم رکھیں" : "Temperature is low, keep plants warm",
        })
      } else {
        insights.push({
          type: "good",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          message: isUrdu ? "درجہ حرارت مثالی حد میں ہے" : "Temperature is in optimal range",
        })
      }
    }

    // Check humidity
    const humdSensor = sensorData.find((s) => s.variableId === "humd")
    if (humdSensor && humdSensor.value !== null) {
      if (humdSensor.value > 80) {
        insights.push({
          type: "warning",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          message: isUrdu ? "نمی بہت زیادہ ہے، ہوا داری بڑھائیں" : "Humidity is very high, increase ventilation",
        })
      } else if (humdSensor.value < 30) {
        insights.push({
          type: "warning",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          message: isUrdu ? "نمی بہت کم ہے، پانی کا چھڑکاؤ کریں" : "Humidity is very low, consider misting plants",
        })
      } else {
        insights.push({
          type: "good",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          message: isUrdu ? "نمی مثالی حد میں ہے" : "Humidity is in optimal range",
        })
      }
    }

    // Check gas level
    const gasSensor = sensorData.find((s) => s.variableId === "gas")
    if (gasSensor && gasSensor.value !== null) {
      if (gasSensor.value > 800) {
        insights.push({
          type: "critical",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          message: isUrdu
            ? "گیس کی سطح بہت زیادہ ہے، ہوا داری بڑھائیں"
            : "Gas level is very high, increase ventilation immediately",
        })
      } else if (gasSensor.value > 600) {
        insights.push({
          type: "warning",
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          message: isUrdu ? "گیس کی سطح زیادہ ہے، ہوا داری کی جانچ کریں" : "Gas level is elevated, check ventilation",
        })
      } else {
        insights.push({
          type: "good",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          message: isUrdu ? "گیس کی سطح محفوظ حد میں ہے" : "Gas level is in safe range",
        })
      }
    }

    // Removed hardcoded weather prediction insights

    return insights
  }

  const insights = generateInsights()

  // If no insights are available, show a message
  if (insights.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className={`text-lg ${isUrdu ? "font-urdu" : ""}`}>
            {isUrdu ? "انٹیلیجنٹ انسائٹس" : "Intelligent Insights"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
            {isUrdu ? "کوئی انسائٹس دستیاب نہیں ہیں" : "No insights available"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isUrdu ? "font-urdu" : ""}`}>
          {isUrdu ? "انٹیلیجنٹ انسائٹس" : "Intelligent Insights"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li
              key={index}
              className={`flex items-start gap-2 p-2 rounded-md ${
                insight.type === "critical"
                  ? "bg-red-50"
                  : insight.type === "warning"
                    ? "bg-amber-50"
                    : insight.type === "good"
                      ? "bg-green-50"
                      : "bg-blue-50"
              }`}
            >
              {insight.icon}
              <span className={isUrdu ? "font-urdu" : ""}>{insight.message}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
