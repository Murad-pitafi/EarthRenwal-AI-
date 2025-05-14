"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { SENSOR_METADATA } from "@/components/RealTimeMonitoring"

// Define types for our sensor data
export interface ConsolidatedReading {
  id: string
  timestamp: number
  pot: number
  phos: number
  nit: number
  gas: number
  humd: number
  temp: number
  // Optional additional sensors
  moist?: number
  wind?: number
  press?: number
  dist?: number
}

interface SensorDataContextType {
  readings: ConsolidatedReading[]
  isCollecting: boolean
  lastUpdated: Date | null
  startCollection: () => void
  stopCollection: () => void
  clearData: () => void
}

const SensorDataContext = createContext<SensorDataContextType | undefined>(undefined)

// Mock data generation function for a specific sensor
const generateMockReading = (sensorId: string): number => {
  const metadata = SENSOR_METADATA[sensorId]
  if (!metadata) return 0

  const min = metadata.mockRange?.[0] || 0
  const max = metadata.mockRange?.[1] || 100
  return Number.parseFloat((min + Math.random() * (max - min)).toFixed(1))
}

export const SensorDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [readings, setReadings] = useState<ConsolidatedReading[]>([])
  const [isCollecting, setIsCollecting] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const collectionInterval = useRef<NodeJS.Timeout | null>(null)
  const initialized = useRef(false)

  // Load existing readings from localStorage on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    try {
      const storedReadings = localStorage.getItem("sensorReadings")
      if (storedReadings) {
        // Try to parse as new format first
        try {
          const parsedReadings = JSON.parse(storedReadings)

          // Check if it's in the new consolidated format
          if (parsedReadings.length > 0 && "pot" in parsedReadings[0]) {
            console.log("Loaded data in consolidated format", parsedReadings.length, "readings")
            setReadings(parsedReadings)
          } else {
            // Convert from old format to new format
            console.log("Converting from old format to consolidated format")
            const groupedReadings = convertOldFormatToNew(parsedReadings)
            setReadings(groupedReadings)
          }
        } catch (error) {
          console.error("Error parsing stored readings:", error)
          // Start with empty readings
          setReadings([])
        }
      }
    } catch (error) {
      console.error("Error loading sensor readings from localStorage:", error)
    }

    // Start collection automatically
    startCollection()

    // Cleanup on unmount
    return () => {
      if (collectionInterval.current) {
        clearInterval(collectionInterval.current)
      }
    }
  }, [])

  // Convert old format (separate readings) to new format (consolidated)
  const convertOldFormatToNew = (oldReadings: any[]): ConsolidatedReading[] => {
    // Group by timestamp (rounded to the nearest second to handle slight variations)
    const groupedByTimestamp = new Map<number, any>()

    oldReadings.forEach((reading) => {
      // Round timestamp to nearest second
      const timestamp = Math.floor(reading.timestamp / 1000) * 1000

      if (!groupedByTimestamp.has(timestamp)) {
        groupedByTimestamp.set(timestamp, {
          id: `consolidated-${timestamp}`,
          timestamp,
          pot: null,
          phos: null,
          nit: null,
          gas: null,
          humd: null,
          temp: null,
        })
      }

      // Add the sensor value to the consolidated reading
      const consolidated = groupedByTimestamp.get(timestamp)
      if (reading.sensorId) {
        consolidated[reading.sensorId] = reading.value
      }
    })

    // Convert to array and filter out incomplete readings
    return Array.from(groupedByTimestamp.values())
      .filter((reading) => {
        // Ensure at least some values are present
        return (
          reading.pot !== null ||
          reading.phos !== null ||
          reading.nit !== null ||
          reading.gas !== null ||
          reading.humd !== null ||
          reading.temp !== null
        )
      })
      .sort((a, b) => b.timestamp - a.timestamp) // Sort by timestamp (newest first)
  }

  // Save readings to localStorage whenever they change
  useEffect(() => {
    if (readings.length > 0) {
      try {
        localStorage.setItem("sensorReadings", JSON.stringify(readings))
        // Dispatch event to notify other components
        window.dispatchEvent(new Event("sensorDataUpdated"))
      } catch (error) {
        console.error("Error saving sensor readings to localStorage:", error)
      }
    }
  }, [readings])

  const collectData = async () => {
    try {
      // Generate a single consolidated reading with all sensor values
      const timestamp = Date.now()
      const newReading: ConsolidatedReading = {
        id: `consolidated-${timestamp}`,
        timestamp,
        pot: generateMockReading("pot"),
        phos: generateMockReading("phos"),
        nit: generateMockReading("nit"),
        gas: generateMockReading("gas"),
        humd: generateMockReading("humd"),
        temp: generateMockReading("temp"),
        // Optional sensors
        moist: generateMockReading("moist"),
        wind: generateMockReading("wind"),
        press: generateMockReading("press"),
        dist: generateMockReading("dist"),
      }

      setReadings((prev) => {
        // Keep only the most recent 3000 readings
        const updatedReadings = [newReading, ...prev]
        if (updatedReadings.length > 3000) {
          return updatedReadings.slice(0, 3000)
        }
        return updatedReadings
      })

      setLastUpdated(new Date())
      console.log("Collected new consolidated reading:", newReading)
    } catch (error) {
      console.error("Error collecting sensor data:", error)
    }
  }

  const startCollection = () => {
    if (collectionInterval.current) {
      clearInterval(collectionInterval.current)
    }

    // Collect data immediately
    collectData()

    // Then set up interval (every 30 seconds)
    collectionInterval.current = setInterval(collectData, 30000)
    setIsCollecting(true)
  }

  const stopCollection = () => {
    if (collectionInterval.current) {
      clearInterval(collectionInterval.current)
      collectionInterval.current = null
    }
    setIsCollecting(false)
  }

  const clearData = () => {
    setReadings([])
    localStorage.removeItem("sensorReadings")
  }

  return (
    <SensorDataContext.Provider
      value={{
        readings,
        isCollecting,
        lastUpdated,
        startCollection,
        stopCollection,
        clearData,
      }}
    >
      {children}
    </SensorDataContext.Provider>
  )
}

export const useSensorData = () => {
  const context = useContext(SensorDataContext)
  if (context === undefined) {
    throw new Error("useSensorData must be used within a SensorDataProvider")
  }
  return context
}
