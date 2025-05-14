"use client"

import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Leaf, Users, Target, Award, Globe, Sprout, BarChart2, Trophy, Calendar, MapPin } from "lucide-react"
import { DataCollectionSection } from "@/components/DataCollectionSection"

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
          bio: "AI Engineer",
          image: "/images/team/murad.png",
        },
        {
          name: "Nizamuldin",
          position: "CAIO | Co-Founder",
          bio: "AI Engineer",
          image: "/images/team/nizam.png",
        },
        {
          name: "Ahmed",
          position: "CPO | Co-Founder",
          bio: "AI Engineer",
          image: "/images/team/ahmed.png",
        },
        {
          name: "Dr. Muhammad Farrukh Shahid",
          position: "Technical Advisor | Mentor",
          bio: "Assistant Professor",
          image: "/images/team/farrukh.png",
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
          year: "2025",
          title: "Strategic Partnerships",
          description: "Formed key partnerships with ZettaMight and Agro TechVision to expand our reach",
        },
      ],
      awards: "Our Awards & Recognition",
      awardsSubtitle: "Celebrating our achievements and milestones",
      awardsItems: [
        {
          name: "SciCom",
          date: "March 2024",
          location: "Karachi",
          type: "recognition",
          icon: "Trophy",
        },
        {
          name: "Climate Ideathon",
          date: "April 2024",
          location: "Karachi",
          type: "recognition",
          icon: "Leaf",
        },
        {
          name: "AIIC",
          date: "June 2024",
          location: "Islamabad",
          type: "recognition",
          icon: "Cpu",
        },
        {
          name: "PASHA",
          date: "September 2024",
          location: "Karachi",
          type: "recognition",
          icon: "Code",
        },
        {
          name: "IEEP Winner",
          date: "September 2024",
          location: "Karachi",
          type: "winner",
          icon: "Award",
        },
        {
          name: "Zindigi Prize",
          date: "September 2024",
          location: "Hyderabad",
          type: "recognition",
          icon: "Wallet",
        },
        {
          name: "Teknofest Top 20",
          date: "November 2024",
          location: "Karachi",
          type: "recognition",
          icon: "Globe",
        },
        {
          name: "YESIST12 Winner",
          date: "May 2025",
          location: "Karachi",
          type: "winner",
          icon: "Trophy",
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
          bio: "اے آئی انجینئر",
          image: "/images/team/murad.png",
        },
        {
          name: "نظام الدین",
          position: "سی اے آئی او | شریک بانی",
          bio: "اے آئی انجینئر",
          image: "/images/team/nizam.png",
        },
        {
          name: "احمد",
          position: "سی پی او | شریک بانی",
          bio: "اے آئی انجینئر",
          image: "/images/team/ahmed.png",
        },
        {
          name: "ڈاکٹر محمد فرخ شاہد",
          position: "ٹیکنیکل ایڈوائزر | مینٹر",
          bio: "اسسٹنٹ پروفیسر",
          image: "/images/team/farrukh.png",
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
          year: "2025",
          title: "اسٹریٹجک پارٹنرشپس",
          description: "اپنی پہنچ کو بڑھانے کے لیے زیٹامائٹ اور ایگرو ٹیک ویژن کے ساتھ اہم شراکت داریاں قائم کیں",
        },
      ],
      awards: "ہمارے ایوارڈز اور اعتراف",
      awardsSubtitle: "ہماری کامیابیوں اور سنگ میل کا جشن",
      awardsItems: [
        {
          name: "سائی کوم",
          date: "مارچ 2024",
          location: "کراچی",
          type: "recognition",
          icon: "Trophy",
        },
        {
          name: "کلائمیٹ آئیڈیاتھون",
          date: "اپریل 2024",
          location: "کراچی",
          type: "recognition",
          icon: "Leaf",
        },
        {
          name: "اے آئی آئی سی",
          date: "جون 2024",
          location: "اسلام آباد",
          type: "recognition",
          icon: "Cpu",
        },
        {
          name: "پاشا",
          date: "ستمبر 2024",
          location: "کراچی",
          type: "recognition",
          icon: "Code",
        },
        {
          name: "آئی ای ای پی ونر",
          date: "ستمبر 2024",
          location: "کراچی",
          type: "winner",
          icon: "Award",
        },
        {
          name: "زندگی پرائز",
          date: "ستمبر 2024",
          location: "حیدرآباد",
          type: "recognition",
          icon: "Wallet",
        },
        {
          name: "ٹیکنوفیسٹ ٹاپ 20",
          date: "نومبر 2024",
          location: "کراچی",
          type: "recognition",
          icon: "Globe",
        },
        {
          name: "یسسٹ 12 ونر",
          date: "مئی 2025",
          location: "کراچی",
          type: "winner",
          icon: "Trophy",
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

      {/* Awards & Recognition Section */}
      <section className="bg-gradient-to-r from-green-50 to-white rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{t.awards}</h2>
            <p className="text-gray-600">{t.awardsSubtitle}</p>
          </div>
        </div>

        {/* Awards Chain */}
        <div className="mt-12 relative">
          {/* Chain Design */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-200 transform -translate-y-1/2 z-0"></div>

          <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-6 md:gap-4">
            {t.awardsItems.map((award, index) => {
              // Dynamically import icons based on the icon name
              let IconComponent
              switch (award.icon) {
                case "Trophy":
                  IconComponent = Trophy
                  break
                case "Leaf":
                  IconComponent = Leaf
                  break
                case "Award":
                  IconComponent = Award
                  break
                case "Cpu":
                  IconComponent = Target
                  break
                case "Code":
                  IconComponent = Sprout
                  break
                case "Lightbulb":
                  IconComponent = Award
                  break
                case "Wallet":
                  IconComponent = BarChart2
                  break
                case "Globe":
                  IconComponent = Globe
                  break
                default:
                  IconComponent = Trophy
              }

              return (
                <div
                  key={index}
                  className={`relative z-10 w-full md:w-[calc(25%-1rem)] ${
                    index % 2 === 0 ? "md:mt-0 md:mb-16" : "md:mt-16 md:mb-0"
                  }`}
                >
                  <div
                    className={`
                      bg-white rounded-lg shadow-md p-4 border-t-4 
                      ${award.type === "winner" ? "border-green-500" : "border-green-300"}
                      transition-all hover:shadow-lg hover:-translate-y-1
                    `}
                  >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                      <div
                        className={`w-8 h-8 rounded-full ${award.type === "winner" ? "bg-green-500" : "bg-green-200"} flex items-center justify-center`}
                      >
                        <IconComponent
                          className={`h-4 w-4 ${award.type === "winner" ? "text-white" : "text-green-700"}`}
                        />
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <h3
                        className={`font-bold text-lg ${award.type === "winner" ? "text-green-700" : "text-gray-800"}`}
                      >
                        {award.name}
                      </h3>

                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
                        <Calendar className="h-3 w-3" />
                        <span>{award.date}</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{award.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vertical connector for mobile */}
                  <div className="md:hidden absolute left-1/2 bottom-0 w-0.5 h-4 bg-green-200 transform translate-x-[-50%] translate-y-[100%]"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

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
                      src={member.image || "/placeholder.svg"}
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

      <DataCollectionSection />

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
