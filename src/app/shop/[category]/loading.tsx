import {
  LuxuryHeroSkeleton,
  LuxuryProductGridSkeleton,
  LuxurySkeleton,
} from '@/components/ui/LuxurySkeleton';

export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-gold-ambient pt-20 md:pt-24 pb-16">
      {/* Hero skeleton */}
      <LuxuryHeroSkeleton />

      {/* Search bar skeleton */}
      <div className="container-wide py-8">
        <div className="max-w-md mx-auto">
          <LuxurySkeleton className="h-12 w-full" />
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="container-wide pb-20">
        <LuxuryProductGridSkeleton count={12} />
      </div>
    </main>
  );
}
