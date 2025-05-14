"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/contexts/UserContext"
import { useSensorData, type ConsolidatedReading } from "@/contexts/SensorDataContext"
import { SensorDataCard } from "./SensorDataCard"
import { SensorGauge } from "./SensorGauge"
import { SensorInsights } from "./SensorInsights"
import { SensorHistoryChart } from "./SensorHistoryChart"
import { SensorDataTable } from "./SensorDataTable"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Thermometer, Droplet, Wind, Leaf, FlaskConical, Atom, Gauge } from "lucide-react"

export const SENSOR_METADATA: Record<
  string,
  {
    name: string
    nameUrdu?: string
    unit: string
    icon: React.ElementType
    mockRange?: [number, number]
    description?: string
    descriptionUrdu?: string
    soilType?: boolean
    color?: string
  }
> = {
  temp: {
    name: "Temperature",
    nameUrdu: "درجہ حرارت",
    unit: "°C",
    icon: Thermometer,
    mockRange: [20, 40],
    description: "Air temperature around the crops",
    descriptionUrdu: "فصلوں کے ارد گرد ہوا کا درجہ حرارت",
    color: "#ef4444",
  },
  humd: {
    name: "Humidity",
    nameUrdu: "نمی",
    unit: "%",
    icon: Droplet,
    mockRange: [40, 90],
    description: "Relative humidity in the air",
    descriptionUrdu: "ہوا میں نسبتی نمی",
    color: "#3b82f6",
  },
  moist: {
    name: "Soil Moisture",
    nameUrdu: "مٹی کی نمی",
    unit: "%",
    icon: Droplet,
    mockRange: [20, 80],
    description: "Water content in the soil",
    descriptionUrdu: "مٹی میں پانی کی مقدار",
    soilType: true,
    color: "#0ea5e9",
  },
  nit: {
    name: "Nitrogen",
    nameUrdu: "نائٹروجن",
    unit: "mg/kg",
    icon: Leaf,
    mockRange: [10, 100],
    description: "Nitrogen content in soil",
    descriptionUrdu: "مٹی میں نائٹروجن کی مقدار",
    soilType: true,
    color: "#22c55e",
  },
  phos: {
    name: "Phosphorus",
    nameUrdu: "فاسفورس",
    unit: "mg/kg",
    icon: FlaskConical,
    mockRange: [5, 50],
    description: "Phosphorus content in soil",
    descriptionUrdu: "مٹی میں فاسفورس کی مقدار",
    soilType: true,
    color: "#f97316",
  },
  pot: {
    name: "Potassium",
    nameUrdu: "پوٹاشیم",
    unit: "mg/kg",
    icon: Atom,
    mockRange: [50, 200],
    description: "Potassium content in soil",
    descriptionUrdu: "مٹی میں پوٹاشیم کی مقدار",
    soilType: true,
    color: "#a855f7",
  },
  wind: {
    name: "Wind Speed",
    nameUrdu: "ہوا کی رفتار",
    unit: "km/h",
    icon: Wind,
    mockRange: [0, 30],
    description: "Current wind speed",
    descriptionUrdu: "موجودہ ہوا کی رفتار",
    color: "#64748b",
  },
  press: {
    name: "Pressure",
    nameUrdu: "دباؤ",
    unit: "hPa",
    icon: Gauge,
    mockRange: [990, 1020],
    description: "Atmospheric pressure",
    descriptionUrdu: "ہوائی دباؤ",
    color: "#6b7280",
  },
}

export default function RealTimeMonitoring() {
  const { language } = useUser()
  const isUrdu = language === "ur"
  const [sensorData, setSensorData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"cards" | "gauges" | "charts" | "table">("cards")
  const [filterType, setFilterType] = useState<"all" | "soil" | "environment">("all")
  const [useMockData, setUseMockData] = useState(true)
  const { readings, isCollecting, startCollection, stopCollection, lastUpdated } = useSensorData()
  const containerRef = useRef<HTMLDivElement>(null)

  // Process readings into sensor data
  useEffect(() => {
    if (readings.length === 0) return

    try {
      // Get the most recent reading
      const latestReading = readings[0] // Assuming readings are sorted newest first

      // Convert consolidated reading to individual sensor data format for UI
      const processedData = Object.entries(SENSOR_METADATA)
        .map(([sensorId, metadata]) => {
          // Check if this sensor exists in the latest reading
          const value = latestReading[sensorId as keyof ConsolidatedReading]

          return {
            id: `${sensorId}-${latestReading.timestamp}`,
            sensorId,
            variableId: sensorId,
            name: isUrdu && metadata.nameUrdu ? metadata.nameUrdu : metadata.name,
            value: value !== undefined ? value : null,
            unit: metadata.unit,
            timestamp: new Date(latestReading.timestamp).toISOString(),
            type: metadata.soilType ? "soil" : "environment",
            icon: metadata.icon.name.toLowerCase(),
            description: isUrdu && metadata.descriptionUrdu ? metadata.descriptionUrdu : metadata.description || "",
          }
        })
        .filter((sensor) => sensor.value !== null)

      setSensorData(processedData)
      setLoading(false)
    } catch (error) {
      console.error("Error processing sensor data:", error)
      // If there's an error, we'll fall back to mock data
      if (useMockData) {
        generateMockData()
      }
    }
  }, [readings, isUrdu, useMockData, lastUpdated])

  // Generate mock data if needed
  useEffect(() => {
    if (!useMockData) return

    const generateMockData = () => {
      const mockData = Object.keys(SENSOR_METADATA).map((sensorId) => {
        const metadata = SENSOR_METADATA[sensorId]
        const min = metadata.mockRange?.[0] || 0
        const max = metadata.mockRange?.[1] || 100
        const value = Number.parseFloat((min + Math.random() * (max - min)).toFixed(1))

        return {
          id: `mock-${sensorId}-${Date.now()}`,
          sensorId,
          variableId: sensorId,
          name: isUrdu && metadata.nameUrdu ? metadata.nameUrdu : metadata.name,
          value,
          unit: metadata.unit,
          timestamp: new Date().toISOString(),
          type: metadata.soilType ? "soil" : "environment",
          icon: metadata.icon.name.toLowerCase(),
          description: isUrdu && metadata.descriptionUrdu ? metadata.descriptionUrdu : metadata.description || "",
        }
      })

      setSensorData(mockData)
      setLoading(false)
    }

    generateMockData()
    const intervalId = setInterval(generateMockData, 30000)

    return () => clearInterval(intervalId)
  }, [useMockData, isUrdu])

  // Filter sensor data based on selected type
  const filteredSensorData = sensorData.filter((sensor) => {
    if (filterType === "all") return true
    return sensor.type === filterType
  })

  // Safe DOM manipulation with refs
  useEffect(() => {
    // This ensures we're not trying to manipulate DOM elements that don't exist
    if (!containerRef.current) return

    // Any DOM manipulation can be safely done here
    const container = containerRef.current

    // Example of safe DOM manipulation
    const updateContainerClass = () => {
      if (viewMode === "table") {
        container.classList.add("table-view")
      } else {
        container.classList.remove("table-view")
      }
    }

    updateContainerClass()

    // Clean up function to prevent memory leaks
    return () => {
      // Safe cleanup
    }
  }, [viewMode])

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${isUrdu ? "font-urdu" : ""}`}>
            {isUrdu ? "ریئل ٹائم مانیٹرنگ" : "Real-time Monitoring"}
          </h1>
          <p className={`text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
            {isUrdu ? "آپ کے کھیت کے سینسر کا لائیو ڈیٹا" : "Live sensor data from your field"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="mock-data" checked={useMockData} onCheckedChange={setUseMockData} />
            <Label htmlFor="mock-data" className={isUrdu ? "font-urdu" : ""}>
              {isUrdu ? "ڈیمو ڈیٹا استعمال کریں" : "Use Demo Data"}
            </Label>
          </div>

          <Button
            variant="outline"
            onClick={isCollecting ? stopCollection : startCollection}
            className={isUrdu ? "font-urdu" : ""}
          >
            {isCollecting
              ? isUrdu
                ? "ڈیٹا کلیکشن روکیں"
                : "Pause Collection"
              : isUrdu
                ? "ڈیٹا کلیکشن شروع کریں"
                : "Start Collection"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={viewMode === "cards" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("cards")}
          className={isUrdu ? "font-urdu" : ""}
        >
          {isUrdu ? "کارڈز" : "Cards"}
        </Button>
        <Button
          variant={viewMode === "gauges" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("gauges")}
          className={isUrdu ? "font-urdu" : ""}
        >
          {isUrdu ? "گیجز" : "Gauges"}
        </Button>
        <Button
          variant={viewMode === "charts" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("charts")}
          className={isUrdu ? "font-urdu" : ""}
        >
          {isUrdu ? "چارٹس" : "Charts"}
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("table")}
          className={isUrdu ? "font-urdu" : ""}
        >
          {isUrdu ? "ٹیبل" : "Table"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filterType === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("all")}
          className={isUrdu ? "font-urdu" : ""}
        >
          {isUrdu ? "تمام سینسر" : "All Sensors"}
        </Button>
        <Button
          variant={filterType === "soil" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("soil")}
          className={isUrdu ? "font-urdu" : ""}
        >
          {isUrdu ? "مٹی کے سینسر" : "Soil Sensors"}
        </Button>
        <Button
          variant={filterType === "environment" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("environment")}
          className={isUrdu ? "font-urdu" : ""}
        >
          {isUrdu ? "ماحولیاتی سینسر" : "Environmental Sensors"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {viewMode === "cards" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSensorData.map((sensor) => (
                <SensorDataCard
                  key={sensor.id}
                  id={sensor.id}
                  variableId={sensor.variableId}
                  name={sensor.name}
                  value={sensor.value}
                  unit={sensor.unit}
                  timestamp={sensor.timestamp}
                  type={sensor.type}
                  icon={sensor.icon}
                  description={sensor.description}
                />
              ))}
            </div>
          )}

          {viewMode === "gauges" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSensorData.map((sensor) => (
                <SensorGauge
                  key={sensor.id}
                  value={sensor.value}
                  min={SENSOR_METADATA[sensor.sensorId]?.mockRange?.[0] || 0}
                  max={SENSOR_METADATA[sensor.sensorId]?.mockRange?.[1] || 100}
                  name={sensor.name}
                  unit={sensor.unit}
                  color={SENSOR_METADATA[sensor.sensorId]?.color || "#3b82f6"}
                  thresholds={
                    sensor.sensorId === "temp"
                      ? { warning: 35, critical: 38 }
                      : sensor.sensorId === "humd"
                        ? { warning: 80, critical: 90 }
                        : undefined
                  }
                />
              ))}
            </div>
          )}

          {viewMode === "charts" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSensorData.map((sensor) => (
                <SensorHistoryChart
                  key={sensor.id}
                  sensorId={sensor.id}
                  sensorName={sensor.name}
                  variableId={sensor.variableId}
                  unit={sensor.unit}
                  color={SENSOR_METADATA[sensor.sensorId]?.color || "#3b82f6"}
                  type={sensor.type}
                />
              ))}
            </div>
          )}

          {viewMode === "table" && <SensorDataTable sensorData={filteredSensorData} />}

          <div className="mt-8">
            <SensorInsights sensorData={sensorData} />
          </div>
        </>
      )}
    </div>
  )
}
