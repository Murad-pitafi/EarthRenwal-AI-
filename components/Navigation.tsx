"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/contexts/UserContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Microscope,
  Award,
  Cloud,
  MessageSquare,
  ImageIcon,
  Phone,
  BarChart,
  Menu,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { language } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const translations = {
    en: {
      home: "Home",
      maliAgent: "Mali Agent AI",
      services: "Services",
      soilAnalysis: "Soil Analysis",
      mediaGallery: "Media Gallery",
      achievements: "Achievements",
      weather: "Weather",
      contact: "Contact",
      riceStats: "Rice Statistics",
      precisionFarming: "Precision Farming",
      soilMonitoring: "Soil Monitoring",
      collaborations: "Collaborations",
    },
    ur: {
      home: "ہوم",
      maliAgent: "مالی ایجنٹ اے آئی",
      services: "خدمات",
      soilAnalysis: "مٹی کا تجزیہ",
      mediaGallery: "میڈیا گیلری",
      achievements: "کامیابیاں",
      weather: "موسم",
      contact: "رابطہ",
      riceStats: "چاول کے اعداد و شمار",
      precisionFarming: "درست کاشتکاری",
      soilMonitoring: "مٹی کی نگرانی",
      collaborations: "شراکت داریاں",
    },
  }

  const t = translations[language]

  const mainRoutes = [
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
      href: "/collaborations",
      label: t.collaborations,
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

  const serviceRoutes = [
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
      href: "/precision-farming",
      label: t.precisionFarming,
      icon: Microscope,
    },
    {
      href: "/soil-monitoring",
      label: t.soilMonitoring,
      icon: Microscope,
    },
  ]

  return (
    <div className="flex items-center justify-between w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/images/logo.png" alt="EarthRenewal.AI Logo" width={50} height={50} />
        <span className="hidden md:inline-block text-xl font-bold text-green-600">EarthRenewal.AI</span>
      </Link>

      <nav className="flex items-center space-x-1 lg:space-x-2 overflow-x-auto">
        {mainRoutes.map((route) => {
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

        {/* Services Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 h-auto py-2",
                serviceRoutes.some((route) => pathname === route.href)
                  ? "text-green-600 bg-green-50"
                  : "text-muted-foreground hover:text-green-600",
              )}
            >
              <Menu className="h-4 w-4" />
              <span className="text-xs md:text-sm flex items-center">
                {t.services}
                <ChevronDown className="h-3 w-3 ml-1" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {serviceRoutes.map((route) => {
              const Icon = route.icon
              return (
                <DropdownMenuItem key={route.href} asChild>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-2 w-full px-2 py-1.5",
                      pathname === route.href ? "text-green-600 bg-green-50" : "",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{route.label}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  )
}
