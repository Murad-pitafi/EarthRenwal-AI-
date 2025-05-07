"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import { Thermometer, Droplet, Wind, Leaf, Activity, Ruler, Zap, CloudRain, Sun, Gauge } from "lucide-react"

interface SensorDataCardProps {
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

export function SensorDataCard({
  id,
  variableId,
  name,
  value,
  unit,
  timestamp,
  type = "other",
  icon = "activity",
  description = "",
  min = 0,
  max = 100,
}: SensorDataCardProps) {
  const { language } = useUser()
  const isUrdu = language === "ur"

  // Get appropriate icon based on icon name
  const getIcon = () => {
    switch (icon.toLowerCase()) {
      case "thermometer":
        return <Thermometer className="h-5 w-5 text-red-500" />
      case "droplet":
        return <Droplet className="h-5 w-5 text-blue-500" />
      case "wind":
        return <Wind className="h-5 w-5 text-gray-500" />
      case "leaf":
        return <Leaf className="h-5 w-5 text-green-500" />
      case "ruler":
        return <Ruler className="h-5 w-5 text-purple-500" />
      case "zap":
        return <Zap className="h-5 w-5 text-yellow-500" />
      case "cloud-rain":
        return <CloudRain className="h-5 w-5 text-blue-400" />
      case "sun":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "gauge":
        return <Gauge className="h-5 w-5 text-orange-500" />
      case "activity":
      default:
        return <Activity className="h-5 w-5 text-emerald-500" />
    }
  }

  // Get progress value (normalized between 0-100)
  const getProgressValue = () => {
    if (value === null) return 0

    // Normalize value between min and max
    return Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100)
  }

  // Get progress color based on sensor type
  const getProgressColor = () => {
    switch (type) {
      case "soil":
        return "bg-green-500"
      case "environment":
        switch (variableId) {
          case "temp":
            return "bg-red-500"
          case "humd":
            return "bg-blue-500"
          case "gas":
            return "bg-gray-500"
          default:
            return "bg-emerald-500"
        }
      default:
        return "bg-emerald-500"
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return isUrdu ? "دستیاب نہیں" : "Not available"

    try {
      const date = new Date(timestamp)
      return new Intl.DateTimeFormat(isUrdu ? "ur-PK" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return timestamp
    }
  }

  // Get translated name based on variableId
  const getTranslatedName = () => {
    if (!isUrdu) return name

    // Urdu translations for sensor names
    const translations: Record<string, string> = {
      dist: "فاصلہ",
      gas: "گیس کی سطح",
      humd: "نمی",
      nit: "نائٹروجن",
      temp: "درجہ حرارت",
    }

    return translations[variableId] || name
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className={`text-md font-medium ${isUrdu ? "font-urdu" : ""}`}>
          <div className="flex items-center gap-2">
            {getIcon()}
            <span>{getTranslatedName()}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {value !== null ? (
          <>
            <div className="text-2xl font-bold mb-2">
              {value} {unit}
            </div>
            {/* Fix: Use className for the indicator instead of indicatorClassName */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor()} transition-all duration-500 ease-in-out`}
                style={{ width: `${getProgressValue()}%` }}
              ></div>
            </div>
            {description && (
              <div className="text-xs text-muted-foreground mt-1">
                {isUrdu ? "تفصیل: " : "Description: "}
                {description}
              </div>
            )}
          </>
        ) : (
          <div className="text-muted-foreground">{isUrdu ? "کوئی ڈیٹا دستیاب نہیں" : "No data available"}</div>
        )}
        <div className="text-xs text-muted-foreground mt-2">
          {isUrdu ? "آخری اپڈیٹ: " : "Last updated: "}
          {formatTimestamp(timestamp)}
        </div>
      </CardContent>
    </Card>
  )
}
