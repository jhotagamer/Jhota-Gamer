import React, { useState } from 'react';
import { Swords } from 'lucide-react';

interface ItemImageProps {
  itemId: string;
  tier?: number;
  enchantment?: number;
  quality?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
  showTierBadge?: boolean;
}

const sizeClasses = {
  xs: 'w-7 h-7',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24'
};

export const ItemImage: React.FC<ItemImageProps> = ({
  itemId,
  tier,
  enchantment = 0,
  quality = 1,
  size = 'md',
  className = '',
  alt = 'Item de Albion Online',
  showTierBadge = false
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Normalize item ID with tier if not present
  let normalizedId = itemId ? itemId.trim() : '';
  if (normalizedId && !normalizedId.startsWith('T') && !normalizedId.startsWith('UNIQUE_') && tier) {
    normalizedId = `T${tier}_${normalizedId}`;
  }

  if (enchantment > 0 && !normalizedId.includes('@')) {
    normalizedId = `${normalizedId}@${enchantment}`;
  }

  const qualityParam = quality > 1 ? `?quality=${quality}` : '';
  const src = normalizedId
    ? `https://render.albiononline.com/v1/item/${encodeURIComponent(normalizedId)}.png${qualityParam}`
    : '';

  // Extract tier for badge if requested
  const detectedTier = tier || (normalizedId.match(/^T([1-8])_/) ? parseInt(normalizedId[1], 10) : null);

  const containerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`relative rounded-xl bg-zinc-900/90 border border-zinc-700/60 p-1 flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0 select-none ${containerSize} ${className}`}
    >
      {/* Fallback or Placeholder */}
      {(!src || hasError) ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-950/60 rounded">
          <Swords className="w-1/2 h-1/2 opacity-60" />
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-zinc-800/40 animate-pulse rounded" />
          )}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-contain drop-shadow transition-opacity duration-200 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      )}

      {/* Optional Tier Badge */}
      {showTierBadge && detectedTier && (
        <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 border border-zinc-700 text-[9px] font-mono font-bold text-amber-300">
          T{detectedTier}
        </span>
      )}
    </div>
  );
};
