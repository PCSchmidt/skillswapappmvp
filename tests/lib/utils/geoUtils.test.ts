// tests/lib/utils/geoUtils.test.ts
import { calculateGeoDistance } from '@/lib/utils/geoUtils'; // Or from '@/lib/utils' if index.ts is used

describe('calculateGeoDistance', () => {
  it('should return 0 for the same coordinates', () => {
    expect(calculateGeoDistance(0, 0, 0, 0)).toBe(0);
    expect(calculateGeoDistance(40.7128, -74.0060, 40.7128, -74.0060)).toBe(0);
  });

  it('should calculate the distance between two known points correctly (e.g., Paris to London)', () => {
    // Paris, France (approx)
    const lat1 = 48.8566;
        const lon1 = 2.3522; // Paris East
    // London, UK (approx)
        const lat2 = 51.5074;
        const lon2 = -0.1278; // London West
        // Expected distance ~343-344 km. Our calculation is ~343.556 km
        expect(calculateGeoDistance(lat1, lon1, lat2, lon2)).toBeCloseTo(343.56, 2);
  });

  it('should handle coordinates across the equator', () => {
    const lat1 = 10; // North
    const lon1 = 0;
    const lat2 = -10; // South
    const lon2 = 0;
    // Approx 20 degrees latitude = 20 * 111.19 km ~ 2223.8 km
    expect(calculateGeoDistance(lat1, lon1, lat2, lon2)).toBeCloseTo(2223.9, 0);
  });

  it('should handle coordinates across the prime meridian', () => {
    const lat1 = 0;
    const lon1 = 10; // East
    const lat2 = 0;
    const lon2 = -10; // West
    // Approx 20 degrees longitude at equator ~ 2223.8 km
    expect(calculateGeoDistance(lat1, lon1, lat2, lon2)).toBeCloseTo(2223.9, 0);
  });

  it('should calculate distance for very distant points (antipodal)', () => {
    const lat1 = 0;
    const lon1 = 0;
    const lat2 = 0;
    const lon2 = 180; // Opposite side of the Earth
    // Half the Earth's circumference: pi * R
    const R = 6371; // Radius of the Earth in kilometers
    expect(calculateGeoDistance(lat1, lon1, lat2, lon2)).toBeCloseTo(Math.PI * R, 0);
  });
});
