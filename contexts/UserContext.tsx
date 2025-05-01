"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ur"

interface UserContextType {
  username: string
  setUsername: (name: string) => void
  language: Language
  setLanguage: (lang: Language) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>("")
  const [language, setLanguage] = useState<Language>("en")
  const [isClient, setIsClient] = useState(false)

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true)

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
    if (typeof window !== "undefined" && isClient) {
      localStorage.setItem("username", username)
      localStorage.setItem("language", language)
      console.log("Language updated in localStorage:", language)
    }
  }, [username, language, isClient])

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        language,
        setLanguage,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
