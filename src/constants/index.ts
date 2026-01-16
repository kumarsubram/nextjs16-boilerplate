/**
 * Application constants
 *
 * Customize these values for your project.
 * You can also override via environment variables.
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "My App";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Logo configuration
 *
 * To use your own logo:
 * 1. Add your logo file to /public/images/ (supports .svg, .png, .jpg, .webp)
 * 2. Update APP_LOGO_PATH below to match your filename
 * 3. Adjust APP_LOGO_SIZE if needed
 *
 * For SVG logos, currentColor will inherit the text color.
 * For image logos, ensure good contrast in both light and dark modes.
 */
export const APP_LOGO_PATH = "/images/logo.svg";
export const APP_LOGO_SIZE = {
  width: 32,
  height: 32,
};
