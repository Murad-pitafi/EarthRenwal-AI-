import sys
import pickle
import os

def verify_model(model_path):
    """Verify if the file is a valid pickle model."""
    try:
        # Check if file exists
        if not os.path.exists(model_path):
            return {"success": False, "error": f"File not found: {model_path}"}
        
        # Try to load the model
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        # Get model type and basic info
        model_type = type(model).__name__
        
        # Return success with model info
        return {
            "success": True,
            "model_type": model_type,
            "file_size": os.path.getsize(model_path),
            "message": "Model verified successfully"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print({"success": False, "error": "No model path provided"})
    else:
        result = verify_model(sys.argv[1])
        print(result)
