"use client"

import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SoilQualityIndicatorProps {
  quality: string
  recommendations: string[]
}

export function SoilQualityIndicator({ quality, recommendations }: SoilQualityIndicatorProps) {
  const { language } = useUser()

  // Calculate progress based on quality
  const getProgressValue = () => {
    switch (quality.toLowerCase()) {
      case "good":
        return 90
      case "moderate":
        return 50
      case "poor":
        return 25
      default:
        return 0
    }
  }

  // Get color based on quality
  const getColorClass = () => {
    switch (quality.toLowerCase()) {
      case "good":
        return "bg-green-600"
      case "moderate":
        return "bg-yellow-500"
      case "poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{language === "en" ? "Soil Quality Assessment" : "مٹی کی معیار کا تعین"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{language === "en" ? "Quality Rating" : "معیار کی درجہ بندی"}</span>
              <span className={`font-bold px-3 py-1 rounded-full text-white ${getColorClass()}`}>{quality}</span>
            </div>
            <Progress value={getProgressValue()} className="h-3">
              <div className={`${getColorClass()} h-full rounded-full`} style={{ width: `${getProgressValue()}%` }} />
            </Progress>
          </div>

          {recommendations && recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-2">{language === "en" ? "Recommendations" : "تجاویز"}</h4>
              <ul className="space-y-2 pl-5 list-disc">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-md border border-green-100">
            <h4 className="font-semibold mb-2">
              {language === "en" ? "Understanding Your Results" : "اپنے نتائج کو سمجھنا"}
            </h4>
            <p className="text-sm text-gray-700">
              {language === "en"
                ? "Your soil quality rating is based on the NPK levels and pH value compared to optimal ranges for Pakistani soils. Follow the recommendations to improve soil health."
                : "آپ کی مٹی کی معیار کی درجہ بندی پاکستانی مٹی کے لیے مثالی رینج کے مقابلے میں NPK کی سطح اور pH ویلیو پر مبنی ہے۔ مٹی کی صحت کو بہتر بنانے کے لیے تجاویز پر عمل کریں۔"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
