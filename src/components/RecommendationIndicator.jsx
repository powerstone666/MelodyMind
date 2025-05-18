import React from 'react';

const RecommendationIndicator = ({ visible, loading, recommendationType }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 z-50 
                    bg-gradient-to-r from-purple-700 to-pink-600 text-white 
                    px-4 py-2 rounded-full shadow-lg 
                    flex items-center gap-2 text-xs md:text-sm
                    animate-fadeIn">
      {loading ? (
        <>
          <span className="animate-pulse">Loading recommendations</span>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {recommendationType === 'gemini' ? 
            'AI-powered recommendation' : 'Playing recommended song'}
        </>
      )}
    </div>
  );
};

export default RecommendationIndicator;
