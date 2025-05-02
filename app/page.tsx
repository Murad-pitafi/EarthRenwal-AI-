"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Microscope, Award, ImageIcon, BarChart } from "lucide-react"
import { MediaGallerySlider } from "@/components/MediaGallerySlider"
import { useUser } from "@/contexts/UserContext"
import { CollaborationSection } from "@/components/CollaborationSection"

export default function Home() {
  const { language } = useUser()
  const fieldWorkImages = ["/images/media_gallery_1.jpg", "/images/media_gallery_2.jpg", "/images/media_gallery_4.jpg"]
  const achievementImages = ["/images/achievements_1.jpg", "/images/achievements_2.jpg", "/images/media_gallery_3.jpg"]

  const translations = {
    en: {
      heroTitle: "EarthRenewal.AI",
      heroSubtitle: "Empowering sustainable agriculture through AI-driven solutions",
      exploreButton: "Explore Mali Agent AI",
      soilAnalysisButton: "Soil Analysis",
      learnAboutJourney: "Learn About Our Journey",
      solutions: "Our Solutions",
      maliAgentTitle: "Mali Agent AI",
      maliAgentDesc: "AI-powered assistant for farmers providing personalized agricultural advice",
      soilAnalysisTitle: "Soil Analysis",
      soilAnalysisDesc: "Advanced soil monitoring and analysis for optimal crop health",
      mediaGalleryTitle: "Media Gallery",
      mediaGalleryDesc: "Explore our field work and community engagement activities",
      achievementsTitle: "Achievements",
      achievementsDesc: "Recognition and milestones in sustainable agriculture innovation",
      riceStatsTitle: "Rice Statistics",
      riceStatsDesc: "Comprehensive data and insights on Pakistan's rice production and agricultural sector",
      learnMore: "Learn More",
      viewGallery: "View Gallery",
      viewAchievements: "View Achievements",
      mission: "Our Mission",
      missionText:
        "At EarthRenewal.AI, we're committed to revolutionizing agriculture through sustainable practices and cutting-edge technology. Our mission is to empower farmers with AI-driven solutions that optimize crop yields while preserving natural resources for future generations.",
      featuredMedia: "Featured Media",
      viewAll: "View All",
      fieldWorkTitle: "Field Work & Community Engagement",
      ourAchievements: "Our Achievements",
      awardsTitle: "Awards & Recognition",
      ourCollaborations: "Our Collaborations",
      viewCollaborations: "View All Collaborations",
    },
    ur: {
      heroTitle: "ارتھ رینیوول۔اے آئی",
      heroSubtitle: "اے آئی پر مبنی حل کے ذریعے پائیدار زراعت کو بااختیار بنانا",
      exploreButton: "مالی ایجنٹ اے آئی کو دریافت کریں",
      soilAnalysisButton: "مٹی کا تجزیہ",
      learnAboutJourney: "ہماری سفر کے بارے میں جانیں",
      solutions: "ہمارے حل",
      maliAgentTitle: "مالی ایجنٹ اے آئی",
      maliAgentDesc: "کسانوں کے لیے ذاتی زرعی مشورے فراہم کرنے والا اے آئی پاور اسسٹنٹ",
      soilAnalysisTitle: "مٹی کا تجزیہ",
      soilAnalysisDesc: "بہترین فصل کی صحت کے لیے جدید مٹی کی نگرانی اور تجزیہ",
      mediaGalleryTitle: "میڈیا گیلری",
      mediaGalleryDesc: "ہمارے فیلڈ ورک اور کمیونٹی انگیجمنٹ سرگرمیوں کو دریافت کریں",
      achievementsTitle: "کامیابیاں",
      achievementsDesc: "پائیدار زراعت کی جدت میں تسلیم اور سنگ میل",
      riceStatsTitle: "چاول کے اعداد و شمار",
      riceStatsDesc: "پاکستان کی چاول کی پیداوار اور زرعی شعبے پر جامع ڈیٹا اور بصیرت",
      learnMore: "مزید جانیں",
      viewGallery: "گیلری دیکھیں",
      viewAchievements: "کامیابیاں دیکھیں",
      mission: "ہمارا مشن",
      missionText:
        "ارتھ رینیوول۔اے آئی میں، ہم پائیدار طریقوں اور جدید ٹیکنالوجی کے ذریعے زراعت میں انقلاب لانے کے لیے پرعزم ہیں۔ ہمارا مشن کسانوں کو اے آئی پر مبنی حل کے ساتھ بااختیار بنانا ہے جو آنے والی نسلوں کے لیے قدرتی وسائل کو محفوظ رکھتے ہوئے فصل کی پیداوار کو بہتر بناتے ہیں۔",
      featuredMedia: "نمایاں میڈیا",
      viewAll: "سب دیکھیں",
      fieldWorkTitle: "فیلڈ ورک اور کمیونٹی انگیجمنٹ",
      ourAchievements: "ہماری کامیابیاں",
      awardsTitle: "ایوارڈز اور اعتراف",
      ourCollaborations: "ہماری شراکت داریاں",
      viewCollaborations: "تمام شراکت داریاں دیکھیں",
    },
  }

  const t = translations[language]

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full rounded-xl overflow-hidden">
        <Image src="/images/background.jpg" alt="Agricultural landscape" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-green-600/40 flex flex-col items-center justify-center text-center p-4">
          <Image src="/images/logo.png" alt="EarthRenewal.AI Logo" width={120} height={120} className="mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{t.heroTitle}</h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">{t.heroSubtitle}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/mali-agent">
                {t.exploreButton} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 border-white"
            >
              <Link href="/soil-analysis">
                {t.soilAnalysisButton} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-8 bg-gradient-to-b from-white to-green-50 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-8">{t.solutions}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.maliAgentTitle}</h3>
              <p className="text-gray-600">{t.maliAgentDesc}</p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/mali-agent">
                  {t.learnMore} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Microscope className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.soilAnalysisTitle}</h3>
              <p className="text-gray-600">{t.soilAnalysisDesc}</p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/soil-analysis">
                  {t.learnMore} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.mediaGalleryTitle}</h3>
              <p className="text-gray-600">{t.mediaGalleryDesc}</p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/media-gallery">
                  {t.viewGallery} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.achievementsTitle}</h3>
              <p className="text-gray-600">{t.achievementsDesc}</p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/achievements">
                  {t.viewAchievements} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.riceStatsTitle}</h3>
              <p className="text-gray-600">{t.riceStatsDesc}</p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/rice-statistics">
                  {t.learnMore} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-8 bg-gradient-to-r from-green-900 to-green-700 rounded-xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t.mission}</h2>
          <p className="text-lg mb-6">{t.missionText}</p>
          <Button asChild className="bg-white text-green-700 hover:bg-green-50">
            <Link href="/about">{t.learnAboutJourney}</Link>
          </Button>
        </div>
      </section>

      {/* Collaborations Section */}
      <section className="py-8 bg-gradient-to-b from-white to-green-50 rounded-xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">{t.ourCollaborations}</h2>
            <Button asChild variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              <Link href="/collaborations">
                {t.viewCollaborations} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CollaborationSection />
        </div>
      </section>

      {/* Featured Media Gallery */}
      <section className="py-8 bg-gradient-to-b from-white to-green-50 rounded-xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">{t.featuredMedia}</h2>
            <Button asChild variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              <Link href="/media-gallery">
                {t.viewAll} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <MediaGallerySlider images={fieldWorkImages} autoPlay={true} interval={4000} title={t.fieldWorkTitle} />
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-8 bg-gradient-to-b from-green-50 to-white rounded-xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">{t.ourAchievements}</h2>
            <Button asChild variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              <Link href="/achievements">
                {t.viewAll} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <MediaGallerySlider images={achievementImages} autoPlay={true} interval={5000} title={t.awardsTitle} />
        </div>
      </section>
    </div>
  )
}
