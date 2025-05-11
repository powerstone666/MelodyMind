import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-red animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border-t-4 border-b-4 border-blue animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
