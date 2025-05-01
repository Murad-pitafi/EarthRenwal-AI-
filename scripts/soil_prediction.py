import sys
import numpy as np
import tensorflow as tf
import pickle

def load_model(model_path):
    try:
        model = tf.keras.models.load_model(model_path)
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def load_scaler(scaler_path):
    try:
        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
            return scaler
    except Exception as e:
        print(f"Error loading scaler: {e}")
        return None

def predict_soil_quality(model, scaler, input_data):
    try:
        scaled_input = scaler.transform(input_data.reshape(1, -1))
        prediction = model.predict(scaled_input)
        return np.argmax(prediction)
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 10:
        print("Usage: python soil_prediction.py <model_path> <scaler_path> <airTemperature> <soilTemperature> <humidity> <moisture> <nitrogen> <phosphorous> <potassium>")
        sys.exit(1)

    model_path = sys.argv[1]
    scaler_path = sys.argv[2]
    try:
        input_data = np.array([float(x) for x in sys.argv[3:]])
    except ValueError:
        print("Error: Invalid input data. Please provide numeric values.")
        sys.exit(1)

    model = load_model(model_path)
    scaler = load_scaler(scaler_path)

    if model is None or scaler is None:
        sys.exit(1)

    prediction = predict_soil_quality(model, scaler, input_data)

    if prediction is None:
        sys.exit(1)

    quality_labels = ['Poor', 'Moderate', 'Good']
    print(quality_labels[prediction])
