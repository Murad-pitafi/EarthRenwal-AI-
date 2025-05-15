"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/contexts/UserContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Award,
  Cloud,
  MessageSquare,
  ImageIcon,
  Phone,
  BarChart,
  Menu,
  ChevronDown,
  Activity,
  Database,
  FlaskRound,
  Info,
  Briefcase,
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
      resources: "Resources",
      mediaGallery: "Media Gallery",
      achievements: "Achievements",
      weather: "Weather",
      contact: "Contact",
      riceStats: "Rice Statistics",
      realTimeMonitoring: "Real-time Monitoring",
      dataManagement: "Data Management",
      soilTest: "Soil Test",
      about: "About",
      careers: "Careers",
    },
    ur: {
      home: "ہوم",
      maliAgent: "مالی ایجنٹ اے آئی",
      resources: "وسائل",
      mediaGallery: "میڈیا گیلری",
      achievements: "کامیابیاں",
      weather: "موسم",
      contact: "رابطہ",
      riceStats: "چاول کے اعداد و شمار",
      realTimeMonitoring: "ریئل ٹائم مانیٹرنگ",
      dataManagement: "ڈیٹا مینجمنٹ",
      soilTest: "مٹی کا ٹیسٹ",
      about: "ہمارے بارے میں",
      careers: "کیریئرز",
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
      href: "/about",
      label: t.about,
      icon: Info,
    },
    {
      href: "/mali-agent",
      label: t.maliAgent,
      icon: MessageSquare,
    },
    {
      href: "/real-time-monitoring",
      label: t.realTimeMonitoring,
      icon: Activity,
    },
    {
      href: "/data-management",
      label: t.dataManagement,
      icon: Database,
    },
    {
      href: "/soil-test",
      label: t.soilTest,
      icon: FlaskRound,
    },
    {
      href: "/weather",
      label: t.weather,
      icon: Cloud,
    },
    {
      href: "/careers",
      label: t.careers,
      icon: Briefcase,
    },
    {
      href: "/contact",
      label: t.contact,
      icon: Phone,
    },
  ]

  const resourceRoutes = [
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
      href: "/rice-statistics",
      label: t.riceStats,
      icon: BarChart,
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

        {/* Resources Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 h-auto py-2",
                resourceRoutes.some((route) => pathname === route.href)
                  ? "text-green-600 bg-green-50"
                  : "text-muted-foreground hover:text-green-600",
              )}
            >
              <Menu className="h-4 w-4" />
              <span className="text-xs md:text-sm flex items-center">
                {t.resources}
                <ChevronDown className="h-3 w-3 ml-1" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {resourceRoutes.map((route) => {
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
