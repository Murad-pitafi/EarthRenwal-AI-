interface ArduinoSensorReading {
  id: string
  variableId: string
  name: string
  value: number
  unit: string
  timestamp: string
  type: string
  icon: string
  description: string
  min: number
  max: number
}

export function formatSensorDataForContext(sensorData: ArduinoSensorReading[]): string {
  const lines = sensorData.map((sensor) => {
    return `${sensor.name}: ${sensor.value} ${sensor.unit}`
  })
  return lines.join("\\n")
}

export function getSoilHealthAssessment(sensorData: ArduinoSensorReading[]): string {
  let assessment = "No soil data available."

  if (sensorData && sensorData.length > 0) {
    const nitrogen = sensorData.find((s) => s.variableId === "nit")?.value || 0
    const phosphorus = sensorData.find((s) => s.variableId === "phos")?.value || 0
    const potassium = sensorData.find((s) => s.variableId === "pot")?.value || 0

    if (nitrogen > 80 || phosphorus > 40 || potassium > 300) {
      assessment = "Nutrient levels are high. Monitor closely."
    } else if (nitrogen < 20 || phosphorus < 10 || potassium < 100) {
      assessment = "Nutrient levels are low. Consider fertilization."
    } else {
      assessment = "Nutrient levels are optimal."
    }
  }

  return assessment
}
