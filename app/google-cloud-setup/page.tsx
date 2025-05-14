import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, CheckCircleIcon } from "lucide-react"

export default function GoogleCloudSetup() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Google Cloud Text-to-Speech Setup Guide</h1>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          To use the Google Cloud Text-to-Speech API with the client library, you need to set up authentication using a
          service account.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step 1: Create a Service Account</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to the{" "}
              <a
                href="https://console.cloud.google.com/iam-admin/serviceaccounts"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Service Accounts page
              </a>{" "}
              in the Google Cloud Console.
            </li>
            <li>Select your project.</li>
            <li>
              Click <strong>Create Service Account</strong>.
            </li>
            <li>Enter a name and description for the service account.</li>
            <li>
              Click <strong>Create and Continue</strong>.
            </li>
            <li>
              For the role, select <strong>Cloud Text-to-Speech &gt; Text-to-Speech Admin</strong>.
            </li>
            <li>
              Click <strong>Continue</strong> and then <strong>Done</strong>.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step 2: Create a Service Account Key</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2">
            <li>In the Service Accounts page, click on the email address of the service account you created.</li>
            <li>
              Click the <strong>Keys</strong> tab.
            </li>
            <li>
              Click <strong>Add Key</strong> and then <strong>Create new key</strong>.
            </li>
            <li>
              Select <strong>JSON</strong> as the key type and click <strong>Create</strong>.
            </li>
            <li>The key file will be downloaded to your computer.</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step 3: Set Up Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">There are two ways to use the service account key:</p>

          <h3 className="text-lg font-semibold mb-2">Option 1: Set Environment Variable</h3>
          <p className="mb-2">
            Set the <code className="bg-gray-100 px-1 py-0.5 rounded">GOOGLE_APPLICATION_CREDENTIALS</code> environment
            variable to the path of your service account key file:
          </p>

          <div className="bg-gray-100 p-3 rounded mb-4">
            <p className="font-mono text-sm">
              # For Linux/macOS
              <br />
              export GOOGLE_APPLICATION_CREDENTIALS=&quot;/path/to/your-project-credentials.json&quot;
            </p>
            <p className="font-mono text-sm mt-2">
              # For Windows PowerShell
              <br />
              $env:GOOGLE_APPLICATION_CREDENTIALS=&quot;C:\path\to\your-project-credentials.json&quot;
            </p>
            <p className="font-mono text-sm mt-2">
              # For Windows Command Prompt
              <br />
              set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your-project-credentials.json
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-2">Option 2: Use Vercel Environment Variables</h3>
          <p className="mb-2">
            For a deployed application, add the following environment variables in your Vercel project:
          </p>

          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to your Vercel project settings.</li>
            <li>Navigate to the Environment Variables section.</li>
            <li>
              Add a new environment variable named{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">GOOGLE_APPLICATION_CREDENTIALS</code> with the value{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">./google-credentials.json</code>.
            </li>
            <li>
              Add another environment variable named{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">GOOGLE_CREDENTIALS</code> with the entire content of
              your JSON key file.
            </li>
          </ol>

          <Alert className="mt-4">
            <CheckCircleIcon className="h-4 w-4" />
            <AlertTitle>Next Steps</AlertTitle>
            <AlertDescription>
              After setting up authentication, you can test the Google Cloud Text-to-Speech API by visiting the{" "}
              <a href="/test-google-client" className="text-blue-600 hover:underline">
                Test Google Client
              </a>{" "}
              page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
