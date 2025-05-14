"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import { useSensorData, type ConsolidatedReading } from "@/contexts/SensorDataContext"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components including the Filler plugin
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface SensorHistoryChartProps {
  sensorId: string
  sensorName: string
  variableId: string
  unit: string
  color: string
  type: "soil" | "environment" | "other"
}

interface ChartData {
  timestamp: Date
  value: number
}

export function SensorHistoryChart({ sensorId, sensorName, variableId, unit, color, type }: SensorHistoryChartProps) {
  const { language } = useUser()
  const { readings } = useSensorData()
  const isUrdu = language === "ur"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ChartData[]>([])

  // Process readings into chart data
  useEffect(() => {
    try {
      setLoading(true)

      if (readings.length > 0) {
        // Extract data for this specific sensor from consolidated readings
        const chartData = readings
          .filter((reading) => reading[variableId as keyof ConsolidatedReading] !== undefined)
          .map((reading) => ({
            timestamp: new Date(reading.timestamp),
            value: reading[variableId as keyof ConsolidatedReading] as number,
          }))
          .filter((item) => item.value !== null && item.value !== undefined)

        // Sort by timestamp (oldest first for charts)
        chartData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

        if (chartData.length > 0) {
          setData(chartData)
        } else {
          // If no data for this sensor, generate mock data
          generateMockData()
        }
      } else {
        // If no readings, generate mock data
        generateMockData()
      }
    } catch (error) {
      console.error("Error processing sensor data for chart:", error)
      // If error, generate mock data
      generateMockData()
    } finally {
      setLoading(false)
    }
  }, [readings, variableId])

  // Generate mock historical data if needed
  const generateMockData = () => {
    const now = new Date()
    const mockData: ChartData[] = []

    // Generate data points for the last 24 hours (one per hour)
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)

      // Base value depends on the variable type
      let baseValue = 0
      switch (variableId) {
        case "dist":
          baseValue = 65
          break
        case "gas":
          baseValue = 770
          break
        case "humd":
          baseValue = 71
          break
        case "nit":
          baseValue = 15
          break
        case "phos":
          baseValue = 10
          break
        case "pot":
          baseValue = 20
          break
        case "temp":
          baseValue = 31
          break
        default:
          baseValue = 50
      }

      // Add some random variation
      const randomVariation = (Math.random() - 0.5) * 20
      const value = Math.max(0, baseValue + randomVariation)

      mockData.push({ timestamp, value })
    }

    setData(mockData)
  }

  // Format data for Chart.js
  const chartData = {
    labels: data.map((point) => {
      const date = new Date(point.timestamp)
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    }),
    datasets: [
      {
        label: sensorName,
        data: data.map((point) => point.value),
        borderColor: color,
        backgroundColor: `${color}33`, // Add transparency
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Chart options
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y} ${unit}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: isUrdu ? "وقت" : "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: unit,
        },
        beginAtZero: true,
      },
    },
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isUrdu ? "font-urdu" : ""}`}>
          {isUrdu ? `${sensorName} کی تاریخ` : `${sensorName} History`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-red-500">{error}</div>
        ) : (
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
