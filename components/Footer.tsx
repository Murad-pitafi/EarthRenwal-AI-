"use client"

import { useUser } from "@/contexts/UserContext"
import { DataCollectionStatus } from "./DataCollectionStatus"

export function Footer() {
  const { language } = useUser()
  const isUrdu = language === "ur"

  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className={`text-gray-600 ${isUrdu ? "font-urdu" : ""}`}>
              {isUrdu
                ? "© 2023 ارتھ رینیوول اے آئی۔ جملہ حقوق محفوظ ہیں۔"
                : "© 2023 EarthRenewal AI. All rights reserved."}
            </p>
          </div>

          <div className="flex-1 mx-4">
            <DataCollectionStatus />
          </div>

          <div className="text-center md:text-right">
            <p className={`text-gray-600 ${isUrdu ? "font-urdu" : ""}`}>
              {isUrdu ? "سندھ، پاکستان میں تیار کیا گیا" : "Made in Sindh, Pakistan"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
