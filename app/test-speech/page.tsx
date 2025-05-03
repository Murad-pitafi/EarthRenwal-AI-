"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function TestSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [testMessage, setTestMessage] = useState(
    "Welcome to EarthRenewal.AI. This is a test of the speech synthesis functionality.",
  )

  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true)

      // Get available voices
      const getVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)

        // Set a default voice if available
        if (availableVoices.length > 0) {
          // Try to find an English voice
          const englishVoice = availableVoices.find((voice) => voice.lang.includes("en-"))
          setSelectedVoice(englishVoice?.name || availableVoices[0].name)
        }
      }

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices
      }

      getVoices()
    }
  }, [])

  const speakText = (text: string) => {
    if (!speechSupported) {
      toast({
        title: "Speech Synthesis Not Supported",
        description: "Your browser does not support speech synthesis.",
        variant: "destructive",
      })
      return
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      setIsSpeaking(true)

      const utterance = new SpeechSynthesisUtterance(text)

      // Set the selected voice if available
      if (selectedVoice) {
        const voice = voices.find((v) => v.name === selectedVoice)
        if (voice) {
          utterance.voice = voice
        }
      }

      utterance.rate = 1.0
      utterance.pitch = 1.0

      // Set up event handlers
      utterance.onend = () => {
        setIsSpeaking(false)
        toast({
          title: "Speech Complete",
          description: "The text has been spoken successfully.",
        })
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

      window.speechSynthesis.speak(utterance)
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

            {voices.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Select Voice:</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {voices.map((voice, index) => (
                    <option key={index} value={voice.name}>
                      {voice.name} ({voice.lang}) {voice.default ? "- Default" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Test Message:</label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <Button
              onClick={() => speakText(testMessage)}
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
          <CardTitle>Chatbot Speech Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              The chatbot's speech functionality uses the Web Speech API's SpeechSynthesis interface to convert text to
              speech. Here's how it works:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                When you click the speaker button in the chatbot, it takes the latest assistant message and passes it to
                the speech synthesis engine.
              </li>
              <li>
                The speech synthesis engine then converts the text to speech and plays it through your device's
                speakers.
              </li>
              <li>The implementation handles various states like speaking, errors, and completion.</li>
            </ul>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-semibold mb-2">Common Issues:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Some browsers may have limited speech synthesis support</li>
                <li>Voice quality varies across browsers and operating systems</li>
                <li>Language support depends on the available voices in your browser</li>
                <li>Mobile devices may have additional restrictions on audio playback</li>
              </ul>
            </div>

            <p>
              If the test above works but the chatbot speech doesn't, there might be an issue with how the speech
              function is being called in the Chatbot component.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
