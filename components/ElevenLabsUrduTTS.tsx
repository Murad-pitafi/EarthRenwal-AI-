"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, CheckCircleIcon, AlertTriangleIcon, Volume2Icon, Loader2 } from "lucide-react"

export default function ElevenLabsUrduTTS() {
  const [text, setText] = useState("السلام علیکم، میں آپ کی مدد کیسے کر سکتا ہوں؟")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  // Add a sample text dropdown to make it easier to test
  // Add this after the useState declarations
  const sampleTexts = [
    {
      label: "Greeting",
      text: "السلام علیکم، میں آپ کی مدد کیسے کر سکتا ہوں؟",
    },
    {
      label: "Weather",
      text: "آج موسم بہت اچھا ہے۔ آسمان صاف ہے اور دھوپ نکلی ہوئی ہے۔",
    },
    {
      label: "Farming",
      text: "فصل کی کاشت کے لیے مٹی کی نمی کا مناسب ہونا ضروری ہے۔",
    },
  ]

  const generateSpeech = async () => {
    if (!text.trim()) {
      setStatus("error")
      setMessage("Please enter some text")
      return
    }

    setStatus("loading")
    setMessage("Generating speech...")

    try {
      // Clean up previous audio URL if it exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
      }

      // Call our API endpoint
      const response = await fetch("/api/elevenlabs-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language: "ur", // Specify Urdu language
        }),
      })

      if (!response.ok) {
        let errorMessage = "Failed to generate speech"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `HTTP error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Get the audio blob
      const audioBlob = await response.blob()

      // Create a URL for the audio blob
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      // Set up the audio element
      if (audioRef.current) {
        audioRef.current.src = url

        // Play the audio
        try {
          await audioRef.current.play()
          setStatus("success")
          setMessage("Speech generated successfully")
        } catch (playError) {
          console.error("Error playing audio:", playError)
          setStatus("error")
          setMessage(`Error playing audio: ${playError.message}. Try clicking the play button manually.`)
        }
      }
    } catch (error) {
      console.error("Error generating speech:", error)
      setStatus("error")
      setMessage(`Error: ${error.message}`)
    }
  }

  // Add this function after the generateSpeech function
  const selectSampleText = (sample: string) => {
    setText(sample)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Urdu Text-to-Speech with ElevenLabs</h1>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>ElevenLabs TTS</AlertTitle>
        <AlertDescription>
          This page uses ElevenLabs' API for high-quality multilingual text-to-speech, including Urdu.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Urdu Speech</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Enter Urdu text to convert to speech"
              className="mb-4"
            />
            {/* Add this UI element after the Textarea */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Sample texts:</p>
              <div className="flex flex-wrap gap-2">
                {sampleTexts.map((sample, index) => (
                  <Button key={index} variant="outline" size="sm" onClick={() => selectSampleText(sample.text)}>
                    {sample.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={generateSpeech} disabled={status === "loading"} className="flex-1">
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Volume2Icon className="mr-2 h-4 w-4" />
                    Generate Speech
                  </>
                )}
              </Button>

              {audioUrl && (
                <Button variant="outline" onClick={() => audioRef.current?.play()} className="flex-1">
                  <Volume2Icon className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
              )}
            </div>

            {/* Hidden audio element */}
            <audio ref={audioRef} controls className={audioUrl ? "w-full mt-4" : "hidden"} />
          </div>
        </CardContent>
      </Card>

      {status !== "idle" && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            {status === "loading" && (
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Processing</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <Alert>
                <CheckCircleIcon className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About ElevenLabs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            ElevenLabs provides state-of-the-art text-to-speech technology with multilingual support. Their API can
            handle Urdu and many other languages with natural-sounding voices.
          </p>
          <p className="mt-2">
            <strong>Note:</strong> This demo uses a limited API key. For production use, you should{" "}
            <a
              href="https://elevenlabs.io/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              sign up for an ElevenLabs account
            </a>{" "}
            and use your own API key.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
