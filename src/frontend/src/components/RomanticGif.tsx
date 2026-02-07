import { memo, useState } from 'react';

interface RomanticGifProps {
  src: string;
  alt: string;
  className?: string;
}

// Memoized component to prevent unnecessary re-renders and GIF restarts
const RomanticGif = memo(({ src, alt, className = '' }: RomanticGifProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-rose-100 dark:bg-rose-900/30 rounded-2xl ${className}`}
        style={{ aspectRatio: '3/2' }}
      >
        <p className="text-rose-600 dark:text-rose-400 text-sm px-4 text-center">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ aspectRatio: '3/2' }}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
});

RomanticGif.displayName = 'RomanticGif';

export default RomanticGif;
