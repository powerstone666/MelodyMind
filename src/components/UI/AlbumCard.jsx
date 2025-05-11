import React from 'react';
import Card from './Card';

const AlbumCard = ({ image, title, subtitle, onClick }) => {
  return (
    <Card onClick={onClick}>
      <div className="relative overflow-hidden group">
        <img 
          src={image} 
          alt={title} 
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">          <button className="bg-gradient-to-r from-melody-pink-600 to-melody-pink-500 rounded-full p-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 shadow-md shadow-melody-pink-600/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          </button>
        </div>
      </div>      <div className="p-3">
        <h3 className="text-sm font-medium truncate text-white group-hover:text-melody-pink-500 transition-colors">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 truncate group-hover:text-melody-purple-200/70 transition-colors">{subtitle}</p>}
      </div>
    </Card>
  );
};

export default AlbumCard;
