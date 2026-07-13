import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text', width, height }) => (
  <div
    className={`skeleton-loader ${variant === 'circular' ? 'rounded-full' : variant === 'text' ? 'rounded-lg h-4' : 'rounded-2xl'} ${className}`}
    style={{ width, height }}
  />
);

const StallCardSkeleton: React.FC = () => (
  <div className="rounded-2xl overflow-hidden bg-[var(--tw-card-background)] border border-[var(--tw-card-border)]">
    <div className="aspect-[4/3] skeleton-loader" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 skeleton-loader rounded-lg" />
      <div className="h-3 w-1/2 skeleton-loader rounded-lg" />
      <div className="flex gap-4">
        <div className="h-3 w-16 skeleton-loader rounded-lg" />
        <div className="h-3 w-16 skeleton-loader rounded-lg" />
      </div>
    </div>
  </div>
);

export { StallCardSkeleton };
export default Skeleton;
