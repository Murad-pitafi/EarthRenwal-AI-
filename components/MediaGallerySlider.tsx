"use client"
import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/UserContext"

interface MediaGallerySliderProps {
  images: string[]
}

export function MediaGallerySlider({ images }: MediaGallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { language } = useUser()

  const getImageDescription = (imagePath: string) => {
    const descriptions = {
      en: {
        "/images/media_gallery_1.jpg": "Team members working in rice fields",
        "/images/media_gallery_2.jpg": "Examining crop growth in experimental plots",
        "/images/media_gallery_3.jpg": "Presentation at the agricultural conference",
        "/images/media_gallery_4.jpg": "Collecting field samples for analysis",
        "/images/media_gallery_5.jpg": "Team discussion during field visit",
        "/images/field_work_soil_analysis_1.jpg": "Team collecting soil samples from rice field",
        "/images/field_work_soil_analysis_2.jpg": "Researchers examining soil quality at the field edge",
      },
      ur: {
        "/images/media_gallery_1.jpg": "چاول کے کھیتوں میں کام کرنے والے ٹیم کے ممبران",
        "/images/media_gallery_2.jpg": "تجرباتی پلاٹس میں فصل کی نشوونما کا معائنہ",
        "/images/media_gallery_3.jpg": "زرعی کانفرنس میں پریزنٹیشن",
        "/images/media_gallery_4.jpg": "تجزیہ کے لیے فیلڈ سیمپل اکٹھا کرنا",
        "/images/media_gallery_5.jpg": "فیلڈ کے دورے کے دوران ٹیم کی گفتگو",
        "/images/field_work_soil_analysis_1.jpg": "ٹیم چاول کے کھیت سے مٹی کے نمونے اکٹھا کر رہی ہے",
        "/images/field_work_soil_analysis_2.jpg": "محققین کھیت کے کنارے مٹی کی کوالٹی کا معائنہ کر رہے ہیں",
      },
    }

    return descriptions[language][imagePath] || ""
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg aspect-video relative">
        <div className="relative w-full h-full">
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={getImageDescription(images[currentIndex])}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
            {getImageDescription(images[currentIndex])}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full" aria-label="Previous image">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} / {images.length}
        </div>
        <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full" aria-label="Next image">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
