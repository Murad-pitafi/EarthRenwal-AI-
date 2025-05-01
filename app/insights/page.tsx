"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Insight {
  title: string
  description: string
}

export default function Insights() {
  const { language } = useUser()
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch("/api/insights")
        if (!response.ok) throw new Error("Failed to fetch insights")
        const data = await response.json()
        setInsights(data)
      } catch (error) {
        console.error("Error fetching insights:", error)
      }
    }

    fetchInsights()
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">{language === "en" ? "Agricultural Insights" : "زراعتی بصیرتیں"}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{language === "en" ? insight.title : `بصیرت ${index + 1}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{language === "en" ? insight.description : `یہ بصیرت ${insight.title} کے بارے میں ہے۔`}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
