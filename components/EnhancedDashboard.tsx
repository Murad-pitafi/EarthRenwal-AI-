"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/contexts/UserContext"
import { useSensorData } from "@/contexts/SensorDataContext"
import { SensorDataCard } from "./SensorDataCard"
import { SensorGauge } from "./SensorGauge"
import { SensorHistoryChart } from "./SensorHistoryChart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, RefreshCw, Download, Clock, Loader2, Gauge } from "lucide-react"
import { SENSOR_METADATA } from "./RealTimeMonitoring"
import { toast } from "@/components/ui/use-toast"

// Interface for Arduino API response
interface ArduinoSensorReading {
  id: string
  variableId: string
  name: string
  value: number
  unit: string
  timestamp: string
  type: string
  icon: string
  description: string
  min: number
  max: number
}

// Interface for soil prediction response
interface SoilPredictionResponse {
  prediction: string
  assessment?: string
  recommendations: string[]
  suitableCrops?: string[]
}

export function EnhancedDashboard() {
  const { language } = useUser()
  const isUrdu = language === "ur"
  const { readings, isCollecting, lastUpdated, startCollection, stopCollection } = useSensorData()
  const [sensorData, setSensorData] = useState<ArduinoSensorReading[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day")
  const [soilPrediction, setSoilPrediction] = useState<SoilPredictionResponse | null>(null)
  const [predictingHealth, setPredictingHealth] = useState(false)

  // Use a ref to track the latest analysis result
  const latestAnalysisResult = useRef<SoilPredictionResponse | null>(null)

  // Get sensor value safely
  const getSensorValue = useCallback((sensors: ArduinoSensorReading[], sensorId: string, defaultValue = 0) => {
    // Try to find the sensor with the exact ID
    const sensor = sensors.find((s) => s.variableId === sensorId)
    if (sensor) return sensor.value

    // Try alternative IDs
    if (sensorId === "humd") {
      const humiditySensor = sensors.find((s) => s.variableId === "humidity")
      if (humiditySensor) return humiditySensor.value
    }
    if (sensorId === "temp") {
      const temperatureSensor = sensors.find((s) => s.variableId === "temperature")
      if (temperatureSensor) return temperatureSensor.value
    }

    return defaultValue
  }, [])

  // State to hold the sensor values for Groq analysis
  const [groqSensorValues, setGroqSensorValues] = useState<{
    nitrogen: number
    phosphorus: number
    potassium: number
    temperature: number
    humidity: number
    gas_level: number
  }>({
    nitrogen: 45,
    phosphorus: 15,
    potassium: 150,
    temperature: 28,
    humidity: 65,
    gas_level: 500,
  })

  const useGroqAnalysis = useCallback(
    async (
      nitrogen: number,
      phosphorus: number,
      potassium: number,
      temperature: number,
      humidity: number,
      gas_level: number,
    ) => {
      try {
        // Call the Groq API
        const response = await fetch("/api/groq-soil-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nitrogen,
            phosphorus,
            potassium,
            temperature,
            humidity,
            gas_level,
          }),
        })

        if (!response.ok) {
          throw new Error(`Groq analysis error: ${response.status}`)
        }

        const result = await response.json()
        console.log("Groq soil analysis result:", result)

        // Store the result in the ref for immediate access
        latestAnalysisResult.current = result

        // Update the state
        setSoilPrediction(result)

        return result
      } catch (error) {
        console.error("Error in Groq analysis:", error)
        throw error
      }
    },
    [],
  )

  // Predict soil health using Groq
  const predictSoilHealth = useCallback(
    async (sensors: ArduinoSensorReading[]) => {
      try {
        setPredictingHealth(true)

        // Use Groq analysis
        try {
          // Extract all required values for the model
          const nitrogen = getSensorValue(sensors, "nit", 45)
          const phosphorus = getSensorValue(sensors, "phos", 15)
          const potassium = getSensorValue(sensors, "pot", 150)
          const temperature = getSensorValue(sensors, "temp", 28)
          const humidity = getSensorValue(sensors, "humd", 65)
          const gas_level = getSensorValue(sensors, "gas", 500)

          const result = await useGroqAnalysis(nitrogen, phosphorus, potassium, temperature, humidity, gas_level)
          console.log("Soil prediction set to:", result)
        } catch (error) {
          console.error("Error with Groq analysis:", error)

          // Set a fallback prediction
          const fallbackPrediction = {
            prediction: "Moderate",
            recommendations: [
              "Unable to run analysis. Using fallback prediction.",
              "Consider regular soil testing for more accurate results.",
              "Maintain balanced fertilization based on crop requirements.",
            ],
            suitableCrops: ["Rice", "Wheat", "Cotton"],
          }

          // Update both the ref and the state
          latestAnalysisResult.current = fallbackPrediction
          setSoilPrediction(fallbackPrediction)

          toast({
            title: isUrdu ? "تجزیہ میں خرابی" : "Analysis Error",
            description: isUrdu ? "مٹی کی صحت کا تجزیہ کرنے میں خرابی" : "Failed to analyze soil health",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error predicting soil health:", error)
        toast({
          title: isUrdu ? "تجزیہ میں خرابی" : "Prediction Error",
          description: isUrdu ? "مٹی کی صحت کا تجزیہ کرنے میں خرابی" : "Failed to analyze soil health",
          variant: "destructive",
        })

        // Set a fallback prediction to avoid showing an error state
        const fallbackPrediction = {
          prediction: "Moderate",
          recommendations: [
            "Unable to run analysis. Using fallback prediction.",
            "Consider regular soil testing for more accurate results.",
            "Maintain balanced fertilization based on crop requirements.",
          ],
          suitableCrops: ["Rice", "Wheat", "Cotton"],
        }

        // Update both the ref and the state
        latestAnalysisResult.current = fallbackPrediction
        setSoilPrediction(fallbackPrediction)
      } finally {
        setPredictingHealth(false)
      }
    },
    [useGroqAnalysis, getSensorValue],
  )

  // Fetch real-time data from Arduino API
  const fetchArduinoData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/arduino-cloud")

      if (!response.ok) {
        throw new Error(`Arduino API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data) {
        console.log("Arduino data received:", data.data)
        setSensorData(data.data)

        // If we have all required sensor data, predict soil health
        if (hasAllRequiredSensors(data.data) && !predictingHealth) {
          predictSoilHealth(data.data)
        }
      } else {
        console.warn("Arduino API returned no data or error:", data)
        // Use existing readings as fallback
        processSensorReadings()
      }
    } catch (error) {
      console.error("Error fetching Arduino data:", error)
      toast({
        title: isUrdu ? "خرابی" : "Error",
        description: isUrdu
          ? "آردوینو ڈیٹا حاصل کرنے میں خرابی۔ بیک اپ ڈیٹا استعمال کر رہے ہیں۔"
          : "Failed to fetch Arduino data. Using backup data.",
        variant: "destructive",
      })
      // Use existing readings as fallback
      processSensorReadings()
    } finally {
      setLoading(false)
    }
  }

  // Check if we have all required sensors for prediction
  const hasAllRequiredSensors = (sensors: ArduinoSensorReading[]) => {
    const requiredSensors = ["gas", "humd", "nit", "phos", "pot", "temp"]
    return requiredSensors.every((sensorId) =>
      sensors.some(
        (sensor) =>
          sensor.variableId === sensorId ||
          // Handle alternative IDs
          (sensorId === "humd" && sensor.variableId === "humidity") ||
          (sensorId === "temp" && sensor.variableId === "temperature"),
      ),
    )
  }

  // Process readings from context into sensor data (fallback)
  const processSensorReadings = () => {
    if (readings.length === 0) return

    // Group the most recent readings by sensor type
    const latestReadings = new Map()

    // Sort readings by timestamp (newest first)
    const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp)

    // Get the latest reading for each sensor type
    for (const reading of sortedReadings) {
      if (!latestReadings.has(reading.sensorId)) {
        latestReadings.set(reading.sensorId, reading)
      }
    }

    // Convert to array format
    const processedData = Array.from(latestReadings.values()).map((reading) => ({
      id: reading.id,
      variableId: reading.sensorId,
      name: SENSOR_METADATA[reading.sensorId]?.name || reading.sensorId,
      value: reading.value,
      unit: SENSOR_METADATA[reading.sensorId]?.unit || "",
      timestamp: new Date(reading.timestamp).toISOString(),
      type: SENSOR_METADATA[reading.sensorId]?.soilType ? "soil" : "environment",
      icon: SENSOR_METADATA[reading.sensorId]?.icon?.name?.toLowerCase() || "activity",
      description: SENSOR_METADATA[reading.sensorId]?.description || "",
      min: SENSOR_METADATA[reading.sensorId]?.mockRange?.[0] || 0,
      max: SENSOR_METADATA[reading.sensorId]?.mockRange?.[1] || 100,
    }))

    setSensorData(processedData)

    // If we have all required sensor data, predict soil health
    if (hasAllRequiredSensors(processedData) && !predictingHealth) {
      predictSoilHealth(processedData)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchArduinoData()

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchArduinoData()
    }, 30000) // Fetch every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Get environment status
  const getEnvironmentStatus = () => {
    const envSensors = sensorData.filter((s) => s.type === "environment")
    if (envSensors.length === 0) return "unknown"

    const tempReading = envSensors.find((s) => s.variableId === "temp")?.value || 0
    const humdReading = envSensors.find((s) => s.variableId === "humd")?.value || 0

    // Check for extreme conditions
    if (tempReading > 38 || tempReading < 5 || humdReading > 90 || humdReading < 20) {
      return "alert"
    }

    // Check for warning conditions
    if (tempReading > 35 || tempReading < 10 || humdReading > 80 || humdReading < 30) {
      return "warning"
    }

    return "normal"
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string | Date | null) => {
    if (!timestamp) return isUrdu ? "دستیاب نہیں" : "Not available"

    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp

    return new Intl.DateTimeFormat(isUrdu ? "ur-PK" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Excessive":
        return <Badge className="bg-purple-500">{isUrdu ? "زیادہ" : "Excessive"}</Badge>
      case "Good":
      case "good":
        return <Badge className="bg-green-500">{isUrdu ? "اچھا" : "Good"}</Badge>
      case "Moderate":
      case "moderate":
      case "fair":
        return <Badge className="bg-yellow-500">{isUrdu ? "معتدل" : "Moderate"}</Badge>
      case "Poor":
      case "poor":
        return <Badge className="bg-red-500">{isUrdu ? "خراب" : "Poor"}</Badge>
      case "alert":
        return <Badge className="bg-red-500">{isUrdu ? "انتباہ" : "Alert"}</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">{isUrdu ? "تنبیہ" : "Warning"}</Badge>
      case "normal":
        return <Badge className="bg-green-500">{isUrdu ? "عام" : "Normal"}</Badge>
      default:
        return <Badge className="bg-gray-500">{isUrdu ? "نامعلوم" : "Unknown"}</Badge>
    }
  }

  // Get the current soil prediction, using the ref as a backup
  const getCurrentSoilPrediction = () => {
    return soilPrediction || latestAnalysisResult.current
  }

  // Get the current soil prediction for display
  const displaySoilPrediction = getCurrentSoilPrediction()

  // Update the sensor values for Groq analysis
  useEffect(() => {
    if (sensorData.length > 0) {
      setGroqSensorValues({
        nitrogen: getSensorValue(sensorData, "nit", 45),
        phosphorus: getSensorValue(sensorData, "phos", 15),
        potassium: getSensorValue(sensorData, "pot", 150),
        temperature: getSensorValue(sensorData, "temp", 28),
        humidity: getSensorValue(sensorData, "humd", 65),
        gas_level: getSensorValue(sensorData, "gas", 500),
      })
    }
  }, [sensorData, getSensorValue])

  // Call useGroqAnalysis unconditionally
  // const groqAnalysisResult = useGroqAnalysis(groqSensorValues.nitrogen, groqSensorValues.phosphorus, groqSensorValues.potassium, groqSensorValues.temperature, groqSensorValues.humidity, groqSensorValues.gas_level);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isUrdu ? "font-urdu" : ""}`}>
            {isUrdu ? "فارم مانیٹرنگ ڈیش بورڈ" : "Farm Monitoring Dashboard"}
          </h1>
          <p className={`text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
            {isUrdu ? "آپ کے کھیت کی صحت کا جائزہ" : "Overview of your field's health and conditions"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchArduinoData}
            className="flex items-center gap-1"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span>{isUrdu ? "ریفریش" : "Refresh"}</span>
          </Button>

          <Button
            variant={isCollecting ? "outline" : "default"}
            size="sm"
            onClick={isCollecting ? stopCollection : startCollection}
            className="flex items-center gap-1"
          >
            {isCollecting ? (
              <span>{isUrdu ? "ڈیٹا کلیکشن روکیں" : "Pause Collection"}</span>
            ) : (
              <span>{isUrdu ? "ڈیٹا کلیکشن شروع کریں" : "Start Collection"}</span>
            )}
          </Button>

          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{isUrdu ? "ڈیٹا ڈاؤنلوڈ کریں" : "Export Data"}</span>
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${isUrdu ? "font-urdu" : ""}`}>
              {isUrdu ? "ڈیٹا کلیکشن کی حیثیت" : "Data Collection Status"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCollecting ? (
                  <>
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className={isUrdu ? "font-urdu" : ""}>{isUrdu ? "فعال" : "Active"}</span>
                  </>
                ) : (
                  <>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className={isUrdu ? "font-urdu" : ""}>{isUrdu ? "معطل" : "Paused"}</span>
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className={isUrdu ? "font-urdu" : ""}>
                  {lastUpdated ? formatTimestamp(lastUpdated) : isUrdu ? "دستیاب نہیں" : "Not available"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${isUrdu ? "font-urdu" : ""}`}>
              {isUrdu ? "مٹی کی صحت" : "Soil Health"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {predictingHealth ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isUrdu ? "تجزیہ جاری ہے..." : "Analyzing..."}</span>
                  </div>
                ) : (
                  getStatusBadge(displaySoilPrediction?.prediction || "unknown")
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className={isUrdu ? "font-urdu" : ""}>
                  {isUrdu ? "مٹی کے ٹیسٹ کی بنیاد پر" : "Based on Soil Test"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${isUrdu ? "font-urdu" : ""}`}>
              {isUrdu ? "ماحولیاتی حالات" : "Environmental Conditions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">{getStatusBadge(getEnvironmentStatus())}</div>
              <div className="text-sm text-muted-foreground">
                <span className={isUrdu ? "font-urdu" : ""}>
                  {isUrdu ? "درجہ حرارت + نمی" : "Temperature + Humidity"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview" className={isUrdu ? "font-urdu" : ""}>
            {isUrdu ? "جائزہ" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="soil" className={isUrdu ? "font-urdu" : ""}>
            {isUrdu ? "مٹی کے سینسر" : "Soil Sensors"}
          </TabsTrigger>
          <TabsTrigger value="environment" className={isUrdu ? "font-urdu" : ""}>
            {isUrdu ? "ماحولیاتی سینسر" : "Environment"}
          </TabsTrigger>
          <TabsTrigger value="charts" className={isUrdu ? "font-urdu" : ""}>
            {isUrdu ? "چارٹس" : "Charts"}
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sensorData.map((sensor) => (
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
            </TabsContent>

            <TabsContent value="soil" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensorData
                  .filter(
                    (sensor) =>
                      sensor.type === "soil" ||
                      sensor.variableId === "nit" ||
                      sensor.variableId === "phos" ||
                      sensor.variableId === "pot" ||
                      sensor.variableId === "gas",
                  )
                  .map((sensor) => (
                    <SensorGauge
                      key={sensor.id}
                      value={sensor.value}
                      min={sensor.min || 0}
                      max={sensor.max || 100}
                      name={sensor.name}
                      unit={sensor.unit}
                      color={SENSOR_METADATA[sensor.variableId]?.color || "#3b82f6"}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="environment" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensorData
                  .filter(
                    (sensor) =>
                      sensor.type === "environment" || sensor.variableId === "temp" || sensor.variableId === "humd",
                  )
                  .map((sensor) => (
                    <SensorGauge
                      key={sensor.id}
                      value={sensor.value}
                      min={sensor.min || 0}
                      max={sensor.max || 100}
                      name={sensor.name}
                      unit={sensor.unit}
                      color={SENSOR_METADATA[sensor.variableId]?.color || "#3b82f6"}
                      thresholds={
                        sensor.variableId === "temp"
                          ? { warning: 35, critical: 38 }
                          : sensor.variableId === "humd"
                            ? { warning: 80, critical: 90 }
                            : undefined
                      }
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="charts" className="mt-0">
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2 border rounded-md p-1">
                  <Button
                    variant={timeRange === "day" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange("day")}
                    className={isUrdu ? "font-urdu" : ""}
                  >
                    {isUrdu ? "24 گھنٹے" : "24h"}
                  </Button>
                  <Button
                    variant={timeRange === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange("week")}
                    className={isUrdu ? "font-urdu" : ""}
                  >
                    {isUrdu ? "ہفتہ" : "Week"}
                  </Button>
                  <Button
                    variant={timeRange === "month" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange("month")}
                    className={isUrdu ? "font-urdu" : ""}
                  >
                    {isUrdu ? "مہینہ" : "Month"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sensorData.map((sensor) => (
                  <SensorHistoryChart
                    key={sensor.id}
                    sensorId={sensor.id}
                    sensorName={sensor.name}
                    variableId={sensor.variableId}
                    unit={sensor.unit}
                    color={SENSOR_METADATA[sensor.variableId]?.color || "#3b82f6"}
                    type={sensor.type}
                  />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Alerts Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className={isUrdu ? "font-urdu" : ""}>
            {isUrdu ? "انتباہات اور تجاویز" : "Alerts & Recommendations"}
          </CardTitle>
          <CardDescription className={isUrdu ? "font-urdu" : ""}>
            {isUrdu ? "آپ کے کھیت کی حالت کی بنیاد پر" : "Based on your field conditions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Excessive Nutrient Warning */}
            {displaySoilPrediction?.prediction === "Excessive" && (
              <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-md">
                <AlertTriangle className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu ? "زیادہ غذائی اجزاء کا انتباہ" : "Excessive Nutrient Warning"}
                  </h4>
                  <p className={`mt-1 text-sm text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu
                      ? "آپ کی مٹی میں غذائی اجزاء کی سطح بہت زیادہ ہے۔ یہ پودوں کی نشوونما کو متاثر کر سکتا ہے اور ماحولیاتی آلودگی کا سبب بن سکتا ہے۔"
                      : "Your soil has excessive nutrient levels. This can harm plant growth and cause environmental pollution."}
                  </p>
                </div>
              </div>
            )}

            {/* Soil Assessment */}
            {displaySoilPrediction?.assessment && (
              <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-md">
                <Gauge className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu ? "مٹی کا تجزیہ" : "Soil Assessment"}
                  </h4>
                  <p className={`mt-1 text-sm text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
                    {displaySoilPrediction.assessment}
                  </p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {displaySoilPrediction?.recommendations && displaySoilPrediction.recommendations.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu ? "مٹی کے ٹیسٹ کی تجاویز" : "Soil Test Recommendations"}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {displaySoilPrediction.recommendations.map((rec, index) => (
                      <li key={index} className={`text-sm text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Suitable Crops */}
            {displaySoilPrediction?.suitableCrops && displaySoilPrediction.suitableCrops.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu ? "موزوں فصلیں" : "Suitable Crops"}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {displaySoilPrediction.suitableCrops.map((crop, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {getEnvironmentStatus() === "alert" && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-md">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu ? "انتہائی درجہ حرارت کا انتباہ" : "Extreme Temperature Alert"}
                  </h4>
                  <p className={`text-sm text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu
                      ? "درجہ حرارت انتہائی حد تک پہنچ گیا ہے۔ فصلوں کو پانی دیں اور چھاؤں فراہم کریں۔"
                      : "Temperature has reached extreme levels. Water crops and provide shade if possible."}
                  </p>
                </div>
              </div>
            )}

            {getEnvironmentStatus() === "warning" && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-md">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu ? "درجہ حرارت کی تنبیہ" : "Temperature Warning"}
                  </h4>
                  <p className={`text-sm text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu
                      ? "درجہ حرارت زیادہ ہے۔ فصلوں کو باقاعدگی سے پانی دیں۔"
                      : "Temperature is elevated. Ensure regular watering of crops."}
                  </p>
                </div>
              </div>
            )}

            {displaySoilPrediction?.prediction === "Good" && getEnvironmentStatus() === "normal" && (
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu ? "مثالی حالات" : "Optimal Conditions"}
                  </h4>
                  <p className={`text-sm text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
                    {isUrdu
                      ? "آپ کے کھیت کی حالت مثالی ہے۔ معمول کے مطابق دیکھ بھال جاری رکھیں۔"
                      : "Your field conditions are optimal. Continue regular maintenance."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
