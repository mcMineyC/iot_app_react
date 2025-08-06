/**
 * Color conversion utilities for working with RGB and HSV color spaces
 */

// Color interfaces
export interface HsvColor {
  h: number; // Hue (0-360 degrees)
  s: number; // Saturation (0-100%)
  v: number; // Value/Brightness (0-100%)
}

export interface RgbColor {
  r: number; // Red (0-255)
  g: number; // Green (0-255)
  b: number; // Blue (0-255)
}

/**
 * Converts an RGB color to HSV
 * @param rgb RGB color with components in range r,g,b (0-255)
 * @returns HSV color with components h (0-360), s (0-100), v (0-100)
 */
export function rgbToHsv(rgb: RgbColor): HsvColor {
  // Normalize RGB values to 0-1 range
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0; // Default hue to 0

  // Calculate hue
  if (max === min) {
    h = 0; // No color, achromatic (gray)
  } else if (max === r) {
    h = ((60 * ((g - b) / diff)) + 360) % 360; // Between yellow and magenta
  } else if (max === g) {
    h = (60 * ((b - r) / diff)) + 120; // Between cyan and yellow
  } else if (max === b) {
    h = (60 * ((r - g) / diff)) + 240; // Between magenta and cyan
  }

  // Calculate saturation
  const s = max === 0 ? 0 : (diff / max) * 100;

  // Calculate value (brightness)
  const v = max * 100;

  // Return HSV object with rounded values
  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v)
  };
}

/**
 * Converts an HSV color to RGB
 * @param hsv HSV color with components h (0-360), s (0-100), v (0-100)
 * @returns RGB color with components in range r,g,b (0-255)
 */
export function hsvToRgb(hsv: HsvColor): RgbColor {
  // Normalize HSV input values
  const h = hsv.h % 360;
  const s = Math.max(0, Math.min(100, hsv.s)) / 100;
  const v = Math.max(0, Math.min(100, hsv.v)) / 100;

  if (s === 0) {
    // Achromatic (gray)
    const value = Math.round(v * 255);
    return { r: value, g: value, b: value };
  }

  const hh = h / 60;
  const i = Math.floor(hh);
  const f = hh - i;

  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));

  let r, g, b;

  switch (i) {
    case 0:
      r = v; g = t; b = p;
      break;
    case 1:
      r = q; g = v; b = p;
      break;
    case 2:
      r = p; g = v; b = t;
      break;
    case 3:
      r = p; g = q; b = v;
      break;
    case 4:
      r = t; g = p; b = v;
      break;
    default: // case 5
      r = v; g = p; b = q;
      break;
  }

  // Convert to 0-255 range and round
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Utility to check if an object is an RGB color
 */
export function isRgb(color: unknown): color is RgbColor {
  if (typeof color !== 'object' || color === null) return false;

  const rgb = color as Partial<RgbColor>;
  return (
    typeof rgb.r === 'number' &&
    typeof rgb.g === 'number' &&
    typeof rgb.b === 'number'
  );
}

/**
 * Utility to check if an object is an HSV color
 */
export function isHsv(color: unknown): color is HsvColor {
  if (typeof color !== 'object' || color === null) return false;

  const hsv = color as Partial<HsvColor>;
  return (
    typeof hsv.h === 'number' &&
    typeof hsv.s === 'number' &&
    typeof hsv.v === 'number'
  );
}

/**
 * RGB to Hex string conversion
 * @returns Hex color string in format #RRGGBB
 */
export function rgbToHex(rgb: RgbColor): string {
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(c => Math.round(c).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hex string to RGB conversion
 * @param hex Hex color string (format: #RGB or #RRGGBB)
 */
export function hexToRgb(hex: string): RgbColor | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  let r, g, b;
  if (hex.length === 3) {
    // Short format #RGB
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    // Standard format #RRGGBB
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return null; // Invalid hex color
  }

  return { r, g, b };
}
