"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MediaGallerySlider } from "@/components/MediaGallerySlider"
import { useUser } from "@/contexts/UserContext"

export default function MediaGallery() {
  const { language } = useUser()
  const [activeTab, setActiveTab] = useState("slideshow")

  const translations = {
    en: {
      title: "Media Gallery",
      fieldWork: "Field Work",
      events: "Events & Presentations",
      soilAnalysis: "Soil Analysis & Research",
    },
    ur: {
      title: "میڈیا گیلری",
      fieldWork: "فیلڈ ورک",
      events: "تقریبات اور پریزنٹیشنز",
      soilAnalysis: "مٹی کا تجزیہ اور تحقیق",
    },
  }

  const t = translations[language]

  const fieldWorkImages = ["/images/media_gallery_1.jpg", "/images/media_gallery_2.jpg", "/images/media_gallery_4.jpg"]
  const eventsImages = ["/images/media_gallery_3.jpg", "/images/media_gallery_5.jpg"]
  const soilAnalysisImages = ["/images/field_work_soil_analysis_1.jpg", "/images/field_work_soil_analysis_2.jpg"]

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-4xl font-bold mb-8">{t.title}</h1>

      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-green-50 to-white">
          <CardHeader>
            <CardTitle>{t.fieldWork}</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaGallerySlider images={fieldWorkImages} />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-white">
          <CardHeader>
            <CardTitle>{t.soilAnalysis}</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaGallerySlider images={soilAnalysisImages} />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-white">
          <CardHeader>
            <CardTitle>{t.events}</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaGallerySlider images={eventsImages} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
