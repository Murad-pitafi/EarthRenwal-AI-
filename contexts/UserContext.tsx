"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ur"

interface UserContextType {
  username: string
  setUsername: (name: string) => void
  language: Language
  setLanguage: (lang: Language) => void
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  username: "",
  setUsername: () => {},
  language: "en",
  setLanguage: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string>("")
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    setMounted(true)

    // Initialize from localStorage on mount
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username")
      const storedLanguage = localStorage.getItem("language") as Language

      if (storedUsername) {
        setUsername(storedUsername)
      }

      if (storedLanguage && (storedLanguage === "en" || storedLanguage === "ur")) {
        setLanguage(storedLanguage)
      }
    }
  }, [])

  // Update localStorage when values change
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("username", username)
      localStorage.setItem("language", language)
    }
  }, [username, language, mounted])

  // Provide a stable context value
  const value = {
    username,
    setUsername,
    language,
    setLanguage,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext)
  return context
}
