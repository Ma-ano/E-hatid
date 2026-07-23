import React from 'react';

interface AdminSkeletonProps {
  type?: 'card' | 'list' | 'stats';
  count?: number;
}

const shimmer = `
  @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }
`;

const SkeletonBar: React.FC<{ width: string; height?: string }> = ({ width, height = '16px' }) => (
  <div
    style={{
      width, height, borderRadius: '8px',
      background: 'linear-gradient(90deg, var(--ion-border-color) 25%, var(--ion-card-background) 50%, var(--ion-border-color) 75%)',
      backgroundSize: '200px 100%',
      animation: 'shimmer 1.5s ease-in-out infinite',
    }}
  />
);

const AdminSkeleton: React.FC<AdminSkeletonProps> = ({ type = 'list', count = 3 }) => {
  return (
    <>
      <style>{shimmer}</style>
      {type === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{
              padding: '16px', background: 'var(--ion-card-background)', borderRadius: '12px'
            }}>
              <SkeletonBar width="80px" height="12px" />
              <div style={{ marginTop: '12px' }}><SkeletonBar width="60px" height="24px" /></div>
            </div>
          ))}
        </div>
      )}
      {type === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{
              padding: '16px', background: 'var(--ion-card-background)', borderRadius: '12px'
            }}>
              <SkeletonBar width="160px" height="16px" />
              <div style={{ marginTop: '8px' }}><SkeletonBar width="240px" height="12px" /></div>
              <div style={{ marginTop: '12px' }}><SkeletonBar width="100%" height="48px" /></div>
            </div>
          ))}
        </div>
      )}
      {type === 'card' && (
        <div style={{ padding: '16px', background: 'var(--ion-card-background)', borderRadius: '12px' }}>
          <SkeletonBar width="120px" height="16px" />
          <div style={{ marginTop: '8px' }}><SkeletonBar width="200px" height="12px" /></div>
          <div style={{ marginTop: '16px' }}><SkeletonBar width="100%" height="40px" /></div>
        </div>
      )}
    </>
  );
};

export default AdminSkeleton;
