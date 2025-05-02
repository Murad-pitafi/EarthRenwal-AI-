"use client"

import { useUser } from "@/contexts/UserContext"
import { CollaborationSection } from "@/components/CollaborationSection"

export default function CollaborationsPage() {
  const { language } = useUser()

  const translations = {
    en: {
      title: "Our Collaborations",
      subtitle: "Working together with industry leaders to transform agriculture",
    },
    ur: {
      title: "ہماری شراکت داریاں",
      subtitle: "زراعت کو تبدیل کرنے کے لیے صنعت کے رہنماؤں کے ساتھ مل کر کام کرنا",
    },
  }

  const t = translations[language]

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
      <p className="text-gray-600 mb-8">{t.subtitle}</p>

      <CollaborationSection />
    </div>
  )
}
