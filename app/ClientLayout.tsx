"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/contexts/UserContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react"

const inter = Inter({ subsets: ["latin"] })

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mounted, setMounted] = useState(false)
  const [currentLang, setCurrentLang] = useState("en")

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language")
      console.log("Initial language from localStorage:", storedLang)
      if (storedLang && (storedLang === "en" || storedLang === "ur")) {
        setCurrentLang(storedLang)
      }
    }
  }, [])

  return (
    <html lang={currentLang} dir={currentLang === "ur" ? "rtl" : "ltr"}>
      <body className={inter.className}>
        <UserProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
            <Header />
            <main className="container mx-auto p-4 flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </UserProvider>
      </body>
    </html>
  )
}
