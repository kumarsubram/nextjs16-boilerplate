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
  getMyPlan,
  hasRole,
  isAdmin,
  hasPaidAccess,
  isDonor,
  updateUserRole,
  upgradePlan,
  downgradePlan,
  recordDonation,
  ensureUserProfile,
} from "./roles";

// Stripe Actions (optional - check isStripeAvailable first)
export {
  isStripeAvailable,
  createSubscriptionCheckout,
  createDonationCheckout,
  openCustomerPortal,
  getMySubscription,
  getMyDonations,
  getMyTotalDonations,
  cancelMySubscription,
  resumeMySubscription,
  hasActiveSubscription,
} from "./stripe";
