"use client"

import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUser } from "@/contexts/UserContext"
import { useEffect, useState } from "react"

export function LanguageToggle() {
  const { language, setLanguage } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Force a hard reload with the new language
  const handleLanguageChange = (newLanguage: "en" | "ur") => {
    if (typeof window !== "undefined") {
      // First update localStorage
      localStorage.setItem("language", newLanguage)
      // Then update the context state
      setLanguage(newLanguage)
      // Force a complete page reload to ensure all components update
      window.location.reload()
    }
  }

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Languages className="h-4 w-4" />
          <span>{language === "en" ? "English" : "اردو"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-green-50 font-semibold" : ""}
        >
          <span className="mr-2">🇬🇧</span> English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("ur")}
          className={language === "ur" ? "bg-green-50 font-semibold" : ""}
        >
          <span className="mr-2">🇵🇰</span> اردو
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
