"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Save, Database, RefreshCw, Trash2 } from "lucide-react"
import { useUser } from "@/contexts/UserContext"

interface DataStorageManagerProps {
  onToggleRealData: (enabled: boolean) => void
  isRealDataEnabled: boolean
}

export function DataStorageManager({ onToggleRealData, isRealDataEnabled }: DataStorageManagerProps) {
  const { language } = useUser()
  const isUrdu = language === "ur"

  const [storageType, setStorageType] = useState<"local" | "file" | "database">("local")
  const [autoExport, setAutoExport] = useState(false)
  const [exportInterval, setExportInterval] = useState(60) // minutes
  const [dataStats, setDataStats] = useState({
    totalReadings: 0,
    oldestReading: "",
    newestReading: "",
    sizeKB: 0,
  })
  const [isExporting, setIsExporting] = useState(false)

  // Translations
  const t = {
    en: {
      title: "Data Storage Manager",
      description: "Configure how sensor data is collected and stored",
      realDataCollection: "Real Data Collection",
      enabled: "Enabled",
      disabled: "Disabled",
      enableDescription:
        "When enabled, the system will attempt to connect to real sensors. When disabled, mock data will be used.",
      storageType: "Storage Type",
      localStorage: "Browser Storage",
      fileStorage: "File Storage",
      databaseStorage: "Database",
      autoExport: "Auto Export",
      exportEvery: "Export every",
      minutes: "minutes",
      dataStats: "Data Statistics",
      totalReadings: "Total Readings",
      timeRange: "Time Range",
      estimatedSize: "Estimated Size",
      actions: "Actions",
      exportNow: "Export Now",
      clearData: "Clear Data",
      to: "to",
      kb: "KB",
    },
    ur: {
      title: "ڈیٹا اسٹوریج مینیجر",
      description: "سینسر ڈیٹا کو جمع کرنے اور ذخیرہ کرنے کی ترتیب دیں",
      realDataCollection: "حقیقی ڈیٹا جمع کرنا",
      enabled: "فعال",
      disabled: "غیر فعال",
      enableDescription:
        "جب فعال ہو، سسٹم حقیقی سینسرز سے جڑنے کی کوشش کرے گا۔ جب غیر فعال ہو، نقلی ڈیٹا استعمال کیا جائے گا۔",
      storageType: "اسٹوریج کی قسم",
      localStorage: "براؤزر اسٹوریج",
      fileStorage: "فائل اسٹوریج",
      databaseStorage: "ڈیٹا بیس",
      autoExport: "خود کار برآمد",
      exportEvery: "ہر",
      minutes: "منٹ میں برآمد کریں",
      dataStats: "ڈیٹا کے اعدادوشمار",
      totalReadings: "کل ریڈنگز",
      timeRange: "وقت کی حد",
      estimatedSize: "تخمینہ سائز",
      actions: "اقدامات",
      exportNow: "ابھی برآمد کریں",
      clearData: "ڈیٹا صاف کریں",
      to: "تا",
      kb: "کلو بائٹس",
    },
  }[language]

  // Load data stats on component mount
  useEffect(() => {
    loadDataStats()
  }, [])

  // Load data statistics from storage
  const loadDataStats = () => {
    try {
      const storedData = localStorage.getItem("sensorReadings")
      if (storedData) {
        const readings = JSON.parse(storedData)

        // Sort by timestamp
        readings.sort((a: any, b: any) => {
          const aTime = new Date(a.timestamp).getTime()
          const bTime = new Date(b.timestamp).getTime()
          return aTime - bTime
        })

        setDataStats({
          totalReadings: readings.length,
          oldestReading: readings.length > 0 ? readings[0].timestamp : "",
          newestReading: readings.length > 0 ? readings[readings.length - 1].timestamp : "",
          sizeKB: Math.round((storedData.length / 1024) * 100) / 100,
        })
      } else {
        setDataStats({
          totalReadings: 0,
          oldestReading: "",
          newestReading: "",
          sizeKB: 0,
        })
      }
    } catch (error) {
      console.error("Error loading data stats:", error)
    }
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return ""

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

  // Export data to file
  const exportData = async () => {
    try {
      setIsExporting(true)

      const storedData = localStorage.getItem("sensorReadings")
      if (!storedData) {
        alert("No data to export")
        setIsExporting(false)
        return
      }

      // Create a JSON file
      const blob = new Blob([storedData], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      // Create a download link
      const link = document.createElement("a")
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      link.download = `sensor-data-${timestamp}.json`
      link.href = url
      link.click()

      // Clean up
      URL.revokeObjectURL(url)
      setIsExporting(false)
    } catch (error) {
      console.error("Error exporting data:", error)
      setIsExporting(false)
    }
  }

  // Clear all stored data
  const clearData = () => {
    if (confirm("Are you sure you want to clear all stored sensor data? This action cannot be undone.")) {
      localStorage.removeItem("sensorReadings")
      loadDataStats()

      // Notify other components
      window.dispatchEvent(new CustomEvent("sensorDataUpdated"))
    }
  }

  // Set up auto-export timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (autoExport && exportInterval > 0) {
      intervalId = setInterval(
        () => {
          exportData()
        },
        exportInterval * 60 * 1000,
      ) // Convert minutes to milliseconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [autoExport, exportInterval])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={isUrdu ? "font-urdu" : ""}>{t.title}</CardTitle>
        <CardDescription className={isUrdu ? "font-urdu" : ""}>{t.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Real Data Collection Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="real-data-toggle" className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
              {t.realDataCollection}
            </Label>
            <div className="flex items-center gap-2">
              <Switch id="real-data-toggle" checked={isRealDataEnabled} onCheckedChange={onToggleRealData} />
              <span className={`text-sm ${isUrdu ? "font-urdu" : ""}`}>
                {isRealDataEnabled ? t.enabled : t.disabled}
              </span>
            </div>
          </div>
          <p className={`text-sm text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>{t.enableDescription}</p>
        </div>

        {/* Storage Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="storage-type" className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
            {t.storageType}
          </Label>
          <Select value={storageType} onValueChange={(value) => setStorageType(value as any)}>
            <SelectTrigger id="storage-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>{t.localStorage}</span>
                </div>
              </SelectItem>
              <SelectItem value="file">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>{t.fileStorage}</span>
                </div>
              </SelectItem>
              <SelectItem value="database">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>{t.databaseStorage}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto Export Settings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-export" className={`font-medium ${isUrdu ? "font-urdu" : ""}`}>
              {t.autoExport}
            </Label>
            <Switch id="auto-export" checked={autoExport} onCheckedChange={setAutoExport} />
          </div>

          {autoExport && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm ${isUrdu ? "font-urdu" : ""}`}>{t.exportEvery}</span>
              <Select
                value={exportInterval.toString()}
                onValueChange={(value) => setExportInterval(Number.parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="60">60</SelectItem>
                  <SelectItem value="120">120</SelectItem>
                  <SelectItem value="360">360</SelectItem>
                  <SelectItem value="720">720</SelectItem>
                  <SelectItem value="1440">1440</SelectItem>
                </SelectContent>
              </Select>
              <span className={`text-sm ${isUrdu ? "font-urdu" : ""}`}>{t.minutes}</span>
            </div>
          )}
        </div>

        {/* Data Statistics */}
        <div className="space-y-2">
          <h3 className={`text-sm font-medium ${isUrdu ? "font-urdu" : ""}`}>{t.dataStats}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-muted/50 p-3 rounded-md">
              <div className={`text-sm font-medium mb-1 ${isUrdu ? "font-urdu" : ""}`}>{t.totalReadings}</div>
              <div className="text-2xl font-bold">{dataStats.totalReadings}</div>
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <div className={`text-sm font-medium mb-1 ${isUrdu ? "font-urdu" : ""}`}>{t.timeRange}</div>
              {dataStats.totalReadings > 0 ? (
                <div className="text-sm">
                  {formatTimestamp(dataStats.oldestReading)} {t.to} {formatTimestamp(dataStats.newestReading)}
                </div>
              ) : (
                <div className="text-sm">-</div>
              )}
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <div className={`text-sm font-medium mb-1 ${isUrdu ? "font-urdu" : ""}`}>{t.estimatedSize}</div>
              <div className="text-lg font-bold">
                {dataStats.sizeKB} {t.kb}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={loadDataStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {isUrdu ? "ریفریش" : "Refresh"}
        </Button>

        <div className="flex gap-2">
          <Button variant="destructive" onClick={clearData} disabled={dataStats.totalReadings === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t.clearData}
          </Button>

          <Button onClick={exportData} disabled={isExporting || dataStats.totalReadings === 0}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? (isUrdu ? "برآمد ہو رہا ہے..." : "Exporting...") : t.exportNow}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
