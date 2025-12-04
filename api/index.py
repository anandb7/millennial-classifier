from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import os

app = Flask(__name__)

# For Vercel deployment, we'll use a simpler approach without LoRA
# In production, you might want to use a model hosting service
base_model_name = "distilbert-base-uncased"

print("Loading tokenizer...")
try:
    tokenizer = AutoTokenizer.from_pretrained(base_model_name)
    print("Tokenizer loaded successfully")
except Exception as e:
    print(f"Error loading tokenizer: {e}")
    tokenizer = None

print("Loading base model...")
try:
    model = AutoModelForSequenceClassification.from_pretrained(base_model_name)
    model.eval()
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Label mapping (assuming binary classification: 0=Not-Millennial, 1=Millennial)
label_map = {0: "Not-Millennial", 1: "Millennial"}

@app.route('/')
def home():
    return jsonify({
        'message': 'Millennial Classifier API',
        'status': 'running',
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
            'confidence': confidence
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy' if model and tokenizer else 'model_not_loaded',
        'model': 'distilbert-base-uncased'
    })

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=8000, debug=True)
