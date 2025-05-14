"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2Icon, Loader2 } from "lucide-react"

interface UrduSpeechButtonProps {
  text: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
}

export default function UrduSpeechButton({
  text,
  className = "",
  variant = "outline",
  size = "sm",
  showText = false,
}: UrduSpeechButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = async () => {
    if (!text.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/elevenlabs-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language: "ur",
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate speech: ${response.status} ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = url
        await audioRef.current.play()
      }
    } catch (err) {
      console.error("Error generating speech:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={speak}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
        title={error || "Speak text"}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2Icon className="h-4 w-4" />}
        {showText && <span className="ml-2">Speak</span>}
      </Button>
      <audio ref={audioRef} className="hidden" />
    </>
  )
}
