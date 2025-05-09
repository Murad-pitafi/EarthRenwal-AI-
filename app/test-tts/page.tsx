"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Volume2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function TestTTS() {
  const [text, setText] = useState<string>("")
  const [language, setLanguage] = useState<string>("en")
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<string>("")

  // Sample texts
  const sampleTexts = {
    en: "Hello! I'm your agricultural AI assistant. How can I help with your farming needs today?",
    ur: "السلام علیکم! میں آپ کا زرعی اے آئی اسسٹنٹ ہوں۔ آج میں آپ کی کاشتکاری کی ضروریات میں کیسے مدد کر سکتا ہوں؟",
  }

  // Load and cache available voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }

    // Function to update available voices
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setAvailableVoices(voices)
      setVoicesLoaded(true)
      console.log(
        "Available voices:",
        voices.map((v) => `${v.name} (${v.lang})`),
      )
    }

    // Get initial voices
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      updateVoices()
    }

    // Set up event listener for when voices change
    window.speechSynthesis.onvoiceschanged = updateVoices

    // Clean up
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  // Find the best voice for the current language
  const getBestVoiceForLanguage = (lang: string): SpeechSynthesisVoice | null => {
    if (!availableVoices.length) {
      return null
    }

    // If user has selected a specific voice, use that
    if (selectedVoice) {
      const voice = availableVoices.find((v) => v.name === selectedVoice)
      if (voice) return voice
    }

    // For Urdu, try to find Urdu voice first, then Hindi, then Arabic as fallbacks
    if (lang === "ur") {
      // Try Urdu first
      const urduVoice = availableVoices.find(
        (voice) => voice.lang.toLowerCase().includes("ur") || voice.name.toLowerCase().includes("urdu"),
      )
      if (urduVoice) {
        console.log("Found Urdu voice:", urduVoice.name)
        return urduVoice
      }

      // Try Hindi as fallback
      const hindiVoice = availableVoices.find(
        (voice) => voice.lang.toLowerCase().includes("hi") || voice.name.toLowerCase().includes("hindi"),
      )
      if (hindiVoice) {
        console.log("Using Hindi voice as fallback:", hindiVoice.name)
        return hindiVoice
      }

      // Try Arabic as fallback
      const arabicVoice = availableVoices.find(
        (voice) => voice.lang.toLowerCase().includes("ar") || voice.name.toLowerCase().includes("arab"),
      )
      if (arabicVoice) {
        console.log("Using Arabic voice as fallback:", arabicVoice.name)
        return arabicVoice
      }

      // Try any female voice as fallback (often better for Urdu)
      const femaleVoice = availableVoices.find((voice) => voice.name.toLowerCase().includes("female"))
      if (femaleVoice) {
        console.log("Using female voice as fallback:", femaleVoice.name)
        return femaleVoice
      }

      // If no appropriate voice found, use any voice
      console.log("No appropriate voice found for Urdu, using default")
      return availableVoices[0]
    }

    // For English
    if (lang === "en") {
      const englishVoice = availableVoices.find((voice) => voice.lang.toLowerCase().startsWith("en"))
      if (englishVoice) {
        console.log("Found English voice:", englishVoice.name)
        return englishVoice
      }
      console.log("No English voice found, using default")
      return availableVoices[0]
    }

    // Default fallback
    return availableVoices[0]
  }

  // Browser TTS function
  const speakText = () => {
    if (!text.trim() || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      setIsSpeaking(true)

      const utterance = new SpeechSynthesisUtterance(text)

      // Set language based on current app language
      utterance.lang = language === "en" ? "en-US" : "ur-PK"

      // Get the best voice for the current language
      const voice = getBestVoiceForLanguage(language)

      if (voice) {
        console.log(`Using voice: ${voice.name} (${voice.lang}) for ${language}`)
        utterance.voice = voice
      } else {
        console.log(`No appropriate voice found for ${language}. Using default.`)
      }

      // Set up event handlers
      utterance.onend = () => {
        console.log("Speech ended")
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        setIsSpeaking(false)
        toast({
          title: "Speech Error",
          description: "An error occurred during speech synthesis.",
          variant: "destructive",
        })
      }

      // Speak
      window.speechSynthesis.speak(utterance)
      console.log("Started speaking:", text.substring(0, 50) + "...")

      // Safety timeout in case onend doesn't fire
      setTimeout(
        () => {
          if (isSpeaking) {
            console.log("Safety timeout triggered - resetting speaking state")
            setIsSpeaking(false)
          }
        },
        Math.max(15000, text.length * 100),
      ) // Longer timeout for longer text
    } catch (error) {
      console.error("Browser TTS error:", error)
      setIsSpeaking(false)
      toast({
        title: "Speech Error",
        description: "An error occurred during speech synthesis.",
        variant: "destructive",
      })
    }
  }

  // Set sample text when language changes
  useEffect(() => {
    setText(sampleTexts[language as keyof typeof sampleTexts] || "")
    setSelectedVoice("") // Reset selected voice when language changes
  }, [language])

  return (
    <div className="container py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Text-to-Speech Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="flex-1">
              <Select
                value={language}
                onValueChange={(value: string) => {
                  setLanguage(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ur">Urdu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={selectedVoice}
                onValueChange={(value: string) => {
                  setSelectedVoice(value)
                }}
                disabled={!voicesLoaded || availableVoices.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Voice (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Auto-select best voice</SelectItem>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to speak..."
            rows={5}
            dir={language === "ur" ? "rtl" : "ltr"}
          />

          <Button onClick={speakText} disabled={!text.trim() || isSpeaking || !voicesLoaded} className="w-full">
            {isSpeaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Speaking...
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Speak Text
              </>
            )}
          </Button>

          <div className="text-sm text-gray-500 mt-4">
            <p>Available voices:</p>
            <ul className="list-disc pl-5 mt-2 max-h-[200px] overflow-y-auto">
              {availableVoices.length > 0 ? (
                availableVoices.map((voice, index) => (
                  <li key={index}>
                    {voice.name} ({voice.lang}){voice.default ? " - Default" : ""}
                  </li>
                ))
              ) : (
                <li>No voices available or still loading...</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
