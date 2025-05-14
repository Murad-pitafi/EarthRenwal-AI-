"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, RefreshCw } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { useSensorData, type ConsolidatedReading } from "@/contexts/SensorDataContext"
import { SENSOR_METADATA } from "@/components/RealTimeMonitoring"

interface SensorDataTableProps {
  title?: string
  maxEntries?: number
  sensorFilter?: string[]
  sensorData?: any[] // For backward compatibility
}

export function SensorDataTable({
  title = "Sensor Data History",
  maxEntries = 50,
  sensorFilter,
  sensorData, // For backward compatibility
}: SensorDataTableProps) {
  const { language } = useUser()
  const { readings, lastUpdated } = useSensorData()
  const isUrdu = language === "ur"
  const [filteredReadings, setFilteredReadings] = useState<ConsolidatedReading[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  })

  const translations = {
    en: {
      title: title,
      timestamp: "Timestamp",
      sensor: "Sensor",
      value: "Value",
      unit: "Unit",
      noData: "No sensor data available",
      loading: "Loading sensor data...",
      download: "Download CSV",
      refresh: "Refresh",
      filter: "Filter",
      allSensors: "All Sensors",
      startDate: "Start Date",
      endDate: "End Date",
      apply: "Apply",
      reset: "Reset",
    },
    ur: {
      title: isUrdu ? "سینسر ڈیٹا کی تاریخ" : title,
      timestamp: "ٹائم اسٹیمپ",
      sensor: "سینسر",
      value: "قیمت",
      unit: "یونٹ",
      noData: "کوئی سینسر ڈیٹا دستیاب نہیں ہے",
      loading: "سینسر ڈیٹا لوڈ ہو رہا ہے...",
      download: "CSV ڈاؤنلوڈ کریں",
      refresh: "ریفریش",
      filter: "فلٹر",
      allSensors: "تمام سینسرز",
      startDate: "شروع کی تاریخ",
      endDate: "آخری تاریخ",
      apply: "لاگو کریں",
      reset: "ری سیٹ",
    },
  }

  const t = translations[language]

  // Get sensor names and metadata
  const sensorNames = Object.entries(SENSOR_METADATA).map(([id, meta]) => ({
    id,
    name: isUrdu && meta.nameUrdu ? meta.nameUrdu : meta.name,
    unit: meta.unit,
  }))

  // Apply filters to readings
  useEffect(() => {
    try {
      setLoading(true)
      let filtered = [...readings]

      // Apply date range filter
      if (dateRange.start) {
        const startDate = new Date(dateRange.start)
        filtered = filtered.filter((reading) => new Date(reading.timestamp) >= startDate)
      }

      if (dateRange.end) {
        const endDate = new Date(dateRange.end)
        endDate.setHours(23, 59, 59, 999) // End of day
        filtered = filtered.filter((reading) => new Date(reading.timestamp) <= endDate)
      }

      // Apply sensor filter if provided
      if (sensorFilter && sensorFilter.length > 0) {
        // For consolidated readings, we keep all readings but will only display selected sensors
        // This is handled in the rendering logic
      }

      // Sort by timestamp (newest first)
      filtered.sort((a, b) => b.timestamp - a.timestamp)

      // Limit to maxEntries
      filtered = filtered.slice(0, maxEntries)

      setFilteredReadings(filtered)
    } catch (error) {
      console.error("Error applying filters:", error)
      setFilteredReadings([])
    } finally {
      setLoading(false)
    }
  }, [readings, dateRange, sensorFilter, lastUpdated])

  // Download readings as CSV
  const downloadCSV = () => {
    try {
      if (filteredReadings.length === 0) {
        alert("No data to export")
        return
      }

      // Create headers
      const headers = ["Timestamp", "Temperature", "Humidity", "Nitrogen", "Phosphorus", "Potassium", "Gas"]

      // Create rows
      const rows = filteredReadings.map((reading) => {
        const timestamp = formatTimestamp(new Date(reading.timestamp).toISOString())
        return [
          timestamp,
          reading.temp !== undefined ? `${reading.temp} °C` : "-",
          reading.humd !== undefined ? `${reading.humd} %` : "-",
          reading.nit !== undefined ? `${reading.nit} mg/kg` : "-",
          reading.phos !== undefined ? `${reading.phos} mg/kg` : "-",
          reading.pot !== undefined ? `${reading.pot} mg/kg` : "-",
          reading.gas !== undefined ? `${reading.gas} ppm` : "-",
        ]
      })

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `sensor-data-${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading CSV:", error)
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return new Intl.DateTimeFormat(isUrdu ? "ur-PK" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date)
    } catch (e) {
      return timestamp
    }
  }

  // Refresh data
  const refreshData = () => {
    // This will trigger a re-render with the latest data
    window.dispatchEvent(new Event("sensorDataUpdated"))
  }

  return (
    <Card>
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className={`text-md font-medium ${isUrdu ? "font-urdu" : ""}`}>{t.title}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start || ""}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value || null })}
              className="text-sm rounded border px-2 py-1"
              placeholder={t.startDate}
            />

            <input
              type="date"
              value={dateRange.end || ""}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value || null })}
              className="text-sm rounded border px-2 py-1"
              placeholder={t.endDate}
            />

            <Button variant="outline" size="sm" onClick={() => setDateRange({ start: null, end: null })}>
              {t.reset}
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {t.refresh}
          </Button>

          <Button variant="outline" size="sm" onClick={downloadCSV} disabled={filteredReadings.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            {t.download}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3">{t.loading}</span>
          </div>
        ) : filteredReadings.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.timestamp}</TableHead>
                  {sensorNames.map((sensor) => (
                    <TableHead key={sensor.id}>
                      {sensor.name} ({sensor.unit})
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReadings.map((reading, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatTimestamp(new Date(reading.timestamp).toISOString())}</TableCell>
                    {sensorNames.map((sensor) => (
                      <TableCell key={sensor.id}>
                        {reading[sensor.id as keyof ConsolidatedReading] !== undefined ? (
                          <span>{reading[sensor.id as keyof ConsolidatedReading]}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center">{t.noData}</div>
        )}
      </CardContent>
    </Card>
  )
}
