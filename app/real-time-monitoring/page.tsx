import { RealTimeMonitoring } from "@/components/RealTimeMonitoring"

export const metadata = {
  title: "Real-time Monitoring | EarthRenewal AI",
  description: "Monitor your field sensors in real-time with Arduino Cloud integration",
}

export default function RealTimeMonitoringPage() {
  return (
    <div className="container mx-auto py-8">
      <RealTimeMonitoring />
    </div>
  )
}
