import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LoadingLegend } from './LoadingLegend';

const CityScene = dynamic(() => import('./CityScene'), { ssr: false });

const CityLoadingFallback = (
  <div className="w-full h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-driftwood/40">
      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

export function CitySection({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Scene with right margin for legend */}
      <div className="absolute inset-0 pr-20">
        <Suspense fallback={CityLoadingFallback}>
          <CityScene />
        </Suspense>
      </div>
      <LoadingLegend />
    </div>
  );
}
