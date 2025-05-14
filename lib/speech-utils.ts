// Speech synthesis utility functions

// Cache for available voices
let availableVoices: SpeechSynthesisVoice[] = []
let voicesLoaded = false
let urduSupported = false

// Function to get all available voices
export const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([])
      return
    }

    // If voices are already loaded, return them
    if (voicesLoaded && availableVoices.length > 0) {
      resolve(availableVoices)
      return
    }

    // Get voices that are already available
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      availableVoices = voices
      voicesLoaded = true

      // Check if any Urdu voice is available
      urduSupported = voices.some(
        (voice) =>
          voice.lang.toLowerCase() === "ur" ||
          voice.lang.toLowerCase() === "ur-pk" ||
          voice.lang.toLowerCase() === "ur-in" ||
          voice.name.toLowerCase().includes("urdu"),
      )

      console.log(`Urdu voice supported by browser: ${urduSupported}`)

      resolve(voices)
      return
    }

    // If voices aren't loaded yet, wait for the voiceschanged event
    const voicesChangedHandler = () => {
      const newVoices = window.speechSynthesis.getVoices()
      availableVoices = newVoices
      voicesLoaded = true

      // Check if any Urdu voice is available
      urduSupported = newVoices.some(
        (voice) =>
          voice.lang.toLowerCase() === "ur" ||
          voice.lang.toLowerCase() === "ur-pk" ||
          voice.lang.toLowerCase() === "ur-in" ||
          voice.name.toLowerCase().includes("urdu"),
      )

      console.log(`Urdu voice supported by browser: ${urduSupported}`)

      window.speechSynthesis.removeEventListener("voiceschanged", voicesChangedHandler)
      resolve(newVoices)
    }

    window.speechSynthesis.addEventListener("voiceschanged", voicesChangedHandler)
  })
}

// Function to find the best voice for a language
export const findBestVoice = async (language: string): Promise<SpeechSynthesisVoice | null> => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null
  }

  const voices = await getVoices()

  // Debug available voices
  console.log(`Available voices: ${voices.length}`)
  voices.forEach((v) => console.log(`Voice: ${v.name}, Lang: ${v.lang}, Default: ${v.default}`))

  // For Urdu, try exact matches only - no fallbacks to Hindi
  if (language === "ur") {
    // Try exact Urdu matches
    const urduVoice = voices.find(
      (voice) =>
        voice.lang.toLowerCase() === "ur" ||
        voice.lang.toLowerCase() === "ur-pk" ||
        voice.lang.toLowerCase() === "ur-in" ||
        voice.name.toLowerCase().includes("urdu"),
    )

    if (urduVoice) {
      console.log(`Found Urdu voice: ${urduVoice.name}`)
      return urduVoice
    }

    // No fallbacks to Hindi - return null to trigger Google TTS
    console.log(`No Urdu voice found, will use Google TTS`)
    return null
  }

  // For English or other languages
  const exactMatch = voices.find((voice) => voice.lang.toLowerCase().startsWith(language.toLowerCase()))
  if (exactMatch) return exactMatch

  // Default to first voice or null if none available
  return voices.find((voice) => voice.default) || voices[0] || null
}

// Function to speak text with the appropriate voice
export const speakText = async (text: string, language: string): Promise<void> => {
  if (typeof window === "undefined") {
    console.error("Window not available")
    return
  }

  try {
    // For Urdu, check if browser supports it
    if (language === "ur") {
      // First check if browser has Urdu voice
      await getVoices() // Ensure voices are loaded

      // If Urdu is not supported by browser, use Google TTS
      if (!urduSupported) {
        console.log("Browser does not support Urdu, using Google TTS")
        return await speakWithGoogleTTS(text, "ur-PK")
      }

      // If we get here, browser has Urdu support, so try to use it
      console.log("Browser supports Urdu, attempting to use browser TTS")
    }

    // Use browser TTS for English and other languages, or if Urdu is supported
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text)

      // Find the best voice for the language
      const voice = await findBestVoice(language)
      if (voice) {
        utterance.voice = voice
        console.log(`Using browser voice: ${voice.name} (${voice.lang})`)
      } else {
        // If no voice found for Urdu, use Google TTS
        if (language === "ur") {
          console.log("No suitable browser voice found for Urdu, using Google TTS")
          return await speakWithGoogleTTS(text, "ur-PK")
        }
        console.warn(`No voice found for language: ${language}`)
      }

      // Set speech parameters
      utterance.rate = language === "ur" ? 0.9 : 1.0 // Slightly slower for Urdu
      utterance.pitch = 1.0

      // Speak the text
      window.speechSynthesis.speak(utterance)

      return new Promise((resolve, reject) => {
        utterance.onend = () => {
          console.log("Speech completed successfully")
          resolve()
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)

          // If browser TTS fails for Urdu, try Google TTS
          if (language === "ur") {
            console.log("Browser TTS failed for Urdu, falling back to Google TTS")
            speakWithGoogleTTS(text, "ur-PK").then(resolve).catch(reject)
          } else {
            reject(new Error("Speech synthesis failed"))
          }
        }
      })
    } else {
      // If browser doesn't support speech synthesis at all, use Google TTS API only for Urdu
      if (language === "ur") {
        console.log("Browser doesn't support speech synthesis, using Google TTS for Urdu")
        return await speakWithGoogleTTS(text, "ur-PK")
      } else {
        throw new Error("Speech synthesis not supported in this browser")
      }
    }
  } catch (error) {
    console.error("Error in text-to-speech:", error)

    // Final fallback for Urdu - if all else fails, try Google TTS
    if (language === "ur") {
      console.log("Error in browser TTS for Urdu, falling back to Google TTS")
      return await speakWithGoogleTTS(text, "ur-PK").catch((e) => {
        console.error("Google TTS also failed:", e)
        throw e
      })
    }

    throw error
  }
}

// Function to use Google TTS API for speech (only for Urdu)
export const speakWithGoogleTTS = async (text: string, languageCode: string): Promise<void> => {
  try {
    console.log(`Using Google TTS API for ${languageCode} speech with ur-PK-Standard-A voice`)

    // Call our API endpoint
    const response = await fetch("/api/google-tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        language: languageCode,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(errorData.error || `Failed to generate speech: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success || !data.audioContent) {
      throw new Error("Invalid response from TTS API")
    }

    // Play the audio
    const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`)

    // Add error handling for audio loading
    audio.onerror = (e) => {
      console.error("Error loading audio:", e)
    }

    // Start loading the audio
    audio.load()

    // Play when ready
    const playPromise = audio.play()

    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("Audio playback failed:", error)
      })
    }

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        console.log("Google TTS audio playback completed")
        resolve()
      }

      audio.onerror = (error) => {
        console.error("Audio playback error:", error)
        reject(new Error("Audio playback failed"))
      }
    })
  } catch (error) {
    console.error("Google TTS error:", error)
    throw error
  }
}

// Check if Urdu is supported by the browser
export const isUrduSupported = async (): Promise<boolean> => {
  await getVoices() // Make sure voices are loaded
  return urduSupported
}
