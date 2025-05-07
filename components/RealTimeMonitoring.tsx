"use client"

import { useState, useEffect } from "react"
import { SensorDataCard } from "./SensorDataCard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/contexts/UserContext"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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

export function RealTimeMonitoring() {
  const { language } = useUser()
  const isUrdu = language === "ur"

  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds
  const [hiddenSensors, setHiddenSensors] = useState<string[]>([])

  // Translations
  const translations = {
    en: {
      title: "Real-time Field Monitoring",
      subtitle: "Live sensor data from your Arduino devices",
      lastUpdated: "Last updated",
      autoRefresh: "Auto refresh",
      refreshEvery: "Refresh every",
      seconds: "seconds",
      refresh: "Refresh",
      allSensors: "All Sensors",
      soilSensors: "Soil Sensors",
      environmentalSensors: "Environmental",
      otherSensors: "Other Sensors",
      noData: "No sensor data available",
      loading: "Loading sensor data...",
      error: "Error",
      tryAgain: "Try again",
      hide: "Hide",
      show: "Show",
      manage: "Manage Sensors",
      addSensor: "Add Sensor",
    },
    ur: {
      title: "حقیقی وقت کی نگرانی",
      subtitle: "آپ کے آردوینو آلات سے براہ راست ڈیٹا",
      lastUpdated: "آخری اپڈیٹ",
      autoRefresh: "خود کار ریفریش",
      refreshEvery: "ہر",
      seconds: "سیکنڈ میں ریفریش کریں",
      refresh: "ریفریش",
      allSensors: "تمام سینسرز",
      soilSensors: "مٹی کے سینسرز",
      environmentalSensors: "ماحولیاتی سینسرز",
      otherSensors: "دیگر سینسرز",
      noData: "کوئی سینسر ڈیٹا دستیاب نہیں ہے",
      loading: "سینسر ڈیٹا لوڈ ہو رہا ہے...",
      error: "خرابی",
      tryAgain: "دوبارہ کوشش کریں",
      hide: "چھپائیں",
      show: "دکھائیں",
      manage: "سینسرز کا انتظام کریں",
      addSensor: "سینسر شامل کریں",
    },
  }

  const t = translations[language]

  // Function to fetch sensor data
  const fetchSensorData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/arduino-cloud")

      if (!response.ok) {
        throw new Error(`Failed to fetch sensor data: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setSensorData(data.data)
      } else {
        throw new Error(data.error || "Failed to fetch sensor data")
      }

      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching sensor data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchSensorData()
  }, [])

  // Auto-refresh setup
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchSensorData()
      }, refreshInterval * 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [autoRefresh, refreshInterval])

  // Toggle sensor visibility
  const toggleSensorVisibility = (sensorId: string) => {
    setHiddenSensors((prev) => {
      if (prev.includes(sensorId)) {
        return prev.filter((id) => id !== sensorId)
      } else {
        return [...prev, sensorId]
      }
    })
  }

  // Filter visible sensors
  const visibleSensors = sensorData.filter((sensor) => !hiddenSensors.includes(sensor.variableId))

  // Filter sensors by type
  const soilSensors = visibleSensors.filter((sensor) => sensor.type === "soil")
  const environmentSensors = visibleSensors.filter((sensor) => sensor.type === "environment")
  const otherSensors = visibleSensors.filter((sensor) => sensor.type === "other")

  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return isUrdu ? "کبھی نہیں" : "Never"

    return new Intl.DateTimeFormat(isUrdu ? "ur-PK" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(lastUpdated)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${isUrdu ? "font-urdu" : ""}`}>{t.title}</h2>
          <p className={`text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>{t.subtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <div className={`text-sm text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
            {t.lastUpdated}: {formatLastUpdated()}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="auto-refresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="auto-refresh" className={`text-sm ${isUrdu ? "font-urdu" : ""}`}>
                {t.autoRefresh}
              </label>
            </div>

            {autoRefresh && (
              <div className="flex items-center gap-1">
                <span className={`text-sm ${isUrdu ? "font-urdu" : ""}`}>{t.refreshEvery}</span>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="text-sm rounded border px-1"
                >
                  <option value="10">10</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="300">300</option>
                </select>
                <span className={`text-sm ${isUrdu ? "font-urdu" : ""}`}>{t.seconds}</span>
              </div>
            )}

            <Button onClick={fetchSensorData} disabled={loading} size="sm" variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {t.refresh}
            </Button>
          </div>
        </div>
      </div>

      {/* Sensor Management */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {sensorData.map((sensor) => (
              <Button
                key={sensor.variableId}
                variant={hiddenSensors.includes(sensor.variableId) ? "outline" : "default"}
                size="sm"
                onClick={() => toggleSensorVisibility(sensor.variableId)}
                className="flex items-center gap-1"
              >
                {hiddenSensors.includes(sensor.variableId) ? t.show : t.hide} {sensor.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className={`font-medium text-red-800 ${isUrdu ? "font-urdu" : ""}`}>{t.error}</h3>
            <p className={`text-sm text-red-700 ${isUrdu ? "font-urdu" : ""}`}>{error}</p>
            <Button onClick={fetchSensorData} variant="outline" size="sm" className="mt-2">
              {t.tryAgain}
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">{t.allSensors}</TabsTrigger>
          <TabsTrigger value="soil">{t.soilSensors}</TabsTrigger>
          <TabsTrigger value="environment">{t.environmentalSensors}</TabsTrigger>
          <TabsTrigger value="other">{t.otherSensors}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {loading && visibleSensors.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className={isUrdu ? "font-urdu" : ""}>{t.loading}</p>
            </div>
          ) : visibleSensors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleSensors.map((sensor) => (
                <SensorDataCard key={sensor.id} {...sensor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={isUrdu ? "font-urdu" : ""}>{t.noData}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="soil" className="mt-0">
          {soilSensors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {soilSensors.map((sensor) => (
                <SensorDataCard key={sensor.id} {...sensor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={isUrdu ? "font-urdu" : ""}>{loading ? t.loading : t.noData}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="environment" className="mt-0">
          {environmentSensors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {environmentSensors.map((sensor) => (
                <SensorDataCard key={sensor.id} {...sensor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={isUrdu ? "font-urdu" : ""}>{loading ? t.loading : t.noData}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="other" className="mt-0">
          {otherSensors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherSensors.map((sensor) => (
                <SensorDataCard key={sensor.id} {...sensor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={isUrdu ? "font-urdu" : ""}>{loading ? t.loading : t.noData}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
