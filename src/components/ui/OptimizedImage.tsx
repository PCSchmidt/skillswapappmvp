import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import React from 'react';

export type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom';

export interface OptimizedImageProps extends Omit<ImageProps, 'className'> {
  className?: string;
  size?: ImageSize;
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | '1:1' | 'auto';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  objectFit?: 'cover' | 'contain' | 'fill';
  containerClassName?: string;
  fallbackText?: string;
  useSkeleton?: boolean;
}

/**
 * OptimizedImage component that provides consistent image optimization
 * using Next.js Image with appropriate sizing, placeholders, and responsive behavior.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt = '',
  size = 'md',
  width: propWidth,
  height: propHeight,
  aspectRatio = 'auto',
  rounded = 'md',
  objectFit = 'cover',
  className = '',
  containerClassName = '',
  placeholder = 'blur',
  fallbackText = 'Image',
  useSkeleton = false,
  quality = 85,
  priority = false,
  ...rest
}) => {
  // Define standard sizes
  const sizeMap = {
    xs: { width: 40, height: 40 },
    sm: { width: 80, height: 80 },
    md: { width: 240, height: 180 },
    lg: { width: 400, height: 300 },
    xl: { width: 800, height: 600 },
    full: { width: 1200, height: 800 },
    custom: { width: propWidth || 300, height: propHeight || 200 },
  };

  const { width, height } = sizeMap[size];

  // Generate aspect ratio class
  const aspectRatioClass = (() => {
    switch (aspectRatio) {
      case 'square':
      case '1:1':
        return 'aspect-square';
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      case '3:2':
        return 'aspect-[3/2]';
      default:
        return '';
    }
  })();

  // Generate rounded class
  const roundedClass = (() => {
    switch (rounded) {
      case 'none':
        return '';
      case 'sm':
        return 'rounded-sm';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'full':
        return 'rounded-full';
      default:
        return 'rounded-md';
    }
  })();

  // Generate object fit class
  const objectFitClass = (() => {
    switch (objectFit) {
      case 'cover':
        return 'object-cover';
      case 'contain':
        return 'object-contain';
      case 'fill':
        return 'object-fill';
      default:
        return 'object-cover';
    }
  })();

  // Generate a simple blurDataURL if not provided
  // This is a light gray placeholder
  const defaultBlurDataURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
  
  // Create a skeleton loading effect if requested
  if (useSkeleton) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-gray-200 animate-pulse', 
        aspectRatioClass,
        roundedClass,
        containerClassName
      )}
      style={{ width: propWidth || width, height: propHeight || height }}
    />
  );
  }

  return (
    <div 
      className={clsx(
        'relative overflow-hidden', 
        aspectRatioClass, 
        roundedClass, 
        containerClassName
      )}
      style={aspectRatio === 'auto' ? { width: propWidth || width, height: propHeight || height } : {}}
    >
      <Image
        src={src}
        alt={alt || fallbackText}
        width={propWidth || width}
        height={propHeight || height}
        className={clsx(objectFitClass, roundedClass, className)}
        placeholder={placeholder}
        blurDataURL={rest.blurDataURL || defaultBlurDataURL}
        quality={quality}
        priority={priority}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
