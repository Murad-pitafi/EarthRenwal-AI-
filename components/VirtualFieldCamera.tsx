"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Download, Maximize, Minimize, Sun, Cloud, CloudRain, Sunset } from "lucide-react"
import { useUser } from "@/contexts/UserContext"

interface VirtualFieldCameraProps {
  title?: string
  fullWidth?: boolean
}

export function VirtualFieldCamera({ title = "Virtual Field Camera", fullWidth = false }: VirtualFieldCameraProps) {
  const { language } = useUser()
  const isUrdu = language === "ur"
  const [expanded, setExpanded] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date())
  const [weatherCondition, setWeatherCondition] = useState<"sunny" | "cloudy" | "rainy" | "sunset">("sunny")
  const [timeOfDay, setTimeOfDay] = useState<number>(12) // 0-23 hours
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const translations = {
    en: {
      title: title,
      snapshot: "Take Snapshot",
      lastUpdated: "Last updated",
      expand: "Expand",
      minimize: "Minimize",
      sunny: "Sunny",
      cloudy: "Cloudy",
      rainy: "Rainy",
      sunset: "Sunset",
      timeOfDay: "Time of Day",
      weather: "Weather",
    },
    ur: {
      title: isUrdu ? "ورچوئل فیلڈ کیمرہ" : title,
      snapshot: "تصویر لیں",
      lastUpdated: "آخری اپڈیٹ",
      expand: "بڑا کریں",
      minimize: "چھوٹا کریں",
      sunny: "دھوپ",
      cloudy: "ابر آلود",
      rainy: "بارش",
      sunset: "غروب آفتاب",
      timeOfDay: "دن کا وقت",
      weather: "موسم",
    },
  }

  const t = translations[language]

  // Draw the virtual field
  const drawVirtualField = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw sky
    let skyColor
    if (weatherCondition === "sunny") {
      if (timeOfDay < 6 || timeOfDay > 18) {
        skyColor = "#0c1445" // Night
      } else if (timeOfDay < 8) {
        skyColor = "#7ab6f5" // Morning
      } else if (timeOfDay > 16) {
        skyColor = "#f5a742" // Evening
      } else {
        skyColor = "#87ceeb" // Day
      }
    } else if (weatherCondition === "cloudy") {
      skyColor = "#b4b4b4"
    } else if (weatherCondition === "rainy") {
      skyColor = "#6b7280"
    } else if (weatherCondition === "sunset") {
      skyColor = "#ff7e5f"
    }

    ctx.fillStyle = skyColor
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2)

    // Draw ground/field
    ctx.fillStyle = "#4d7c0f" // Green field
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2)

    // Draw mountains in background
    ctx.fillStyle = "#6b7280"
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width / 4, canvas.height / 3)
    ctx.lineTo(canvas.width / 2, canvas.height / 2)
    ctx.lineTo((3 * canvas.width) / 4, canvas.height / 3)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.fill()

    // Draw sun or moon
    if (timeOfDay >= 6 && timeOfDay <= 18) {
      // Sun
      const sunX = (timeOfDay - 6) * (canvas.width / 12)
      const sunY = canvas.height / 4
      const sunRadius = 30

      // Sun glow
      const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2)
      gradient.addColorStop(0, "rgba(255, 255, 0, 0.8)")
      gradient.addColorStop(1, "rgba(255, 255, 0, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2)
      ctx.fill()

      // Sun
      ctx.fillStyle = "#ffff00"
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Moon
      const moonX = (timeOfDay > 18 ? timeOfDay - 18 : timeOfDay + 6) * (canvas.width / 12)
      const moonY = canvas.height / 4
      const moonRadius = 20

      // Moon glow
      const gradient = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonRadius * 2)
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonRadius * 2, 0, Math.PI * 2)
      ctx.fill()

      // Moon
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw clouds if cloudy or rainy
    if (weatherCondition === "cloudy" || weatherCondition === "rainy") {
      ctx.fillStyle = "#ffffff"

      // Cloud 1
      drawCloud(ctx, canvas.width / 4, canvas.height / 4, 30)

      // Cloud 2
      drawCloud(ctx, canvas.width / 2, canvas.height / 6, 40)

      // Cloud 3
      drawCloud(ctx, (3 * canvas.width) / 4, canvas.height / 3, 35)
    }

    // Draw rain if rainy
    if (weatherCondition === "rainy") {
      ctx.strokeStyle = "#a3c2f5"
      ctx.lineWidth = 1

      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * (canvas.height / 2)

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - 10, y + 20)
        ctx.stroke()
      }
    }

    // Draw crops in the field
    const cropRows = 5
    const cropCols = 15
    const cropWidth = canvas.width / cropCols
    const cropHeight = 20
    const fieldTop = canvas.height / 2

    for (let row = 0; row < cropRows; row++) {
      for (let col = 0; col < cropCols; col++) {
        const x = col * cropWidth + cropWidth / 2
        const y = fieldTop + row * cropHeight + 20

        // Plant stem
        ctx.strokeStyle = "#3f6212"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x, y - 15)
        ctx.stroke()

        // Plant leaves
        ctx.fillStyle = "#65a30d"
        ctx.beginPath()
        ctx.ellipse(x - 5, y - 10, 5, 3, Math.PI / 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.ellipse(x + 5, y - 10, 5, 3, -Math.PI / 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Add timestamp
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Arial"
    ctx.fillText(new Date().toLocaleString(), 10, canvas.height - 10)

    setLastUpdated(new Date())
  }

  // Helper function to draw a cloud
  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.arc(x + size, y, size * 0.8, 0, Math.PI * 2)
    ctx.arc(x - size, y, size * 0.7, 0, Math.PI * 2)
    ctx.arc(x + size / 2, y - size / 2, size * 0.7, 0, Math.PI * 2)
    ctx.arc(x - size / 2, y - size / 2, size * 0.7, 0, Math.PI * 2)
    ctx.fill()
  }

  // Function to take a snapshot (download the canvas as an image)
  const takeSnapshot = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL("image/png")

    // Create a link element
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `virtual-field-${new Date().toISOString().replace(/:/g, "-")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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

  // Draw the virtual field when component mounts or when parameters change
  useEffect(() => {
    drawVirtualField()

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      drawVirtualField()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [weatherCondition, timeOfDay])

  return (
    <Card className={expanded ? "fixed inset-4 z-50 overflow-auto" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-xl ${isUrdu ? "font-urdu" : ""}`}>
          <Camera className="h-5 w-5 inline mr-2" />
          {t.title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={takeSnapshot}>
            <Download className="h-4 w-4 mr-2" />
            {t.snapshot}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <>
                <Minimize className="h-4 w-4 mr-2" />
                {t.minimize}
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4 mr-2" />
                {t.expand}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="w-full rounded-md"
            style={{ maxHeight: expanded ? "calc(100vh - 200px)" : "480px" }}
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className={`text-sm font-medium mb-2 ${isUrdu ? "font-urdu" : ""}`}>{t.weather}</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={weatherCondition === "sunny" ? "default" : "outline"}
                  onClick={() => setWeatherCondition("sunny")}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  {t.sunny}
                </Button>
                <Button
                  size="sm"
                  variant={weatherCondition === "cloudy" ? "default" : "outline"}
                  onClick={() => setWeatherCondition("cloudy")}
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  {t.cloudy}
                </Button>
                <Button
                  size="sm"
                  variant={weatherCondition === "rainy" ? "default" : "outline"}
                  onClick={() => setWeatherCondition("rainy")}
                >
                  <CloudRain className="h-4 w-4 mr-2" />
                  {t.rainy}
                </Button>
                <Button
                  size="sm"
                  variant={weatherCondition === "sunset" ? "default" : "outline"}
                  onClick={() => setWeatherCondition("sunset")}
                >
                  <Sunset className="h-4 w-4 mr-2" />
                  {t.sunset}
                </Button>
              </div>
            </div>

            <div>
              <h3 className={`text-sm font-medium mb-2 ${isUrdu ? "font-urdu" : ""}`}>{t.timeOfDay}</h3>
              <input
                type="range"
                min="0"
                max="23"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(Number.parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center mt-1">{timeOfDay}:00</div>
            </div>
          </div>
        </div>

        <div className={`mt-2 text-xs text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
          {t.lastUpdated}: {formatLastUpdated()}
        </div>
      </CardContent>
    </Card>
  )
}
