
import React from 'react';

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center text-primary dark:text-green-300">
    <div className="w-24 h-24 text-6xl mb-4 animate-bounce">🌾</div>
    <h1 className="text-2xl font-bold font-poppins">किसान मित्र</h1>
    <p className="font-inter">लोड हो रहा है...</p>
    <div className="absolute bottom-8 w-24 h-1.5 bg-green-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-pulse w-full"></div>
    </div>
  </div>
);

export default LoadingScreen;
