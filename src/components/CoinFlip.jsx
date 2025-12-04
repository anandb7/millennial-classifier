import React from 'react';

const CoinFlip = ({ isFlipping, result }) => {
  return (
    <div className="flex justify-center items-center my-8">
      <div className={`coin-3d ${isFlipping ? 'animate-flip' : ''} w-32 h-32 relative`}>
        <div className="coin-face flex items-center justify-center text-sm font-bold text-white">
          Millennial
        </div>
        <div className="coin-face coin-back flex items-center justify-center text-sm font-bold text-white">
          Not-Millennial
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
