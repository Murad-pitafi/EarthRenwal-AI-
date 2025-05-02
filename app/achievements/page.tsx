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
      vision: "Our Vision & Goals",
      farmers: "Farmers We Aim to Assist",
      awards: "Future Milestones",
      yield: "Target Yield Improvement",
    },
    ur: {
      title: "ہماری کامیابیاں",
      vision: "ہمارا وژن اور اہداف",
      farmers: "کسان جنہیں ہم مدد کرنا چاہتے ہیں",
      awards: "مستقبل کے سنگ میل",
      yield: "ہدف پیداوار میں بہتری",
    },
  }

  const t = translations[language]

  const achievements = [
    {
      title: language === "en" ? "IEEEP Fair 2024 Participation" : "آئی ای ای ای پی میلہ 2024 میں شرکت",
      description:
        language === "en"
          ? "Showcasing our agricultural technology innovations at the upcoming IEEEP Fair 2024 in Karachi."
          : "کراچی میں آنے والے آئی ای ای ای پی میلہ 2024 میں اپنی زرعی ٹیکنالوجی کی جدت کا مظاہرہ کرنا۔",
      image: "/images/achievements_1.jpg",
      date: language === "en" ? "September 2024" : "ستمبر 2024",
      icon: Trophy,
    },
    {
      title: language === "en" ? "EarthRenewal.AI Launch" : "ارتھ رینیوول۔اے آئی لانچ",
      description:
        language === "en"
          ? "Official launch of our Smart Farming solutions at the Agricultural Innovation Conference 2024."
          : "زرعی جدت کانفرنس 2024 میں اپنے سمارٹ فارمنگ حل کا سرکاری آغاز۔",
      image: "/images/achievements_2.jpg",
      date: language === "en" ? "August 2024" : "اگست 2024",
      icon: Award,
    },
    {
      title: language === "en" ? "Zindigi Prize Application" : "زندگی پرائز کی درخواست",
      description:
        language === "en"
          ? "Applying for the Zindigi Prize for sustainable technology solutions to support our growth."
          : "اپنی ترقی کی حمایت کے لیے پائیدار ٹیکنالوجی حل کے لیے زندگی پرائز کے لیے درخواست دینا۔",
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
          <CardTitle className="text-center">{t.vision}</CardTitle>
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
