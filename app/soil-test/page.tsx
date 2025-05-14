import GroqSoilTest from "@/components/GroqSoilTest"

export default function SoilTestPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Soil Analysis</h1>
        <p className="text-muted-foreground">
          Test soil parameters and get AI-powered analysis and recommendations for Sindh, Pakistan
        </p>
      </div>

      <GroqSoilTest />
    </div>
  )
}
