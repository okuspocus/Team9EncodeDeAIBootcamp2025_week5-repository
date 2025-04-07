import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get Venice AI API key from environment variables
api_key = os.getenv("VENICE_API_KEY")

if not api_key:
    print("Error: VENICE_API_KEY not found in environment variables")
    print("Please make sure you have set your Venice AI API key in the .env file")
    exit(1)

# Venice AI API base URL
base_url = os.getenv("VENICE_API_BASE_URL", "https://api.venice.ai/api/v1")

# Endpoint to list models
models_url = f"{base_url}/models"

# Headers with API key
headers = {
    "Authorization": f"Bearer {api_key}"
}

# Make the request
try:
    response = requests.get(models_url, headers=headers)

    # Check if request was successful
    if response.status_code == 200:
        models = response.json()
        print("\nAvailable Venice AI Models:")
        print("==========================")
        
        # Sort models by ID for easier reading
        sorted_models = sorted(models.get("data", []), key=lambda x: x['id'])
        
        for model in sorted_models:
            model_id = model['id']
            # Add an indicator for smaller models that might work with free accounts
            is_small = any(name in model_id.lower() for name in ["7b", "8b", "small", "tiny", "mini"])
            note = " (likely works with free account)" if is_small else ""
            print(f"- {model_id}{note}")
            
        print("\nRecommended models for free accounts:")
        print("==================================")
        for model in sorted_models:
            model_id = model['id']
            if any(name in model_id.lower() for name in ["7b", "8b", "small", "tiny", "mini"]):
                print(f"- {model_id}")
                
    else:
        print(f"Error: {response.status_code} - {response.text}")
        
except Exception as e:
    print(f"Error making request: {e}")
    print("Please check your internet connection and API key")
