import { useState } from 'react';

export const usePredict = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const predict = async (text) => {
    if (!text || text.trim().length === 0) {
      setError('You need to write something — even a passive-aggressive diary entry works.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError('Oops. Even AI has existential crises sometimes.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setResult(null);
    setIsLoading(false);
  };

  return {
    predict,
    isLoading,
    error,
    result,
    reset,
  };
};
