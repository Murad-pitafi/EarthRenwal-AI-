"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getVoices, findBestVoice, speakText } from "@/lib/speech-utils"

export default function TestSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en")
  const [testMessage, setTestMessage] = useState(
    "Welcome to EarthRenewal.AI. This is a test of the speech synthesis functionality.",
  )
  const [urduTestMessage, setUrduTestMessage] = useState(
    "ارتھ رینیول اے آئی میں خوش آمدید۔ یہ تقریر کی صلاحیت کا ٹیسٹ ہے۔",
  )

  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true)

      // Get available voices
      const loadVoices = async () => {
        const availableVoices = await getVoices()
        setVoices(availableVoices)

        // Set a default voice if available
        if (availableVoices.length > 0) {
          // Try to find an English voice
          const englishVoice = await findBestVoice("en")
          if (englishVoice) {
            setSelectedVoice(englishVoice.name)
          } else {
            setSelectedVoice(availableVoices[0].name)
          }
        }
      }

      loadVoices()
    }
  }, [])

  const handleSpeakText = async () => {
    if (!speechSupported) {
      toast({
        title: "Speech Synthesis Not Supported",
        description: "Your browser does not support speech synthesis.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSpeaking(true)

      // Use the appropriate message based on selected language
      const textToSpeak = selectedLanguage === "ur" ? urduTestMessage : testMessage

      // Speak the text using our utility
      await speakText(textToSpeak, selectedLanguage)

      setIsSpeaking(false)
      toast({
        title: "Speech Complete",
        description: "The text has been spoken successfully.",
      })
    } catch (error) {
      console.error("Error in text-to-speech:", error)
      setIsSpeaking(false)
      toast({
        title: "Speech Error",
        description: "An error occurred during speech synthesis.",
        variant: "destructive",
      })
    }
  }

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value)
  }

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value
    setSelectedLanguage(lang)

    // Find best voice for selected language
    const bestVoice = await findBestVoice(lang)
    if (bestVoice) {
      setSelectedVoice(bestVoice.name)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Speech Synthesis Test</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Speech Synthesis Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Speech Synthesis Support:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${speechSupported ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {speechSupported ? "Supported" : "Not Supported"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Available Voices:</span>
              <span>{voices.length}</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Language:</label>
              <select value={selectedLanguage} onChange={handleLanguageChange} className="w-full p-2 border rounded">
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            {voices.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Select Voice:</label>
                <select value={selectedVoice} onChange={handleVoiceChange} className="w-full p-2 border rounded">
                  {voices.map((voice, index) => (
                    <option key={index} value={voice.name}>
                      {voice.name} ({voice.lang}) {voice.default ? "- Default" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Test Message ({selectedLanguage === "ur" ? "Urdu" : "English"}):
              </label>
              <textarea
                value={selectedLanguage === "ur" ? urduTestMessage : testMessage}
                onChange={(e) =>
                  selectedLanguage === "ur" ? setUrduTestMessage(e.target.value) : setTestMessage(e.target.value)
                }
                className="w-full p-2 border rounded"
                rows={3}
                dir={selectedLanguage === "ur" ? "rtl" : "ltr"}
              />
            </div>

            <Button
              onClick={handleSpeakText}
              disabled={!speechSupported || isSpeaking}
              className="flex items-center gap-2"
            >
              {isSpeaking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Speaking...
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Speak Text
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Urdu Speech Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>The application now has improved support for Urdu speech synthesis. Here's how it works:</p>

            <ul className="list-disc pl-5 space-y-2">
              <li>The system first tries to find a native Urdu voice (ur, ur-PK, or ur-IN language codes).</li>
              <li>If no Urdu voice is available, it falls back to Hindi voices (similar language region).</li>
              <li>
                If no Hindi voice is found, it tries any South Asian voice (with 'in' or 'pk' in the language code).
              </li>
              <li>As a last resort, it uses the default system voice.</li>
            </ul>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-semibold mb-2">Voice Availability:</h3>
              <p>
                Voice availability depends on your operating system and browser. Windows, macOS, Android, and iOS all
                have different built-in voices. You may need to install additional language packs on your operating
                system to get better Urdu voice support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
