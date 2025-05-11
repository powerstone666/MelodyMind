import React from 'react';

const Section = ({ title, children, onViewAll, viewAllText = "View All" }) => {
  return (
    <div className="mb-10 animate-fadeIn">
      <div className="flex items-center justify-between px-6 mb-2">        <h2 className="text-2xl font-bold bg-gradient-to-r from-melody-pink-500 to-blue text-transparent bg-clip-text">{title}</h2>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="px-4 py-1 text-sm text-white rounded-full bg-melody-purple-700 hover:bg-melody-pink-600/30 transition-colors duration-300"
          >
            {viewAllText}
          </button>
        )}
      </div>
      <div className="flex overflow-x-auto space-x-5 px-6 py-4 no-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default Section;
