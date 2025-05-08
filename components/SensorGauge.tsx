"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"

interface SensorGaugeProps {
  value: number | null
  min: number
  max: number
  name: string
  unit: string
  color: string
  thresholds?: {
    warning: number
    critical: number
  }
}

export function SensorGauge({ value, min, max, name, unit, color, thresholds }: SensorGaugeProps) {
  const { language } = useUser()
  const isUrdu = language === "ur"
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw the gauge
  useEffect(() => {
    if (!canvasRef.current || value === null) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height * 0.8 // Position gauge in lower part of canvas
    const radius = Math.min(width, height) * 0.4

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw gauge background
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
    ctx.lineWidth = 20
    ctx.strokeStyle = "#e5e7eb" // Light gray
    ctx.stroke()

    // Calculate value position
    const normalizedValue = Math.min(Math.max((value - min) / (max - min), 0), 1)
    const startAngle = Math.PI
    const endAngle = startAngle - normalizedValue * Math.PI

    // Determine color based on thresholds
    let gaugeColor = color
    if (thresholds) {
      const normalizedWarning = (thresholds.warning - min) / (max - min)
      const normalizedCritical = (thresholds.critical - min) / (max - min)

      if (normalizedValue >= normalizedCritical) {
        gaugeColor = "#ef4444" // Red
      } else if (normalizedValue >= normalizedWarning) {
        gaugeColor = "#f59e0b" // Amber
      }
    }

    // Draw value arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, true)
    ctx.lineWidth = 20
    ctx.strokeStyle = gaugeColor
    ctx.stroke()

    // Draw center point
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI, false)
    ctx.fillStyle = "#374151" // Dark gray
    ctx.fill()

    // Draw needle
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    const needleAngle = startAngle - normalizedValue * Math.PI
    const needleLength = radius * 0.9
    ctx.lineTo(centerX + needleLength * Math.cos(needleAngle), centerY + needleLength * Math.sin(needleAngle))
    ctx.lineWidth = 2
    ctx.strokeStyle = "#111827" // Very dark gray
    ctx.stroke()

    // Draw value text
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#111827"
    ctx.textAlign = "center"
    ctx.fillText(`${value}${unit}`, centerX, centerY - radius * 0.6)

    // Draw min and max labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#6b7280" // Medium gray
    ctx.textAlign = "left"
    ctx.fillText(`${min}${unit}`, centerX - radius * 0.9, centerY + 20)
    ctx.textAlign = "right"
    ctx.fillText(`${max}${unit}`, centerX + radius * 0.9, centerY + 20)
  }, [value, min, max, unit, color, thresholds])

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isUrdu ? "font-urdu" : ""}`}>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        {value === null ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            {isUrdu ? "کوئی ڈیٹا دستیاب نہیں" : "No data available"}
          </div>
        ) : (
          <canvas ref={canvasRef} width={200} height={150} className="max-w-full"></canvas>
        )}
      </CardContent>
    </Card>
  )
}
