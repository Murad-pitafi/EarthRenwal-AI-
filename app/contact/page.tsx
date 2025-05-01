"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function Contact() {
  const { language } = useUser()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const translations = {
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with our agricultural experts",
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      submit: "Send Message",
      submitting: "Sending...",
      contactInfo: "Contact Information",
      address: "Karachi, Pakistan",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM",
      namePlaceholder: "Enter your name",
      emailPlaceholder: "Enter your email",
      subjectPlaceholder: "Enter subject",
      messagePlaceholder: "Enter your message",
      successTitle: "Message Sent",
      successMessage: "Thank you for contacting us. We will get back to you soon.",
      teamTitle: "Our Team",
      teamSubtitle: "Meet the experts behind EarthRenewal.AI",
    },
    ur: {
      title: "ہم سے رابطہ کریں",
      subtitle: "ہمارے زرعی ماہرین سے رابطہ کریں",
      name: "نام",
      email: "ای میل",
      subject: "موضوع",
      message: "پیغام",
      submit: "پیغام بھیجیں",
      submitting: "بھیج رہا ہے...",
      contactInfo: "رابطے کی معلومات",
      address: "کراچی، پاکستان",
      hours: "پیر - جمعہ: صبح 9:00 - شام 5:00",
      namePlaceholder: "اپنا نام درج کریں",
      emailPlaceholder: "اپنا ای میل درج کریں",
      subjectPlaceholder: "موضوع درج کریں",
      messagePlaceholder: "اپنا پیغام درج کریں",
      successTitle: "پیغام بھیج دیا گیا",
      successMessage: "ہم سے رابطہ کرنے کا شکریہ۔ ہم جلد ہی آپ سے رابطہ کریں گے۔",
      teamTitle: "ہماری ٹیم",
      teamSubtitle: "ارتھ رینیوول۔اے آئی کے پیچھے ماہرین سے ملیں",
    },
  }

  const t = translations[language]

  const teamMembers = [
    {
      name: "Muhammad Murad",
      position: "CEO & CTO | Founder",
      email: "pitafimurad99@gmail.com",
      image: "/diverse-group.png",
    },
    {
      name: "Nizamuldin",
      position: "CAIO | Co-Founder",
      email: "nizamudinqureshi@gmail.com",
      image: "/diverse-group.png",
    },
    {
      name: "Ahmed",
      position: "CPO | Co-Founder",
      email: "m.ahmedaieng@gmail.com",
      phone: "+92 306 1511392",
      image: "/diverse-group.png",
    },
    {
      name: "Dr. Muhammad Farrukh Shahid",
      position: "Technical Advisor | Mentor",
      email: "mfarrukh.shahid@nu.edu.pk",
      image: "/diverse-group.png",
    },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      toast({
        title: t.successTitle,
        description: t.successMessage,
      })
    }, 1500)
  }

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-4xl font-bold mb-8">{t.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-b from-white to-green-50">
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.namePlaceholder}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.emailPlaceholder}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">{t.subject}</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t.subjectPlaceholder}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">{t.message}</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.messagePlaceholder}
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? t.submitting : t.submit}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-white to-green-50">
          <CardHeader>
            <CardTitle>{t.contactInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">{language === "en" ? "Address" : "پتہ"}</p>
                <p className="text-gray-600">Karachi, Pakistan</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">{language === "en" ? "Phone" : "فون"}</p>
                <p className="text-gray-600">+92 330 3193261</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">{language === "en" ? "Email" : "ای میل"}</p>
                <p className="text-gray-600">earthrenewalai@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">{language === "en" ? "Business Hours" : "کاروباری اوقات"}</p>
                <p className="text-gray-600">{t.hours}</p>
              </div>
            </div>

            <div className="pt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115681.29592731265!2d66.8943178501212!3d24.89268186831883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sKarachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1651234567890!5m2!1sen!2s"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-md"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">{t.teamTitle}</h2>
        <p className="text-gray-600 mb-8">{t.teamSubtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-gradient-to-b from-white to-green-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-green-600 mb-2">{member.position}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
