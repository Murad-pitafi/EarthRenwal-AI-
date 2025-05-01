import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Microscope, Award, ImageIcon, BarChart } from "lucide-react"
import { MediaGallerySlider } from "@/components/MediaGallerySlider"

export default function Home() {
  const fieldWorkImages = ["/images/media_gallery_1.jpg", "/images/media_gallery_2.jpg", "/images/media_gallery_4.jpg"]

  const achievementImages = ["/images/achievements_1.jpg", "/images/achievements_2.jpg", "/images/media_gallery_3.jpg"]

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full rounded-xl overflow-hidden">
        <Image src="/images/background.jpg" alt="Agricultural landscape" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-green-600/40 flex flex-col items-center justify-center text-center p-4">
          <Image src="/images/logo.png" alt="EarthRenewal.AI Logo" width={120} height={120} className="mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">EarthRenewal.AI</h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
            Empowering sustainable agriculture through AI-driven solutions
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/mali-agent">
                Explore Mali Agent AI <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 border-white"
            >
              <Link href="/soil-analysis">
                Soil Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-8 bg-gradient-to-b from-white to-green-50 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-8">Our Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mali Agent AI</h3>
              <p className="text-gray-600">
                AI-powered assistant for farmers providing personalized agricultural advice
              </p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/mali-agent">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Microscope className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Soil Analysis</h3>
              <p className="text-gray-600">Advanced soil monitoring and analysis for optimal crop health</p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/soil-analysis">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Media Gallery</h3>
              <p className="text-gray-600">Explore our field work and community engagement activities</p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/media-gallery">
                  View Gallery <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Achievements</h3>
              <p className="text-gray-600">Recognition and milestones in sustainable agriculture innovation</p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/achievements">
                  View Achievements <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rice Statistics</h3>
              <p className="text-gray-600">
                Comprehensive data and insights on Pakistan's rice production and agricultural sector
              </p>
              <Button asChild variant="link" className="mt-4 text-green-600">
                <Link href="/rice-statistics">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-8 bg-gradient-to-r from-green-900 to-green-700 rounded-xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg mb-6">
            At EarthRenewal.AI, we're committed to revolutionizing agriculture through sustainable practices and
            cutting-edge technology. Our mission is to empower farmers with AI-driven solutions that optimize crop
            yields while preserving natural resources for future generations.
          </p>
          <Button asChild className="bg-white text-green-700 hover:bg-green-50">
            <Link href="/about">Learn About Our Journey</Link>
          </Button>
        </div>
      </section>

      {/* Featured Media Gallery */}
      <section className="py-8 bg-gradient-to-b from-white to-green-50 rounded-xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Featured Media</h2>
            <Button asChild variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              <Link href="/media-gallery">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <MediaGallerySlider
            images={fieldWorkImages}
            autoPlay={true}
            interval={4000}
            title="Field Work & Community Engagement"
          />
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-8 bg-gradient-to-b from-green-50 to-white rounded-xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Our Achievements</h2>
            <Button asChild variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              <Link href="/achievements">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <MediaGallerySlider images={achievementImages} autoPlay={true} interval={5000} title="Awards & Recognition" />
        </div>
      </section>
    </div>
  )
}
