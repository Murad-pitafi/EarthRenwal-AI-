"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Volume2, Check, X, AlertTriangle } from "lucide-react"

export default function DebugUrduSpeechPage() {
  const [urduText, setUrduText] = useState("السلام علیکم، میں آپ کی مدد کیسے کر سکتا ہوں؟")
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyStatus, setApiKeyStatus] = useState<"checking" | "configured" | "missing" | "error">("checking")
  const [logs, setLogs] = useState<string[]>([])
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Add a log function
  const addLog = (message: string) => {
    console.log(message)
    setLogs((prev) => [...prev, `${new Date().toISOString().substring(11, 23)} - ${message}`])
  }

  useEffect(() => {
    // Check if API key is configured
    const checkApiKey = async () => {
      try {
        addLog("Checking Google API key configuration...")
        const response = await fetch("/api/test-google-api")
        const data = await response.json()

        if (data.success) {
          setApiKeyStatus("configured")
          addLog(`API key is configured. Length: ${data.keyInfo.length}, Masked: ${data.keyInfo.maskedKey}`)
        } else {
          setApiKeyStatus("missing")
          addLog(`API key error: ${data.error}`)
        }
      } catch (error) {
        setApiKeyStatus("error")
        addLog(`Error checking API key: ${error.message}`)
      }
    }

    checkApiKey()
  }, [])

  const handleTestDirectApi = async () => {
    if (!urduText.trim() || isLoading) return

    setIsLoading(true)
    addLog("Testing Google TTS API directly...")

    try {
      const response = await fetch("/api/google-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: urduText,
          language: "ur-PK",
        }),
      })

      addLog(`API Response status: ${response.status}`)

      if (!response.ok) {
        let errorText
        try {
          const errorData = await response.json()
          errorText = JSON.stringify(errorData)
        } catch (e) {
          errorText = await response.text()
        }
        addLog(`API Error: ${errorText}`)
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      addLog(`API Response received: ${JSON.stringify(data).substring(0, 100)}...`)

      if (!data.success || !data.audioContent) {
        addLog(`Invalid API response: ${JSON.stringify(data)}`)
        throw new Error("Invalid response from API")
      }

      addLog(`Audio content received, length: ${data.audioContent.length}`)

      // Create audio source
      const audioSource = `data:audio/mp3;base64,${data.audioContent}`
      setAudioSrc(audioSource)

      addLog("Audio source set, attempting to play...")

      // Wait for the next tick to ensure the audio element is updated
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load()

          audioRef.current.onloadeddata = () => {
            addLog("Audio loaded, playing...")
            audioRef.current
              ?.play()
              .then(() => addLog("Audio playback started"))
              .catch((err) => addLog(`Audio play error: ${err.message}`))
          }

          audioRef.current.onerror = (e) => {
            addLog(`Audio error: ${e}`)
            if (audioRef.current?.error) {
              addLog(`Audio error code: ${audioRef.current.error.code}, message: ${audioRef.current.error.message}`)
            }
          }
        } else {
          addLog("Audio element not found")
        }
      }, 100)
    } catch (error) {
      addLog(`Direct API test error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestServerSideApi = async () => {
    if (!urduText.trim() || isLoading) return

    setIsLoading(true)
    addLog("Testing server-side Urdu speech API...")

    try {
      const response = await fetch("/api/urdu-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: urduText,
        }),
      })

      addLog(`API Response status: ${response.status}`)

      if (!response.ok) {
        let errorText
        try {
          const errorData = await response.json()
          errorText = JSON.stringify(errorData)
        } catch (e) {
          errorText = await response.text()
        }
        addLog(`API Error: ${errorText}`)
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      addLog(`API Response received: ${JSON.stringify(data).substring(0, 100)}...`)

      if (!data.success || !data.audioContent) {
        addLog(`Invalid API response: ${JSON.stringify(data)}`)
        throw new Error("Invalid response from API")
      }

      addLog(`Audio content received, length: ${data.audioContent.length}`)

      // Create audio source
      const audioSource = `data:audio/mp3;base64,${data.audioContent}`
      setAudioSrc(audioSource)

      addLog("Audio source set, attempting to play...")

      // Wait for the next tick to ensure the audio element is updated
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load()

          audioRef.current.onloadeddata = () => {
            addLog("Audio loaded, playing...")
            audioRef.current
              ?.play()
              .then(() => addLog("Audio playback started"))
              .catch((err) => addLog(`Audio play error: ${err.message}`))
          }

          audioRef.current.onerror = (e) => {
            addLog(`Audio error: ${e}`)
            if (audioRef.current?.error) {
              addLog(`Audio error code: ${audioRef.current.error.code}, message: ${audioRef.current.error.message}`)
            }
          }
        } else {
          addLog("Audio element not found")
        }
      }, 100)
    } catch (error) {
      addLog(`Server-side API test error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestFallbackMethod = async () => {
    if (!urduText.trim() || isLoading) return

    setIsLoading(true)
    addLog("Testing fallback method (using HTML5 audio element)...")

    try {
      const response = await fetch("/api/google-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: urduText,
          language: "ur-PK",
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.audioContent) {
        throw new Error("Invalid response from API")
      }

      addLog(`Audio content received, creating blob...`)

      // Convert base64 to blob
      const byteCharacters = atob(data.audioContent)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "audio/mp3" })

      // Create object URL
      const url = URL.createObjectURL(blob)
      addLog(`Blob URL created: ${url}`)

      setAudioSrc(url)

      // Wait for the next tick to ensure the audio element is updated
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load()

          audioRef.current.onloadeddata = () => {
            addLog("Audio loaded, playing...")
            audioRef.current
              ?.play()
              .then(() => addLog("Audio playback started"))
              .catch((err) => addLog(`Audio play error: ${err.message}`))
          }
        }
      }, 100)
    } catch (error) {
      addLog(`Fallback method error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Debug Urdu Speech</h1>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Urdu Speech Debugging</span>
            <div className="flex items-center">
              <span className="text-sm mr-2">API Key:</span>
              {apiKeyStatus === "checking" ? (
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              ) : apiKeyStatus === "configured" ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : apiKeyStatus === "missing" ? (
                <X className="h-5 w-5 text-red-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Urdu Text</h3>
            <Textarea value={urduText} onChange={(e) => setUrduText(e.target.value)} dir="rtl" className="h-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleTestDirectApi} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Volume2 className="h-4 w-4 mr-2" />}
              Test Direct API
            </Button>

            <Button
              onClick={handleTestServerSideApi}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Volume2 className="h-4 w-4 mr-2" />}
              Test Server-Side API
            </Button>

            <Button
              onClick={handleTestFallbackMethod}
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Volume2 className="h-4 w-4 mr-2" />}
              Test Fallback Method
            </Button>
          </div>

          {audioSrc && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Audio Player</h3>
              <audio ref={audioRef} controls className="w-full">
                <source src={audioSrc} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Debug Logs</h3>
            <div className="bg-gray-100 p-3 rounded h-64 overflow-auto font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Click one of the buttons above to test.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className={`mb-1 ${log.includes("Error") ? "text-red-600" : ""}`}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
