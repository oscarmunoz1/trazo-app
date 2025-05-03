/**
 * Stripe Checkout Storage Manager
 * Centralizes all localStorage operations for the Stripe checkout flow
 */

// Key constants to prevent typos and improve maintainability
export const STORAGE_KEYS = {
  // Checkout state flags
  CHECKOUT_IN_PROGRESS: 'stripe_checkout_in_progress',
  CHECKOUT_COMPLETED: 'stripe_checkout_completed',
  REDIRECT_FROM_STRIPE: 'redirect_from_stripe',
  ERROR_RECOVERY: 'stripe_checkout_error_recovery',

  // Subscription bypass flags
  SUBSCRIPTION_BYPASS_TEMP: 'subscription_bypass_temp',
  SUBSCRIPTION_BYPASS_UNTIL: 'subscription_bypass_until',
  SUBSCRIPTION_LAST_CHECK: 'subscription_last_check',

  // Navigation flags
  DIRECT_NAVIGATION: 'direct_navigation',
  NAVIGATION_TO_PRICING: 'navigation_to_pricing',
  SKIP_PRICING_RENDER: 'skip_pricing_render',
  STRIPE_SUCCESS_REDIRECT: 'stripe_success_redirect',
  PREVENT_PRICING_PAGE: 'prevent_pricing_page',

  // Timing and coordination
  SUBSCRIPTION_LOADING: 'subscription_loading',
  SUBSCRIPTION_REDIRECT_TIME: 'subscription_redirect_time',

  // Session data
  PROCESSED_SESSIONS: 'processed_sessions',
  LAST_FORM_PATH: 'last_form_path'
};

/**
 * Start a Stripe checkout flow
 * Sets all necessary flags to prevent redirects during checkout
 */
export function startCheckoutFlow(): void {
  localStorage.setItem(STORAGE_KEYS.CHECKOUT_IN_PROGRESS, 'true');
  localStorage.setItem(STORAGE_KEYS.REDIRECT_FROM_STRIPE, 'true');
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_REDIRECT_TIME, Date.now().toString());
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP, 'true');
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK, Date.now().toString());
}

/**
 * Complete a Stripe checkout
 * Sets the completion flag and schedules its cleanup
 */
export function completeCheckout(): void {
  localStorage.setItem(STORAGE_KEYS.CHECKOUT_COMPLETED, 'true');

  // Schedule cleanup to avoid keeping flags indefinitely
  setTimeout(() => {
    localStorage.removeItem(STORAGE_KEYS.CHECKOUT_COMPLETED);
  }, 5000);
}

/**
 * Clean up all checkout related flags
 * @param {number} delay - Delay in ms before cleanup
 */
export function cleanupCheckoutFlow(delay = 3000): void {
  setTimeout(() => {
    localStorage.removeItem(STORAGE_KEYS.CHECKOUT_IN_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.REDIRECT_FROM_STRIPE);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION_REDIRECT_TIME);
  }, delay);
}

/**
 * Mark a session as processed to prevent duplicate processing
 * @param {string} sessionId - The Stripe session ID
 */
export function markSessionProcessed(sessionId: string | null): void {
  if (!sessionId) return;

  const processedSessions = getProcessedSessions();
  if (!processedSessions.includes(sessionId)) {
    processedSessions.push(sessionId);
    localStorage.setItem(STORAGE_KEYS.PROCESSED_SESSIONS, JSON.stringify(processedSessions));
  }

  // Set flag to prevent subscription redirects
  completeCheckout();
}

/**
 * Get processed session IDs from localStorage
 */
export function getProcessedSessions(): string[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROCESSED_SESSIONS) || '[]');
}

/**
 * Check if a session has already been processed
 * @param {string} sessionId - The Stripe session ID
 */
export function isSessionProcessed(sessionId: string | null): boolean {
  if (!sessionId) return false;
  return getProcessedSessions().includes(sessionId);
}

/**
 * Set up extended bypass for subscription checks
 * Useful during error recovery when we're confident the subscription succeeded
 * @param {number} durationMs - Duration in milliseconds
 */
export function setExtendedBypass(durationMs = 10 * 60 * 1000): void {
  localStorage.setItem(STORAGE_KEYS.ERROR_RECOVERY, 'true');
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP, 'true');
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_BYPASS_UNTIL, String(Date.now() + durationMs));
  completeCheckout();
}

/**
 * Set a flag to indicate Stripe success redirect in progress
 * This will prevent the pricing page from being rendered during redirects
 */
export function setStripeSuccessRedirect(duration = 30000): void {
  localStorage.setItem(STORAGE_KEYS.STRIPE_SUCCESS_REDIRECT, 'true');
  localStorage.setItem(STORAGE_KEYS.PREVENT_PRICING_PAGE, 'true');
  localStorage.setItem(STORAGE_KEYS.SKIP_PRICING_RENDER, 'true');

  // Cleanup after the specified duration
  setTimeout(() => {
    localStorage.removeItem(STORAGE_KEYS.STRIPE_SUCCESS_REDIRECT);
    localStorage.removeItem(STORAGE_KEYS.PREVENT_PRICING_PAGE);
    localStorage.removeItem(STORAGE_KEYS.SKIP_PRICING_RENDER);
  }, duration);
}

/**
 * Check if the system is currently handling a Stripe success redirect
 */
export function isStripeSuccessRedirect(): boolean {
  return localStorage.getItem(STORAGE_KEYS.STRIPE_SUCCESS_REDIRECT) === 'true';
}

/**
 * Check if the pricing page rendering should be prevented
 */
export function shouldPreventPricingPage(): boolean {
  return localStorage.getItem(STORAGE_KEYS.PREVENT_PRICING_PAGE) === 'true';
}

/**
 * Prepare for redirect after checkout
 * Sets necessary flags to ensure smooth navigation
 */
export function prepareForRedirect(): void {
  // Clear stored path
  localStorage.removeItem(STORAGE_KEYS.LAST_FORM_PATH);

  // Set navigation flags
  localStorage.setItem(STORAGE_KEYS.DIRECT_NAVIGATION, 'true');
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_LOADING, 'true');
  localStorage.setItem(STORAGE_KEYS.REDIRECT_FROM_STRIPE, 'true');
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_REDIRECT_TIME, Date.now().toString());

  // Ensure subscription bypass
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP, 'true');
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK, Date.now().toString());

  // Prevent page flicker
  localStorage.setItem(STORAGE_KEYS.SKIP_PRICING_RENDER, 'true');
  localStorage.setItem(STORAGE_KEYS.PREVENT_PRICING_PAGE, 'true');

  setTimeout(() => {
    localStorage.removeItem(STORAGE_KEYS.SKIP_PRICING_RENDER);
    localStorage.removeItem(STORAGE_KEYS.PREVENT_PRICING_PAGE);
  }, 10000);
}

/**
 * Clean up error recovery flags
 */
export function cleanupErrorRecovery(): void {
  localStorage.removeItem(STORAGE_KEYS.ERROR_RECOVERY);
}

/**
 * Check if we're in a checkout flow
 * Consolidated logic from multiple components
 */
export function inCheckoutFlow(): boolean {
  const params = new URLSearchParams(window.location.search);

  // Check URL parameters
  const isStripeSuccess = params.get('success') === 'true' && params.get('session_id') !== null;
  const comingFromStripe = params.get('from_stripe') === 'true';

  // Check localStorage flags
  const isCheckoutCompleted = localStorage.getItem(STORAGE_KEYS.CHECKOUT_COMPLETED) === 'true';
  const isCheckoutInProgress = localStorage.getItem(STORAGE_KEYS.CHECKOUT_IN_PROGRESS) === 'true';
  const redirectFromStripe = localStorage.getItem(STORAGE_KEYS.REDIRECT_FROM_STRIPE) === 'true';
  const skipPricingRender = localStorage.getItem(STORAGE_KEYS.SKIP_PRICING_RENDER) === 'true';
  const directNavigation = localStorage.getItem(STORAGE_KEYS.DIRECT_NAVIGATION) === 'true';
  const subscriptionBypassTemp =
    localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP) === 'true';
  const stripeSuccessRedirect =
    localStorage.getItem(STORAGE_KEYS.STRIPE_SUCCESS_REDIRECT) === 'true';

  // Check for timed bypass
  const bypassUntil = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_BYPASS_UNTIL);
  const bypassTimeValid = bypassUntil && parseInt(bypassUntil) > Date.now();

  // Check if the current path is the Stripe success page
  const isStripeSuccessPage = window.location.pathname.includes('/stripe-success');

  return !!(
    isCheckoutCompleted ||
    isCheckoutInProgress ||
    redirectFromStripe ||
    comingFromStripe ||
    isStripeSuccess ||
    skipPricingRender ||
    directNavigation ||
    subscriptionBypassTemp ||
    bypassTimeValid ||
    isStripeSuccessPage ||
    stripeSuccessRedirect
  );
}

/**
 * Save last form path for returning after subscription upgrade
 * @param {string} path - Path to save
 */
export function saveLastFormPath(path: string): void {
  localStorage.setItem(STORAGE_KEYS.LAST_FORM_PATH, path);
}

/**
 * Get the last form path
 */
export function getLastFormPath(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_FORM_PATH);
}

export default {
  startCheckoutFlow,
  completeCheckout,
  cleanupCheckoutFlow,
  markSessionProcessed,
  isSessionProcessed,
  setExtendedBypass,
  setStripeSuccessRedirect,
  isStripeSuccessRedirect,
  shouldPreventPricingPage,
  prepareForRedirect,
  cleanupErrorRecovery,
  inCheckoutFlow,
  saveLastFormPath,
  getLastFormPath,
  STORAGE_KEYS
};
