from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import os
from peft import PeftModel
import requests
import tempfile
import shutil

app = Flask(__name__)

# Model configuration
base_model_name = "distilbert-base-uncased"

def download_model_from_url(url, extract_to):
    """Download and extract model from a URL"""
    try:
        print(f"Downloading model from {url}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as tmp_file:
            shutil.copyfileobj(response.raw, tmp_file)
            tmp_file_path = tmp_file.name
        
        # Extract the zip file
        import zipfile
        with zipfile.ZipFile(tmp_file_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        
        # Clean up
        os.unlink(tmp_file_path)
        print("Model downloaded and extracted successfully")
        return True
        
    except Exception as e:
        print(f"Error downloading model: {e}")
        return False

print("Loading tokenizer...")
try:
    tokenizer = AutoTokenizer.from_pretrained(base_model_name)
    print("Tokenizer loaded successfully")
except Exception as e:
    print(f"Error loading tokenizer: {e}")
    tokenizer = None

print("Loading base model...")
try:
    base_model = AutoModelForSequenceClassification.from_pretrained(base_model_name)
    print("Base model loaded successfully")
except Exception as e:
    print(f"Error loading base model: {e}")
    base_model = None

# Try to load LoRA model
model = None
model_path = "./final_lora_model"

# First try local path (for development)
if os.path.exists(model_path):
    print("Loading LoRA adapter from local path...")
    try:
        model = PeftModel.from_pretrained(base_model, model_path)
        model.eval()
        print("LoRA model loaded successfully from local path")
    except Exception as e:
        print(f"Error loading LoRA from local path: {e}")
        model = None

# If local fails, try to download (for production)
if model is None and base_model is not None:
    # You'll need to upload your model to a cloud service and provide the URL
    model_url = os.environ.get("LORA_MODEL_URL")
    if model_url:
        print("Attempting to download LoRA model...")
        temp_dir = tempfile.mkdtemp()
        if download_model_from_url(model_url, temp_dir):
            try:
                model = PeftModel.from_pretrained(base_model, temp_dir)
                model.eval()
                print("LoRA model loaded successfully from download")
            except Exception as e:
                print(f"Error loading downloaded LoRA model: {e}")
                model = None
            finally:
                # Clean up temp directory
                shutil.rmtree(temp_dir, ignore_errors=True)
    else:
        print("LORA_MODEL_URL not found in environment variables")
        print("Falling back to base model only")

# If no LoRA model, use base model
if model is None and base_model is not None:
    model = base_model
    print("Using base model only (LoRA not available)")

# Label mapping (assuming binary classification: 0=Not-Millennial, 1=Millennial)
label_map = {0: "Not-Millennial", 1: "Millennial"}

@app.route('/')
def home():
    return jsonify({
        'message': 'Millennial Classifier API',
        'status': 'running',
        'model_type': 'LoRA' if isinstance(model, PeftModel) else 'Base Model',
        'endpoints': {
            'predict': 'POST /predict - Classify text as Millennial or Not-Millennial',
            'health': 'GET /health - Check API health'
        }
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if not model or not tokenizer:
            return jsonify({'error': 'Model not loaded properly'}), 500
            
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
        
        text = data['text'].strip()
        
        if not text:
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Tokenize the input text
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        
        # Make prediction
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=-1)
            predicted_class = torch.argmax(probabilities, dim=-1).item()
            confidence = probabilities[0][predicted_class].item()
        
        result = {
            'label': label_map[predicted_class],
            'confidence': confidence,
            'model_type': 'LoRA' if isinstance(model, PeftModel) else 'Base Model'
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy' if model and tokenizer else 'model_not_loaded',
        'model_type': 'LoRA' if isinstance(model, PeftModel) else 'Base Model',
        'base_model': base_model_name
    })

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=8000, debug=True)
