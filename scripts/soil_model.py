import joblib
import numpy as np
import os
import sys
import json

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)

# Path to the model file - we'll look in multiple locations
MODEL_PATHS = [
    os.path.join(project_dir, "models", "soil_quality_model.pkl"),
    os.path.join(script_dir, "soil_quality_model.pkl"),
    os.path.join(project_dir, "soil_quality_model.pkl"),
]

def find_model():
    """Try to find the model in various locations"""
    for path in MODEL_PATHS:
        try:
            if os.path.exists(path):
                print(f"Found model at: {path}", file=sys.stderr)
                return path
        except Exception as e:
            print(f"Error checking path {path}: {e}", file=sys.stderr)
    
    print("Model not found in any of the expected locations:", MODEL_PATHS, file=sys.stderr)
    return None

def predict_soil_quality(gas, humidity, nitrogen, phosphorus, potassium, temperature):
    """Simple prediction function that matches the user's script"""
    try:
        # Find and load the model
        model_path = find_model()
        if not model_path:
            print("Model not found in any of the expected locations", file=sys.stderr)
            return {"prediction": "Moderate", "error": "Model file not found"}
        
        print(f"Loading model from: {model_path}", file=sys.stderr)
        model = joblib.load(model_path)
        
        # Create input array in same order as training features
        input_data = np.array([[gas, humidity, nitrogen, phosphorus, potassium, temperature]])
        
        # Make prediction
        prediction = model.predict(input_data)
        
        # Map prediction to class name
        class_mapping = {0: 'Good', 1: 'Moderate', 2: 'Poor'}
        predicted_class = class_mapping[prediction[0]]
        
        print(f"Prediction successful: {predicted_class}", file=sys.stderr)
        return {"prediction": predicted_class}
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}", file=sys.stderr)
        return {"prediction": "Moderate", "error": str(e)}

if __name__ == "__main__":
    # Check if we have command line arguments
    if len(sys.argv) > 1:
        try:
            # Parse JSON from stdin or file
            if sys.argv[1] == "--data-file" and len(sys.argv) > 2:
                with open(sys.argv[2], 'r') as f:
                    data = json.load(f)
            else:
                data = json.loads(sys.argv[1])
            
            print(f"Input data: {data}", file=sys.stderr)
                
            result = predict_soil_quality(
                data['gas_level'],
                data['humidity'],
                data['nitrogen'],
                data['phosphorus'],
                data['potassium'],
                data['temperature']
            )
            print(json.dumps(result))
            
        except Exception as e:
            print(f"Error processing input: {str(e)}", file=sys.stderr)
            print(json.dumps({"prediction": "Moderate", "error": f"Error: {str(e)}"}))
    else:
        # Use sample values for testing
        result = predict_soil_quality(500, 65, 45, 15, 150, 28)
        print(json.dumps(result))
