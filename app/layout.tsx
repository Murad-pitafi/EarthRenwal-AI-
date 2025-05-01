import type React from "react"
import type { Metadata } from "next"
import { ClientLayout } from "./ClientLayout"

export const metadata: Metadata = {
  title: "EarthRenewal.AI",
  description: "Empowering sustainable agriculture through AI-driven solutions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'