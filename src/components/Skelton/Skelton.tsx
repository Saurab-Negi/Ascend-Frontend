import React from "react";

type SkeletonProps = {
  width?: string;
  height?: string;
  className?: string;
  radius?: string;
};

const Skeleton: React.FC<SkeletonProps> = ({
  width = "w-full",
  height = "h-4",
  radius = "rounded-md",
  className = "",
}) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${width} ${height} ${radius} ${className}`} 
    />
  );
};

export default Skeleton;
