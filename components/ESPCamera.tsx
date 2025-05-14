"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, Download, Maximize, Minimize, Upload, Clock, ImageIcon, Settings } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ESPCameraProps {
  defaultIpAddress?: string
}

export function ESPCamera({ defaultIpAddress = "192.168.43.105" }: ESPCameraProps) {
  const { language } = useUser()
  const isUrdu = language === "ur"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mode, setMode] = useState<"live" | "simulation" | "upload" | "timelapse" | "settings">("live")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [simulationIndex, setSimulationIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<HTMLImageElement>(null)
  const [ipAddress, setIpAddress] = useState(defaultIpAddress)
  const [streamUrl, setStreamUrl] = useState(`http://${defaultIpAddress}`)
  const [isConnected, setIsConnected] = useState(false)
  const [streamKey, setStreamKey] = useState(Date.now()) // Used to force reload the stream

  // Simulation images
  const simulationImages = [
    "/sunny-farm-field.png",
    "/cloudy-farm-field.png",
    "/rainy-farm-field.png",
    "/farm-field-sunset.png",
    "/farm-field-crops.png",
  ]

  // Time-lapse images
  const timelapseImages = [
    "/farm-field-morning.png",
    "/farm-field-noon.png",
    "/farm-field-afternoon.png",
    "/farm-field-evening.png",
    "/farm-field-night.png",
  ]

  const translations = {
    en: {
      title: "ESP32-CAM Stream",
      loading: "Connecting to camera...",
      error: "Could not connect to camera",
      refresh: "Refresh",
      snapshot: "Take Snapshot",
      lastUpdated: "Last updated",
      expand: "Expand",
      minimize: "Minimize",
      noCamera: "Camera not available",
      uploadImage: "Upload Image",
      uploadPrompt: "Upload an image from your device",
      uploadButton: "Select Image",
      simulation: "Simulation",
      simulationDesc: "View simulated field conditions",
      live: "Live Feed",
      timelapse: "Time-lapse",
      timelapseDesc: "View field changes over time",
      nextImage: "Next Image",
      prevImage: "Previous Image",
      playTimelapse: "Play Time-lapse",
      pauseTimelapse: "Pause",
      uploadTab: "Upload",
      liveTab: "Live",
      simulationTab: "Simulation",
      timelapseTab: "Time-lapse",
      settingsTab: "Settings",
      reconnecting: "Attempting to reconnect...",
      fallbackMode: "Using fallback mode",
      ipAddress: "Camera IP Address",
      connect: "Connect",
      streamUrl: "Stream URL",
      connected: "Connected",
      disconnected: "Disconnected",
      settings: "Camera Settings",
      saveSettings: "Save Settings",
      streamType: "Stream Type",
      mjpegStream: "MJPEG Stream",
      jpegStream: "JPEG Snapshot",
    },
    ur: {
      title: "ESP32-CAM سٹریم",
      loading: "کیمرے سے منسلک ہو رہا ہے...",
      error: "کیمرہ سے رابطہ نہیں ہو سکا",
      refresh: "ریفریش",
      snapshot: "تصویر لیں",
      lastUpdated: "آخری اپڈیٹ",
      expand: "بڑا کریں",
      minimize: "چھوٹا کریں",
      noCamera: "کیمرہ دستیاب نہیں ہے",
      uploadImage: "تصویر اپلوڈ کریں",
      uploadPrompt: "اپنے آلے سے تصویر اپلوڈ کریں",
      uploadButton: "تصویر منتخب کریں",
      simulation: "سمولیشن",
      simulationDesc: "فیلڈ کی حالت کا سمولیشن دیکھیں",
      live: "براہ راست فیڈ",
      timelapse: "ٹائم لیپس",
      timelapseDesc: "وقت کے ساتھ فیلڈ میں تبدیلیاں دیکھیں",
      nextImage: "اگلی تصویر",
      prevImage: "پچھلی تصویر",
      playTimelapse: "ٹائم لیپس چلائیں",
      pauseTimelapse: "روکیں",
      uploadTab: "اپلوڈ",
      liveTab: "براہ راست",
      simulationTab: "سمولیشن",
      timelapseTab: "ٹائم لیپس",
      settingsTab: "ترتیبات",
      reconnecting: "دوبارہ منسلک کرنے کی کوشش کر رہا ہے...",
      fallbackMode: "فال بیک موڈ استعمال کر رہا ہے",
      ipAddress: "کیمرہ آئی پی ایڈریس",
      connect: "منسلک کریں",
      streamUrl: "سٹریم یو آر ایل",
      connected: "منسلک",
      disconnected: "غیر منسلک",
      settings: "کیمرہ ترتیبات",
      saveSettings: "ترتیبات محفوظ کریں",
      streamType: "سٹریم کی قسم",
      mjpegStream: "MJPEG سٹریم",
      jpegStream: "JPEG سنیپ شاٹ",
    },
  }

  const t = translations[language]

  // Function to check if the ESP32-CAM is accessible
  const checkCameraConnection = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create a new image element to test if the stream loads
      const testImage = new Image()

      // Set up a promise that resolves when the image loads or rejects on error
      const imagePromise = new Promise((resolve, reject) => {
        testImage.onload = () => resolve(true)
        testImage.onerror = () => reject(new Error("Failed to load camera stream"))

        // Set a timeout in case the image takes too long to load
        setTimeout(() => reject(new Error("Camera request timed out")), 5000)
      })

      // Set the source to start loading - for ESP32-CAM we use the root URL
      testImage.src = `${streamUrl}?t=${Date.now()}`

      // Wait for the image to load
      await imagePromise

      // If we get here, the camera is accessible
      setIsConnected(true)
      setLastUpdated(new Date())
      setMode("live")
      setStreamKey(Date.now()) // Force reload the stream

      return true
    } catch (error) {
      console.error("Error connecting to camera:", error)
      setError(error instanceof Error ? error.message : "Failed to connect to camera")
      setIsConnected(false)

      // If we're in live mode and the camera fails, switch to simulation mode
      if (mode === "live") {
        setMode("simulation")
      }

      return false
    } finally {
      setLoading(false)
    }
  }

  // Connect to the camera with the current IP address
  const connectToCamera = () => {
    setStreamUrl(`http://${ipAddress}`)
    setStreamKey(Date.now())
    checkCameraConnection()
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      setLastUpdated(new Date())
    }
    reader.readAsDataURL(file)
  }

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Handle simulation navigation
  const nextSimulationImage = () => {
    const nextIndex = (simulationIndex + 1) % simulationImages.length
    setSimulationIndex(nextIndex)
    setLastUpdated(new Date())
  }

  const prevSimulationImage = () => {
    const prevIndex = (simulationIndex - 1 + simulationImages.length) % simulationImages.length
    setSimulationIndex(prevIndex)
    setLastUpdated(new Date())
  }

  // Time-lapse functionality
  const [timelapseIndex, setTimelapseIndex] = useState(0)
  const [timelapseRunning, setTimelapseRunning] = useState(false)

  const toggleTimelapse = () => {
    setTimelapseRunning(!timelapseRunning)
  }

  // Check camera connection on component mount and when stream URL changes
  useEffect(() => {
    if (mode === "live") {
      checkCameraConnection()
    }
  }, [streamUrl, mode])

  // Handle simulation mode
  useEffect(() => {
    if (mode === "simulation") {
      setLastUpdated(new Date())
    }
  }, [mode, simulationIndex])

  // Handle time-lapse mode
  useEffect(() => {
    if (mode === "timelapse" && timelapseRunning) {
      const intervalId = setInterval(() => {
        setTimelapseIndex((prev) => (prev + 1) % timelapseImages.length)
        setLastUpdated(new Date())
      }, 2000) // Change image every 2 seconds

      return () => clearInterval(intervalId)
    }
  }, [mode, timelapseRunning])

  // Update image when time-lapse index changes
  useEffect(() => {
    if (mode === "timelapse") {
      setLastUpdated(new Date())
    }
  }, [timelapseIndex, mode])

  // Function to take a snapshot
  const takeSnapshot = () => {
    if (mode === "live" && streamRef.current) {
      // Create a canvas element
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions to match the image
      canvas.width = streamRef.current.naturalWidth || streamRef.current.width
      canvas.height = streamRef.current.naturalHeight || streamRef.current.height

      // Draw the image onto the canvas
      ctx.drawImage(streamRef.current, 0, 0)

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) return

          // Create a download link
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `esp32-cam-${new Date().toISOString().replace(/:/g, "-")}.jpg`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        },
        "image/jpeg",
        0.9,
      )
    } else if (mode === "simulation") {
      // For simulation mode, download the current simulation image
      const link = document.createElement("a")
      link.href = simulationImages[simulationIndex]
      link.download = `simulation-${new Date().toISOString().replace(/:/g, "-")}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (mode === "timelapse") {
      // For timelapse mode, download the current timelapse image
      const link = document.createElement("a")
      link.href = timelapseImages[timelapseIndex]
      link.download = `timelapse-${new Date().toISOString().replace(/:/g, "-")}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (mode === "upload" && uploadedImage) {
      // For upload mode, download the uploaded image
      const link = document.createElement("a")
      link.href = uploadedImage
      link.download = `uploaded-${new Date().toISOString().replace(/:/g, "-")}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return isUrdu ? "کبھی نہیں" : "Never"

    return new Intl.DateTimeFormat(isUrdu ? "ur-PK" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(lastUpdated)
  }

  return (
    <Card className={expanded ? "fixed inset-4 z-50 overflow-auto" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-xl ${isUrdu ? "font-urdu" : ""}`}>
          <Camera className="h-5 w-5 inline mr-2" />
          {t.title}
          {mode !== "live" && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">({t.fallbackMode})</span>
          )}
          {isConnected && mode === "live" && (
            <span className="ml-2 text-sm font-normal text-green-500">({t.connected})</span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {mode === "live" && (
            <Button variant="outline" size="sm" onClick={connectToCamera} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {t.refresh}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={takeSnapshot} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            {t.snapshot}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <>
                <Minimize className="h-4 w-4 mr-2" />
                {t.minimize}
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4 mr-2" />
                {t.expand}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(value) => setMode(value as any)} className="mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="live">
              <Camera className="h-4 w-4 mr-2" />
              {t.liveTab}
            </TabsTrigger>
            <TabsTrigger value="simulation">
              <ImageIcon className="h-4 w-4 mr-2" />
              {t.simulationTab}
            </TabsTrigger>
            <TabsTrigger value="timelapse">
              <Clock className="h-4 w-4 mr-2" />
              {t.timelapseTab}
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              {t.uploadTab}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              {t.settingsTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-4">
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md z-10">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p className={`mt-2 text-sm ${isUrdu ? "font-urdu" : ""}`}>{t.loading}</p>
                  </div>
                </div>
              )}

              {error && !isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-md z-10">
                  <div className="text-center">
                    <p className={`text-red-500 font-medium ${isUrdu ? "font-urdu" : ""}`}>{t.error}</p>
                    <p className={`text-sm text-red-400 ${isUrdu ? "font-urdu" : ""}`}>{error}</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={connectToCamera}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t.reconnecting}
                    </Button>
                  </div>
                </div>
              )}

              {/* ESP32-CAM stream - this is an img tag that loads the MJPEG stream */}
              <img
                ref={streamRef}
                src={`${streamUrl}?key=${streamKey}`}
                alt="ESP32-CAM Stream"
                className="w-full rounded-md"
                style={{
                  maxHeight: expanded ? "calc(100vh - 200px)" : "480px",
                  objectFit: "contain",
                  display: isConnected ? "block" : "none",
                }}
                onError={() => {
                  setError("Failed to load camera stream")
                  setIsConnected(false)
                }}
              />

              {!isConnected && !loading && (
                <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className={`text-gray-500 ${isUrdu ? "font-urdu" : ""}`}>{t.noCamera}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="mt-4">
            <div className="relative">
              <img
                src={simulationImages[simulationIndex] || "/placeholder.svg"}
                alt="Field Simulation"
                className="w-full rounded-md"
                style={{ maxHeight: expanded ? "calc(100vh - 200px)" : "480px", objectFit: "contain" }}
              />
              <div className="mt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={prevSimulationImage}>
                  {t.prevImage}
                </Button>
                <Button variant="outline" size="sm" onClick={nextSimulationImage}>
                  {t.nextImage}
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.simulationDesc}</p>
            </div>
          </TabsContent>

          <TabsContent value="timelapse" className="mt-4">
            <div className="relative">
              <img
                src={timelapseImages[timelapseIndex] || "/placeholder.svg"}
                alt="Field Time-lapse"
                className="w-full rounded-md"
                style={{ maxHeight: expanded ? "calc(100vh - 200px)" : "480px", objectFit: "contain" }}
              />
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTimelapseIndex((prev) => (prev - 1 + timelapseImages.length) % timelapseImages.length)
                  }
                >
                  {t.prevImage}
                </Button>
                <Button variant={timelapseRunning ? "default" : "outline"} size="sm" onClick={toggleTimelapse}>
                  {timelapseRunning ? t.pauseTimelapse : t.playTimelapse}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimelapseIndex((prev) => (prev + 1) % timelapseImages.length)}
                >
                  {t.nextImage}
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.timelapseDesc}</p>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <div className="relative">
              {uploadedImage ? (
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded Field Image"
                  className="w-full rounded-md"
                  style={{ maxHeight: expanded ? "calc(100vh - 200px)" : "480px", objectFit: "contain" }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-md flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className={`text-gray-500 ${isUrdu ? "font-urdu" : ""}`}>{t.uploadPrompt}</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={triggerFileUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  {t.uploadButton}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isUrdu ? "font-urdu" : ""}`}>{t.settings}</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ipAddress" className={isUrdu ? "font-urdu" : ""}>
                      {t.ipAddress}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="ipAddress"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="192.168.43.105"
                      />
                      <Button onClick={connectToCamera}>{t.connect}</Button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="streamUrl" className={isUrdu ? "font-urdu" : ""}>
                      {t.streamUrl}
                    </Label>
                    <Input
                      id="streamUrl"
                      value={streamUrl}
                      onChange={(e) => setStreamUrl(e.target.value)}
                      placeholder="http://192.168.43.105"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={isUrdu ? "font-urdu" : ""}>{t.status}:</span>
                    <span className={`font-medium ${isConnected ? "text-green-500" : "text-red-500"}`}>
                      {isConnected ? t.connected : t.disconnected}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className={`mt-2 text-xs text-muted-foreground ${isUrdu ? "font-urdu" : ""}`}>
          {t.lastUpdated}: {formatLastUpdated()}
        </div>
      </CardContent>
    </Card>
  )
}
