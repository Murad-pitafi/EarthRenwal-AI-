import { NextResponse } from "next/server"

const insights = [
  {
    title: "Optimal Planting Time",
    description:
      "Based on soil temperature and moisture levels, the optimal planting time for corn is estimated to be in 2 weeks.",
  },
  {
    title: "Irrigation Recommendation",
    description:
      "Current soil moisture levels suggest increasing irrigation by 15% to maintain optimal growing conditions.",
  },
  {
    title: "Pest Alert",
    description:
      "Recent weather patterns indicate a higher risk of aphid infestation. Consider implementing preventive measures.",
  },
  {
    title: "Yield Prediction",
    description:
      "Given current conditions and historical data, this season's wheat yield is projected to be 5% higher than last year.",
  },
]

export async function GET() {
  return NextResponse.json(insights)
}
