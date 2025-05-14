import { ModelUploader } from "@/components/ModelUploader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ModelManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Model Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ModelUploader />

        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
            <CardDescription>View information about your uploaded soil health prediction model</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              After uploading your model, you can view its details and test it with sample data.
            </p>

            <div className="space-y-2">
              <p>
                <strong>Model Location:</strong> /models/soil_health_model.pkl
              </p>
              <p>
                <strong>Input Features:</strong> Gas Level, Humidity, Nitrogen, Phosphorus, Potassium, Temperature
              </p>
              <p>
                <strong>Usage:</strong> This model will be used to predict soil health based on sensor readings.
              </p>
              <p>
                <strong>Integration:</strong> The model is automatically used in the real-time monitoring dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>How to Prepare Your Model</CardTitle>
            <CardDescription>Guidelines for creating compatible soil health prediction models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Model Requirements:</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Must be a scikit-learn or similar model saved as a .pkl file</li>
                  <li>
                    Must accept exactly these input features in this order: Gas Level, Humidity, Nitrogen, Phosphorus,
                    Potassium, Temperature
                  </li>
                  <li>Should output soil health classification or recommendations</li>
                  <li>Maximum file size: 10MB</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium">Example Python Code to Create Compatible Model:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {`import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Sample data (replace with your actual training data)
X = np.array([
    # Gas, Humidity, Nitrogen, Phosphorus, Potassium, Temperature
    [500, 65, 45, 15, 150, 28],
    [450, 70, 40, 12, 140, 30],
    # ... more training examples
])
y = np.array(['Good', 'Moderate', 'Poor'])  # Your target labels

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train your model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the model
with open('soil_health_model.pkl', 'wb') as f:
    pickle.dump(model, f)
`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
