"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react"

export default function TestGoogleClient() {
  const [text, setText] = useState("السلام علیکم، میں آپ کی مدد کیسے کر سکتا ہوں؟")
  const [language, setLanguage] = useState("ur-PK")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [audioSrc, setAudioSrc] = useState("")

  const testGoogleTTS = async () => {
    setStatus("loading")
    setMessage("Sending request to Google Cloud TTS...")
    setAudioSrc("")

    try {
      const response = await fetch("/api/google-tts-client", {
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
        throw new Error(errorData.details || `HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.audioContent) {
        throw new Error("Invalid response: No audio content")
      }

      setAudioSrc(`data:audio/mp3;base64,${data.audioContent}`)
      setStatus("success")
      setMessage("Speech generated successfully!")
    } catch (error) {
      console.error("Error:", error)
      setStatus("error")
      setMessage(`Error: ${error.message}`)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Google Cloud TTS Client Test</h1>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          This test requires a Google Cloud service account key. Make sure you have set the
          GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of your service account key file.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Google Cloud Text-to-Speech</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., ur-PK, en-US"
              />
            </div>
            <div>
              <Label htmlFor="text">Text to Speak</Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="Enter text to convert to speech"
              />
            </div>
            <Button onClick={testGoogleTTS} disabled={status === "loading"}>
              {status === "loading" ? "Generating..." : "Generate Speech"}
            </Button>
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
              <>
                <Alert className="mb-4">
                  <CheckCircleIcon className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>

                <div className="mt-4">
                  <Label htmlFor="audio-player">Generated Audio</Label>
                  <audio id="audio-player" controls src={audioSrc} className="w-full mt-2" autoPlay />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
