"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getVoiceDetails } from "@/lib/speech-utils"
import { Volume2, Loader2 } from "lucide-react"

interface VoiceInfo {
  name: string
  lang: string
  default: boolean
}

export default function VoiceTestPage() {
  const [voices, setVoices] = useState<VoiceInfo[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [text, setText] = useState<string>("Hello, this is a test of the speech synthesis.")
  const [urduText, setUrduText] = useState<string>("السلام علیکم، یہ تقریر کی جانچ ہے۔")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voiceDetails = await getVoiceDetails()
        setVoices(voiceDetails)

        // Set default voice
        if (voiceDetails.length > 0) {
          const defaultVoice = voiceDetails.find((v) => v.default) || voiceDetails[0]
          setSelectedVoice(defaultVoice.name)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading voices:", error)
        setIsLoading(false)
      }
    }

    loadVoices()
  }, [])

  const handleSpeak = async () => {
    if (!selectedVoice || isSpeaking) return

    setIsSpeaking(true)

    try {
      const utterance = new SpeechSynthesisUtterance(text)

      // Find the selected voice
      const voice = window.speechSynthesis.getVoices().find((v) => v.name === selectedVoice)
      if (voice) {
        utterance.voice = voice
      }

      // Set up event handlers
      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error("Speech error:", event)
        setIsSpeaking(false)
      }

      // Speak
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance)

      // Safety timeout
      setTimeout(() => {
        if (isSpeaking) setIsSpeaking(false)
      }, 10000)
    } catch (error) {
      console.error("Error speaking:", error)
      setIsSpeaking(false)
    }
  }

  const handleSpeakUrdu = async () => {
    if (isSpeaking) return

    setIsSpeaking(true)

    try {
      const utterance = new SpeechSynthesisUtterance(urduText)

      // Try to find an Urdu voice
      const voices = window.speechSynthesis.getVoices()
      const urduVoice = voices.find(
        (voice) =>
          voice.lang.toLowerCase() === "ur" ||
          voice.lang.toLowerCase() === "ur-pk" ||
          voice.lang.toLowerCase() === "ur-in" ||
          voice.name.toLowerCase().includes("urdu"),
      )

      if (urduVoice) {
        utterance.voice = urduVoice
      } else {
        // Try Hindi as fallback
        const hindiVoice = voices.find(
          (voice) => voice.lang.toLowerCase().startsWith("hi") || voice.name.toLowerCase().includes("hindi"),
        )

        if (hindiVoice) {
          utterance.voice = hindiVoice
        } else {
          // Set language code anyway
          utterance.lang = "ur-PK"
        }
      }

      // Set up event handlers
      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error("Speech error:", event)
        setIsSpeaking(false)
      }

      // Speak
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance)

      // Safety timeout
      setTimeout(() => {
        if (isSpeaking) setIsSpeaking(false)
      }, 10000)
    } catch (error) {
      console.error("Error speaking Urdu:", error)
      setIsSpeaking(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Voice Test</h1>

      <Card className="w-full max-w-3xl mx-auto mb-6">
        <CardHeader>
          <CardTitle>Available Voices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : voices.length === 0 ? (
            <p className="text-center py-4 text-red-600">No speech synthesis voices found in your browser.</p>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Select Voice</h3>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang}) {voice.default ? "- Default" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Test Text</h3>
                <Textarea value={text} onChange={(e) => setText(e.target.value)} className="mb-4" rows={3} />
                <Button
                  onClick={handleSpeak}
                  disabled={!selectedVoice || isSpeaking}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSpeaking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Speaking...
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 mr-2" />
                      Speak
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Urdu Voice Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Urdu Test Text</h3>
              <Textarea
                value={urduText}
                onChange={(e) => setUrduText(e.target.value)}
                className="mb-4"
                rows={3}
                dir="rtl"
              />
              <Button onClick={handleSpeakUrdu} disabled={isSpeaking} className="bg-blue-600 hover:bg-blue-700">
                {isSpeaking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Speaking...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Speak Urdu
                  </>
                )}
              </Button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded">
              <h3 className="font-medium mb-2">Urdu Voice Support</h3>
              <p className="text-sm">
                Most browsers don't have built-in Urdu voice support. This test will try to use:
              </p>
              <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                <li>A native Urdu voice if available</li>
                <li>A Hindi voice as fallback (similar script)</li>
                <li>The default voice with Urdu language code</li>
              </ol>
              <p className="text-sm mt-2">The quality may vary depending on your browser and operating system.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
