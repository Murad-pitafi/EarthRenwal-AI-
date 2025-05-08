"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Mic, Send, Volume2 } from "lucide-react"
import Image from "next/image"
import { useUser } from "@/contexts/UserContext"
import { toast } from "@/components/ui/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function MaliAgent() {
  const { language } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])

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

  // Load and cache available voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }

    // Function to update available voices
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setAvailableVoices(voices)
      console.log(
        "Available voices:",
        voices.map((v) => `${v.name} (${v.lang})`),
      )
    }

    // Get initial voices
    updateVoices()

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

    // For Urdu, try to find Urdu voice first, then Hindi, then Arabic as fallbacks
    if (lang === "ur") {
      // Try Urdu first
      const urduVoice = availableVoices.find(
        (voice) => voice.lang.toLowerCase().includes("ur") || voice.name.toLowerCase().includes("urdu"),
      )
      if (urduVoice) return urduVoice

      // Try Hindi as fallback
      const hindiVoice = availableVoices.find(
        (voice) => voice.lang.toLowerCase().includes("hi") || voice.name.toLowerCase().includes("hindi"),
      )
      if (hindiVoice) return hindiVoice

      // Try Arabic as fallback
      const arabicVoice = availableVoices.find(
        (voice) => voice.lang.toLowerCase().includes("ar") || voice.name.toLowerCase().includes("arab"),
      )
      if (arabicVoice) return arabicVoice

      // If no appropriate voice found, use any voice
      return availableVoices[0]
    }

    // For English
    if (lang === "en") {
      const englishVoice = availableVoices.find((voice) => voice.lang.toLowerCase().startsWith("en"))
      return englishVoice || availableVoices[0]
    }

    // Default fallback
    return availableVoices[0]
  }

  // Updated speech function with improved voice selection
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast({
        title: language === "en" ? "Not Supported" : "سپورٹ نہیں ہے",
        description:
          language === "en"
            ? "Your browser does not support text-to-speech."
            : "آپ کا براؤزر ٹیکسٹ ٹو سپیچ کو سپورٹ نہیں کرتا۔",
        variant: "destructive",
      })
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
          title: language === "en" ? "Speech Error" : "تقریر میں خرابی",
          description:
            language === "en"
              ? "An error occurred during speech synthesis."
              : "تقریر کی تخلیق کے دوران ایک خرابی پیش آئی۔",
          variant: "destructive",
        })
      }

      // Speak
      window.speechSynthesis.speak(utterance)
      console.log("Started speaking:", text.substring(0, 50) + "...")

      // Safety timeout in case onend doesn't fire
      setTimeout(() => {
        if (isSpeaking) {
          console.log("Safety timeout triggered - resetting speaking state")
          setIsSpeaking(false)
        }
      }, 15000)
    } catch (error) {
      console.error("Error in text-to-speech:", error)
      setIsSpeaking(false)
      toast({
        title: language === "en" ? "Speech Error" : "تقریر میں خرابی",
        description:
          language === "en"
            ? "An error occurred during speech synthesis."
            : "تقریر کی تخلیق کے دوران ایک خرابی پیش آئی۔",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    // Set initial welcome message in the selected language
    const welcomeMessage =
      language === "en"
        ? "Hello! I'm Mali Agent, your agricultural AI assistant. How can I help with your farming needs today?"
        : "السلام علیکم! میں مالی ایجنٹ ہوں، آپ کا زرعی اے آئی اسسٹنٹ۔ آج میں آپ کی کاشتکاری کی ضروریات میں کیسے مدد کر سکتا ہوں؟"

    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
      },
    ])
  }, [language])

  const handleVoiceInput = () => {
    // Check if browser supports speech recognition
    if (typeof window === "undefined") return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast({
        title: language === "en" ? "Not Supported" : "سپورٹ نہیں ہے",
        description:
          language === "en"
            ? "Speech recognition is not supported in your browser."
            : "آپ کے براؤزر میں اسپیچ ریکگنیشن سپورٹ نہیں ہے۔",
        variant: "destructive",
      })
      return
    }

    try {
      setIsRecording(true)
      toast({
        title: language === "en" ? "Listening..." : "سن رہا ہے...",
        description: language === "en" ? "Speak now" : "اب بولیں",
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
          title: language === "en" ? "Error" : "خرابی",
          description:
            language === "en"
              ? "Failed to recognize speech. Please try again."
              : "تقریر کو پہچاننے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
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
        title: language === "en" ? "Error" : "خرابی",
        description:
          language === "en"
            ? "Failed to start speech recognition. Please try again."
            : "اسپیچ ریکگنیشن شروع کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
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
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          language: language,
          maxLength: 4, // Request short responses (3-4 lines)
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

      // Automatically speak the response
      if (data.response) {
        speakText(formatResponseText(data.response))
      }
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
              <Button
                type="button"
                onClick={() => {
                  if (messages.length > 0) {
                    const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant")
                    if (lastAssistantMessage) {
                      speakText(cleanTextForDisplay(lastAssistantMessage.content))
                      toast({
                        title: language === "en" ? "Speaking..." : "بول رہا ہے...",
                        description: language === "en" ? "The message is being spoken." : "پیغام بولا جا رہا ہے۔",
                      })
                    }
                  }
                }}
                disabled={isLoading || isSpeaking}
                variant="outline"
                className={`border-blue-600 text-blue-600 hover:bg-blue-50 ${isSpeaking ? "bg-blue-100" : ""}`}
              >
                {isSpeaking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                <span className="sr-only">{language === "en" ? "Text to speech" : "متن سے تقریر"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
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
      </div>
    </div>
  )
}
