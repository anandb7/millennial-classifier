import React, { useState } from 'react';
import { usePredict } from './hooks/usePredict';
import CoinFlip from './components/CoinFlip';
import ResultCard from './components/ResultCard';

function App() {
  const [text, setText] = useState('');
  const [showError, setShowError] = useState(false);
  const { predict, isLoading, error, result, reset } = usePredict();

  const handlePredict = async () => {
    if (!text.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    reset();
    const predictionResult = await predict(text);
    if (!predictionResult && error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleReset = () => {
    setText('');
    reset();
    setShowError(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: '#f0f2f5'}}>
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2" style={{color: '#1877f2'}}>
            MillennialDetector™
          </h1>
          <p className="text-gray-600 text-base">
            Discover your generational essence through AI
          </p>
        </div>

        {/* Main Content - Side by Side */}
        <div className="glass-morphism rounded-lg p-6 min-h-[500px] max-h-[600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            
            {/* Left Side - Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Enter Your Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?"
                  className={`fb-input w-full h-40 p-3 resize-none transition-all ${
                    showError && !text.trim() ? 'animate-shake border-red-400' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>

              {/* Error Message */}
              {showError && error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center text-sm animate-fade-in">
                  {error}
                </div>
              )}

              {/* Predict Button */}
              <button
                onClick={handlePredict}
                disabled={isLoading || !text.trim()}
                className="fb-button w-full px-6 py-3 text-base"
              >
                {isLoading ? 'Analyzing...' : 'Predict My Generation'}
              </button>

              {/* Reset Button */}
              {result && (
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all text-sm"
                >
                  Try Again
                </button>
              )}
            </div>

            {/* Right Side - Coin Section */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                {/* Coin Container */}
                <div className="flex justify-center items-center mb-6">
                  <div className="relative">
                    {/* Coin with animations */}
                    <div 
                      className={`coin-3d w-40 h-40 relative ${
                        !isLoading && !result ? 'animate-spin-slow' : ''
                      } ${isLoading ? 'animate-flip' : ''}`}
                      style={{
                        transform: result && !isLoading 
                          ? result.label === 'Millennial' 
                            ? 'rotateY(0deg)' 
                            : 'rotateY(180deg)'
                          : ''
                      }}
                    >
                      <div className="coin-face flex items-center justify-center text-sm font-bold text-gray-800 rounded-full">
                        Millennial
                      </div>
                      <div className="coin-face coin-back flex items-center justify-center text-sm font-bold text-gray-800 rounded-full">
                        Not-Millennial
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result Display */}
                {result && (
                  <div className="animate-fade-in">
                    <ResultCard result={result} />
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center text-gray-600 animate-pulse">
                    <p className="text-base font-medium">Analyzing...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Powered by your fine-tuned LoRA model</p>
        </div>
      </div>
    </div>
  );
}

export default App;
