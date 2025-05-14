"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function TestGoogleTTS() {
  const [text, setText] = useState("السلام علیکم! میں آپ کا زرعی اے آئی اسسٹنٹ ہوں۔")
  const [language, setLanguage] = useState("ur-PK")
  const [isLoading, setIsLoading] = useState(false)

  const handleSpeak = async () => {
    if (!text.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/google-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate speech")
      }

      const data = await response.json()

      if (!data.success || !data.audioContent) {
        throw new Error("Invalid response from TTS API")
      }

      // Play the audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`)
      audio.play()

      toast({
        title: "Success",
        description: "Speech generated successfully",
      })
    } catch (error) {
      console.error("Google TTS error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate speech",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Google Text-to-Speech Test</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Google Cloud TTS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Language:</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ur-PK">Urdu (Pakistan)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="hi-IN">Hindi (India)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Text to speak:</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              dir={language === "ur-PK" ? "rtl" : "ltr"}
              className="w-full"
            />
          </div>

          <Button onClick={handleSpeak} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating speech...
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" />
                Speak with Google TTS
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Google Cloud Text-to-Speech</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This page demonstrates the Google Cloud Text-to-Speech API integration. It provides high-quality speech
            synthesis for languages that might not be supported by the browser's built-in speech synthesis.
          </p>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>High-quality neural voices</li>
              <li>Support for 220+ voices across 40+ languages and variants</li>
              <li>Excellent Urdu language support</li>
              <li>Adjustable speaking rate and pitch</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="font-semibold mb-2">Cost Information:</h3>
            <p>Google Cloud TTS is a paid service with the following pricing:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Standard voices: $4 per 1 million characters</li>
              <li>WaveNet/Neural voices: $16 per 1 million characters</li>
              <li>New Google Cloud accounts get $300 in free credits</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
