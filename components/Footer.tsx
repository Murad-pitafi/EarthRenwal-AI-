"use client"

import { useUser } from "@/contexts/UserContext"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const { language } = useUser()

  const translations = {
    en: {
      about: "About Us",
      contact: "Contact Us",
      services: "Our Services",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "© 2024 EarthRenewal.AI. All rights reserved.",
      address: "Karachi, Pakistan",
      phone: "+92 330 3193261",
      email: "earthrenewalai@gmail.com",
      followUs: "Follow Us",
      subscribe: "Subscribe to our newsletter",
      subscribeButton: "Subscribe",
      emailPlaceholder: "Enter your email",
    },
    ur: {
      about: "ہمارے بارے میں",
      contact: "ہم سے رابطہ کریں",
      services: "ہماری خدمات",
      privacy: "رازداری کی پالیسی",
      terms: "سروس کی شرائط",
      rights: "© 2024 ارتھ رینیوول۔ اے آئی۔ جملہ حقوق محفوظ ہیں۔",
      address: "کراچی، پاکستان",
      phone: "+92 330 3193261",
      email: "earthrenewalai@gmail.com",
      followUs: "ہمیں فالو کریں",
      subscribe: "ہماری نیوز لیٹر کے لیے سبسکرائب کریں",
      subscribeButton: "سبسکرائب کریں",
      emailPlaceholder: "اپنا ای میل درج کریں",
    },
  }

  const t = translations[language]

  return (
    <footer className="bg-gradient-to-r from-green-900 to-green-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/logo.png" alt="EarthRenewal.AI Logo" width={40} height={40} />
              <span className="text-xl font-bold">EarthRenewal.AI</span>
            </div>
            <p className="text-green-100 mb-4">
              {language === "en"
                ? "Empowering sustainable agriculture through AI-driven solutions"
                : "اے آئی پر مبنی حل کے ذریعے پائیدار زراعت کو بااختیار بنانا"}
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-green-100 hover:text-white">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-green-100 hover:text-white">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-green-100 hover:text-white">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{language === "en" ? "Quick Links" : "فوری لنکس"}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-green-100 hover:text-white">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/mali-agent" className="text-green-100 hover:text-white">
                  Mali Agent AI
                </Link>
              </li>
              <li>
                <Link href="/soil-analysis" className="text-green-100 hover:text-white">
                  {language === "en" ? "Soil Analysis" : "مٹی کا تجزیہ"}
                </Link>
              </li>
              <li>
                <Link href="/media-gallery" className="text-green-100 hover:text-white">
                  {language === "en" ? "Media Gallery" : "میڈیا گیلری"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t.contact}</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-green-100">{t.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span className="text-green-100">{t.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span className="text-green-100">{t.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t.subscribe}</h3>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="px-4 py-2 rounded bg-green-800 border border-green-700 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-medium transition-colors"
              >
                {t.subscribeButton}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-200">
          <p>{t.rights}</p>
        </div>
      </div>
    </footer>
  )
}
