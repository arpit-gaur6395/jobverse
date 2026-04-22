import React from 'react';

const Shimmer = ({ width = '100%', height = '20px', className = '', rounded = 'rounded' }) => {
  return (
    <div
      className={`shimmer ${className} ${rounded}`}
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
};

const ShimmerCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      <Shimmer width="60%" height="24px" className="mb-3" />
      <Shimmer width="100%" height="16px" className="mb-2" />
      <Shimmer width="80%" height="16px" className="mb-4" />
      <div className="flex gap-2">
        <Shimmer width="30%" height="32px" rounded="rounded-full" />
        <Shimmer width="40%" height="32px" />
      </div>
    </div>
  );
};

const ShimmerButton = ({ width = '100%', height = '44px' }) => {
  return (
    <Shimmer width={width} height={height} rounded="rounded-lg" />
  );
};

const ShimmerText = ({ lines = 3, className = '' }) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <Shimmer
          key={index}
          width={index === lines - 1 ? '70%' : '100%'}
          height="16px"
          className="mb-2"
        />
      ))}
    </div>
  );
};

const ShimmerAvatar = ({ size = '40px' }) => {
  return <Shimmer width={size} height={size} rounded="rounded-full" />;
};

const ShimmerJobCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Shimmer width="70%" height="24px" className="mb-2" />
          <Shimmer width="50%" height="18px" />
        </div>
        <Shimmer width="60px" height="30px" rounded="rounded-lg" />
      </div>
      <div className="flex gap-2 mb-4">
        <Shimmer width="25%" height="28px" rounded="rounded-full" />
        <Shimmer width="25%" height="28px" rounded="rounded-full" />
        <Shimmer width="25%" height="28px" rounded="rounded-full" />
      </div>
      <Shimmer width="100%" height="40px" rounded="rounded-lg" />
    </div>
  );
};

export { Shimmer, ShimmerCard, ShimmerButton, ShimmerText, ShimmerAvatar, ShimmerJobCard };
