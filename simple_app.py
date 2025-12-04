from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import random
import os

app = Flask(__name__)

# Mock prediction for testing frontend
def mock_predict(text):
    # Simple heuristic based on text content for demo purposes
    millennial_keywords = ['literally', 'like', 'avocado', 'spotify', 'netflix', 'adulting', 'anxiety', 'self-care', 'toxic', 'vibe']
    not_millennial_keywords = ['telephone', 'newspaper', 'radio', 'cassette', 'cd', 'dial-up', 'typewriter']
    
    text_lower = text.lower()
    millennial_score = sum(1 for keyword in millennial_keywords if keyword in text_lower)
    not_millennial_score = sum(1 for keyword in not_millennial_keywords if keyword in text_lower)
    
    if millennial_score > not_millennial_score:
        return {'label': 'Millennial', 'confidence': 0.75 + random.random() * 0.2}
    else:
        return {'label': 'Not-Millennial', 'confidence': 0.75 + random.random() * 0.2}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
        
        text = data['text'].strip()
        
        if not text:
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Use mock prediction for now
        result = mock_predict(text)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model': 'mock'})

if __name__ == '__main__':
    print("Starting Flask server with mock predictions...")
    app.run(host='0.0.0.0', port=8000, debug=True)
