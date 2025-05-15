import { RiceClassifier } from "@/components/RiceClassifier"

export default function RiceClassificationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Rice Variety Classification</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto">
        Upload an image of rice grains to identify the variety. Our AI model can distinguish between Basmati, IRRI-6,
        and other common rice varieties grown in Pakistan.
      </p>

      <RiceClassifier />

      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">About Rice Classification</h2>
        <p className="mb-4">
          Rice variety identification is crucial for farmers, traders, and consumers to ensure quality and authenticity.
          Our deep learning model has been trained on thousands of images of different rice varieties to provide
          accurate classification.
        </p>
        <p className="mb-4">The model can identify the following rice varieties:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Basmati - Known for its distinctive aroma and long grains</li>
          <li>IRRI-6 - High-yielding variety developed by the International Rice Research Institute</li>
          <li>Super Kernel - Premium quality rice with extra-long grains</li>
          <li>PK-386 - Drought-resistant variety suitable for various regions in Pakistan</li>
          <li>KS-282 - Early maturing variety with good cooking quality</li>
        </ul>
        <p>For best results, ensure your image is well-lit, focused, and shows multiple grains clearly.</p>
      </div>
    </div>
  )
}
