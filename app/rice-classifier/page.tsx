import { RiceClassifierClient } from "@/components/RiceClassifierClient"

export const metadata = {
  title: "Rice Variety Classifier",
  description: "Identify different rice varieties using image recognition",
}

export default function RiceClassifierPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Rice Variety Classifier</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto">
        This tool uses machine learning to identify different rice varieties from images. Upload a clear image of rice
        grains or use your camera to capture one.
      </p>

      <RiceClassifierClient />

      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">About Rice Classification</h2>
        <p className="mb-4">
          Pakistan is known for producing several high-quality rice varieties, including Basmati, IRRI-6, Super Kernel,
          PK-386, and KS-282. Each variety has distinct characteristics that affect cooking quality, taste, and market
          value.
        </p>
        <p className="mb-4">
          Our classifier can help farmers, traders, and consumers identify these varieties accurately, ensuring proper
          pricing and usage.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Tips for Best Results</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use good lighting when taking photos</li>
          <li>Place rice grains on a contrasting background</li>
          <li>Ensure the grains are clearly visible and not overlapping too much</li>
          <li>Include multiple grains in the image for better accuracy</li>
        </ul>
      </div>
    </div>
  )
}
