import { type NextRequest, NextResponse } from "next/server"

// Define the soil parameter ranges for Sindh, Pakistan
const SOIL_RANGES = {
  nitrogen: {
    excessive: { min: 450, max: 10000 },
    good: { min: 300, max: 450 },
    moderate: { min: 150, max: 300 },
    poor: { min: 0, max: 150 },
  },
  phosphorus: {
    excessive: { min: 600, max: 10000 },
    good: { min: 400, max: 600 },
    moderate: { min: 200, max: 400 },
    poor: { min: 0, max: 200 },
  },
  potassium: {
    excessive: { min: 600, max: 10000 },
    good: { min: 400, max: 600 },
    moderate: { min: 200, max: 400 },
    poor: { min: 0, max: 200 },
  },
  temperature: {
    excessive: { min: 45, max: 100 },
    good: { min: 20, max: 30 },
    moderate: { min: 30, max: 35 },
    poor: { min: 35, max: 45 },
  },
  humidity: {
    excessive: { min: 90, max: 100 },
    good: { min: 60, max: 90 },
    moderate: { min: 30, max: 60 },
    poor: { min: 10, max: 30 },
  },
  gas_level: {
    excessive: { min: 900, max: 10000 },
    good: { min: 300, max: 500 },
    moderate: { min: 500, max: 700 },
    poor: { min: 700, max: 900 },
  },
}

// Function to classify a parameter value
function classifyParameter(
  value: number,
  ranges: typeof SOIL_RANGES.nitrogen,
): "Excessive" | "Good" | "Moderate" | "Poor" {
  if (value >= ranges.excessive.min) {
    return "Excessive"
  } else if (value >= ranges.good.min && value <= ranges.good.max) {
    return "Good"
  } else if (value >= ranges.moderate.min && value <= ranges.moderate.max) {
    return "Moderate"
  } else {
    return "Poor"
  }
}

// Function to determine overall soil quality
function determineSoilQuality(
  classifications: Record<string, "Excessive" | "Good" | "Moderate" | "Poor">,
): "Excessive" | "Good" | "Moderate" | "Poor" {
  const counts = {
    Excessive: 0,
    Good: 0,
    Moderate: 0,
    Poor: 0,
  }

  // Count occurrences of each classification
  Object.values(classifications).forEach((classification) => {
    counts[classification]++
  })

  // Determine overall quality
  if (counts.Excessive >= 2) {
    return "Excessive"
  } else if (counts.Poor >= 2) {
    return "Poor"
  } else if (counts.Good >= 4) {
    return "Good"
  } else {
    return "Moderate"
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Log the incoming data for debugging
    console.log("Received soil parameters:", data)

    const { nitrogen, phosphorus, potassium, temperature, humidity, gas_level } = data

    // Validate all required parameters exist
    if (!nitrogen || !phosphorus || !potassium || !temperature || !humidity || !gas_level) {
      console.error("Missing required soil parameters")
      return NextResponse.json(
        {
          error: "Missing required soil parameters",
          message:
            "All soil parameters (nitrogen, phosphorus, potassium, temperature, humidity, gas_level) are required",
        },
        { status: 400 },
      )
    }

    // Classify each parameter
    const classifications = {
      nitrogen: classifyParameter(nitrogen, SOIL_RANGES.nitrogen),
      phosphorus: classifyParameter(phosphorus, SOIL_RANGES.phosphorus),
      potassium: classifyParameter(potassium, SOIL_RANGES.potassium),
      temperature: classifyParameter(temperature, SOIL_RANGES.temperature),
      humidity: classifyParameter(humidity, SOIL_RANGES.humidity),
      gas_level: classifyParameter(gas_level, SOIL_RANGES.gas_level),
    }

    // Determine overall soil quality
    const overallQuality = determineSoilQuality(classifications)

    // Prepare the prompt for Groq
    const prompt = `
      You are an agricultural expert specializing in soil analysis for Sindh, Pakistan. 
      Analyze the following soil parameters and provide recommendations:
      
      - Nitrogen: ${nitrogen} mg/kg (Classification: ${classifications.nitrogen})
      - Phosphorus: ${phosphorus} mg/kg (Classification: ${classifications.phosphorus})
      - Potassium: ${potassium} mg/kg (Classification: ${classifications.potassium})
      - Temperature: ${temperature}°C (Classification: ${classifications.temperature})
      - Humidity: ${humidity}% (Classification: ${classifications.humidity})
      - Gas Level: ${gas_level} ppm (Classification: ${classifications.gas_level})
      
      Overall Soil Quality: ${overallQuality}
      
      Important context:
      - "Excessive" classification means the level is too high and needs to be reduced
      - "Good" classification means the level is optimal
      - "Moderate" classification means the level is acceptable but could be improved
      - "Poor" classification means the level is too low and needs to be increased
      
      Based on these parameters and the overall soil quality classification, provide:
      1. A brief assessment of the soil condition (2-3 sentences)
      2. 3-5 specific recommendations for improving soil health, including how to:
         - Reduce any excessive nutrient levels
         - Increase any poor nutrient levels
         - Maintain good nutrient levels
      3. A list of 3-5 crops that would be suitable for growing in these soil conditions in Sindh, Pakistan
      
      Format your response as JSON with the following structure:
      {
        "assessment": "Your soil assessment here",
        "recommendations": ["Recommendation 1", "Recommendation 2", ...],
        "suitableCrops": ["Crop 1", "Crop 2", ...]
      }
      
      Provide only the JSON response without any additional text.
    `

    // Call Groq API
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are an agricultural expert specializing in soil analysis for Sindh, Pakistan.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    })

    // Log the Groq API response status
    console.log("Groq API response status:", groqResponse.status)

    if (!groqResponse.ok) {
      console.error(`Groq API error: ${groqResponse.status}`)

      // Provide a fallback response when the Groq API fails
      return NextResponse.json({
        prediction: overallQuality,
        assessment:
          "The soil analysis service is currently experiencing issues. Here's a basic assessment based on your parameters.",
        recommendations: generateFallbackRecommendations(classifications),
        suitableCrops: ["Rice", "Wheat", "Cotton", "Sugarcane"],
      })
    }

    const groqData = await groqResponse.json()
    console.log("Groq API response received")

    // Check if the response has the expected structure
    if (!groqData || !groqData.choices || !groqData.choices[0] || !groqData.choices[0].message) {
      console.error("Unexpected Groq API response structure:", groqData)

      // Provide a fallback response when the Groq API response is malformed
      return NextResponse.json({
        prediction: overallQuality,
        assessment:
          "The soil analysis service returned an unexpected response. Here's a basic assessment based on your parameters.",
        recommendations: generateFallbackRecommendations(classifications),
        suitableCrops: ["Rice", "Wheat", "Cotton", "Sugarcane"],
      })
    }

    const responseContent = groqData.choices[0].message.content
    console.log("Groq response content:", responseContent)

    // Parse the JSON response from Groq
    let parsedResponse
    try {
      // Extract JSON if it's wrapped in code blocks
      const jsonMatch =
        responseContent.match(/```json\n([\s\S]*)\n```/) ||
        responseContent.match(/```\n([\s\S]*)\n```/) ||
        responseContent.match(/\{[\s\S]*\}/)

      let jsonContent
      if (jsonMatch) {
        jsonContent = jsonMatch[1] || jsonMatch[0]
      } else {
        jsonContent = responseContent
      }

      // Clean up the content to ensure it's valid JSON
      jsonContent = jsonContent.trim()
      if (!jsonContent.startsWith("{")) {
        jsonContent = "{" + jsonContent
      }
      if (!jsonContent.endsWith("}")) {
        jsonContent = jsonContent + "}"
      }

      console.log("Attempting to parse JSON:", jsonContent)
      parsedResponse = JSON.parse(jsonContent)

      // Validate the parsed response has the required fields
      if (!parsedResponse.assessment || !parsedResponse.recommendations || !parsedResponse.suitableCrops) {
        throw new Error("Missing required fields in parsed response")
      }
    } catch (error) {
      console.error("Error parsing Groq response:", error)
      console.log("Raw response:", responseContent)

      // Provide a structured fallback response
      parsedResponse = {
        assessment: generateFallbackAssessment(classifications, overallQuality),
        recommendations: generateFallbackRecommendations(classifications),
        suitableCrops: ["Rice", "Wheat", "Cotton", "Sugarcane"],
      }
    }

    // Return the final response
    return NextResponse.json({
      prediction: overallQuality,
      assessment: parsedResponse.assessment,
      recommendations: parsedResponse.recommendations,
      suitableCrops: parsedResponse.suitableCrops,
    })
  } catch (error) {
    console.error("Error in Groq soil analysis:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze soil data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Helper function to generate fallback assessment
function generateFallbackAssessment(
  classifications: Record<string, "Excessive" | "Good" | "Moderate" | "Poor">,
  overallQuality: "Excessive" | "Good" | "Moderate" | "Poor",
): string {
  if (overallQuality === "Excessive") {
    return "Your soil has excessive levels of nutrients which can be harmful to plants and the environment. This can lead to nutrient runoff, plant toxicity, and imbalanced soil ecology."
  } else if (overallQuality === "Good") {
    return "Your soil has good nutrient levels that are well-balanced for most crops. The current conditions are favorable for plant growth and development."
  } else if (overallQuality === "Moderate") {
    return "Your soil has moderate nutrient levels that are acceptable but could be improved. Some adjustments would help optimize plant growth and yield."
  } else {
    return "Your soil has poor nutrient levels that need to be addressed. Current conditions may limit plant growth and reduce crop yields."
  }
}

// Helper function to generate fallback recommendations
function generateFallbackRecommendations(
  classifications: Record<string, "Excessive" | "Good" | "Moderate" | "Poor">,
): string[] {
  const recommendations: string[] = []

  // Check each parameter and add appropriate recommendations
  if (classifications.nitrogen === "Excessive") {
    recommendations.push(
      "Reduce nitrogen application and consider planting nitrogen-consuming cover crops like corn or sorghum to help balance levels.",
    )
  } else if (classifications.nitrogen === "Poor") {
    recommendations.push(
      "Increase nitrogen levels by applying organic nitrogen fertilizers or incorporating leguminous cover crops.",
    )
  }

  if (classifications.phosphorus === "Excessive") {
    recommendations.push(
      "Avoid adding phosphorus fertilizers and consider using crops that remove phosphorus efficiently like sunflower or mustard.",
    )
  } else if (classifications.phosphorus === "Poor") {
    recommendations.push("Apply phosphorus-rich fertilizers or bone meal to increase phosphorus levels.")
  }

  if (classifications.potassium === "Excessive") {
    recommendations.push(
      "Avoid potassium fertilizers and consider leaching the soil with irrigation to reduce potassium levels.",
    )
  } else if (classifications.potassium === "Poor") {
    recommendations.push("Apply potassium-rich fertilizers or wood ash to increase potassium levels.")
  }

  // Add general recommendations
  if (recommendations.length < 3) {
    recommendations.push("Conduct regular soil testing to monitor nutrient levels and adjust management practices.")
    recommendations.push("Implement crop rotation to help balance soil nutrients naturally.")
    recommendations.push("Consider adding organic matter to improve soil structure and nutrient retention.")
  }

  return recommendations
}
