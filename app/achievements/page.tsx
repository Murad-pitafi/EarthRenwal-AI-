"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Trophy, Medal } from "lucide-react"
import { AchievementsSlider } from "@/components/AchievementsSlider"
import { useUser } from "@/contexts/UserContext"

export default function Achievements() {
  const { language } = useUser()

  const translations = {
    en: {
      title: "Our Achievements",
      impact: "Recognition & Impact",
      farmers: "Farmers Assisted",
      awards: "Awards & Recognitions",
      yield: "Average Yield Improvement",
    },
    ur: {
      title: "ہماری کامیابیاں",
      impact: "تسلیم اور اثر",
      farmers: "مدد کیے گئے کسان",
      awards: "ایوارڈز اور اعترافات",
      yield: "اوسط پیداوار میں بہتری",
    },
  }

  const t = translations[language]

  const achievements = [
    {
      title: language === "en" ? "IEEEP Fair 2024 Recognition" : "آئی ای ای ای پی میلہ 2024 کا اعتراف",
      description:
        language === "en"
          ? "Recognized for innovation in agricultural technology at the IEEEP Fair 2024 in Karachi."
          : "کراچی میں آئی ای ای ای پی میلہ 2024 میں زرعی ٹیکنالوجی میں جدت کے لیے تسلیم کیا گیا۔",
      image: "/images/achievements_1.jpg",
      date: language === "en" ? "September 2024" : "ستمبر 2024",
      icon: Trophy,
    },
    {
      title: language === "en" ? "EarthRenewal.AI Presentation" : "ارتھ رینیوول۔اے آئی پریزنٹیشن",
      description:
        language === "en"
          ? "Presented our Smart Farming solutions at the Agricultural Innovation Conference 2024."
          : "زرعی جدت کانفرنس 2024 میں اپنے سمارٹ فارمنگ حل پیش کیے۔",
      image: "/images/achievements_2.jpg",
      date: language === "en" ? "August 2024" : "اگست 2024",
      icon: Award,
    },
    {
      title: language === "en" ? "Zindigi Prize Finalist" : "زندگی پرائز فائنلسٹ",
      description:
        language === "en"
          ? "Selected as a finalist for the Zindigi Prize for sustainable technology solutions."
          : "پائیدار ٹیکنالوجی حل کے لیے زندگی پرائز کے فائنلسٹ کے طور پر منتخب کیا گیا۔",
      image: "/images/media_gallery_3.jpg",
      date: language === "en" ? "July 2024" : "جولائی 2024",
      icon: Medal,
    },
  ]

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-4xl font-bold mb-8">{t.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <AchievementsSlider achievements={achievements} />
        </div>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardHeader>
          <CardTitle className="text-center">{t.impact}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-green-600">500+</p>
              <p className="text-gray-600">{t.farmers}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">15+</p>
              <p className="text-gray-600">{t.awards}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">30%</p>
              <p className="text-gray-600">{t.yield}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
