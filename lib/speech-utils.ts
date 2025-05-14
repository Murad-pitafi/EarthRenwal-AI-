// Speech synthesis utility functions

// Cache for available voices
let availableVoices: SpeechSynthesisVoice[] = []
let voicesLoaded = false

// Function to get all available voices
export const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.log("Speech synthesis not available")
      resolve([])
      return
    }

    // If voices are already loaded, return them
    if (voicesLoaded && availableVoices.length > 0) {
      console.log(`Returning cached voices (${availableVoices.length})`)
      resolve(availableVoices)
      return
    }

    // Get voices that are already available
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      availableVoices = voices
      voicesLoaded = true
      console.log(`Loaded ${voices.length} voices`)
      resolve(voices)
      return
    }

    // If voices aren't loaded yet, wait for the voiceschanged event
    console.log("Waiting for voices to load...")
    const voicesChangedHandler = () => {
      const newVoices = window.speechSynthesis.getVoices()
      availableVoices = newVoices
      voicesLoaded = true
      console.log(`Voices changed event: ${newVoices.length} voices`)
      window.speechSynthesis.removeEventListener("voiceschanged", voicesChangedHandler)
      resolve(newVoices)
    }

    window.speechSynthesis.addEventListener("voiceschanged", voicesChangedHandler)
  })
}

// Function to find the best voice for a language (only used for non-Urdu languages)
export const findBestVoice = async (language: string): Promise<SpeechSynthesisVoice | null> => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.log("Speech synthesis not available")
    return null
  }

  // For Urdu, we always want to use Google TTS API
  if (language === "ur") {
    console.log("Urdu language requested - will use Google TTS API instead of browser voices")
    return null
  }

  const voices = await getVoices()

  // Debug available voices
  console.log(`Finding voice for language: ${language}`)
  console.log(`Available voices: ${voices.length}`)

  // For English or other languages
  const exactMatch = voices.find((voice) => voice.lang.toLowerCase().startsWith(language.toLowerCase()))
  if (exactMatch) {
    console.log(`Found exact match for ${language}: ${exactMatch.name}`)
    return exactMatch
  }

  // Default to first voice or null if none available
  const defaultVoice = voices.find((voice) => voice.default) || voices[0] || null
  console.log(`Using default voice: ${defaultVoice?.name || "none"}`)
  return defaultVoice
}

// Function to speak text with the appropriate voice
export const speakText = async (text: string, language: string): Promise<void> => {
  console.log(`Speaking text in ${language}: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`)

  if (typeof window === "undefined") {
    console.error("Window not available")
    return
  }

  try {
    // ALWAYS use Google TTS for Urdu, regardless of browser support
    if (language === "ur") {
      console.log("Urdu language detected - using Google TTS API directly")
      return await speakWithGoogleTTS(text, "ur-PK")
    }

    // Use browser TTS for English and other languages
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
        console.warn(`No voice found for language: ${language}`)
      }

      // Set speech parameters
      utterance.rate = 1.0
      utterance.pitch = 1.0

      // Speak the text
      console.log("Starting browser speech synthesis...")
      window.speechSynthesis.speak(utterance)

      return new Promise((resolve, reject) => {
        utterance.onend = () => {
          console.log("Browser speech completed successfully")
          resolve()
        }

        utterance.onerror = (event) => {
          console.error("Browser speech synthesis error:", event)
          reject(new Error("Speech synthesis failed"))
        }
      })
    } else {
      throw new Error("Speech synthesis not supported in this browser")
    }
  } catch (error) {
    console.error("Error in text-to-speech:", error)
    throw error
  }
}

// Function to use Google TTS API for speech (only for Urdu)
export const speakWithGoogleTTS = async (text: string, languageCode: string): Promise<void> => {
  console.log(`Using Google TTS API for ${languageCode} speech with ur-PK-Standard-A voice`)
  console.log(`Text to speak: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`)

  try {
    // Call our API endpoint
    console.log("Sending request to /api/google-tts...")
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

    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      let errorMessage = "Unknown error"
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorData.details || `HTTP error ${response.status}`
        console.error("TTS API error response:", errorData)
      } catch (e) {
        console.error("Failed to parse error response:", e)
      }
      throw new Error(`Failed to generate speech: ${errorMessage}`)
    }

    let data
    try {
      data = await response.json()
      console.log("TTS API response received:", data.success ? "Success" : "Failed")
    } catch (e) {
      console.error("Failed to parse JSON response:", e)
      throw new Error("Invalid JSON response from TTS API")
    }

    if (!data.success || !data.audioContent) {
      console.error("Invalid TTS API response:", data)
      throw new Error("Invalid response from TTS API: No audio content")
    }

    console.log(`Audio content received, length: ${data.audioContent.length}`)

    // Create audio element
    const audio = new Audio()

    // Add event listeners for debugging
    audio.addEventListener("loadstart", () => console.log("Audio loading started"))
    audio.addEventListener("loadeddata", () => console.log("Audio data loaded"))
    audio.addEventListener("canplay", () => console.log("Audio can play"))
    audio.addEventListener("playing", () => console.log("Audio playback started"))

    // Add error handling for audio loading
    audio.onerror = (e) => {
      console.error("Error loading audio:", e)
      console.error("Audio error details:", {
        code: audio.error?.code,
        message: audio.error?.message,
      })
    }

    // Set the audio source
    const audioSrc = `data:audio/mp3;base64,${data.audioContent}`
    console.log(`Setting audio source (first 50 chars): ${audioSrc.substring(0, 50)}...`)
    audio.src = audioSrc

    // Start loading the audio
    console.log("Loading audio...")
    audio.load()

    // Play when ready
    console.log("Attempting to play audio...")
    const playPromise = audio.play()

    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio playback started successfully")
        })
        .catch((error) => {
          console.error("Audio playback failed:", error)
          // Try an alternative approach
          console.log("Trying alternative playback approach...")
          setTimeout(() => {
            try {
              audio.play().catch((e) => console.error("Alternative playback also failed:", e))
            } catch (e) {
              console.error("Alternative playback error:", e)
            }
          }, 1000)
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

      // Safety timeout in case onended doesn't fire
      setTimeout(() => {
        console.log("Safety timeout reached - resolving promise")
        resolve()
      }, 10000) // 10 second timeout
    })
  } catch (error) {
    console.error("Google TTS error:", error)
    throw error
  }
}

// Check if Urdu is supported by the browser - no longer used for decision making
export const isUrduSupported = async (): Promise<boolean> => {
  const voices = await getVoices()
  const urduSupported = voices.some(
    (voice) =>
      voice.lang.toLowerCase() === "ur" ||
      voice.lang.toLowerCase() === "ur-pk" ||
      voice.lang.toLowerCase() === "ur-in" ||
      voice.name.toLowerCase().includes("urdu"),
  )
  console.log(`Urdu voice supported by browser: ${urduSupported} (but will use Google TTS API regardless)`)
  return urduSupported
}
