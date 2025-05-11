import React from 'react';

const Button = ({ children, onClick, variant = "primary", fullWidth, className = "", icon }) => {
  const baseClasses = "px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2";
    const variants = {
    primary: "bg-melody-pink-600 hover:bg-melody-pink-500 text-white shadow-md shadow-melody-pink-600/20 hover:shadow-melody-pink-500/30",
    secondary: "bg-melody-purple-700 hover:bg-melody-purple-600 text-white shadow-md shadow-melody-purple-800/20",
    outline: "bg-transparent border border-melody-pink-500 text-melody-pink-500 hover:bg-melody-pink-600/10 hover:border-melody-pink-400",
    transparent: "bg-transparent hover:bg-white/10"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
