"use client"

import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Droplets, CloudRain, Tractor, Sprout, AlertTriangle, BarChart2 } from "lucide-react"
import Image from "next/image"

export default function RiceStatistics() {
  const { language } = useUser()

  const translations = {
    en: {
      title: "Rice Statistics & Agricultural Insights",
      subtitle: "Key information about Pakistan's agricultural sector and rice production",
      overview: "Overview",
      challenges: "Challenges",
      soilHealth: "Soil Health",
      landPreparation: "Land Preparation",
      employmentTitle: "Agricultural Employment",
      employmentDesc: "The agriculture sector generates 37% of Pakistan's total employment",
      climateChangeTitle: "Climate Change Impact",
      climateChangeDesc:
        "Pakistan had to bear total of US$3792.52 million losses from 1999 to 2018 due to climate change",
      farmersImpactDesc:
        "Most farmers recognized multiple ways in which climate change impacted rice crop, yet most failed to adopt to the reported changes",
      landPrepTitle: "Land Preparation Techniques",
      landPrepDesc: "Proper land preparation is essential for successful rice cultivation",
      soilHealthTitle: "Importance of Soil Health",
      soilHealthDesc:
        "99% of the food and fiber we produce grows on soils and only 10-12% of the earth's surface is covered by soils available for agriculture",
      challengesTitle: "Key Challenges in Rice Production",
      techTitle: "Lack of Technology & Mechanization",
      techDesc: "Farm mechanization is crucial for agricultural growth but has been historically neglected in Pakistan",
      inputsTitle: "Low Quality Inputs",
      inputsDesc:
        "Lack of access to quality agriculture inputs has resulted in low average yields and poor profits for farmers",
      knowledgeTitle: "Lack of Knowledge for Best Practices",
      knowledgeDesc: "Manual transplanting of rice results in increased production costs and reduced yields",
      landPrepTechniques: [
        "Manage soil water (both wetting and drying)",
        "Control weeds",
        "Mix and incorporate soil amendments such as lime and basal fertilizer",
        "Control or destroy insects, their eggs, larvae, and breeding places",
        "Reduce wind and water erosion by leaving a rough and broken surface",
      ],
      soilHealthPoints: [
        "Soil supports life and allows plants like rice to grow upright and turn towards the sun",
        "Provides needed nutrients to ensure enough yields",
        "Stores and supplies water to plants",
        "Helps filter water and immobilize many toxic substances",
        "Mineralizes crop residues and stores carbon",
        "Exchanges gases with the atmosphere",
      ],
      bestPractices: [
        "Direct Seeded Rice (DSR) for water conservation",
        "Alternate Wetting and Drying (AWD) to address water challenges",
        "Mechanical transplanting for timely and cost-effective services",
        "Diversified rice-based multiple cropping system with high-value crops",
        "Application of best management practices for efficient use of scarce resources",
      ],
      riceProduction: "Rice Production in Pakistan",
      riceExport: "Rice Export Statistics",
      climateImpact: "Climate Impact on Rice",
      waterUsage: "Water Usage in Rice Cultivation",
      mechanization: "Mechanization Statistics",
      soilNutrients: "Soil Nutrient Levels",
    },
    ur: {
      title: "چاول کے اعداد و شمار اور زرعی بصیرت",
      subtitle: "پاکستان کے زرعی شعبے اور چاول کی پیداوار کے بارے میں اہم معلومات",
      overview: "جائزہ",
      challenges: "چیلنجز",
      soilHealth: "مٹی کی صحت",
      landPreparation: "زمین کی تیاری",
      employmentTitle: "زرعی روزگار",
      employmentDesc: "زراعت کا شعبہ پاکستان کی کل ملازمت کا 37% پیدا کرتا ہے",
      climateChangeTitle: "موسمیاتی تبدیلی کا اثر",
      climateChangeDesc:
        "پاکستان کو 1999 سے 2018 تک موسمیاتی تبدیلی کی وجہ سے کل 3792.52 ملین امریکی ڈالر کے نقصانات برداشت کرنا پڑے",
      farmersImpactDesc:
        "زیادہ تر کسانوں نے متعدد طریقوں سے موسمیاتی تبدیلی کے چاول کی فصل پر اثرات کو تسلیم کیا، لیکن زیادہ تر رپورٹ شدہ تبدیلیوں کو اپنانے میں ناکام رہے",
      landPrepTitle: "زمین کی تیاری کی تکنیک",
      landPrepDesc: "کامیاب چاول کی کاشت کے لیے مناسب زمین کی تیاری ضروری ہے",
      soilHealthTitle: "مٹی کی صحت کی اہمیت",
      soilHealthDesc:
        "ہم جو کھانا اور فائبر پیدا کرتے ہیں اس کا 99% مٹی پر اگتا ہے اور زمین کی سطح کا صرف 10-12% زراعت کے لیے دستیاب مٹی سے ڈھکا ہوا ہے",
      challengesTitle: "چاول کی پیداوار میں اہم چیلنجز",
      techTitle: "ٹیکنالوجی اور میکنائزیشن کی کمی",
      techDesc: "فارم میکنائزیشن زرعی ترقی کے لیے اہم ہے لیکن تاریخی طور پر پاکستان میں اس کو نظر انداز کیا گیا ہے",
      inputsTitle: "کم معیار کے ان پٹس",
      inputsDesc: "معیاری زرعی ان پٹس تک رسائی کی کمی کی وجہ سے اوسط پیداوار کم اور کسانوں کے منافع کم ہوئے ہیں",
      knowledgeTitle: "بہترین طریقوں کے لیے علم کی کمی",
      knowledgeDesc: "چاول کی دستی نشاندہی کی وجہ سے پیداوار کی لاگت میں اضافہ اور پیداوار میں کمی ہوتی ہے",
      landPrepTechniques: [
        "مٹی کے پانی کا انتظام کریں (دونوں گیلا اور خشک کرنا)",
        "کھرپتوار کو کنٹرول کریں",
        "چونا اور بنیادی کھاد جیسی مٹی کی ترمیم کو ملائیں اور شامل کریں",
        "کیڑوں، ان کے انڈوں، لاروا، اور پرورش کی جگہوں کو کنٹرول یا تباہ کریں",
        "ہوا اور پانی کی کٹاو کو کم کرنے کے لیے ایک ناہموار اور ٹوٹی ہوئی سطح چھوڑ دیں",
      ],
      soilHealthPoints: [
        "مٹی زندگی کو سہارا دیتی ہے اور چاول جیسے پودوں کو سیدھا کھڑا ہونے اور سورج کی طرف مڑنے کی اجازت دیتی ہے",
        "کافی پیداوار کو یقینی بنانے کے لیے ضروری غذائی اجزاء فراہم کرتی ہے",
        "پودوں کے لیے پانی ذخیرہ کرتی اور فراہم کرتی ہے",
        "پانی کو فلٹر کرنے اور بہت سے زہریلے مادوں کو غیر متحرک کرنے میں مدد کرتی ہے",
        "فصل کے بقایا جات کو معدنی بناتی اور کاربن ذخیرہ کرتی ہے",
        "ماحول کے ساتھ گیسوں کا تبادلہ کرتی ہے",
      ],
      bestPractices: [
        "پانی کے تحفظ کے لیے براہ راست بیج والا چاول (DSR)",
        "پانی کے چیلنجز سے نمٹنے کے لیے متبادل گیلا کرنا اور خشک کرنا (AWD)",
        "بروقت اور لاگت موثر خدمات کے لیے میکانکی نشاندہی",
        "اعلی قیمت والی فصلوں کے ساتھ متنوع چاول پر مبنی متعدد فصلی نظام",
        "کم وسائل کے موثر استعمال کے لیے بہترین انتظامی طریقوں کا اطلاق",
      ],
      riceProduction: "پاکستان میں چاول کی پیداوار",
      riceExport: "چاول کی برآمد کے اعداد و شمار",
      climateImpact: "چاول پر موسمیاتی اثر",
      waterUsage: "چاول کی کاشت میں پانی کا استعمال",
      mechanization: "میکنائزیشن کے اعداد و شمار",
      soilNutrients: "مٹی کے غذائی اجزاء کی سطح",
    },
  }

  const t = translations[language]

  // Rice production data for chart visualization
  const riceProductionData = [
    { year: "2018", production: 7.4 },
    { year: "2019", production: 7.2 },
    { year: "2020", production: 8.1 },
    { year: "2021", production: 8.4 },
    { year: "2022", production: 7.9 },
  ]

  // Water usage data
  const waterUsageData = [
    { method: "Traditional", usage: 100 },
    { method: "AWD", usage: 70 },
    { method: "DSR", usage: 60 },
  ]

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{t.title}</h1>
          <p className="text-gray-500 mt-2">{t.subtitle}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="bg-white rounded-lg p-4 shadow-sm">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="land-preparation">{t.landPreparation}</TabsTrigger>
          <TabsTrigger value="soil-health">{t.soilHealth}</TabsTrigger>
          <TabsTrigger value="challenges">{t.challenges}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  {t.employmentTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-lg font-semibold">{t.employmentDesc}</p>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {language === "en" ? "Employment in Agriculture" : "زراعت میں روزگار"}
                      </span>
                      <span className="text-sm font-medium">37%</span>
                    </div>
                    <Progress value={37} className="h-3 bg-gray-200">
                      <div className="bg-green-600 h-full rounded-full" style={{ width: "37%" }}></div>
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-blue-600" />
                  {t.climateChangeTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>{t.climateChangeDesc}</p>
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription>{t.farmersImpactDesc}</AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-green-600" />
                  {t.riceProduction}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  <Image src="/rice-production-chart.png" alt="Rice production chart" fill className="object-contain" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/80">
                    <p className="text-sm text-center">
                      {language === "en"
                        ? "Rice production in Pakistan (million tons)"
                        : "پاکستان میں چاول کی پیداوار (ملین ٹن)"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-white to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  {t.waterUsage}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  <Image
                    src="/water-usage-comparison.png"
                    alt="Water usage comparison"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/80">
                    <p className="text-sm text-center">
                      {language === "en"
                        ? "Water usage comparison between cultivation methods (%)"
                        : "کاشت کے طریقوں کے درمیان پانی کے استعمال کا موازنہ (%)"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <Image src="/images/background.jpg" alt="Rice fields" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-transparent flex items-center">
              <div className="p-6 text-white max-w-md">
                <h2 className="text-2xl font-bold mb-2">
                  {language === "en" ? "Pakistan's Rice Industry" : "پاکستان کی چاول کی صنعت"}
                </h2>
                <p>
                  {language === "en"
                    ? "Rice is the second most important staple food crop and export item in Pakistan"
                    : "چاول پاکستان میں دوسری سب سے اہم بنیادی غذائی فصل اور برآمدی آئٹم ہے"}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="land-preparation" className="mt-6 space-y-6">
          <Card className="bg-gradient-to-b from-white to-green-50">
            <CardHeader>
              <CardTitle>{t.landPrepTitle}</CardTitle>
              <CardDescription>{t.landPrepDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-3">
                    {t.landPrepTechniques.map((technique, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <span className="text-green-600 text-xs font-bold">{index + 1}</span>
                        </div>
                        <p>{technique}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/rice-land-preparation.png"
                    alt="Land preparation for rice cultivation"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-white to-green-50">
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Modern Land Preparation Methods" : "زمین کی تیاری کے جدید طریقے"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="font-semibold mb-2 flex items-center gap-1">
                    <Tractor className="h-4 w-4 text-green-600" />
                    {language === "en" ? "Mechanized Preparation" : "میکنائزڈ تیاری"}
                  </h3>
                  <p className="text-sm">
                    {language === "en"
                      ? "Using tractors and modern equipment for efficient land preparation"
                      : "کارآمد زمین کی تیاری کے لیے ٹریکٹر اور جدید آلات کا استعمال"}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold mb-2 flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    {language === "en" ? "Water Management" : "پانی کا انتظام"}
                  </h3>
                  <p className="text-sm">
                    {language === "en"
                      ? "Efficient irrigation systems to optimize water usage"
                      : "پانی کے استعمال کو بہتر بنانے کے لیے موثر آبپاشی کے نظام"}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h3 className="font-semibold mb-2 flex items-center gap-1">
                    <Sprout className="h-4 w-4 text-amber-600" />
                    {language === "en" ? "Direct Seeding" : "براہ راست بیج کاری"}
                  </h3>
                  <p className="text-sm">
                    {language === "en"
                      ? "Direct seeded rice reduces labor costs and water usage"
                      : "براہ راست بیج والا چاول مزدوری کی لاگت اور پانی کے استعمال کو کم کرتا ہے"}
                  </p>
                </div>
              </div>

              <div className="mt-6 relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/rice-cultivation-comparison.png"
                  alt="Traditional vs modern rice cultivation methods"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soil-health" className="mt-6 space-y-6">
          <Card className="bg-gradient-to-b from-white to-green-50">
            <CardHeader>
              <CardTitle>{t.soilHealthTitle}</CardTitle>
              <CardDescription>{t.soilHealthDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-3">
                    {t.soilHealthPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <Leaf className="h-3 w-3 text-green-600" />
                        </div>
                        <p>{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/healthy-soil-profile.png"
                    alt="Healthy soil for rice cultivation"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-white to-green-50">
            <CardHeader>
              <CardTitle>{t.soilNutrients}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p>
                    {language === "en"
                      ? "Organic materials can improve a soil's physical properties leading to better structure, aggregation, improved water-holding capacity, and better drainage. These changes may not do much to the flooded rice soils in Asia where fields are typically flooded during land preparation."
                      : "نامیاتی مواد مٹی کی طبعی خصوصیات کو بہتر بنا سکتے ہیں جس سے بہتر ساخت، اکٹھا ہونا، پانی کی گنجائش میں بہتری، اور بہتر نکاسی ہوتی ہے۔ یہ تبدیلیاں ایشیا میں سیلاب زدہ چاول کی مٹی پر زیادہ اثر نہیں کرتیں جہاں زمین کی تیاری کے دوران کھیتوں میں عام طور پر سیلاب آتا ہے۔"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <h3 className="font-semibold mb-2">{language === "en" ? "Nitrogen (N)" : "نائٹروجن (N)"}</h3>
                      <p className="text-sm">
                        {language === "en"
                          ? "Essential for leaf growth and green vegetation"
                          : "پتوں کی نشوونما اور سبز نباتات کے لیے ضروری"}
                      </p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <h3 className="font-semibold mb-2">{language === "en" ? "Phosphorous (P)" : "فاسفورس (P)"}</h3>
                      <p className="text-sm">
                        {language === "en"
                          ? "Critical for root development and flowering"
                          : "جڑوں کی نشوونما اور پھولوں کے لیے اہم"}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <h3 className="font-semibold mb-2">{language === "en" ? "Potassium (K)" : "پوٹاشیم (K)"}</h3>
                      <p className="text-sm">
                        {language === "en"
                          ? "Improves overall plant health and disease resistance"
                          : "پودوں کی مجموعی صحت اور بیماری سے مزاحمت کو بہتر بناتا ہے"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=500&query=soil nutrient cycle diagram showing NPK flow in rice fields"
                    alt="Soil nutrient cycle"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6 space-y-6">
          <Card className="bg-gradient-to-b from-white to-green-50">
            <CardHeader>
              <CardTitle>{t.challengesTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">{t.techTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{t.techDesc}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">{t.inputsTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{t.inputsDesc}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">{t.knowledgeTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{t.knowledgeDesc}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=500&query=challenges in rice farming infographic showing technology gap, input quality issues, and knowledge barriers"
                    alt="Challenges in rice farming"
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">
                    {language === "en" ? "Best Management Practices" : "بہترین انتظامی طریقے"}
                  </h3>
                  <ul className="space-y-3">
                    {t.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <span className="text-green-600 text-xs font-bold">✓</span>
                        </div>
                        <p>{practice}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
