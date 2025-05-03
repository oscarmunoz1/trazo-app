const STORAGE_KEYS = {
  LAST_FORM_PATH: 'last_form_path',
  SUBSCRIPTION_LOADING: 'subscription_loading',
  REDIRECT_FROM_STRIPE: 'redirect_from_stripe',
  SUBSCRIPTION_REDIRECT_TIME: 'subscription_redirect_time',
  SUBSCRIPTION_BYPASS_TEMP: 'subscription_bypass_temp',
  SUBSCRIPTION_LAST_CHECK: 'subscription_last_check',
  PROCESSED_SESSIONS: 'processed_sessions',
  STRIPE_CHECKOUT_COMPLETED: 'stripe_checkout_completed',
  STRIPE_CHECKOUT_ERROR_RECOVERY: 'stripe_checkout_error_recovery'
} as const;

class SubscriptionStorage {
  private static instance: SubscriptionStorage;

  private constructor() {}

  static getInstance(): SubscriptionStorage {
    if (!SubscriptionStorage.instance) {
      SubscriptionStorage.instance = new SubscriptionStorage();
    }
    return SubscriptionStorage.instance;
  }

  // Session Management
  isSessionProcessed(sessionId: string): boolean {
    const processedSessions = this.getProcessedSessions();
    return processedSessions.includes(sessionId);
  }

  markSessionProcessed(sessionId: string): void {
    const processedSessions = this.getProcessedSessions();
    if (!processedSessions.includes(sessionId)) {
      processedSessions.push(sessionId);
      localStorage.setItem(STORAGE_KEYS.PROCESSED_SESSIONS, JSON.stringify(processedSessions));
    }
  }

  private getProcessedSessions(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROCESSED_SESSIONS) || '[]');
    } catch {
      return [];
    }
  }

  // Checkout Flow Management
  startCheckoutFlow(): void {
    localStorage.setItem(STORAGE_KEYS.STRIPE_CHECKOUT_COMPLETED, 'true');
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP, 'true');
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK, Date.now().toString());
  }

  endCheckoutFlow(): void {
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEYS.STRIPE_CHECKOUT_COMPLETED);
    }, 5000);
  }

  // Redirect Management
  prepareForRedirect(): void {
    localStorage.removeItem(STORAGE_KEYS.LAST_FORM_PATH);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_LOADING, 'true');
    localStorage.setItem(STORAGE_KEYS.REDIRECT_FROM_STRIPE, 'true');
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_REDIRECT_TIME, Date.now().toString());
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP, 'true');
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK, Date.now().toString());
  }

  cleanupRedirect(): void {
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION_LOADING);
    localStorage.removeItem(STORAGE_KEYS.REDIRECT_FROM_STRIPE);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION_REDIRECT_TIME);
    localStorage.removeItem(STORAGE_KEYS.STRIPE_CHECKOUT_ERROR_RECOVERY);
  }

  // Error Recovery
  setErrorRecovery(): void {
    localStorage.setItem(STORAGE_KEYS.STRIPE_CHECKOUT_ERROR_RECOVERY, 'true');
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP, 'true');
    localStorage.setItem(
      STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK,
      String(Date.now() + 10 * 60 * 1000) // 10 minutes
    );
  }

  clearErrorRecovery(): void {
    localStorage.removeItem(STORAGE_KEYS.STRIPE_CHECKOUT_ERROR_RECOVERY);
  }

  // Form Path Management
  setLastFormPath(path: string): void {
    localStorage.setItem(STORAGE_KEYS.LAST_FORM_PATH, path);
  }

  getLastFormPath(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_FORM_PATH);
  }

  clearLastFormPath(): void {
    localStorage.removeItem(STORAGE_KEYS.LAST_FORM_PATH);
  }
}

export const subscriptionStorage = SubscriptionStorage.getInstance();
