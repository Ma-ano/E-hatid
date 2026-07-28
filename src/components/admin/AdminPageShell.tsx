import React from 'react';
import { IonSearchbar } from '@ionic/react';

interface AdminPageShellProps {
  title: string;
  subtitle?: string;
  search?: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  };
  loading?: boolean;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}

const AdminPageShell: React.FC<AdminPageShellProps> = ({
  title, subtitle, search, loading, skeleton, children
}) => (
  <div className="page-container py-6">
    <div className="px-4 mb-4">
      <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>
          {subtitle}
        </p>
      )}
      {search && (
        <IonSearchbar
          value={search.value}
          onIonChange={e => search.onChange(e.detail.value!)}
          placeholder={search.placeholder || 'Search...'}
          style={{
            '--background': 'var(--ion-card-background)',
            '--border-radius': '12px',
            '--border': '1px solid var(--ion-border-color)',
            '--placeholder-color': 'var(--ion-text-color-secondary)',
            '--icon-color': 'var(--ion-color-primary)',
            '--color': 'var(--ion-text-color)',
            padding: '0', height: '48px', marginTop: '12px',
          } as any}
        />
      )}
    </div>
    {loading && skeleton ? skeleton : children}
  </div>
);

export default AdminPageShell;
