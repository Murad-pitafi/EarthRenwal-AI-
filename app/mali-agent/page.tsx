"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Mic, Send, Gauge } from "lucide-react"
import Image from "next/image"
import { useUser } from "@/contexts/UserContext"
import { useSensorData } from "@/contexts/SensorDataContext"
import { toast } from "@/components/ui/use-toast"
import { formatSensorDataForContext, getSoilHealthAssessment } from "@/lib/sensor-utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

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

export default function MaliAgent() {
  const { language } = useUser()
  const { readings } = useSensorData()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const [sensorData, setSensorData] = useState<ArduinoSensorReading[]>([])
  const [formattedSensorData, setFormattedSensorData] = useState("")
  const [soilHealth, setSoilHealth] = useState("")
  const [showSensorData, setShowSensorData] = useState(false)
  const lastMessageRef = useRef<string | null>(null)
  const isUrdu = language === "ur"

  const translations = {
    en: {
      title: "Mali Agent AI",
      placeholder: "Ask about crops, soil, weather, or farming practices...",
      send: "Send",
      voice: "Voice input",
      howHelps: "How Mali Agent Helps",
      features: [
        "Personalized crop recommendations based on your soil and climate",
        "Real-time pest and disease identification with treatment suggestions",
        "Weather-based irrigation and farming activity scheduling",
        "Market insights and optimal harvest timing recommendations",
        "Multilingual support for local language communication",
      ],
      showSensorData: "Show Sensor Data",
      hideSensorData: "Hide Sensor Data",
      currentReadings: "Current Sensor Readings",
      soilHealth: "Soil Health Assessment",
      listening: "Listening...",
      speakNow: "Speak now",
      notSupported: "Not Supported",
      speechRecognitionNotSupported: "Speech recognition is not supported in your browser.",
      error: "Error",
      failedToRecognize: "Failed to recognize speech. Please try again.",
      failedToStart: "Failed to start speech recognition. Please try again.",
      speaking: "Speaking...",
      messageBeingSpoken: "The message is being spoken.",
    },
    ur: {
      title: "مالی ایجنٹ اے آئی",
      placeholder: "فصلوں، مٹی، موسم، یا کاشتکاری کے طریقوں کے بارے میں پوچھیں...",
      send: "بھیجیں",
      voice: "آواز سے ان پٹ",
      howHelps: "مالی ایجنٹ کیسے مدد کرتا ہے",
      features: [
        "آپ کی مٹی اور موسم کی بنیاد پر ذاتی فصل کی سفارشات",
        "کیڑے اور بیماری کی حقیقی وقت کی شناخت اور علاج کی تجاویز",
        "موسم پر مبنی آبپاشی اور کاشتکاری کی سرگرمیوں کی شیڈولنگ",
        "مارکیٹ کی بصیرت اور فصل کاٹنے کے بہترین وقت کی سفارشات",
        "مقامی زبان کی مواصلات کے لیے کثیر لسانی سپورٹ",
      ],
      showSensorData: "سینسر ڈیٹا دکھائیں",
      hideSensorData: "سینسر ڈیٹا چھپائیں",
      currentReadings: "موجودہ سینسر ریڈنگز",
      soilHealth: "مٹی کی صحت کا تجزیہ",
      listening: "سن رہا ہے...",
      speakNow: "اب بولیں",
      notSupported: "سپورٹ نہیں ہے",
      speechRecognitionNotSupported: "آپ کے براؤزر میں اسپیچ ریکگنیشن سپورٹ نہیں ہے۔",
      error: "خرابی",
      failedToRecognize: "تقریر کو پہچاننے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
      failedToStart: "اسپیچ ریکگنیشن شروع کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
      speaking: "بول رہا ہے...",
      messageBeingSpoken: "پیغام بولا جا رہا ہے۔",
    },
  }

  const t = translations[language]

  // Clean text for display - remove markdown and HTML tags
  const cleanTextForDisplay = (text: string): string => {
    // Replace markdown with proper formatting but don't show the actual markdown characters
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove ** but keep the content
      .replace(/\*(.*?)\*/g, "$1") // Remove * but keep the content
      .replace(/<strong>(.*?)<\/strong>/g, "$1") // Remove <strong> tags but keep content
      .replace(/<em>(.*?)<\/em>/g, "$1") // Remove <em> tags but keep content
      .replace(/^#\s+/gm, "") // Remove heading markers
      .replace(/^-\s+/gm, "• ") // Replace list items with bullets
      .trim()
  }

  // Add this function to format the text for display while preserving formatting
  const formatResponseText = (text: string): string => {
    // Replace markdown with proper formatting but preserve structure
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove ** but keep the content bold
      .trim()
  }

  // Fetch sensor data from Arduino API
  const fetchSensorData = useCallback(async () => {
    try {
      const response = await fetch("/api/arduino-cloud")

      if (!response.ok) {
        throw new Error(`Arduino API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data) {
        console.log("Arduino data received for Mali Agent:", data.data)
        setSensorData(data.data)

        // Format sensor data for context
        const formattedData = formatSensorDataForContext(data.data)
        setFormattedSensorData(formattedData)

        // Get soil health assessment
        const healthAssessment = getSoilHealthAssessment(data.data)
        setSoilHealth(healthAssessment)
      } else {
        console.warn("Arduino API returned no data or error:", data)
        // Use existing readings as fallback
        processSensorReadings()
      }
    } catch (error) {
      console.error("Error fetching Arduino data for Mali Agent:", error)
      // Use existing readings as fallback
      processSensorReadings()
    }
  }, [])

  // Process readings from context into sensor data (fallback)
  const processSensorReadings = useCallback(() => {
    if (readings.length === 0) return

    // Group the most recent readings by sensor type
    const latestReadings = new Map()

    // Sort readings by timestamp (newest first)
    const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp)

    // Get the latest reading for each sensor type
    for (const reading of sortedReadings) {
      if (!latestReadings.has(reading.sensorId)) {
        latestReadings.set(reading.sensorId, reading)
      }
    }

    // Convert to array format
    const processedData = Array.from(latestReadings.values()).map((reading) => ({
      id: reading.id,
      variableId: reading.sensorId,
      name: reading.sensorId,
      value: reading.value,
      unit: "",
      timestamp: new Date(reading.timestamp).toISOString(),
      type: reading.sensorId === "temp" || reading.sensorId === "humd" ? "environment" : "soil",
      icon: "activity",
      description: "",
      min: 0,
      max: 100,
    }))

    setSensorData(processedData)

    // Format sensor data for context
    const formattedData = formatSensorDataForContext(processedData)
    setFormattedSensorData(formattedData)

    // Get soil health assessment
    const healthAssessment = getSoilHealthAssessment(processedData)
    setSoilHealth(healthAssessment)
  }, [readings])

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

  // Initial data fetch
  useEffect(() => {
    // Fetch sensor data on component mount
    fetchSensorData()

    // Set up interval to refresh sensor data every 60 seconds
    const interval = setInterval(fetchSensorData, 60000)

    return () => clearInterval(interval)
  }, [fetchSensorData])

  // Find the best voice for the current language
  const getBestVoiceForLanguage = (lang: string): SpeechSynthesisVoice | null => {
    if (!availableVoices.length) {
      return null
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

  // Improved browser TTS function with better error handling
  const speakText = (text: string) => {
    if (!text.trim() || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }

    // Only use browser TTS for English
    if (language === "en") {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()
        setIsSpeaking(true)

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "en-US"

        // Get an English voice if available
        const englishVoice = availableVoices.find((voice) => voice.lang.toLowerCase().startsWith("en"))
        if (englishVoice) {
          utterance.voice = englishVoice
        }

        // Set up event handlers
        utterance.onend = () => {
          setIsSpeaking(false)
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          setIsSpeaking(false)
        }

        // Speak
        window.speechSynthesis.speak(utterance)

        // Safety timeout
        setTimeout(
          () => {
            if (isSpeaking) {
              setIsSpeaking(false)
            }
          },
          Math.max(15000, text.length * 100),
        )
      } catch (error) {
        console.error("Browser TTS error:", error)
        setIsSpeaking(false)
      }
    }
    // For Urdu, we'll use the ElevenLabs API directly
  }

  // Function to speak Urdu text using ElevenLabs
  const speakUrduText = async (text: string) => {
    if (!text.trim()) return

    try {
      setIsSpeaking(true)
      const response = await fetch("/api/elevenlabs-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl) // Clean up
      }

      audio.onerror = () => {
        console.error("Audio playback error")
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl) // Clean up
      }

      await audio.play()
    } catch (error) {
      console.error("Error speaking Urdu text:", error)
      setIsSpeaking(false)
      toast({
        title: isUrdu ? "آواز میں خرابی" : "Speech Error",
        description: isUrdu ? "متن کو آواز میں تبدیل کرنے میں خرابی۔" : "Error converting text to speech.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    // Set initial welcome message in the selected language
    const welcomeMessage =
      language === "en"
        ? "Hello! I'm Mali Agent, your agricultural AI assistant. I now have access to your real-time soil sensor data. How can I help with your farming needs today?"
        : "السلام علیکم! میں مالی ایجنٹ ہوں، آپ کا زرعی اے آئی اسسٹنٹ۔ اب میرے پاس آپ کے مٹی کے سینسر کا حقیقی وقت کا ڈیٹا ہے۔ آج میں آپ کی کاشتکاری کی ضروریات میں کیسے مدد کر سکتا ہوں؟"

    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
      },
    ])

    // Speak the welcome message
    if (language === "en") {
      speakText(welcomeMessage)
    } else {
      speakUrduText(welcomeMessage)
    }
  }, [language])

  // Auto-speak new assistant messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]

    // Only speak if it's a new assistant message and not the same as the last one we spoke
    if (lastMessage && lastMessage.role === "assistant" && lastMessage.content !== lastMessageRef.current) {
      lastMessageRef.current = lastMessage.content

      if (language === "en") {
        speakText(cleanTextForDisplay(lastMessage.content))
      } else {
        speakUrduText(cleanTextForDisplay(lastMessage.content))
      }
    }
  }, [messages, language])

  const handleVoiceInput = () => {
    // Check if browser supports speech recognition
    if (typeof window === "undefined") return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast({
        title: t.notSupported,
        description: t.speechRecognitionNotSupported,
        variant: "destructive",
      })
      return
    }

    try {
      setIsRecording(true)
      toast({
        title: t.listening,
        description: t.speakNow,
      })

      const recognition = new SpeechRecognition()
      recognition.lang = language === "en" ? "en-US" : "ur-PK"
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsRecording(false)

        // Submit the form with the transcript
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent
        handleSubmit(fakeEvent, transcript)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsRecording(false)
        toast({
          title: t.error,
          description: t.failedToRecognize,
          variant: "destructive",
        })
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognition.start()
    } catch (error) {
      console.error("Speech recognition error:", error)
      setIsRecording(false)
      toast({
        title: t.error,
        description: t.failedToStart,
        variant: "destructive",
      })
    }
  }

  // Update the handleSubmit function to include speech functionality
  const handleSubmit = async (e: React.FormEvent, voiceInput = "") => {
    e.preventDefault()
    const userMessage = voiceInput || input
    if (!userMessage.trim() || isLoading) return

    const userMessageObj: Message = { role: "user", content: userMessage }
    setMessages((prev) => [...prev, userMessageObj])
    setInput("")
    setIsLoading(true)

    try {
      // Refresh sensor data before sending the request
      await fetchSensorData()

      console.log("Sending to chatbot API with sensor data:", {
        query: userMessage,
        language,
        sensorData: formattedSensorData,
        soilHealth,
      })

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          language: language,
          sensorData: formattedSensorData,
          soilHealth: soilHealth,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Auto-speaking is now handled by the useEffect
    } catch (error) {
      console.error("Error:", error)
      // Fallback responses in case of API failure
      const fallbackResponses =
        language === "en"
          ? [
              "Based on your soil analysis, I recommend reducing nitrogen application by 15% and increasing potassium levels.",
              "The current weather forecast shows a 70% chance of rain in the next 48 hours. Consider delaying your pesticide application.",
              "For your wheat crop at this growth stage, I recommend monitoring for rust disease as conditions are favorable for its development.",
              "Your soil moisture levels are optimal. Maintain your current irrigation schedule for the next week.",
              "Based on historical data and current conditions, the optimal planting time for your region would be in approximately 2 weeks.",
            ]
          : [
              "آپ کی مٹی کے تجزیہ کی بنیاد پر، میں نائٹروجن کی ایپلیکیشن کو 15% کم کرنے اور پوٹاشیم کی سطح بڑھانے کی تجویز کرتا ہوں۔",
              "موجودہ موسم کی پیش گوئی اگلے 48 گھنٹوں میں بارش کا 70% امکان ظاہر کرتی ہے۔ اپنے کیڑے مار دوا کے استعمال میں تاخیر پر غور کریں۔",
              "اس نشوونما کے مرحلے پر آپ کی گندم کی فصل کے لیے، میں زنگ کی بیماری کی نگرانی کی تجویز کرتا ہوں کیونکہ حالات اس کی نشوونما کے لیے سازگار ہیں۔",
              "آپ کی مٹی کی نمی کی سطح مثالی ہے۔ اگلے ہفتے کے لیے اپنی موجودہ آبپاشی کا شیڈول برقرار رکھیں۔",
              "تاریخی اعداد و شمار اور موجودہ حالات کی بنیاد پر، آپ کے علاقے کے لیے بہترین کاشت کا وقت تقریباً 2 ہفتوں میں ہوگا۔",
            ]

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      <div className="md:col-span-2">
        <Card className="h-full flex flex-col bg-gradient-to-b from-green-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Image src="/images/logo.png" alt="Mali Agent" width={24} height={24} />
              </div>
              {t.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 h-[400px] mb-4 p-4 border rounded-md bg-white">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-lg ${
                    message.role === "user" ? "bg-green-100 ml-auto max-w-[80%]" : "bg-gray-100 mr-auto max-w-[80%]"
                  }`}
                >
                  <p className="font-semibold mb-1">
                    {message.role === "user"
                      ? language === "en"
                        ? "You:"
                        : "آپ:"
                      : language === "en"
                        ? "Mali Agent:"
                        : "مالی ایجنٹ:"}
                  </p>
                  <p className="text-sm">{cleanTextForDisplay(message.content)}</p>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                </div>
              )}
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                disabled={isLoading || isRecording}
                className="flex-1"
                dir={language === "ur" ? "rtl" : "ltr"}
              />
              <Button type="submit" disabled={isLoading || isRecording} className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4" />
                <span className="sr-only">{t.send}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading || isRecording}
                onClick={handleVoiceInput}
                className={`border-green-600 text-green-600 hover:bg-green-50 ${isRecording ? "bg-red-50" : ""}`}
              >
                {isRecording ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                <span className="sr-only">{t.voice}</span>
              </Button>
              {isSpeaking && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-blue-100"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="sr-only">{isUrdu ? "بول رہا ہے..." : "Speaking..."}</span>
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="bg-gradient-to-b from-green-50 to-white">
          <CardHeader>
            <CardTitle>{t.howHelps}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {t.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <span className="text-green-600 text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-sm">{feature}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>{t.currentReadings}</span>
              <Button variant="ghost" size="sm" onClick={() => setShowSensorData(!showSensorData)} className="text-xs">
                {showSensorData ? t.hideSensorData : t.showSensorData}
              </Button>
            </CardTitle>
          </CardHeader>
          {showSensorData && (
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{t.soilHealth}</span>
                </div>
                <p className="text-muted-foreground pl-6">{soilHealth}</p>

                <div className="mt-4">
                  {sensorData.map((sensor) => (
                    <div key={sensor.id} className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span>{sensor.name}:</span>
                      <span className="font-medium">
                        {sensor.value.toFixed(1)} {sensor.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
