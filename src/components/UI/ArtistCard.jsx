import React from 'react';
import Card from './Card';

const ArtistCard = ({ image, name, onClick }) => {
  return (
    <Card onClick={onClick} className="text-center">
      <div className="relative overflow-hidden pt-4 px-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full aspect-square object-cover rounded-full transition-transform duration-500 hover:scale-110" 
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium truncate text-white">{name}</h3>
        <p className="text-xs text-gray-400">Artist</p>
      </div>
    </Card>
  );
};

export default ArtistCard;
