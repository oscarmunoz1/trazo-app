/**
 * SubscriptionToastHelper - Utilities for managing subscription-related toast messages
 * Prevents duplicate toasts from appearing when navigating between pages
 */

// Constants to avoid typos
const TOAST_KEYS = {
  SUCCESS_TOAST_SHOWN: 'subscription_success_toast_shown',
  ADDON_SUCCESS_TOAST_SHOWN: 'addon_success_toast_shown',
  ERROR_TOAST_SHOWN: 'subscription_error_toast_shown'
};

/**
 * Check if a subscription success toast has already been shown
 * @returns true if a success toast was already shown
 */
export function isSuccessToastShown(): boolean {
  return localStorage.getItem(TOAST_KEYS.SUCCESS_TOAST_SHOWN) === 'true';
}

/**
 * Mark a subscription success toast as shown
 */
export function markSuccessToastShown(): void {
  localStorage.setItem(TOAST_KEYS.SUCCESS_TOAST_SHOWN, 'true');

  // Auto-cleanup after a reasonable time
  setTimeout(() => {
    clearSuccessToastFlag();
  }, 10000); // 10 seconds
}

/**
 * Clear the success toast flag
 */
export function clearSuccessToastFlag(): void {
  localStorage.removeItem(TOAST_KEYS.SUCCESS_TOAST_SHOWN);
}

/**
 * Clear all subscription toast flags
 * Call this when redirecting to the establishment page or when
 * you want to ensure no subscription toast messages appear
 */
export function clearAllSubscriptionToastFlags(): void {
  localStorage.removeItem(TOAST_KEYS.SUCCESS_TOAST_SHOWN);
  localStorage.removeItem(TOAST_KEYS.ADDON_SUCCESS_TOAST_SHOWN);
  localStorage.removeItem(TOAST_KEYS.ERROR_TOAST_SHOWN);
}

export default {
  isSuccessToastShown,
  markSuccessToastShown,
  clearSuccessToastFlag,
  clearAllSubscriptionToastFlags
};
