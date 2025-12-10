'use client';

import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/next';
import { ReactNode } from 'react';

const DynamicProviders = dynamic(() => import('./providers').then(mod => mod.Providers), {
  ssr: false,
});

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <DynamicProviders>
        {children}
      </DynamicProviders>
      <Analytics />
    </>
  );
}
