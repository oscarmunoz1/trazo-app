import { createAsyncThunk } from '@reduxjs/toolkit';
import { toastManager } from '../utils/toast/ToastManager';
import stripeCheckoutStorage from '../utils/storage/StripeCheckoutStorage';
import { subscriptionApi } from '../store/api/subscriptionApi';
import { setCompany } from '../store/features/companySlice';
import { store } from '../store';

/**
 * Types for checkout service
 */
export interface CheckoutCompletionParams {
  sessionId: string;
  companyId: string;
  isAddon?: boolean;
}

export interface CheckoutSessionParams {
  plan_id: string;
  company_id: string;
  interval?: string;
  new_company?: boolean;
  trial_days?: number;
}

/**
 * Service for handling Stripe checkout flow
 */
class StripeCheckoutService {
  private static instance: StripeCheckoutService;
  private maxRetries = 3;

  // Make constructor private for singleton
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): StripeCheckoutService {
    if (!StripeCheckoutService.instance) {
      StripeCheckoutService.instance = new StripeCheckoutService();
    }
    return StripeCheckoutService.instance;
  }

  /**
   * Initialize the service with callbacks and i18n
   * @param intl - react-intl methods for localization
   */
  public init(intl: any): void {
    this.intl = intl;
  }

  /**
   * Complete a checkout session
   * Handles API call, error handling, and recovery mechanisms
   */
  public async completeCheckoutSession({
    sessionId,
    companyId,
    isAddon = false
  }: CheckoutCompletionParams): Promise<boolean> {
    if (!sessionId || !companyId) {
      console.error('Missing required parameters for checkout completion');
      return false;
    }

    // Check if session already processed
    if (stripeCheckoutStorage.isSessionProcessed(sessionId)) {
      console.log('Session already processed:', sessionId);
      this.showAlreadyProcessedToast();

      // Still refresh company data
      await this.refreshCompanyData(companyId);
      return true;
    }

    try {
      // For add-ons, just refresh company data
      if (isAddon) {
        console.log('Processing add-on purchase');
        await this.refreshCompanyData(companyId);

        this.showSuccessToast('app.addonPurchaseSuccessful', 'app.addonPurchaseSuccessDescription');
        stripeCheckoutStorage.markSessionProcessed(sessionId);
        return true;
      }

      // Check if company already has a subscription
      const state = store.getState();
      const currentCompany = state.company.currentCompany as any;

      if (currentCompany?.subscription?.status === 'active') {
        console.log('Company already has a subscription, session likely processed');
        this.showSuccessToast('app.subscriptionSuccess', 'app.subscriptionAlreadyActive');
        stripeCheckoutStorage.markSessionProcessed(sessionId);
        return true;
      }

      // Make API call to complete checkout
      console.log('Completing checkout:', { session_id: sessionId, company_id: companyId });

      // Use the API to complete checkout
      const completeCheckout = subscriptionApi.endpoints.completeCheckout.initiate;
      const result = await store
        .dispatch(
          completeCheckout({
            session_id: sessionId,
            company_id: companyId
          })
        )
        .unwrap();

      console.log('Checkout completion result:', result);

      // Handle successful result
      if (result.success) {
        // Update company data
        if (result.company) {
          store.dispatch(setCompany(result.company));
        } else {
          await this.refreshCompanyData(companyId);
        }

        // Mark session as processed and show success
        stripeCheckoutStorage.markSessionProcessed(sessionId);
        this.showSuccessToast('app.subscriptionSuccess', 'app.subscriptionSuccessDescription');
        return true;
      }

      // Handle API error with result
      this.showErrorToast(
        'app.subscriptionError',
        result.error || 'app.subscriptionErrorDescription'
      );

      // Try refreshing as fallback
      const refreshSuccess = await this.refreshCompanyData(companyId);
      if (refreshSuccess) {
        stripeCheckoutStorage.markSessionProcessed(sessionId);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error in checkout completion:', error);

      // For duplicate session errors
      if (this.isDuplicateSessionError(error)) {
        // Mark as processed to avoid future attempts
        stripeCheckoutStorage.markSessionProcessed(sessionId);

        // Try refreshing company data
        const refreshSuccess = await this.refreshCompanyData(companyId);
        if (refreshSuccess) {
          this.showSuccessToast(
            'app.subscriptionSuccess',
            'app.subscriptionSuccessBackupDescription'
          );
          return true;
        }

        // Special handling for request error (likely serializer issue)
        if (this.isRequestError(error)) {
          // Set extended bypass and mark session processed
          stripeCheckoutStorage.setExtendedBypass();
          stripeCheckoutStorage.markSessionProcessed(sessionId);

          // Force update with multiple retries
          const updateSuccess = await this.forceUpdateCompanySubscription(companyId);

          if (updateSuccess) {
            this.showSuccessToast(
              'app.subscriptionSuccess',
              'app.subscriptionSuccessBackupDescription'
            );
            return true;
          }

          // Even if update failed, let user proceed with bypass
          this.showInfoToast(
            'app.subscriptionProcessing',
            'app.subscriptionProcessingDescription app.temporaryAccess'
          );
          return true;
        }
      }

      // Default error case
      let errorMessage = this.getErrorMessage(error);
      this.showErrorToast('app.subscriptionError', errorMessage);

      // Last-ditch check: does the company show active in Redux?
      const state = store.getState();
      const company = state.company.currentCompany as any;

      if (company?.subscription?.status === 'active') {
        console.log('Found existing subscription despite error, considering success');
        this.showSuccessToast('app.subscriptionSuccess', 'app.subscriptionAlreadyActive');
        return true;
      }

      return false;
    }
  }

  /**
   * Create checkout session with retry logic
   */
  public async createCheckoutSession(params: CheckoutSessionParams): Promise<string | null> {
    try {
      // Use API to create checkout session
      const createCheckoutSession = subscriptionApi.endpoints.createCheckoutSession.initiate;
      const response = await store.dispatch(createCheckoutSession(params)).unwrap();

      // Handle response formats (some return url, some sessionId)
      if (response && response.url) {
        return response.url;
      } else if (response && response.sessionId) {
        return 'https://checkout.stripe.com/pay/' + response.sessionId;
      } else {
        toastManager.error(
          this.translate('app.error'),
          this.translate('app.invalidCheckoutResponse')
        );
        return null;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toastManager.error(this.translate('app.error'), this.translate('app.checkoutError'));
      return null;
    }
  }

  /**
   * Retry checkout completion with increasing delays
   */
  public async retryCheckoutCompletion(
    params: CheckoutCompletionParams,
    attempt = 1
  ): Promise<boolean> {
    if (attempt > this.maxRetries) {
      return false;
    }

    try {
      // Add increasing delay between attempts
      if (attempt > 1) {
        const delay = Math.min(attempt * 1500, 7500);
        console.log(`Waiting ${delay}ms before retry attempt ${attempt}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      return await this.completeCheckoutSession(params);
    } catch (error) {
      console.error(`Retry attempt ${attempt} failed:`, error);
      return this.retryCheckoutCompletion(params, attempt + 1);
    }
  }

  /**
   * Refresh company data after checkout
   */
  private async refreshCompanyData(companyId: string): Promise<boolean> {
    try {
      // Use RTK Query refetch
      const getCompany = subscriptionApi.endpoints.getCompany.initiate;
      const response = await store.dispatch(getCompany(companyId)).unwrap();

      if (response) {
        store.dispatch(setCompany(response));

        // Check if subscription is active
        if (response.subscription?.status === 'active') {
          console.log('Subscription confirmed active in refreshed data');
          return true;
        }
      }
    } catch (error) {
      console.error('Error refreshing company data:', error);
    }
    return false;
  }

  /**
   * Force update company subscription with multiple retries
   */
  private async forceUpdateCompanySubscription(companyId: string): Promise<boolean> {
    for (let attempt = 1; attempt <= 5; attempt++) {
      console.log(`Attempt ${attempt}/5 to manually fetch updated company data`);

      // Add increasing delay between attempts
      if (attempt > 1) {
        const delay = Math.min(attempt * 1500, 7500);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      try {
        const getCompany = subscriptionApi.endpoints.getCompany.initiate;
        const response = await store.dispatch(getCompany(companyId)).unwrap();

        if (response) {
          // Update Redux store with fresh data
          store.dispatch(setCompany(response));

          // Check if subscription exists
          if (response.subscription || response.has_subscription === true) {
            return true;
          }
        }
      } catch (error) {
        console.error(`Refetch attempt ${attempt} failed:`, error);
      }
    }

    // Last resort: direct API call
    try {
      const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || '';
      const apiUrl = `${backendUrl}/api/companies/${companyId}/`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const companyData = await response.json();

        if (companyData) {
          store.dispatch(setCompany(companyData));

          if (companyData.subscription || companyData.has_subscription === true) {
            return true;
          }
        }
      }
    } catch (error) {
      console.error('Error in direct API call:', error);
    }

    return false;
  }

  // Helper methods for error handling

  private isDuplicateSessionError(error: any): boolean {
    return !!(
      error.data?.error &&
      (error.data.error.includes('already processed') ||
        error.data.error.includes('exists') ||
        error.data.error.includes('duplicate') ||
        error.data.error === 'request')
    );
  }

  private isRequestError(error: any): boolean {
    return (
      error.data?.error === 'request' ||
      (error.status === 400 && (error.data?.error === 'request' || error.error === 'request'))
    );
  }

  private getErrorMessage(error: any): string {
    if (error.data?.error) {
      return error.data.error;
    } else if (error.message) {
      return error.message;
    }
    return this.translate('app.subscriptionErrorDescription');
  }

  // Toast methods

  private showSuccessToast(titleKey: string, descriptionKey: string): void {
    toastManager.success(this.translate(titleKey), this.translate(descriptionKey));
  }

  private showErrorToast(titleKey: string, descriptionKey: string): void {
    toastManager.error(
      this.translate(titleKey),
      typeof descriptionKey === 'string' && descriptionKey.startsWith('app.')
        ? this.translate(descriptionKey)
        : descriptionKey
    );
  }

  private showInfoToast(titleKey: string, descriptionKey: string): void {
    toastManager.info(this.translate(titleKey), this.translate(descriptionKey));
  }

  private showAlreadyProcessedToast(): void {
    toastManager.warning(
      this.translate('app.subscriptionAlreadyProcessed'),
      this.translate('app.subscriptionAlreadyProcessedDescription')
    );
  }

  // Translation helper
  private intl: any;
  private translate(id: string): string {
    return this.intl ? this.intl.formatMessage({ id }) : id;
  }
}

// Export singleton instance
export const stripeCheckoutService = StripeCheckoutService.getInstance();
export default stripeCheckoutService;
