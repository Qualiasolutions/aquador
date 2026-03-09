import {
  LuxuryHeroSkeleton,
  LuxuryFilterSkeleton,
  LuxuryProductGridSkeleton,
  LuxurySkeleton,
} from '@/components/ui/LuxurySkeleton';

export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-gold-ambient pt-20 md:pt-24 pb-16">
      {/* Hero skeleton */}
      <LuxuryHeroSkeleton />

      {/* Search bar skeleton */}
      <div className="container-wide pb-10 pt-8">
        <div className="max-w-md mx-auto mb-8">
          <LuxurySkeleton className="h-12 w-full" />
        </div>

        {/* Filter skeletons */}
        <div className="flex flex-col items-center gap-6">
          <LuxuryFilterSkeleton />
          <div className="flex gap-2">
            <LuxurySkeleton className="h-8 w-20" />
            <LuxurySkeleton className="h-8 w-24" />
            <LuxurySkeleton className="h-8 w-28" />
          </div>
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="container-wide pb-20">
        <LuxuryProductGridSkeleton count={12} />
      </div>
    </main>
  );
}
