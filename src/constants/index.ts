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

/**
 * Legal / Company information
 *
 * Used in Privacy Policy, Terms of Service, and Footer.
 * Update these values with your company information.
 */
export const COMPANY_NAME =
  process.env.NEXT_PUBLIC_COMPANY_NAME || "My Company Inc.";
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";
export const COMPANY_WEBSITE =
  process.env.NEXT_PUBLIC_COMPANY_WEBSITE || "https://example.com";

/**
 * Legal document dates
 *
 * Update these when you modify the legal documents.
 */
export const PRIVACY_POLICY_LAST_UPDATED = "January 2026";
export const TERMS_OF_SERVICE_LAST_UPDATED = "January 2026";
