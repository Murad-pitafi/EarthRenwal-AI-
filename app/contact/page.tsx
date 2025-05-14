"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/UserContext"
import Image from "next/image"

export default function ContactPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    toast({
      title: language === "en" ? "Message Sent" : "پیغام بھیج دیا گیا",
      description: language === "en" ? "We will get back to you soon!" : "ہم جلد ہی آپ سے رابطہ کریں گے!",
    })
    setFormData({ name: "", email: "", message: "" })
  }

  const teamMembers = [
    {
      name: "Farrukh Shahzad",
      role: language === "en" ? "Project Lead" : "پروجیکٹ لیڈ",
      image: "/images/team/farrukh.png",
    },
    {
      name: "Ahmed Khan",
      role: language === "en" ? "Agricultural Scientist" : "زراعتی سائنسدان",
      image: "/images/team/ahmed.png",
    },
    {
      name: "Nizam Uddin",
      role: language === "en" ? "Software Engineer" : "سافٹ ویئر انجینئر",
      image: "/images/team/nizam.png",
    },
    {
      name: "Murad Ali",
      role: language === "en" ? "Data Scientist" : "ڈیٹا سائنسدان",
      image: "/images/team/murad.png",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{language === "en" ? "Contact Us" : "ہم سے رابطہ کریں"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              {language === "en" ? "Send us a message" : "ہمیں پیغام بھیجیں"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2">
                  {language === "en" ? "Name" : "نام"}
                </label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">
                  {language === "en" ? "Email" : "ای میل"}
                </label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2">
                  {language === "en" ? "Message" : "پیغام"}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {language === "en" ? "Submit" : "جمع کرائیں"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">
              {language === "en" ? "Contact Information" : "رابطے کی معلومات"}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{language === "en" ? "Address" : "پتہ"}:</h3>
                <p>
                  {language === "en"
                    ? "123 Agriculture Street, Hyderabad, Sindh, Pakistan"
                    : "123 زراعت سٹریٹ، حیدرآباد، سندھ، پاکستان"}
                </p>
              </div>
              <div>
                <h3 className="font-medium">{language === "en" ? "Email" : "ای میل"}:</h3>
                <p>info@earthrenewal.pk</p>
              </div>
              <div>
                <h3 className="font-medium">{language === "en" ? "Phone" : "فون"}:</h3>
                <p>+92 300 1234567</p>
              </div>
              <div>
                <h3 className="font-medium">{language === "en" ? "Working Hours" : "کام کے اوقات"}:</h3>
                <p>{language === "en" ? "Monday - Friday: 9:00 AM - 5:00 PM" : "پیر - جمعہ: صبح 9:00 - شام 5:00"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Section */}
      <h2 className="text-2xl font-semibold mb-6 text-center">{language === "en" ? "Our Team" : "ہماری ٹیم"}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {teamMembers.map((member, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={member.image || "/placeholder.svg"} alt={member.name} fill style={{ objectFit: "cover" }} />
            </div>
            <CardContent className="text-center py-4">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map Section */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">
              {language === "en" ? "Map will be displayed here" : "نقشہ یہاں دکھایا جائے گا"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
