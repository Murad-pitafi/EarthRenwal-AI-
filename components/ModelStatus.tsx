"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Loader2 } from "lucide-react"

interface ModelLocation {
  path: string
  exists: boolean
  size?: number
}

export function ModelStatus() {
  const [modelLocations, setModelLocations] = useState<ModelLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkModelStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/upload-model")

      if (!response.ok) {
        throw new Error(`Error checking model status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setModelLocations(data.modelLocations)
      } else {
        throw new Error(data.error || "Failed to check model status")
      }
    } catch (error) {
      console.error("Error checking model status:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkModelStatus()
  }, [])

  const modelExists = modelLocations.some((location) => location.exists)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Model Status</span>
          <Button variant="outline" size="sm" onClick={checkModelStatus} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Model Available:</span>
              {modelExists ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" /> Yes
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <XCircle className="h-5 w-5 mr-1" /> No
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Checked Locations:</h4>
              <ul className="space-y-1 text-sm">
                {modelLocations.map((location, index) => (
                  <li key={index} className="flex items-start">
                    {location.exists ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 mr-1 flex-shrink-0" />
                    )}
                    <div>
                      <span className="font-mono text-xs break-all">{location.path}</span>
                      {location.exists && location.size && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({(location.size / 1024).toFixed(2)} KB)
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
