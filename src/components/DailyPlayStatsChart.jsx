// Daily Play Stats chart component for profile page
import React from 'react';

const DailyPlayStatsChart = ({ dailyStats }) => {
  // If no data is available yet
  if (!dailyStats || dailyStats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-40 rounded-lg bg-deep-grey/20 border border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-400 text-center">Start listening to see your daily stats!</p>
      </div>
    );
  }
    // Find the max play count to calculate bar heights
  const maxCount = Math.max(...dailyStats.map(day => day.count), 1);
  
  // Check if there's any actual activity (plays > 0)
  const hasActivity = dailyStats.some(day => day.count > 0);
  
  // If no plays, show a special message
  if (!hasActivity) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-40 rounded-lg bg-deep-grey/20 border border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-400 text-center">Start listening to see your daily activity!</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-deep-grey/30 p-4 rounded-lg border border-gray-700">
      <div className="mb-3">
        <p className="text-white font-semibold mb-2">Last 7 Days Activity</p>
      </div>
      
      <div className="flex items-end justify-between h-32 mt-4">
        {dailyStats.map((day, index) => {
          // Calculate bar height percentage (min 5% so there's always a visible bar)
          const heightPercentage = day.count > 0 
            ? Math.max(15, Math.round((day.count / maxCount) * 100)) 
            : 5;
            
          return (
            <div key={index} className="flex flex-col items-center justify-end">
              <div 
                className="w-8 bg-melody-pink-500 rounded-t-md transition-all duration-500 hover:bg-melody-pink-400"
                style={{ height: `${heightPercentage}%` }}
                title={`${day.count} plays`}
              ></div>
              <div className="text-xs text-gray-400 mt-2">{day.date}</div>
              <div className="text-white text-xs font-semibold mt-1">{day.count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyPlayStatsChart;
