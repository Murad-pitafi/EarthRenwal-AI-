"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { speakText, isUrduSupported } from "@/lib/speech-utils"
import { Loader2 } from "lucide-react"

export default function UrduTTSTest() {
  const [loading, setLoading] = useState(false)
  const [urduSupported, setUrduSupported] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("")

  useEffect(() => {
    const checkUrduSupport = async () => {
      try {
        const supported = await isUrduSupported()
        setUrduSupported(supported)
        setStatus(
          `Urdu ${supported ? "is" : "is not"} supported by your browser. ${supported ? "Will use browser TTS." : "Will use Google Cloud TTS."}`,
        )
      } catch (err) {
        console.error("Error checking Urdu support:", err)
        setUrduSupported(false)
        setStatus("Error checking Urdu support. Will use Google Cloud TTS.")
      }
    }

    checkUrduSupport()
  }, [])

  const testUrduSpeech = async () => {
    setLoading(true)
    setError(null)
    setStatus("Testing Urdu speech...")

    try {
      // Simple Urdu greeting
      await speakText("السلام علیکم، میں آپ کی مدد کیسے کر سکتا ہوں؟", "ur")
      setStatus("Urdu speech test completed successfully!")
    } catch (err) {
      console.error("Error testing Urdu speech:", err)
      setError(`Error: ${err.message || "Unknown error"}`)
      setStatus("Urdu speech test failed.")
    } finally {
      setLoading(false)
    }
  }

  const testEnglishSpeech = async () => {
    setLoading(true)
    setError(null)
    setStatus("Testing English speech...")

    try {
      await speakText("Hello, how can I help you today?", "en")
      setStatus("English speech test completed successfully!")
    } catch (err) {
      console.error("Error testing English speech:", err)
      setError(`Error: ${err.message || "Unknown error"}`)
      setStatus("English speech test failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Urdu TTS Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <p>Status: {status || "Checking Urdu support..."}</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <Button onClick={testUrduSpeech} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Test Urdu Speech (Google TTS)
          </Button>

          <Button onClick={testEnglishSpeech} disabled={loading} variant="outline" className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Test English Speech (Browser TTS)
          </Button>
        </div>

        <div className="text-sm mt-4">
          <p className="font-medium">Urdu Test Phrase:</p>
          <p dir="rtl" className="mt-1">
            السلام علیکم، میں آپ کی مدد کیسے کر سکتا ہوں؟
          </p>
          <p className="text-gray-500 mt-1">(Translation: "Hello, how can I help you?")</p>
        </div>
      </CardContent>
    </Card>
  )
}
