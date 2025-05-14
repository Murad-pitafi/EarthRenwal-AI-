"use client"
import { useSensorData } from "@/contexts/SensorDataContext"
import { Button } from "@/components/ui/button"
import { Play, Pause, Trash2 } from "lucide-react"

export function DataCollectionStatus() {
  const { readings, isCollecting, lastUpdated, startCollection, stopCollection, clearData } = useSensorData()

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isCollecting ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
        <span>
          {isCollecting ? "Collecting data" : "Collection paused"}
          {lastUpdated && ` (Last update: ${lastUpdated.toLocaleTimeString()})`}
        </span>
        <span className="text-gray-500">{readings.length} readings stored</span>
      </div>
      <div className="flex items-center gap-2">
        {isCollecting ? (
          <Button variant="outline" size="sm" onClick={stopCollection} className="h-7 px-2">
            <Pause className="h-3 w-3 mr-1" /> Pause
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={startCollection} className="h-7 px-2">
            <Play className="h-3 w-3 mr-1" /> Resume
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={clearData} className="h-7 px-2 text-red-500 hover:text-red-700">
          <Trash2 className="h-3 w-3 mr-1" /> Clear Data
        </Button>
      </div>
    </div>
  )
}
