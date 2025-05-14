"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ElevenLabsUrduTTS from "@/components/ElevenLabsUrduTTS"

export default function UrduSpeechElevenLabsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ElevenLabs Urdu TTS Test</h1>

      <Card>
        <CardHeader>
          <CardTitle>ElevenLabs Urdu Text-to-Speech</CardTitle>
        </CardHeader>
        <CardContent>
          <ElevenLabsUrduTTS />
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">About ElevenLabs TTS</h2>
        <p className="mb-4">
          This page demonstrates the ElevenLabs text-to-speech API for Urdu language. ElevenLabs provides high-quality,
          natural-sounding voices in multiple languages.
        </p>
        <p>The API is being used in the Mali Agent to provide spoken responses in Urdu.</p>
      </div>
    </div>
  )
}
