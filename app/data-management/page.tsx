import { DataStorageManager } from "@/components/DataStorageManager"
import { StorageRecommendations } from "@/components/StorageRecommendations"

export default function DataManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Data Management</h1>
      <p className="text-muted-foreground mb-8">
        Configure how sensor data is collected, stored, and managed in your application.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DataStorageManager onToggleRealData={() => {}} isRealDataEnabled={false} />
        </div>

        <div>
          <StorageRecommendations />
        </div>
      </div>
    </div>
  )
}
