/**
 * Server Actions
 *
 * Export all server actions from here.
 * Import in components: import { updateMyProfile } from "@/actions";
 */

// User Profile Actions
export { getMyProfile, updateMyProfile, deleteMyProfile } from "./user-profile";

// Role Actions
export {
  getMyRole,
  hasRole,
  isAdmin,
  hasPaidAccess,
  isDonor,
  updateUserRole,
  ensureUserProfile,
} from "./roles";

// Stripe Actions (optional - check isStripeAvailable first)
export {
  isStripeAvailable,
  createSubscriptionCheckout,
  createDonationCheckout,
  createCheckout, // deprecated alias
  openCustomerPortal,
  getMySubscription,
  getMyDonations,
  getMyTotalDonations,
  cancelMySubscription,
  resumeMySubscription,
  hasActiveSubscription,
} from "./stripe";
