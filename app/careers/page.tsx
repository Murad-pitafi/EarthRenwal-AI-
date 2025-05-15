import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Lightbulb, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Careers | EarthRenewal.AI",
  description: "Join our team and make a difference in sustainable agriculture",
}

export default function CareersPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Internship Opportunities</h1>

      <div className="max-w-4xl mx-auto">
        <p className="text-lg text-center mb-12">
          We're looking for talented students to join our mission of empowering sustainable agriculture through
          AI-driven solutions. Our 2-month internship program offers hands-on experience in a dynamic environment.
        </p>

        <Card className="mb-12">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Internship Program (2 Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-6">
              We welcome students who are passionate about sustainable agriculture, technology, and making a positive
              impact. Our internships are designed to provide real-world experience while contributing to meaningful
              projects.
            </p>

            <div className="mb-6">
              <h3 className="font-medium mb-3">Potential Areas of Interest:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Artificial Intelligence & Machine Learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Web Development & UI/UX Design</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Data Analysis & Visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>IoT & Embedded Systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Agricultural Technology</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Content Creation & Communication</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3">What You'll Gain:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0">•</div>
                  <span>Hands-on experience with cutting-edge technologies</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0">•</div>
                  <span>Mentorship from experienced professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0">•</div>
                  <span>Opportunity to work on real-world agricultural challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0">•</div>
                  <span>Certificate of completion and recommendation letter</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="bg-green-50 p-6 rounded-lg mb-12">
          <h2 className="text-xl font-semibold mb-4">How to Apply</h2>
          <p className="mb-6">
            Complete our application form by clicking the button below. You'll need to provide your basic information
            and area of interest.
          </p>

          <div className="flex justify-center mb-6">
            <a href="https://forms.gle/1o6WXzPzWL9Yk6ek6" target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                Apply Now <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Applications are reviewed on a rolling basis. We'll contact selected candidates for the next steps.
          </p>
        </div>
      </div>
    </div>
  )
}
