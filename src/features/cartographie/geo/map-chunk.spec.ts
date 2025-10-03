import type { BBox } from 'geojson';
import { describe, expect, it } from 'vitest';
import { boundingBoxCenter, mapChunk, splitBondingBox } from './map-chunk';

describe('map chunk', () => {
  it.each([
    { latitude: 48.8743, longitude: 2.4456, expected: [2.4, 48.8, 2.5, 48.9] },
    { latitude: 48.8999, longitude: 2.4999, expected: [2.4, 48.8, 2.5, 48.9] },
    { latitude: 48.8, longitude: 2.3, expected: [2.2, 48.7, 2.3, 48.8] },
    { latitude: 48.8, longitude: 2.4999, expected: [2.4, 48.7, 2.5, 48.8] },
    { latitude: 48.8999, longitude: 2.3, expected: [2.2, 48.8, 2.3, 48.9] },
    { latitude: -0.15, longitude: -0.15, expected: [-0.2, -0.2, -0.1, -0.1] },
    { latitude: 50, longitude: 3.14, expected: [3.1, 50.0, 3.2, 50.1] },
    { latitude: 47.53, longitude: 5, expected: [5.0, 47.5, 5.1, 47.6] },
    { latitude: 10.05, longitude: 20.05, expected: [20.0, 10.0, 20.1, 10.1] }
  ])('should get chunk for latitude: $latitude, longitude: $longitude (default steps)', ({ latitude, longitude, expected }) => {
    const chunk: BBox = mapChunk([longitude, latitude]);
    expect(chunk).toEqual(expected);
  });

  it('should respect custom vertical step', () => {
    const chunk = mapChunk([2.4456, 48.8743], { verticalStep: 0.5 });
    expect(chunk).toEqual<BBox>([2.4, 48.5, 2.5, 49.0]);
  });

  it('should respect custom horizontal step', () => {
    const chunk = mapChunk([2.4456, 48.8743], { horizontalStep: 0.5 });
    expect(chunk).toEqual<BBox>([2.0, 48.8, 2.5, 48.9]);
  });

  it('should respect custom vertical and horizontal step', () => {
    const chunk = mapChunk([2.4456, 48.8743], { verticalStep: 0.5, horizontalStep: 0.5 });
    expect(chunk).toEqual<BBox>([2.0, 48.5, 2.5, 49.0]);
  });
});

describe('map chunk center', () => {
  it('should compute center for [2.4, 48.8, 2.5, 48.9]', () => {
    const center = boundingBoxCenter([2.4, 48.8, 2.5, 48.9]);

    expect(center).toEqual([2.45, 48.85]);
  });
});

describe('split chunk', () => {
  it('should split bounding box in multiple chunks', () => {
    const boundingBox: BBox = [2.3, 48.7, 2.7, 49.1];
    const chunks: BBox[] = splitBondingBox(boundingBox, { verticalStep: 0.1, horizontalStep: 0.2 });

    expect(chunks).toEqual<BBox[]>([
      [2.2, 49.1, 2.4, 49.2],
      [2.4, 49.1, 2.6, 49.2],
      [2.6, 49.1, 2.8, 49.2],
      [2.2, 49, 2.4, 49.1],
      [2.4, 49, 2.6, 49.1],
      [2.6, 49, 2.8, 49.1],
      [2.2, 48.9, 2.4, 49],
      [2.4, 48.9, 2.6, 49],
      [2.6, 48.9, 2.8, 49],
      [2.2, 48.8, 2.4, 48.9],
      [2.4, 48.8, 2.6, 48.9],
      [2.6, 48.8, 2.8, 48.9],
      [2.2, 48.7, 2.4, 48.8],
      [2.4, 48.7, 2.6, 48.8],
      [2.6, 48.7, 2.8, 48.8]
    ]);
  });
});
