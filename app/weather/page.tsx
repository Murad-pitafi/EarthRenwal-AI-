"use client"
import { useUser } from "@/contexts/UserContext"
import { Weather } from "@/components/Weather"
import { WeatherForecast } from "@/components/WeatherForecast"

export default function WeatherPage() {
  const { language } = useUser()

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-4xl font-bold mb-8">{language === "en" ? "Weather Forecast" : "موسم کی پیش گوئی"}</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Weather />
        </div>
        <div>
          <WeatherForecast />
        </div>
      </div>
    </div>
  )
}
