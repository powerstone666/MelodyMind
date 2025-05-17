// Play count chart component for profile page
import React from 'react';

const PlayCountChart = ({ artists }) => {
  // If no artists data is available yet
  if (!artists || artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-40 rounded-lg bg-deep-grey/20 border border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-400 text-center">Start listening to see your stats!</p>
      </div>
    );
  }
  
  // Find the max play count to calculate percentages
  const maxPlayCount = artists.reduce((max, artist) => 
    artist.count > max ? artist.count : max, 0);
    
  // Calculate total plays from all artists
  const totalPlays = artists.reduce((sum, artist) => sum + artist.count, 0);

  return (
    <div className="w-full bg-deep-grey/30 p-4 rounded-lg border border-gray-700">
      <div className="mb-3">
        <p className="text-white font-semibold mb-2">Top Artists Distribution</p>
      </div>
      <div className="space-y-3">
        {artists.map((artist, index) => {
          // Calculate percentage width for the bar
          const percentage = Math.round((artist.count / maxPlayCount) * 100);
          
          // Calculate artist's percentage of total plays
          const playPercentage = Math.round((artist.count / totalPlays) * 100);
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-white text-sm">{artist.name}</span>
                <span className="text-gray-400 text-xs">{artist.count} plays ({playPercentage}%)</span>
              </div>
              <div className="w-full bg-deep-grey/40 rounded-full h-2.5">
                <div 
                  className="bg-melody-pink-500 h-2.5 rounded-full" 
                  style={{ width: `${percentage}%` }}
                  title={`${artist.count} plays`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayCountChart;
