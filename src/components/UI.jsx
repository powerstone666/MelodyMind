import React from 'react';

// Enhanced Section Component
export const Section = ({ title, children, onViewAll }) => {
  const [expanded, setExpanded] = React.useState(false);
  const isAboveMedium = React.useCallback(() => window.innerWidth >= 768, []);
  const [isMobile, setIsMobile] = React.useState(!isAboveMedium());
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(!isAboveMedium());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAboveMedium]);
  
  const handleViewAll = () => {
    setExpanded(!expanded);
    if (onViewAll) onViewAll();
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between px-6 mb-2">        <h2 className="text-2xl font-bold bg-gradient-to-r from-melody-pink-500 to-blue text-transparent bg-clip-text">{title}</h2>
        {!isMobile && onViewAll && (
          <button 
            onClick={handleViewAll}
            className="px-4 py-1 text-sm rounded-full bg-melody-purple-700 hover:bg-melody-pink-600/30 transition-colors duration-300 flex items-center gap-2"
          >
            <span>{expanded ? 'Show Less' : 'View All'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expanded ? "M5 15l7-7 7 7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        )}
      </div>      {/* Mobile View - Always Horizontal Scrolling */}
      {isMobile && (
        <div className="flex overflow-x-auto space-x-4 p-4 no-scrollbar snap-x snap-mandatory w-full relative">
          {children}
        </div>
      )}      {/* Desktop View - Grid Layout when expanded, otherwise show limited items */}
      {!isMobile && (
        <div className={expanded 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 p-4 animate-fadeIn" 
          : "flex overflow-x-auto space-x-5 p-4 no-scrollbar relative"
        }>
          {children}
        </div>
      )}
    </div>
  );
};

// Enhanced Card Component
export const Card = ({ children, onClick }) => {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div 
      onClick={onClick}
      className={`
        bg-deep-grey rounded-lg overflow-hidden 
        transition-all duration-300 hover:shadow-xl hover:scale-103 
        hover:shadow-red/30 cursor-pointer group        ${isMobile 
          ? 'min-w-[130px] w-[130px] flex-shrink-0 snap-center' 
          : 'min-w-[160px] w-[160px] lg:min-w-[180px] lg:w-[180px] xl:min-w-[190px] xl:w-[190px]'
        }
        border border-transparent hover:border-red/20
      `}
    >
      {children}
    </div>
  );
};

// Album Art Component
export const AlbumArt = ({ src, alt, isNew }) => {
  const isMobile = window.innerWidth < 768;
  const [imgError, setImgError] = React.useState(false);
  
  // Normalize the image source URL
  const normalizedSrc = React.useMemo(() => {
    if (!src) return 'https://via.placeholder.com/300?text=No+Image';
    if (typeof src === 'string') return src;
    if (src && src.url) return src.url;
    if (src && src.link) return src.link;
    return 'https://via.placeholder.com/300?text=No+Image';
  }, [src]);
  
  return (
    <div className="relative overflow-hidden group">
      <img 
        src={!imgError ? normalizedSrc : 'https://via.placeholder.com/300?text=No+Image'} 
        alt={alt} 
        className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-110" 
        loading="lazy"
        onError={() => setImgError(true)}
      />{isNew && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-gradient-to-r from-melody-pink-600 to-melody-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg shadow-melody-pink-600/40">
            NEW
          </span>
        </div>
      )}<div className="absolute inset-0 bg-gradient-to-t from-melody-purple-900/80 via-melody-purple-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">        <button className="bg-gradient-to-r from-melody-pink-600 to-melody-pink-500 rounded-full p-2 transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-melody-pink-600/40 hover:shadow-melody-pink-500/60">
          <svg xmlns="http://www.w3.org/2000/svg" className={isMobile ? "h-5 w-5" : "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Content Card Info
export const CardInfo = ({ title, subtitle }) => {
  return (
    <div className="p-3">      <h3 className="font-medium truncate leading-tight mb-1 transition-colors duration-300 group-hover:text-melody-pink-500" 
          style={{ fontSize: '0.95rem' }}>
        {title}
      </h3>
      {subtitle && (
        <div className="text-xs text-gray-400 leading-tight overflow-hidden">
          {typeof subtitle === 'string' ? (
            <p className="truncate">{subtitle}</p>
          ) : (
            subtitle
          )}
        </div>
      )}
    </div>
  );
};

// Button Component
export const Button = ({ children, onClick, variant = "primary", fullWidth, className = "" }) => {
  const baseClasses = "px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105";
  
  const variants = {
    primary: "bg-red hover:bg-red/80 text-white",
    secondary: "bg-deep-grey hover:bg-grey/80 text-white",
    outline: "bg-transparent border border-red text-red hover:bg-red/10"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Loader Component
export const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">      <div className="relative transform hover:scale-110 transition-transform duration-500">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-melody-pink-600 animate-spin" 
             style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-t-4 border-b-4 border-blue animate-spin"
               style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="wave-bars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ message, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fadeIn">      <div className="text-gray-400 mb-4 transform transition-transform duration-500 hover:scale-110 hover:text-melody-pink-500">
        {icon}
      </div>
      <p className="mt-2 text-gray-400 text-center font-medium">{message}</p>
      <p className="mt-1 text-gray-500 text-sm text-center">Try refreshing or check back later</p>
      <div className="mt-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </span>
        </Button>
      </div>
    </div>
  );
};