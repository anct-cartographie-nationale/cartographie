const LIGHT = '#ffffff';
const DARK = '#1e1e1e';
const LUMINANCE_THRESHOLD = 0.5;

const expandShortHex = (hex: string): string => (hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex);

const channel = (hex: string, index: number): number => Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16) / 255;

const relativeLuminance = (hex: string): number =>
  0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);

export const contrastColor = (color: string): string => {
  const hex = expandShortHex(color.replace(/^#/, '').toLowerCase());
  if (!/^[0-9a-f]{6}$/.test(hex)) return LIGHT;
  return relativeLuminance(hex) > LUMINANCE_THRESHOLD ? DARK : LIGHT;
};
