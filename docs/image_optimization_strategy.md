# Image Optimization Strategy

This document outlines the image optimization strategy for the SkillSwap MVP application to improve performance, reduce bandwidth usage, and enhance user experience across devices.

## Goals

- Reduce page load times by optimizing image delivery
- Minimize bandwidth consumption for users on limited data plans
- Ensure images look crisp on all device types and screen resolutions
- Prevent layout shifts during image loading
- Implement best practices for SEO and Core Web Vitals

## Technical Approach

### 1. Next.js Image Component

We'll leverage the built-in `next/image` component which provides:

- Automatic WebP/AVIF format conversion when supported
- Responsive sizing based on viewport
- Lazy loading by default
- Automatic image optimization

```jsx
// Before
<img src="/profile.jpg" alt="User profile" width="400" height="300" />

// After
import Image from 'next/image';

<Image 
  src="/profile.jpg" 
  alt="User profile" 
  width={400} 
  height={300} 
  placeholder="blur" 
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAKBweIx4ZKCMhIy0rKDA8ZEE8Nzc8e1hdSWSRgJmWj4CMiqC05sOgqtqtiozI/8va7vX///+bwf////r/5v3/+P/bAEMBKy0tPDU8dkFBdviljKX4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+P/AABEIABkAGQMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAABAUGA//EACIQAAIBAwQDAQEAAAAAAAAAAAECAwAEEQUSITETIkFxgf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGhEBAQACAwAAAAAAAAAAAAAAAQACERIhMf/aAAwDAQACEQMRAD8AnnvNQaWGaO4JMbBsEDjOCDjGB7U10itqNi7rwo3HgcY9ahafKlvYs0kixqJPUscZyPiszrwgj2vdQogwBucDr4VB36or0mW9JuC9LNHdJJdOkP5bKC2wKR28kYx3waqI7eGCISLCgZsZbaMn65rltPnvLQObS7dA3O0N+9U6Xd3txcMl1cNKgUHaVAGfyigC9Q2xQk//2Q=="
/>
```

### 2. Image Formats & Size Optimization

We'll implement a multi-format delivery approach:

| Format | Use Case |
|--------|----------|
| WebP | Primary format for most images (with JPEG/PNG fallback) |
| AVIF | For browsers that support it (with WebP and JPEG/PNG fallback) |
| SVG | For icons, logos, and simple illustrations |
| JPEG | For photographic content when modern formats not supported |
| PNG | Only for images requiring transparency when WebP not supported |

### 3. Responsive Images Implementation

We'll implement different image sizes based on viewport width:

```jsx
<Image
  src="/hero-image.jpg"
  alt="Hero"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  width={1200}
  height={800}
  style={{
    width: '100%',
    height: 'auto',
  }}
/>
```

Specific dimensions will be defined for common image types:

| Image Type | Mobile (<=640px) | Tablet (<=1024px) | Desktop (>1024px) |
|------------|------------------|-------------------|-------------------|
| Hero | 640px | 1024px | 1200px |
| Card thumbnail | 320px | 400px | 480px |
| Avatar (sm) | 40px | 48px | 56px |
| Avatar (lg) | 80px | 96px | 120px |
| Skill preview | 240px | 320px | 360px |

### 4. Placeholder and Loading Strategy

To prevent layout shifts and improve perceived performance:

```jsx
// Blur placeholder approach
<Image
  src="/profile.jpg"
  alt="Profile"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// Dominant color approach
<div style={{ backgroundColor: "#E1E7F0" /* dominant color */ }}>
  <Image
    src="/profile.jpg"
    alt="Profile"
    width={400}
    height={300}
  />
</div>
```

### 5. CDN and Caching Configuration

For external images, we'll configure our Next.js image domains:

```js
// In next.config.js
module.exports = {
  images: {
    domains: ['skillswap-user-content.s3.amazonaws.com', 'supabase.io'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: '/_next/image',
    loader: 'default',
    minimumCacheTTL: 60,
  },
}
```

### 6. SVG Implementation

For icons and UI elements, we'll use SVGs:

- Inline critical SVGs for immediate rendering
- Use sprite sheets for repeatedly used icons
- Optimize SVGs with SVGO

```jsx
// Icon component example
import { ReactComponent as StarIcon } from '@/icons/star.svg';

const RatingIcon = ({ active }) => (
  <StarIcon className={`w-5 h-5 ${active ? 'text-yellow-500' : 'text-gray-300'}`} />
);
```

### Skeleton Loaders for Image-heavy Components

```jsx
const SkillCardImageSkeleton = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg w-full h-48"></div>
);

// Usage with suspense
<Suspense fallback={<SkillCardImageSkeleton />}>
  <Image src={skill.imageUrl} alt={skill.name} width={400} height={300} />
</Suspense>
```

## Implementation Steps

1. **Audit Current Images**
   - Identify all image usage across the application
   - Categorize by type (hero, thumbnail, avatar, etc.)
   - Document current dimensions and formats

2. **Create Image Component Library**
   - Develop reusable image components for each use case
   - Implement proper error handling and fallbacks
   - Document component usage patterns

3. **Convert Existing Images**
   - Replace standard img tags with next/image components
   - Generate appropriate placeholder images
   - Ensure correct aspect ratios are maintained

4. **Performance Testing**
   - Verify improvements to LCP (Largest Contentful Paint)
   - Ensure CLS (Cumulative Layout Shift) is minimized
   - Test performance across various connection speeds

5. **Documentation**
   - Create image usage guidelines for developers
   - Document responsive image patterns
   - Establish conventions for new image assets

## Target Performance Metrics

| Metric | Current | Target |
|--------|---------|--------|
| LCP | ~2.5s | <1.5s |
| CLS | ~0.1 | <0.05 |
| Image Load Time | ~800ms | <400ms |
| Image Size Reduction | - | >50% |

## Technical Considerations

- **Browser Compatibility**: Ensure graceful fallbacks for browsers not supporting WebP/AVIF
- **Accessibility**: All images must have descriptive alt text
- **SEO Impact**: Correctly implementing image optimization improves Core Web Vitals, positively impacting SEO
- **Development Workflow**: Establish clear processes for adding new images to the application

## Integration with Existing Image Upload System

For user-uploaded images:

1. **Server-side Processing**
   - Automatically generate multiple resolution variants
   - Convert to optimized formats (WebP, AVIF)
   - Generate and store placeholder blurDataURLs

2. **Client-side Implementation**
   - Use the appropriate image size based on context
   - Implement lazy loading for gallery/collection views
   - Provide clear loading states for uploading images

## Implementation Timeline

| Week | Tasks |
|------|-------|
| Week 1 | Audit current images and create component library |
| Week 2 | Convert high-priority images (hero, landing page) |
| Week 3 | Convert remaining images and implement lazy loading |
| Week 3 | Testing, optimization, and documentation |
