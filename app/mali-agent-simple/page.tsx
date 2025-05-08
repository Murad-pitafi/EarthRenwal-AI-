"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Volume2 } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { toast } from "@/components/ui/use-toast"

export default function MaliAgentSimple() {
  const { language } = useUser()
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, language }),
      })

      if (!res.ok) throw new Error("Failed to get response")

      const data = await res.json()
      setResponse(data.response || "")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: language === "en" ? "Error" : "خرابی",
        description: language === "en" ? "Failed to get response" : "جواب حاصل کرنے میں ناکام",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

        // Fallback to browser TTS as last resort
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = language === "en" ? "en-US" : "ur-PK"
          window.speechSynthesis.speak(utterance)
        }
      }

      await audio.play()
    } catch (error) {
      console.error("Speech error:", error)
      setIsSpeaking(false)
      toast({
        title: language === "en" ? "Speech Error" : "تقریر میں خرابی",
        description: language === "en" ? "Could not play speech" : "تقریر نہیں چل سکی",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{language === "en" ? "Simple Mali Agent" : "سادہ مالی ایجنٹ"}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{language === "en" ? "Ask a Question" : "سوال پوچھیں"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "en"
                  ? "Ask about crops, soil, weather, or farming practices..."
                  : "فصلوں، مٹی، موسم، یا کاشتکاری کے طریقوں کے بارے میں پوچھیں..."
              }
              disabled={isLoading}
              dir={language === "ur" ? "rtl" : "ltr"}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {language === "en" ? "Processing..." : "پروسیسنگ..."}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {language === "en" ? "Send" : "بھیجیں"}
                  </>
                )}
              </Button>

              {response && (
                <Button
                  type="button"
                  onClick={() => speakText(response)}
                  disabled={isLoading || isSpeaking}
                  variant="outline"
                  className={`border-blue-600 text-blue-600 hover:bg-blue-50 ${isSpeaking ? "bg-blue-100" : ""}`}
                >
                  {isSpeaking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {language === "en" ? "Speaking..." : "بول رہا ہے..."}
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 mr-2" />
                      {language === "en" ? "Speak Response" : "جواب بولیں"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Response" : "جواب"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-md whitespace-pre-line">{response}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
