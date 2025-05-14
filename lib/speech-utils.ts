// Speech synthesis utility functions

// Cache for available voices
let availableVoices: SpeechSynthesisVoice[] = []
let voicesLoaded = false

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
      resolve(voices)
      return
    }

    // If voices aren't loaded yet, wait for the voiceschanged event
    const voicesChangedHandler = () => {
      const newVoices = window.speechSynthesis.getVoices()
      availableVoices = newVoices
      voicesLoaded = true
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

  // For Urdu, try multiple possible language codes
  if (language === "ur") {
    // Try exact Urdu matches first
    const urduVoice = voices.find(
      (voice) =>
        voice.lang.toLowerCase() === "ur" ||
        voice.lang.toLowerCase() === "ur-pk" ||
        voice.lang.toLowerCase() === "ur-in",
    )

    if (urduVoice) {
      console.log(`Found Urdu voice: ${urduVoice.name}`)
      return urduVoice
    }

    // If no Urdu voice, try Hindi as a fallback (similar language region)
    const hindiVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("hi"))

    if (hindiVoice) {
      console.log(`Using Hindi voice as fallback for Urdu: ${hindiVoice.name}`)
      return hindiVoice
    }

    // If no Hindi voice either, try any South Asian voice
    const southAsianVoice = voices.find(
      (voice) =>
        voice.lang
          .toLowerCase()
          .includes("in") || // Indian voices
        voice.lang.toLowerCase().includes("pk"), // Pakistani voices
    )

    if (southAsianVoice) {
      console.log(`Using South Asian voice as fallback: ${southAsianVoice.name}`)
      return southAsianVoice
    }

    // Last resort: use any available voice
    console.log(`No suitable voice found for Urdu, using default voice`)
    return voices.find((voice) => voice.default) || voices[0] || null
  }

  // For English or other languages
  const exactMatch = voices.find((voice) => voice.lang.toLowerCase().startsWith(language.toLowerCase()))
  if (exactMatch) return exactMatch

  // Default to first voice or null if none available
  return voices.find((voice) => voice.default) || voices[0] || null
}

// Function to speak text with the appropriate voice
export const speakText = async (text: string, language: string): Promise<void> => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.error("Speech synthesis not supported")
    return
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text)

    // Find the best voice for the language
    const voice = await findBestVoice(language)
    if (voice) {
      utterance.voice = voice
      console.log(`Using voice: ${voice.name} (${voice.lang})`)
    } else {
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
        reject(new Error("Speech synthesis failed"))
      }
    })
  } catch (error) {
    console.error("Error in text-to-speech:", error)
    throw error
  }
}
