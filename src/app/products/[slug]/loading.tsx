import { ProgressiveLoader } from '@/components/ui/ProgressiveLoader';
import { DEFAULT_PRODUCT_STAGES } from '@/lib/loading/states';

export default function ProductLoading() {
  return (
    <div className="content-container py-12">
      <ProgressiveLoader
        stages={DEFAULT_PRODUCT_STAGES}
        className="min-h-[400px]"
      />
    </div>
  );
}
