import baseApi from './baseApi';
import { RootState } from '../index';
import {
  PLANS_URL,
  CREATE_CHECKOUT_SESSION_URL,
  COMPLETE_CHECKOUT_URL
} from '../../config/backend';
// Define types for plan data
export interface PlanFeatures {
  max_establishments: number;
  max_parcels: number;
  max_productions_per_year: number;
  establishment_full_description: boolean;
  monthly_scan_limit: number;
  storage_limit_gb: number;
  support_response_time: number;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: PlanFeatures;
  is_active: boolean;
  stripe_price_id: string;
  created_at: string;
  updated_at: string;
}

export interface CheckoutSessionRequest {
  plan_id: string;
  company_id: string;
  interval: string;
  new_company?: boolean;
  trial_days?: number;
}

export interface CheckoutSessionResponse {
  sessionId: string;
}

// Add new interface for the complete checkout request
export interface CompleteCheckoutRequest {
  session_id: string;
  company_id: string;
}

export interface CompleteCheckoutResponse {
  success: boolean;
  subscription_id?: string;
  error?: string;
  company?: any; // Company data returned from backend
}

// Instead of creating a new API, inject endpoints into your base API
export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], string>({
      query: (interval) => ({
        url: PLANS_URL,
        params: { interval },
        credentials: 'include' // Consistent with your other APIs
      })
    }),
    createCheckoutSession: builder.mutation<CheckoutSessionResponse, CheckoutSessionRequest>({
      query: (body) => ({
        url: CREATE_CHECKOUT_SESSION_URL,
        method: 'POST',
        body,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }),
    completeCheckout: builder.mutation<CompleteCheckoutResponse, CompleteCheckoutRequest>({
      query: (body) => ({
        url: COMPLETE_CHECKOUT_URL,
        method: 'POST',
        body,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      // Invalidate the company data to force a refresh
      invalidatesTags: ['Company']
    })
  })
});

// Export hooks for usage in components
export const { useGetPlansQuery, useCreateCheckoutSessionMutation, useCompleteCheckoutMutation } =
  subscriptionApi;
