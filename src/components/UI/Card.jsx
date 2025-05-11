import React from 'react';

const Card = ({ children, onClick, className = "" }) => {
  return (    <div 
      onClick={onClick}      className={`bg-melody-purple-800 rounded-lg shadow-lg overflow-hidden min-w-[120px] max-w-[120px] md:min-w-[140px] md:max-w-[140px] 
                transition-all duration-300 hover:shadow-xl hover:scale-103 hover:shadow-melody-pink-600/40 cursor-pointer 
                border border-melody-purple-700 hover:border-melody-pink-600/50 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
