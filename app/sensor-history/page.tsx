import { SensorDataTable } from "@/components/SensorDataTable"
import { ClientLayout } from "@/app/ClientLayout"

export default function SensorHistoryPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Sensor Data History</h1>
        <p className="text-muted-foreground mb-8">
          View and analyze historical sensor data collected from all connected devices.
        </p>

        <div className="bg-white p-6 rounded-lg shadow">
          <SensorDataTable maxEntries={1000} />
        </div>
      </div>
    </ClientLayout>
  )
}
