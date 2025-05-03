"use client"

import { useUser } from "@/contexts/UserContext"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { MapPin, Database, BarChart2 } from "lucide-react"

export function DataCollectionSection() {
  const { language } = useUser()

  const translations = {
    en: {
      title: "Our Field Work",
      subtitle: "Currently Active in Ghotki District, Sindh",
      description:
        "We are currently collecting agricultural data from farms across Ghotki district in Sindh province. This data helps us understand local farming practices, soil conditions, and crop patterns to provide more accurate and region-specific recommendations.",
      dataPoints: "Data Collection Points",
      farmersEngaged: "Farmers Engaged",
      cropsAnalyzed: "Crops Analyzed",
      soilSamples: "Soil Samples",
      mapCaption: "Map of Sindh Province with Ghotki District highlighted",
    },
    ur: {
      title: "ہمارا فیلڈ ورک",
      subtitle: "فی الحال سندھ کے ضلع گھوٹکی میں فعال",
      description:
        "ہم فی الحال سندھ صوبے کے ضلع گھوٹکی میں کھیتوں سے زرعی ڈیٹا جمع کر رہے ہیں۔ یہ ڈیٹا ہمیں مقامی کاشتکاری کے طریقوں، مٹی کے حالات، اور فصل کے پیٹرن کو سمجھنے میں مدد کرتا ہے تاکہ زیادہ درست اور علاقائی سفارشات فراہم کی جا سکیں۔",
      dataPoints: "ڈیٹا جمع کرنے کے مقامات",
      farmersEngaged: "شامل کسان",
      cropsAnalyzed: "تجزیہ شدہ فصلیں",
      soilSamples: "مٹی کے نمونے",
      mapCaption: "سندھ صوبے کا نقشہ جس میں ضلع گھوٹکی کو نمایاں کیا گیا ہے",
    },
  }

  const t = translations[language]

  return (
    <section className="py-12 bg-gradient-to-b from-white to-green-50 rounded-xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
          <p className="text-xl font-semibold text-green-600">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-lg">{t.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">6</p>
                  <p className="text-sm">{t.dataPoints}</p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <Database className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">50+</p>
                  <p className="text-sm">{t.farmersEngaged}</p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <BarChart2 className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">75+</p>
                  <p className="text-sm">{t.soilSamples}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="border-4 border-green-100 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/sindh-map.png"
                alt="Map of Sindh Province with Ghotki District highlighted"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">{t.mapCaption}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
