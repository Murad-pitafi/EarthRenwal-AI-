"use client"

import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PartnerLogo } from "@/components/PartnerLogo"

export function CollaborationSection() {
  const { language } = useUser()

  const translations = {
    en: {
      title: "Our Collaborations",
      subtitle: "Working together with industry leaders to transform agriculture",
      zettamightTitle: "ZettaMight",
      zettamightDesc:
        "ZettaMight is a premier destination for cutting-edge solutions in Cloud and Cyber Security, Blockchain technology, AI innovation, and digital product development. At ZettaMight, we empower the tech industry with unparalleled expertise and comprehensive services tailored to meet the demands of today's digital landscape.",
      agroTechTitle: "Agro TechVision",
      agroTechDesc:
        "Harnessing Precision Agriculture for Sustainable Farming Success. Step into the future of farming with Agro TechVision, where tradition meets innovation to cultivate a greener, more prosperous world. Our pioneering precision agriculture solutions redefine the landscape of modern farming, empowering growers and agribusinesses alike to unlock the full potential of their land while nurturing the planet.",
      learnMore: "Learn More",
    },
    ur: {
      title: "ہماری شراکت داریاں",
      subtitle: "زراعت کو تبدیل کرنے کے لیے صنعت کے رہنماؤں کے ساتھ مل کر کام کرنا",
      zettamightTitle: "زیٹامائٹ",
      zettamightDesc:
        "زیٹامائٹ کلاؤڈ اور سائبر سیکیورٹی، بلاکچین ٹیکنالوجی، اے آئی جدت، اور ڈیجیٹل پروڈکٹ ڈویلپمنٹ میں جدید حل کے لیے ایک اعلی مقام ہے۔ زیٹامائٹ میں، ہم ٹیک انڈسٹری کو آج کے ڈیجیٹل لینڈسکیپ کی ضروریات کو پورا کرنے کے لیے بے مثال مہارت اور جامع خدمات کے ساتھ بااختیار بناتے ہیں۔",
      agroTechTitle: "ایگرو ٹیک ویژن",
      agroTechDesc:
        "پائیدار کاشتکاری کی کامیابی کے لیے پریسیژن ایگریکلچر کا استعمال۔ ایگرو ٹیک ویژن کے ساتھ کاشتکاری کے مستقبل میں قدم رکھیں، جہاں روایت جدت سے ملتی ہے تاکہ ایک سبز، زیادہ خوشحال دنیا کو پروان چڑھایا جا سکے۔ ہمارے پیش رو پریسیژن ایگریکلچر حل جدید کاشتکاری کے منظر نامے کو نئی تعریف دیتے ہیں، کاشتکاروں اور زرعی کاروباروں کو اپنی زمین کی پوری صلاحیت کو کھولنے کے لیے بااختیار بناتے ہیں۔",
      learnMore: "مزید جانیں",
    },
  }

  const t = translations[language]

  return (
    <section className="py-12 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden border-green-200 hover:shadow-lg transition-shadow">
            <PartnerLogo
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZCURp5w8nKdOAA6URQplipESofd9lD.png"
              alt="ZettaMight Logo"
              bgColor="bg-white"
            />
            <CardHeader>
              <CardTitle>{t.zettamightTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t.zettamightDesc}</p>
              <Link
                href="https://zettamight.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
              >
                {t.learnMore}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-green-200 hover:shadow-lg transition-shadow">
            <PartnerLogo
              src="https://agro-techvision.netlify.app/img/logo.png"
              alt="Agro TechVision Logo"
              bgColor="bg-white"
            />
            <CardHeader>
              <CardTitle>{t.agroTechTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t.agroTechDesc}</p>
              <Link
                href="https://agrotechvision.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
              >
                {t.learnMore}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
