import { ModelStatus } from "@/components/ModelStatus"
import { ModelUploader } from "@/components/ModelUploader"

export default function ModelStatusPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Soil Quality Model Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ModelStatus />
        </div>
        <div>
          <ModelUploader />
        </div>
      </div>
    </div>
  )
}
