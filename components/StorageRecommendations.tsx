import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Database, HardDrive, Cloud, Server } from "lucide-react"

export function StorageRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Recommendations</CardTitle>
        <CardDescription>Best practices for storing your data and model files</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sensor Data Storage
          </h3>

          <div className="space-y-2">
            <div className="bg-muted/50 p-3 rounded-md">
              <h4 className="font-medium">For Development</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Browser localStorage + JSON export is sufficient for testing and development.
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <h4 className="font-medium">For Production</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Use a proper database like SQLite, MongoDB, or Supabase for reliable data storage.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Model Files Storage
          </h3>

          <div className="space-y-2">
            <div className="bg-muted/50 p-3 rounded-md">
              <h4 className="font-medium">Version Control</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Store model files (.pkl, .h5, .keras) in Git LFS on GitHub for version control.
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <h4 className="font-medium">Deployment</h4>
              <p className="text-sm text-muted-foreground mt-1">
                For production, store models in cloud storage (S3, Google Cloud Storage) and reference them in your app.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Server className="h-5 w-5" />
            Recommended Setup
          </h3>

          <div className="bg-muted/50 p-3 rounded-md">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Github className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>GitHub:</strong> For code, configuration, and model files (with Git LFS)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Database className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Supabase/MongoDB:</strong> For sensor readings and time-series data
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Cloud className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Cloud Storage:</strong> For large model files and backups
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
