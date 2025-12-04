from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import os

app = Flask(__name__)

# Load the base model and tokenizer
base_model_name = "distilbert-base-uncased"
model_path = "./final_lora_model"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_path)

print("Loading base model...")
base_model = AutoModelForSequenceClassification.from_pretrained(base_model_name)

print("Loading LoRA adapter...")
from peft import PeftModel
model = PeftModel.from_pretrained(base_model, model_path)

# Set model to evaluation mode
model.eval()

# Label mapping (assuming binary classification: 0=Not-Millennial, 1=Millennial)
label_map = {0: "Not-Millennial", 1: "Millennial"}

@app.route('/predict', methods=['POST'])
def predict():
    try:
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
    return jsonify({'status': 'healthy', 'model': 'loaded'})

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=8000, debug=True)
