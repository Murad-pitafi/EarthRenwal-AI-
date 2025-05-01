"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Achievement {
  title: string
  description: string
  image: string
  date: string
  icon: React.ElementType
}

interface AchievementsSliderProps {
  achievements: Achievement[]
}

export function AchievementsSlider({ achievements }: AchievementsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === achievements.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => {
      resetTimeout()
    }
  }, [currentIndex, achievements.length])

  const goToPrevious = () => {
    resetTimeout()
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? achievements.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    resetTimeout()
    setCurrentIndex((prevIndex) => (prevIndex === achievements.length - 1 ? 0 : prevIndex + 1))
  }

  const achievement = achievements[currentIndex]
  const Icon = achievement.icon

  return (
    <Card className="relative overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={achievement.image || "/placeholder.svg"} alt={achievement.title} fill className="object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-green-600" />
          <CardTitle>{achievement.title}</CardTitle>
        </div>
        <CardDescription>{achievement.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{achievement.description}</p>
      </CardContent>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-24 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-24 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>

      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {achievements.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-green-600" : "bg-gray-300"}`}
            onClick={() => {
              resetTimeout()
              setCurrentIndex(index)
            }}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}
