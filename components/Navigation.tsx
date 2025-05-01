"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/contexts/UserContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Microscope, Award, Cloud, MessageSquare, ImageIcon, Phone, BarChart } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const pathname = usePathname()
  const { language } = useUser()

  const translations = {
    en: {
      home: "Home",
      maliAgent: "Mali Agent AI",
      soilAnalysis: "Soil Analysis",
      mediaGallery: "Media Gallery",
      achievements: "Achievements",
      weather: "Weather",
      contact: "Contact",
      riceStats: "Rice Statistics",
    },
    ur: {
      home: "ہوم",
      maliAgent: "مالی ایجنٹ اے آئی",
      soilAnalysis: "مٹی کا تجزیہ",
      mediaGallery: "میڈیا گیلری",
      achievements: "کامیابیاں",
      weather: "موسم",
      contact: "رابطہ",
      riceStats: "چاول کے اعداد و شمار",
    },
  }

  const t = translations[language]

  const routes = [
    {
      href: "/",
      label: t.home,
      icon: Home,
    },
    {
      href: "/mali-agent",
      label: t.maliAgent,
      icon: MessageSquare,
    },
    {
      href: "/soil-analysis",
      label: t.soilAnalysis,
      icon: Microscope,
    },
    {
      href: "/rice-statistics",
      label: t.riceStats,
      icon: BarChart,
    },
    {
      href: "/media-gallery",
      label: t.mediaGallery,
      icon: ImageIcon,
    },
    {
      href: "/achievements",
      label: t.achievements,
      icon: Award,
    },
    {
      href: "/weather",
      label: t.weather,
      icon: Cloud,
    },
    {
      href: "/contact",
      label: t.contact,
      icon: Phone,
    },
  ]

  return (
    <div className="flex items-center justify-between w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/images/logo.png" alt="EarthRenewal.AI Logo" width={50} height={50} />
        <span className="hidden md:inline-block text-xl font-bold text-green-600">EarthRenewal.AI</span>
      </Link>

      <nav className="flex items-center space-x-1 lg:space-x-2 overflow-x-auto">
        {routes.map((route) => {
          const Icon = route.icon
          return (
            <Button
              key={route.href}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 h-auto py-2",
                pathname === route.href ? "text-green-600 bg-green-50" : "text-muted-foreground hover:text-green-600",
              )}
              asChild
            >
              <Link href={route.href}>
                <Icon className="h-4 w-4" />
                <span className="text-xs md:text-sm">{route.label}</span>
              </Link>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
