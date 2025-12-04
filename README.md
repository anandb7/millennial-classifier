# MillennialDetector™ 🔮

A single-page web app that predicts whether you're Millennial or Not-Millennial based on your writing style, powered by your fine-tuned LoRA model.

## Features

- **Text Analysis**: Paste your blog-style text and get instant generational predictions
- **Coin Flip Animation**: Watch the coin flip while the AI analyzes your text
- **Glass-morphism UI**: Modern, aesthetic interface with subtle gradients
- **Your LoRA Model**: Uses your fine-tuned DistilBERT model with LoRA adapter
- **Real AI Predictions**: Actual model inference with confidence scores
- **Humorous Results**: Get personalized results with confidence scores
- **Error Handling**: Playful error messages for edge cases

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Flask API
- **Model**: DistilBERT-base-uncased with LoRA adapter
- **Styling**: TailwindCSS with custom animations
- **Fonts**: Inter (body) + Comic Neue (headings)

## Quick Start

1. Install Python dependencies:

```bash
pip install -r requirements.txt
```

1. Install Node.js dependencies:

```bash
npm install
```

1. Add your images to the carousel folders:
   - Add millennial images to `/public/millennial/` (name them 1.jpg, 2.jpg, 3.jpg, etc.)
   - Add non-millennial images to `/public/non-millennial/` (name them 1.jpg, 2.jpg, 3.jpg, etc.)

1. Start both frontend and backend:

```bash
npm run dev
```

1. Open your browser to `http://localhost:5173`

The API will be available at `http://localhost:8000`

## API Integration

The app expects a POST endpoint at `/predict` with the following format:

**Request:**

```json
{
  "text": "Your blog-style text here..."
}
```

**Response:**

```json
{
  "label": "Millennial" | "Not-Millennial",
  "confidence": 0.85
}
```

## Configuration

The Vite config is set up to proxy API requests to `http://localhost:8000`. Update the `vite.config.js` if your API runs elsewhere.

## Project Structure

```
src/
├── components/
│   ├── CoinFlip.jsx      # Coin flip animation
│   └── ResultCard.jsx    # Results display
├── hooks/
│   └── usePredict.js     # API call hook
├── App.jsx               # Main application
├── main.jsx              # React entry point
└── index.css             # Global styles
```

## Build for Production

```bash
npm run build
```

## License

Made with ☕ and existential dread.
