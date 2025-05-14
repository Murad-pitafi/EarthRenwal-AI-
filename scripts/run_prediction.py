import sys
import json
import argparse
import numpy as np
import os

# Parse command line arguments
parser = argparse.ArgumentParser(description='Run ML model predictions')
parser.add_argument('--model-path', required=True, help='Path to the model file')
parser.add_argument('--scaler-path', help='Path to the scaler file (if needed)')
parser.add_argument('--model-type', required=True, help='Type of model (soilQuality, cropYield, etc.)')
parser.add_argument('--input-data', required=True, help='JSON string of input data')

args = parser.parse_args()

# Validate model file exists
if not os.path.exists(args.model_path):
    print(json.dumps({"error": f"Model file not found: {args.model_path}"}))
    sys.exit(1)

# Validate scaler file if provided
if args.scaler_path and not os.path.exists(args.scaler_path):
    print(json.dumps({"error": f"Scaler file not found: {args.scaler_path}"}))
    sys.exit(1)

# Determine model format and load appropriate libraries
model_format = os.path.splitext(args.model_path)[1].lower()

try:
    # Load input data
    input_data = json.loads(args.input_data)
    
    # Convert input data to numpy array if it's a list
    if isinstance(input_data, list):
        input_data = np.array(input_data)
    
    # Handle different model formats
    if model_format == '.pkl':
        import pickle
        
        # Load the model
        with open(args.model_path, 'rb') as f:
            model = pickle.load(f)
        
        # Make prediction
        prediction = model.predict(input_data.reshape(1, -1) if input_data.ndim == 1 else input_data)
        
    elif model_format in ['.h5', '.keras']:
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow logging
        import tensorflow as tf
        
        # Load the model
        model = tf.keras.models.load_model(args.model_path)
        
        # Load scaler if provided
        if args.scaler_path:
            import pickle
            with open(args.scaler_path, 'rb') as f:
                scaler = pickle.load(f)
            # Apply scaling
            input_data = scaler.transform(input_data.reshape(1, -1) if input_data.ndim == 1 else input_data)
        
        # Make prediction
        prediction = model.predict(input_data)
        
        # Convert to Python native types (from numpy)
        if isinstance(prediction, np.ndarray):
            prediction = prediction.tolist()
    else:
        print(json.dumps({"error": f"Unsupported model format: {model_format}"}))
        sys.exit(1)
    
    # Process prediction based on model type
    result = {"prediction": prediction}
    
    # Add model-specific processing
    if args.model_type == "soilQuality":
        # For classification models, get the class with highest probability
        if hasattr(prediction, 'shape') and len(prediction.shape) > 1 and prediction.shape[1] > 1:
            class_idx = np.argmax(prediction, axis=1)[0]
            quality_labels = ['Poor', 'Moderate', 'Good']
            result["class"] = quality_labels[class_idx]
    
    # Return the prediction as JSON
    print(json.dumps(result))
    
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
