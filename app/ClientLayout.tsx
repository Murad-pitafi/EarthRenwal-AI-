"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { UserProvider } from "@/contexts/UserContext"
import { SensorDataProvider } from "@/contexts/SensorDataContext"
import { Toaster } from "@/components/ui/toaster"
import { AgricultureLayout } from "@/components/AgricultureLayout"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <UserProvider>
            <SensorDataProvider>
              <AgricultureLayout>
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
              </AgricultureLayout>
              <Toaster />
            </SensorDataProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
