"use client"

import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Leaf, Users, Target, Award, Globe, Sprout, BarChart2 } from "lucide-react"

export default function About() {
  const { language } = useUser()

  const translations = {
    en: {
      title: "About EarthRenewal.AI",
      subtitle: "Empowering sustainable agriculture through AI-driven solutions",
      overview: "Overview",
      overviewText:
        "EarthRenewal.AI is a pioneering agricultural technology startup dedicated to transforming farming practices through artificial intelligence and data-driven solutions. Founded in 2024, our team combines expertise in agriculture, data science, and sustainable development to address the unique challenges faced by farmers in Pakistan and beyond.",
      mission: "Our Mission",
      missionText:
        "To empower farmers with accessible AI-driven tools that optimize crop yields, conserve resources, and promote sustainable agricultural practices while adapting to climate change challenges.",
      vision: "Our Vision",
      visionText:
        "A world where agriculture is environmentally sustainable, economically viable, and technologically advanced, ensuring food security for future generations.",
      values: "Our Values",
      valuesItems: [
        {
          title: "Sustainability",
          description: "Promoting farming practices that preserve natural resources and biodiversity",
        },
        {
          title: "Innovation",
          description: "Continuously developing cutting-edge solutions to agricultural challenges",
        },
        {
          title: "Accessibility",
          description: "Making advanced agricultural technology available to farmers of all scales",
        },
        {
          title: "Community",
          description: "Building strong relationships with farming communities and stakeholders",
        },
      ],
      approach: "Our Approach",
      approachText:
        "At EarthRenewal.AI, we combine artificial intelligence, data analytics, and agricultural science to develop practical solutions for real-world farming challenges. Our approach is rooted in understanding local farming contexts, collaborating with agricultural experts, and continuously refining our technologies based on farmer feedback.",
      team: "Our Team",
      teamMembers: [
        {
          name: "Muhammad Murad",
          position: "CEO & CTO | Founder",
          bio: "Agricultural technology expert with a passion for sustainable farming solutions.",
        },
        {
          name: "Nizamuldin",
          position: "CAIO | Co-Founder",
          bio: "AI specialist focused on developing intelligent systems for agricultural applications.",
        },
        {
          name: "Ahmed",
          position: "CPO | Co-Founder",
          bio: "Product strategist with extensive experience in agricultural innovation.",
        },
        {
          name: "Dr. Muhammad Farrukh Shahid",
          position: "Technical Advisor | Mentor",
          bio: "Academic researcher specializing in sustainable agricultural practices and technology integration.",
        },
      ],
      journey: "Our Journey",
      journeyItems: [
        {
          year: "2024",
          title: "Foundation",
          description: "EarthRenewal.AI was founded with a vision to revolutionize agriculture through AI",
        },
        {
          year: "2024",
          title: "Mali Agent Launch",
          description: "Released our flagship AI agricultural assistant to support Pakistani farmers",
        },
        {
          year: "2024",
          title: "Strategic Partnerships",
          description: "Formed key partnerships with ZettaMight and Agro TechVision to expand our reach",
        },
      ],
    },
    ur: {
      title: "ارتھ رینیوول۔اے آئی کے بارے میں",
      subtitle: "اے آئی پر مبنی حل کے ذریعے پائیدار زراعت کو بااختیار بنانا",
      overview: "جائزہ",
      overviewText:
        "ارتھ رینیوول۔اے آئی ایک پیش رو زرعی ٹیکنالوجی اسٹارٹ اپ ہے جو مصنوعی ذہانت اور ڈیٹا پر مبنی حل کے ذریعے کاشتکاری کے طریقوں کو تبدیل کرنے کے لیے وقف ہے۔ 2024 میں قائم، ہماری ٹیم زراعت، ڈیٹا سائنس، اور پائیدار ترقی میں مہارت کو یکجا کرتی ہے تاکہ پاکستان اور اس سے آگے کسانوں کو درپیش منفرد چیلنجز کا حل کیا جا سکے۔",
      mission: "ہمارا مشن",
      missionText:
        "کسانوں کو قابل رسائی اے آئی پر مبنی ٹولز کے ساتھ بااختیار بنانا جو فصل کی پیداوار کو بہتر بناتے ہیں، وسائل کو محفوظ کرتے ہیں، اور موسمیاتی تبدیلی کے چیلنجز کے مطابق پائیدار زرعی طریقوں کو فروغ دیتے ہیں۔",
      vision: "ہمارا وژن",
      visionText:
        "ایک ایسی دنیا جہاں زراعت ماحولیاتی طور پر پائیدار، معاشی طور پر قابل عمل، اور ٹیکنالوجی کے لحاظ سے جدید ہو، آنے والی نسلوں کے لیے غذائی تحفظ کو یقینی بناتے ہوئے۔",
      values: "ہماری اقدار",
      valuesItems: [
        {
          title: "پائیداری",
          description: "قدرتی وسائل اور حیاتیاتی تنوع کو محفوظ رکھنے والے کاشتکاری کے طریقوں کو فروغ دینا",
        },
        {
          title: "جدت",
          description: "زرعی چیلنجز کے لیے مسلسل جدید حل تیار کرنا",
        },
        {
          title: "قابل رسائی",
          description: "جدید زرعی ٹیکنالوجی کو تمام پیمانوں کے کسانوں کے لیے دستیاب کرنا",
        },
        {
          title: "کمیونٹی",
          description: "کاشتکاری کمیونٹیز اور اسٹیک ہولڈرز کے ساتھ مضبوط تعلقات قائم کرنا",
        },
      ],
      approach: "ہمارا نقطہ نظر",
      approachText:
        "ارتھ رینیوول۔اے آئی میں، ہم حقیقی دنیا کے کاشتکاری چیلنجز کے لیے عملی حل تیار کرنے کے لیے مصنوعی ذہانت، ڈیٹا تجزیہ، اور زرعی سائنس کو یکجا کرتے ہیں۔ ہمارا نقطہ نظر مقامی کاشتکاری کے سیاق و سباق کو سمجھنے، زرعی ماہرین کے ساتھ تعاون کرنے، اور کسانوں کی رائے کی بنیاد پر اپنی ٹیکنالوجیز کو مسلسل بہتر بنانے میں جڑا ہوا ہے۔",
      team: "ہماری ٹیم",
      teamMembers: [
        {
          name: "محمد مراد",
          position: "سی ای او اور سی ٹی او | بانی",
          bio: "پائیدار کاشتکاری حل کے لیے جذبے کے ساتھ زرعی ٹیکنالوجی کے ماہر۔",
        },
        {
          name: "نظام الدین",
          position: "سی اے آئی او | شریک بانی",
          bio: "زرعی ایپلیکیشنز کے لیے ذہین سسٹم تیار کرنے پر توجہ مرکوز کرنے والے اے آئی اسپیشلسٹ۔",
        },
        {
          name: "احمد",
          position: "سی پی او | شریک بانی",
          bio: "زرعی جدت میں وسیع تجربے کے ساتھ پروڈکٹ اسٹریٹجسٹ۔",
        },
        {
          name: "ڈاکٹر محمد فرخ شاہد",
          position: "ٹیکنیکل ایڈوائزر | مینٹر",
          bio: "پائیدار زرعی طریقوں اور ٹیکنالوجی انضمام میں مہارت رکھنے والے اکیڈمک محقق۔",
        },
      ],
      journey: "ہمارا سفر",
      journeyItems: [
        {
          year: "2024",
          title: "بنیاد",
          description: "ارتھ رینیوول۔اے آئی کی بنیاد اے آئی کے ذریعے زراعت میں انقلاب لانے کے وژن کے ساتھ رکھی گئی",
        },
        {
          year: "2024",
          title: "مالی ایجنٹ کا آغاز",
          description: "پاکستانی کسانوں کی مدد کے لیے اپنا فلیگ شپ اے آئی زرعی اسسٹنٹ جاری کیا",
        },
        {
          year: "2024",
          title: "اسٹریٹجک پارٹنرشپس",
          description: "اپنی پہنچ کو بڑھانے کے لیے زیٹامائٹ اور ایگرو ٹیک ویژن کے ساتھ اہم شراکت داریاں قائم کیں",
        },
      ],
    },
  }

  const t = translations[language]

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.subtitle}</p>
      </div>

      {/* Overview Section */}
      <section className="bg-gradient-to-r from-green-50 to-white rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">{t.overview}</h2>
        </div>
        <p className="text-lg">{t.overviewText}</p>
      </section>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-b from-white to-green-50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>{t.mission}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{t.missionText}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-white to-green-50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>{t.vision}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{t.visionText}</p>
          </CardContent>
        </Card>
      </div>

      {/* Values Section */}
      <section className="bg-gradient-to-r from-green-50 to-white rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Award className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">{t.values}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {t.valuesItems.map((value, index) => (
            <Card key={index} className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Approach Section */}
      <section className="bg-gradient-to-r from-white to-green-50 rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Sprout className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">{t.approach}</h2>
        </div>
        <p className="text-lg">{t.approachText}</p>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-to-r from-green-50 to-white rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">{t.team}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {t.teamMembers.map((member, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-green-100 flex items-center justify-center">
                    <Image
                      src="/diverse-group.png"
                      alt={member.name}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-green-600 mb-2">{member.position}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Journey Section */}
      <section className="bg-gradient-to-r from-green-50 to-white rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">{t.journey}</h2>
        </div>
        <div className="space-y-8 mt-8">
          {t.journeyItems.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">{item.year}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dataset Derive Section */}
      <section className="bg-gradient-to-r from-white to-green-50 rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <BarChart2 className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">{language === "en" ? "Our Data Approach" : "ہمارا ڈیٹا نقطہ نظر"}</h2>
        </div>
        <p className="text-lg mb-6">
          {language === "en"
            ? "At EarthRenewal.AI, we leverage diverse agricultural datasets to derive actionable insights for farmers. Our data-driven approach combines satellite imagery, weather patterns, soil samples, and historical crop yields to provide precise recommendations."
            : "ارتھ رینیوول۔اے آئی میں، ہم کسانوں کے لیے قابل عمل بصیرت حاصل کرنے کے لیے متنوع زرعی ڈیٹا سیٹس کا فائدہ اٹھاتے ہیں۔ ہمارا ڈیٹا پر مبنی نقطہ نظر سیٹلائٹ امیجری، موسم کے پیٹرن، مٹی کے نمونے، اور تاریخی فصل کی پیداوار کو یکجا کرتا ہے تاکہ درست سفارشات فراہم کی جا سکیں۔"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>{language === "en" ? "Data Collection" : "ڈیٹا جمع کرنا"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {language === "en"
                  ? "We gather data from multiple sources including IoT sensors, satellite imagery, weather stations, and farmer inputs to create comprehensive agricultural datasets."
                  : "ہم جامع زرعی ڈیٹا سیٹس بنانے کے لیے آئی او ٹی سینسرز، سیٹلائٹ امیجری، موسمی اسٹیشنوں، اور کسانوں کے ان پٹس سمیت متعدد ذرائع سے ڈیٹا اکٹھا کرتے ہیں۔"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>{language === "en" ? "Data Processing" : "ڈیٹا پروسیسنگ"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {language === "en"
                  ? "Our AI algorithms clean, normalize, and analyze the collected data, identifying patterns and correlations that human analysis might miss."
                  : "ہمارے اے آئی الگورتھم جمع کردہ ڈیٹا کو صاف، نارمل، اور تجزیہ کرتے ہیں، ایسے پیٹرن اور تعلقات کی شناخت کرتے ہیں جو انسانی تجزیہ سے چھوٹ سکتے ہیں۔"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>{language === "en" ? "Insight Generation" : "بصیرت کی تخلیق"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {language === "en"
                  ? "We transform processed data into actionable recommendations for optimal planting times, irrigation schedules, fertilizer application, and pest management."
                  : "ہم پروسیس شدہ ڈیٹا کو بہترین کاشت کے اوقات، آبپاشی کے شیڈول، کھاد کے استعمال، اور کیڑے مار ادویات کے انتظام کے لیے قابل عمل سفارشات میں تبدیل کرتے ہیں۔"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-100">
          <h3 className="text-xl font-bold mb-4">{language === "en" ? "Our Data Sources" : "ہمارے ڈیٹا کے ذرائع"}</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-xs font-bold">✓</span>
              </div>
              <span>{language === "en" ? "Farmer input and feedback" : "کسان کا ان پٹ اور فیڈ بیک"}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-xs font-bold">✓</span>
              </div>
              <span>{language === "en" ? "Soil sensor readings" : "مٹی کے سینسر کی ریڈنگ"}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-xs font-bold">✓</span>
              </div>
              <span>{language === "en" ? "Crop images" : "فصل کی تصاویر"}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-xs font-bold">✓</span>
              </div>
              <span>{language === "en" ? "Weather station data" : "موسمی اسٹیشن کا ڈیٹا"}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-xs font-bold">✓</span>
              </div>
              <span>{language === "en" ? "Historical crop yield data" : "تاریخی فصل کی پیداوار کا ڈیٹا"}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Image Section */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image src="/images/background.jpg" alt="Agricultural landscape" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-transparent flex items-center">
          <div className="p-6 text-white max-w-md">
            <h2 className="text-2xl font-bold mb-2">
              {language === "en" ? "Join Our Mission" : "ہمارے مشن میں شامل ہوں"}
            </h2>
            <p>
              {language === "en"
                ? "Together, we can transform agriculture for a sustainable future."
                : "مل کر، ہم پائیدار مستقبل کے لیے زراعت کو تبدیل کر سکتے ہیں۔"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
