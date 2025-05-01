"use client"

import { useUser } from "@/contexts/UserContext"
import { Navigation } from "./Navigation"
import { LanguageToggle } from "./LanguageToggle"
import { useEffect, useState } from "react"

export function Header() {
  const { language } = useUser()
  const [mounted, setMounted] = useState(false)

  // This ensures we only render the component after it's mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-green-50 via-white to-green-50 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="w-full"></div>
          <div className="flex items-center gap-2"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-green-50 via-white to-green-50 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Navigation />
        <div className="flex items-center gap-2">
          {/* Small debug indicator */}
          <div className="text-xs text-gray-500 mr-2">Lang: {language}</div>
          <LanguageToggle />
        </div>
      </div>
    </header>
  )
}
