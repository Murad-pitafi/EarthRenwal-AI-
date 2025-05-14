"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser } from "@/contexts/UserContext"
import { Upload, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export function ModelUploader() {
  const { language } = useUser()
  const isUrdu = language === "ur"
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      console.log("Selected file:", selectedFile.name)

      // Accept the file regardless of extension - we'll validate on the server
      setFile(selectedFile)
      setUploadStatus("idle")
      setErrorMessage("")
    }
  }

  const uploadModel = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus("idle")

    try {
      // Create form data
      const formData = new FormData()
      formData.append("model", file)

      console.log("Uploading file:", file.name)

      // Send to API endpoint
      const response = await fetch("/api/upload-model", {
        method: "POST",
        body: formData,
      })

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json()

        if (response.ok && result.success) {
          setUploadStatus("success")
        } else {
          throw new Error(result.error || "Unknown error")
        }
      } else {
        // Handle non-JSON response
        const textResponse = await response.text()
        if (response.ok) {
          setUploadStatus("success")
        } else {
          throw new Error(textResponse || "Server error")
        }
      }
    } catch (error) {
      console.error("Error uploading model:", error)
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload model")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isUrdu ? "font-urdu" : ""}>
          {isUrdu ? "مٹی کی صحت کا ماڈل اپلوڈ کریں" : "Upload Soil Health Model"}
        </CardTitle>
        <CardDescription className={isUrdu ? "font-urdu" : ""}>
          {isUrdu
            ? "اپنا .pkl ماڈل فائل اپلوڈ کریں جو مٹی کی صحت کی پیش گوئی کرے گا"
            : "Upload your .pkl model file that will predict soil health"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            {/* Remove the accept attribute to allow any file type */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="model-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">
                      {isUrdu ? "کلک کریں یا فائل کھینچیں" : "Click to upload or drag and drop"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {isUrdu ? ".pkl فائل (سائز < 10MB)" : ".pkl file (size < 10MB)"}
                  </p>
                </div>
                <input
                  id="model-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>

            {file && (
              <div className="mt-2 text-sm text-gray-500">
                {isUrdu ? "منتخب فائل:" : "Selected file:"} {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          {uploadStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className={isUrdu ? "font-urdu" : ""}>{isUrdu ? "کامیابی" : "Success"}</AlertTitle>
              <AlertDescription className={isUrdu ? "font-urdu" : ""}>
                {isUrdu ? "ماڈل کامیابی سے اپلوڈ ہو گیا ہے۔" : "Model has been uploaded successfully."}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertTitle className={isUrdu ? "font-urdu" : ""}>{isUrdu ? "خرابی" : "Error"}</AlertTitle>
              <AlertDescription className={isUrdu ? "font-urdu" : ""}>
                {isUrdu ? `اپلوڈ میں خرابی: ${errorMessage}` : `Upload failed: ${errorMessage}`}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={uploadModel} disabled={!file || uploading} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUrdu ? "اپلوڈ ہو رہا ہے..." : "Uploading..."}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {isUrdu ? "ماڈل اپلوڈ کریں" : "Upload Model"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
