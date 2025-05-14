"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { speakText, speakWithGoogleTTS } from "@/lib/speech-utils"
import { Loader2, Volume2 } from "lucide-react"

export default function UrduTTSTest() {
  const [urduText, setUrduText] = useState("السلام علیکم، میں آپ کی مدد کیسے کر سکتا ہوں؟")
  const [englishText, setEnglishText] = useState("Hello, how can I help you today?")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [apiKeyStatus, setApiKeyStatus] = useState<"checking" | "configured" | "missing" | "error">("checking")
  const [logs, setLogs] = useState<string[]>([])

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

  const handleSpeakUrdu = async () => {
    if (!urduText.trim() || isSpeaking) return

    setIsSpeaking(true)
    addLog("Starting Urdu speech...")

    try {
      // Override console.log to capture logs
      const originalConsoleLog = console.log
      const originalConsoleError = console.error

      console.log = (message, ...args) => {
        originalConsoleLog(message, ...args)
        if (typeof message === "string") {
          addLog(message)
        } else {
          addLog(String(message))
        }
      }

      console.error = (message, ...args) => {
        originalConsoleError(message, ...args)
        if (typeof message === "string") {
          addLog(`ERROR: ${message}`)
        } else {
          addLog(`ERROR: ${String(message)}`)
        }
      }

      await speakText(urduText, "ur")
      addLog("Urdu speech completed")

      // Restore console functions
      console.log = originalConsoleLog
      console.error = originalConsoleError
    } catch (error) {
      addLog(`Urdu speech error: ${error.message}`)
    } finally {
      setIsSpeaking(false)
    }
  }

  const handleSpeakEnglish = async () => {
    if (!englishText.trim() || isSpeaking) return

    setIsSpeaking(true)
    addLog("Starting English speech...")

    try {
      await speakText(englishText, "en")
      addLog("English speech completed")
    } catch (error) {
      addLog(`English speech error: ${error.message}`)
    } finally {
      setIsSpeaking(false)
    }
  }

  const handleForceGoogleTTS = async () => {
    if (!urduText.trim() || isSpeaking) return

    setIsSpeaking(true)
    addLog("Forcing Google TTS API for Urdu...")

    try {
      // Override console.log to capture logs
      const originalConsoleLog = console.log
      const originalConsoleError = console.error

      console.log = (message, ...args) => {
        originalConsoleLog(message, ...args)
        if (typeof message === "string") {
          addLog(message)
        } else {
          addLog(String(message))
        }
      }

      console.error = (message, ...args) => {
        originalConsoleError(message, ...args)
        if (typeof message === "string") {
          addLog(`ERROR: ${message}`)
        } else {
          addLog(`ERROR: ${String(message)}`)
        }
      }

      // Directly call Google TTS
      await speakWithGoogleTTS(urduText, "ur-PK")
      addLog("Google TTS completed")

      // Restore console functions
      console.log = originalConsoleLog
      console.error = originalConsoleError
    } catch (error) {
      addLog(`Google TTS error: ${error.message}`)
    } finally {
      setIsSpeaking(false)
    }
  }

  const handleTestGoogleTTSDirectly = async () => {
    if (isSpeaking) return

    setIsSpeaking(true)
    addLog("Testing Google TTS API directly...")

    try {
      const response = await fetch("/api/google-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "تیسٹ میسج",
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

      // Play the audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`)

      audio.addEventListener("loadstart", () => addLog("Audio loading started"))
      audio.addEventListener("loadeddata", () => addLog("Audio data loaded"))
      audio.addEventListener("canplay", () => addLog("Audio can play"))
      audio.addEventListener("playing", () => addLog("Audio playback started"))

      audio.onerror = (e) => {
        addLog(`Audio error: ${e}`)
        if (audio.error) {
          addLog(`Audio error code: ${audio.error.code}, message: ${audio.error.message}`)
        }
      }

      addLog("Loading audio...")
      audio.load()

      addLog("Playing audio...")
      await audio.play()

      addLog("Audio playback started")
    } catch (error) {
      addLog(`Direct Google TTS test error: ${error.message}`)
    } finally {
      setIsSpeaking(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Urdu Text-to-Speech Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="mb-2 font-medium">
            Google API Key:{" "}
            {apiKeyStatus === "checking"
              ? "Checking..."
              : apiKeyStatus === "configured"
                ? "✅ Configured"
                : apiKeyStatus === "missing"
                  ? "❌ Missing"
                  : "⚠️ Error checking"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Urdu Text</h3>
              <Textarea value={urduText} onChange={(e) => setUrduText(e.target.value)} dir="rtl" className="h-24" />
              <Button onClick={handleSpeakUrdu} disabled={isSpeaking} className="w-full">
                {isSpeaking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Volume2 className="h-4 w-4 mr-2" />}
                Speak Urdu Text
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">English Text</h3>
              <Textarea value={englishText} onChange={(e) => setEnglishText(e.target.value)} className="h-24" />
              <Button onClick={handleSpeakEnglish} disabled={isSpeaking} className="w-full">
                {isSpeaking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Volume2 className="h-4 w-4 mr-2" />}
                Speak English Text
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Button
              onClick={handleForceGoogleTTS}
              disabled={isSpeaking}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSpeaking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Volume2 className="h-4 w-4 mr-2" />}
              Force Google TTS for Urdu
            </Button>

            <Button
              onClick={handleTestGoogleTTSDirectly}
              disabled={isSpeaking}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {isSpeaking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Volume2 className="h-4 w-4 mr-2" />}
              Test Google TTS API Directly
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Debug Logs</h3>
          <div className="bg-gray-100 p-3 rounded h-64 overflow-auto font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Click one of the buttons above to test.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`mb-1 ${log.includes("ERROR") ? "text-red-600" : ""}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
