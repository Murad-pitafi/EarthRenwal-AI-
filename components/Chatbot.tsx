"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Mic, Send, Volume2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function Chatbot() {
  const { language, setLanguage } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [sessionId, setSessionId] = useState<string>("")

  // Clean text for display - remove markdown and HTML tags
  const cleanTextForDisplay = (text: string): string => {
    // Replace markdown with proper formatting but preserve structure
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove ** but keep the content
      .trim()
  }

  useEffect(() => {
    // Generate a session ID if one doesn't exist
    if (!sessionId) {
      const newSessionId = uuidv4()
      setSessionId(newSessionId)

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("chatSessionId", newSessionId)
      }
    }

    // Load session ID from localStorage if available
    if (typeof window !== "undefined" && !sessionId) {
      const storedSessionId = localStorage.getItem("chatSessionId")
      if (storedSessionId) {
        setSessionId(storedSessionId)
      }
    }
  }, [sessionId])

  useEffect(() => {
    // Update welcome message when language changes
    setMessages([
      {
        role: "assistant",
        content:
          language === "en"
            ? "Hello! I'm your agricultural AI assistant. How can I help with your farming needs today?"
            : "السلام علیکم! میں آپ کا زرعی اے آئی اسسٹنٹ ہوں۔ آج میں آپ کی کاشتکاری کی ضروریات میں کیسے مدد کر سکتا ہوں؟",
      },
    ])
  }, [language])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent, voiceInput = "") => {
    e.preventDefault()
    const userMessage = voiceInput || input
    if (!userMessage.trim() || isLoading) return

    const newUserMessage: Message = { role: "user", content: userMessage }
    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          language: language,
          sessionId: sessionId,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      const assistantMessage: Message = {
        role: "assistant",
        content: data.text || "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Generate speech from the response
      if (data.text) {
        speakText(cleanTextForDisplay(data.text))
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage =
        language === "en"
          ? "Sorry, something went wrong. Please try again."
          : "معذرت، کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔"

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ])
      toast({
        title: language === "en" ? "Error" : "خرابی",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true)

      // Use server-side TTS for better language support
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      })

      if (!response.ok) throw new Error("TTS request failed")

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
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (error) {
      console.error("Speech error:", error)
      setIsSpeaking(false)
      toast({
        title: language === "en" ? "Speech Error" : "تقریر میں خرابی",
        description:
          language === "en"
            ? "Could not play speech. Trying browser fallback..."
            : "تقریر نہیں چل سکی۔ براؤزر فالبیک کی کوشش کر رہا ہے...",
      })

      // Fallback to browser TTS
      tryBrowserTTS(text)
    }
  }

  // Add this new function for browser fallback
  const tryBrowserTTS = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }

    try {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "en" ? "en-US" : "ur-PK"

      // Get available voices
      const voices = window.speechSynthesis.getVoices()
      const languageVoices = voices.filter((voice) =>
        language === "en" ? voice.lang.startsWith("en") : voice.lang.startsWith("ur"),
      )

      if (languageVoices.length > 0) {
        utterance.voice = languageVoices[0]
      }

      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Browser TTS error:", error)
      setIsSpeaking(false)
    }
  }

  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    // Pre-initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // This forces the browser to load voices
      window.speechSynthesis.getVoices()
    }
  }, [])

  const placeholderText =
    language === "en"
      ? "Ask about crops, soil, weather, or farming practices..."
      : "فصلوں، مٹی، موسم، یا کاشتکاری کے طریقوں کے بارے میں پوچھیں..."

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{language === "en" ? "Mali Agent AI" : "مالی ایجنٹ اے آئی"}</CardTitle>
        <Select
          value={language}
          onValueChange={(value: string) => {
            if (typeof window !== "undefined") {
              localStorage.setItem("language", value)
              setLanguage(value as "en" | "ur")
              window.location.reload()
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={language === "en" ? "Select Language" : "زبان منتخب کریں"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ur">اردو</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] mb-4 p-4 border rounded-md" ref={scrollAreaRef}>
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
              <div className="text-sm chat-message">{cleanTextForDisplay(message.content)}</div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderText}
            disabled={isLoading || isRecording}
            dir={language === "ur" ? "rtl" : "ltr"}
          />
          <Button type="submit" disabled={isLoading || isRecording} className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4" />
            <span className="sr-only">{language === "en" ? "Send" : "بھیجیں"}</span>
          </Button>
          <Button
            type="button"
            onClick={handleVoiceInput}
            disabled={isLoading || isRecording}
            variant="outline"
            className={`border-green-600 text-green-600 hover:bg-green-50 ${isRecording ? "bg-red-50" : ""}`}
          >
            {isRecording ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
            <span className="sr-only">{language === "en" ? "Voice input" : "آواز سے ان پٹ"}</span>
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
  )
}
