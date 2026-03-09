import { cn } from '@/lib/utils';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
};

const sizeClasses = {
  sm: 'h-8 w-8 border-2',
  md: 'h-12 w-12 border-2',
  lg: 'h-16 w-16 border-3',
};

export function LoadingSpinner({
  size = 'md',
  className,
  text
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={cn(
          'animate-spin rounded-full border-gold-500/20 border-t-gold-500',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label={text || 'Loading'}
      />
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
