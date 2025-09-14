import React from 'react';

interface AppLoaderProps {
  isLoading: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-400 to-green-500 rounded-full flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;