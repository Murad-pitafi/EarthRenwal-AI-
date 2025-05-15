"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, Camera, RefreshCw, AlertCircle } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function RiceClassifierClient() {
  const { language } = useUser()
  const isUrdu = language === "ur"
  const { toast } = useToast()
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const [modelError, setModelError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelStatus, setModelStatus] = useState<"not_loaded" | "loading" | "loaded" | "error">("not_loaded")

  // This would normally load the TensorFlow.js model
  // But since the model is 268 MB, we'll simulate the loading process
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true)
        setModelStatus("loading")

        // Simulate model loading time
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // In a real implementation, you would load the model here
        // Example:
        // const model = await tf.loadLayersModel('path/to/model.json');

        // For now, we'll just simulate success
        setModelStatus("loaded")
        setModelLoading(false)
      } catch (error: any) {
        console.error("Error loading model:", error)
        setModelError(error.message || "Failed to load rice classification model")
        setModelStatus("error")
        setModelLoading(false)
      }
    }

    loadModel()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = () => {
          setImage(reader.result as string)
          setResult(null)
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: isUrdu ? "غلط فائل کی قسم" : "Invalid file type",
          description: isUrdu ? "براہ کرم صرف تصویری فائلیں اپلوڈ کریں" : "Please upload only image files",
          variant: "destructive",
        })
      }
    }
  }

  const toggleCamera = async () => {
    if (cameraActive) {
      // Stop the camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
      setCameraActive(false)
    } else {
      // Start the camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraActive(true)
        setResult(null)
      } catch (error) {
        console.error("Error accessing camera:", error)
        toast({
          title: isUrdu ? "کیمرے تک رسائی میں خرابی" : "Camera access error",
          description: isUrdu
            ? "آپ کے کیمرے تک رسائی حاصل کرنے میں ایک خرابی ہوئی ہے"
            : "There was an error accessing your camera",
          variant: "destructive",
        })
      }
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setImage(imageDataUrl)

        // Stop the camera
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream
          stream.getTracks().forEach((track) => track.stop())
          video.srcObject = null
        }
        setCameraActive(false)
      }
    }
  }

  const classifyRice = async () => {
    if (!image || modelStatus !== "loaded") return

    setIsLoading(true)
    setResult(null)

    try {
      // In a real implementation, you would:
      // 1. Load the image into a tensor
      // 2. Preprocess the image
      // 3. Run inference with the model
      // 4. Process the results

      // For now, we'll simulate a classification result
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate classification results
      const simulatedResults = {
        variety: "Basmati",
        confidence: 0.85,
        all_predictions: [
          { variety: "Basmati", confidence: 0.85 },
          { variety: "IRRI-6", confidence: 0.08 },
          { variety: "Super Kernel", confidence: 0.04 },
          { variety: "PK-386", confidence: 0.02 },
          { variety: "KS-282", confidence: 0.01 },
        ],
      }

      setResult(simulatedResults)
    } catch (error: any) {
      console.error("Error classifying rice:", error)
      toast({
        title: isUrdu ? "درجہ بندی میں خرابی" : "Classification Error",
        description:
          error.message ||
          (isUrdu ? "چاول کی قسم کی درجہ بندی کرنے میں ایک خرابی ہوئی ہے" : "Failed to classify rice variety"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetClassifier = () => {
    setImage(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className={isUrdu ? "font-urdu text-right" : ""}>
          {isUrdu ? "چاول کی قسم کی شناخت" : "Rice Variety Classifier"}
        </CardTitle>
        <CardDescription className={isUrdu ? "font-urdu text-right" : ""}>
          {isUrdu
            ? "چاول کی قسم کی شناخت کے لیے تصویر اپلوڈ کریں یا کیمرہ استعمال کریں"
            : "Upload an image or use your camera to identify rice varieties"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {modelStatus === "loading" && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>{isUrdu ? "ماڈل لوڈ ہو رہا ہے..." : "Loading rice classification model..."}</p>
          </div>
        )}

        {modelStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{isUrdu ? "ماڈل لوڈ کرنے میں خرابی" : "Model Loading Error"}</AlertTitle>
            <AlertDescription>
              {modelError ||
                (isUrdu ? "چاول کی درجہ بندی کا ماڈل لوڈ کرنے میں خرابی" : "Failed to load rice classification model")}
            </AlertDescription>
          </Alert>
        )}

        {modelStatus === "loaded" && (
          <>
            {!cameraActive && !image && (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {isUrdu ? "تصویر اپلوڈ کرنے کے لیے کلک کریں یا یہاں کھینچیں" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">
                  {isUrdu ? "PNG, JPG, JPEG (زیادہ سے زیادہ 5MB)" : "PNG, JPG, JPEG (max 5MB)"}
                </p>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            )}

            {cameraActive && (
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                <Button onClick={captureImage} className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Camera className="mr-2 h-4 w-4" />
                  {isUrdu ? "تصویر کھینچیں" : "Capture"}
                </Button>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {image && !cameraActive && (
              <div className="relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Rice sample"
                  className="w-full rounded-lg object-contain max-h-[300px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white bg-opacity-75"
                  onClick={resetClassifier}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}

            {result && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className={`font-medium text-lg ${isUrdu ? "font-urdu text-right" : ""}`}>
                  {isUrdu ? "نتائج:" : "Results:"}
                </h3>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <span className={isUrdu ? "font-urdu text-right" : ""}>
                      {isUrdu ? "چاول کی قسم:" : "Rice Variety:"}
                    </span>
                    <span className="font-bold">{result.variety}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={isUrdu ? "font-urdu text-right" : ""}>{isUrdu ? "اعتماد:" : "Confidence:"}</span>
                    <span>{(result.confidence * 100).toFixed(2)}%</span>
                  </div>

                  {result.all_predictions && (
                    <div className="mt-3">
                      <p className={`text-sm text-gray-500 ${isUrdu ? "font-urdu text-right" : ""}`}>
                        {isUrdu ? "تمام پیش گوئیاں:" : "All Predictions:"}
                      </p>
                      <div className="mt-1 space-y-1">
                        {result.all_predictions.map((pred: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{pred.variety}</span>
                            <span>{(pred.confidence * 100).toFixed(2)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={toggleCamera} disabled={modelStatus !== "loaded"}>
          <Camera className="mr-2 h-4 w-4" />
          {cameraActive ? (isUrdu ? "کیمرہ بند کریں" : "Stop Camera") : isUrdu ? "کیمرہ استعمال کریں" : "Use Camera"}
        </Button>

        <Button onClick={classifyRice} disabled={!image || isLoading || modelStatus !== "loaded"}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUrdu ? "درجہ بندی کر رہا ہے..." : "Classifying..."}
            </>
          ) : (
            <>{isUrdu ? "چاول کی قسم کی درجہ بندی کریں" : "Classify Rice Variety"}</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
