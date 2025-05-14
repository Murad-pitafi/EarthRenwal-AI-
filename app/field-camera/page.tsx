import { ESPCamera } from "@/components/ESPCamera"

export default function FieldCameraPage() {
  return (
    <div className="container mx-auto py-8">
      <ESPCamera ipAddress="192.168.43.105" />
    </div>
  )
}
