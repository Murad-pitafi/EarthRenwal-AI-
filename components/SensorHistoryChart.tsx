"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
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

interface HistoryDataPoint {
  value: number
  timestamp: string
}

interface SensorHistoryChartProps {
  sensorId: string
  sensorName: string
  variableId: string
  unit: string
  color: string
  type: "soil" | "environment" | "other"
}

export function SensorHistoryChart({ sensorId, sensorName, variableId, unit, color, type }: SensorHistoryChartProps) {
  const { language } = useUser()
  const isUrdu = language === "ur"
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate mock historical data for now
  // In a real implementation, this would fetch from an API endpoint
  useEffect(() => {
    const generateMockData = () => {
      const now = new Date()
      const data: HistoryDataPoint[] = []

      // Generate data points for the last 24 hours (one per hour)
      for (let i = 24; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString()

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

        data.push({ value, timestamp })
      }

      return data
    }

    setLoading(true)
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      const data = generateMockData()
      setHistoryData(data)
      setError(null)
    } catch (err) {
      setError("Failed to load historical data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [variableId])

  // Format data for Chart.js
  const chartData = {
    labels: historyData.map((point) => {
      const date = new Date(point.timestamp)
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    }),
    datasets: [
      {
        label: sensorName,
        data: historyData.map((point) => point.value),
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
