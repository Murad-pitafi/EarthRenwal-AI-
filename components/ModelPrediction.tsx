"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface ModelPredictionProps {
  modelType: "soilQuality" | "cropYield" | "diseaseDetection"
  title: string
  description: string
  inputFields: {
    name: string
    label: string
    defaultValue: number
    step?: number
    min?: number
    max?: number
  }[]
}

export function ModelPrediction({ modelType, title, description, inputFields }: ModelPredictionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [inputValues, setInputValues] = useState<Record<string, number>>(
    inputFields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue }), {}),
  )

  const handleInputChange = (name: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      // Convert input values to array format expected by the model
      const inputData = Object.values(inputValues)

      const response = await fetch("/api/model-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelType,
          inputData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed")
      }

      setResult(data)
    } catch (error: any) {
      console.error("Prediction error:", error)
      toast({
        title: "Prediction Error",
        description: error.message || "Failed to make prediction",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderResult = () => {
    if (!result) return null

    if (result.error) {
      return <div className="text-red-500 mt-4">Error: {result.error}</div>
    }

    if (modelType === "soilQuality" && result.class) {
      const qualityColorMap: Record<string, string> = {
        Poor: "bg-red-100 text-red-800",
        Moderate: "bg-yellow-100 text-yellow-800",
        Good: "bg-green-100 text-green-800",
      }

      return (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium">Prediction Result:</h3>
          <div className={`p-3 rounded-md ${qualityColorMap[result.class] || "bg-gray-100"}`}>
            <p className="font-bold text-lg">Soil Quality: {result.class}</p>
          </div>
        </div>
      )
    }

    // Generic result display
    return (
      <div className="mt-4 space-y-2">
        <h3 className="font-medium">Prediction Result:</h3>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">{JSON.stringify(result.prediction, null, 2)}</pre>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {inputFields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type="number"
                value={inputValues[field.name]}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                step={field.step || 0.01}
                min={field.min}
                max={field.max}
                className="mt-1"
              />
            </div>
          ))}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Make Prediction"
            )}
          </Button>
        </form>

        {renderResult()}
      </CardContent>
    </Card>
  )
}
