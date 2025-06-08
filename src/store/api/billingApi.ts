import baseApi from './baseApi';
import {
  SUBSCRIPTIONS_URL,
  PAYMENT_METHODS_URL,
  INVOICES_URL,
  ADDONS_URL,
  SUBSCRIPTION_DASHBOARD_URL
} from '../../config/backend';

// Interface definitions
export interface Subscription {
  id: number;
  company: any;
  plan: any;
  status: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  used_productions: number;
  used_storage_gb: number;
  scan_count: number;
  trial_end: string | null;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  interval: string;
  features: any;
  is_active: boolean;
}

export interface AddOn {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  is_active: boolean;
}

export interface PaymentMethod {
  id: number;
  card_brand: string;
  last_4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export interface Invoice {
  id: number;
  amount: number;
  status: string;
  invoice_date: string;
  due_date: string | null;
  invoice_pdf: string | null;
}

// Define the API slice
export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBillingDashboard: builder.query<
      {
        subscription: Subscription[];
        addons: AddOn[];
        paymentMethods: PaymentMethod[];
        invoices: Invoice[];
      },
      void
    >({
      query: () => ({
        url: SUBSCRIPTION_DASHBOARD_URL,
        credentials: 'include'
      }),
      transformResponse: (response: any) => {
        console.log('Raw billing dashboard response:', response);
        return {
          subscription: Array.isArray(response.subscription)
            ? response.subscription
            : response.subscription
            ? [response.subscription]
            : [],
          addons: response.addons || [],
          paymentMethods: response.paymentMethods || [],
          invoices: response.invoices || []
        };
      },
      keepUnusedDataFor: 60,
      providesTags: (result) => {
        if (!result)
          return [
            { type: 'Subscription' as const, id: 'LIST' },
            { type: 'Addon' as const, id: 'LIST' },
            { type: 'PaymentMethod' as const, id: 'LIST' },
            { type: 'Invoice' as const, id: 'LIST' }
          ];

        return [
          ...result.subscription.map((sub) => ({ type: 'Subscription' as const, id: sub.id })),
          ...result.addons.map((addon) => ({ type: 'Addon' as const, id: addon.id })),
          ...result.paymentMethods.map((pm) => ({ type: 'PaymentMethod' as const, id: pm.id })),
          ...result.invoices.map((invoice) => ({ type: 'Invoice' as const, id: invoice.id }))
        ];
      }
    }),
    getSubscription: builder.query<Subscription[], void>({
      query: () => ({
        url: SUBSCRIPTIONS_URL(),
        credentials: 'include'
      }),
      transformResponse: (response: any) => {
        console.log('Raw subscription response:', response);
        if (Array.isArray(response)) {
          return response;
        } else if (response && typeof response === 'object') {
          return [response];
        }
        return [];
      },
      keepUnusedDataFor: 60,
      providesTags: (result) =>
        result
          ? result?.map((sub) => ({ type: 'Subscription' as const, id: sub.id }))
          : [{ type: 'Subscription' as const, id: 'LIST' }]
    }),
    getAddons: builder.query<AddOn[], void>({
      query: () => ({
        url: ADDONS_URL,
        credentials: 'include'
      }),
      keepUnusedDataFor: 60, // Keep data in cache for 60 seconds
      providesTags: (result) =>
        result
          ? result.map((addon) => ({ type: 'Addon' as const, id: addon.id }))
          : [{ type: 'Addon' as const, id: 'LIST' }]
    }),
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => ({
        url: PAYMENT_METHODS_URL,
        credentials: 'include'
      }),
      keepUnusedDataFor: 60, // Keep data in cache for 60 seconds
      providesTags: (result) =>
        result
          ? result.map((pm) => ({ type: 'PaymentMethod' as const, id: pm.id }))
          : [{ type: 'PaymentMethod' as const, id: 'LIST' }]
    }),
    getInvoices: builder.query<Invoice[], void>({
      query: () => ({
        url: INVOICES_URL,
        credentials: 'include'
      }),
      keepUnusedDataFor: 60, // Keep data in cache for 60 seconds
      providesTags: (result) =>
        result
          ? result.map((invoice) => ({ type: 'Invoice' as const, id: invoice.id }))
          : [{ type: 'Invoice' as const, id: 'LIST' }]
    }),
    cancelSubscription: builder.mutation<any, number>({
      query: (subscriptionId) => {
        const cleanId = String(subscriptionId).replace(/\//g, '');
        return {
          url: `${SUBSCRIPTIONS_URL(cleanId)}cancel/`,
          method: 'POST',
          credentials: 'include'
        };
      },
      invalidatesTags: (result, error, subscriptionId) => [
        { type: 'Subscription' as const, id: subscriptionId },
        { type: 'Company' as const, id: 'LIST' }
      ]
    }),
    reactivateSubscription: builder.mutation<any, number>({
      query: (subscriptionId) => {
        const cleanId = String(subscriptionId).replace(/\//g, '');
        return {
          url: `${SUBSCRIPTIONS_URL(cleanId)}reactivate/`,
          method: 'POST',
          credentials: 'include'
        };
      },
      invalidatesTags: (result, error, subscriptionId) => [
        { type: 'Subscription' as const, id: subscriptionId },
        { type: 'Company' as const, id: 'LIST' }
      ]
    }),
    changePlan: builder.mutation<any, { companyId: number; planId: number }>({
      query: ({ companyId, planId }) => {
        // Ensure we have clean ID strings without any slashes
        const cleanId = String(companyId).replace(/\//g, '');
        return {
          url: `${SUBSCRIPTIONS_URL(cleanId)}change_plan/`,
          method: 'POST',
          body: { plan_id: planId },
          credentials: 'include'
        };
      },
      invalidatesTags: (result, error, { companyId }) => [
        { type: 'Subscription' as const, id: companyId },
        { type: 'Company' as const, id: 'LIST' }
      ]
    }),
    addAddon: builder.mutation<any, { subscriptionId: number; addonId: number; quantity: number }>({
      query: ({ subscriptionId, addonId, quantity }) => {
        const cleanId = String(subscriptionId).replace(/\//g, '');
        return {
          url: `${SUBSCRIPTIONS_URL(cleanId)}add_addon/`,
          method: 'POST',
          body: { addon_id: addonId, quantity },
          credentials: 'include'
        };
      },
      transformResponse: (response: any) => {
        // Handle both direct application and checkout URL responses
        if (response && response.url) {
          return { url: response.url, immediate: false };
        }
        return { success: true, immediate: true, ...response };
      },
      invalidatesTags: (result, error, { subscriptionId, addonId }) => [
        { type: 'Subscription' as const, id: subscriptionId },
        { type: 'Addon' as const, id: addonId },
        { type: 'Company' as const, id: 'LIST' }
      ]
    }),
    setDefaultPaymentMethod: builder.mutation({
      query: (id) => ({
        url: `${PAYMENT_METHODS_URL}${id}/set_default/`,
        method: 'POST'
      }),
      invalidatesTags: [
        { type: 'PaymentMethod', id: 'LIST' },
        { type: 'Subscription', id: 'LIST' }
      ]
    }),
    removePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `${PAYMENT_METHODS_URL}${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: [
        { type: 'PaymentMethod', id: 'LIST' },
        { type: 'Subscription', id: 'LIST' }
      ]
    }),
    createCheckoutSession: builder.mutation<
      { url: string },
      {
        planId?: number;
        companyId?: number;
        successUrl?: string;
        cancelUrl?: string;
        interval?: string;
        newCompany?: boolean;
        trialDays?: number;
        addonType?: string;
        quantity?: number;
        mode?: 'subscription' | 'payment' | 'setup';
        // Also accept snake_case versions directly
        company_id?: number;
        plan_id?: number;
        success_url?: string;
        cancel_url?: string;
        new_company?: boolean;
        trial_days?: number;
        addon_type?: string;
      }
    >({
      query: (data) => ({
        url: `checkout/create_session/`,
        method: 'POST',
        // Use snake_case if provided directly, otherwise convert from camelCase
        body: {
          company_id: data.company_id || data.companyId,
          plan_id: data.plan_id || data.planId,
          success_url: data.success_url || data.successUrl,
          cancel_url: data.cancel_url || data.cancelUrl,
          interval: data.interval,
          new_company: data.new_company !== undefined ? data.new_company : data.newCompany,
          trial_days: data.trial_days !== undefined ? data.trial_days : data.trialDays,
          addon_type: data.addon_type || data.addonType,
          quantity: data.quantity,
          mode: data.mode
        },
        credentials: 'include'
      })
    }),
    createCustomerPortalSession: builder.mutation({
      query: (data) => ({
        url: `checkout/create_customer_portal_session/`,
        method: 'POST',
        body: {
          company_id: data.companyId,
          return_url: data.returnUrl
        },
        credentials: 'include'
      })
    }),

    // Blockchain subscription endpoints
    subscribeBlockchain: builder.mutation<{ checkout_url: string; session_id: string }, void>({
      query: () => ({
        url: 'billing/subscribe-blockchain/',
        method: 'POST',
        credentials: 'include'
      }),
      invalidatesTags: [
        { type: 'Company', id: 'LIST' },
        { type: 'Subscription', id: 'LIST' }
      ]
    }),

    getBlockchainSubscriptionStatus: builder.query<
      {
        blockchainSubscribed: boolean;
        company: { id: number; name: string };
        mainSubscription: any;
      },
      void
    >({
      query: () => ({
        url: 'billing/subscription-status/',
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: [{ type: 'Company', id: 'LIST' }]
    })
  })
});

// Export the hooks
export const {
  useGetBillingDashboardQuery,
  useGetSubscriptionQuery,
  useGetAddonsQuery,
  useGetPaymentMethodsQuery,
  useGetInvoicesQuery,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useChangePlanMutation,
  useAddAddonMutation,
  useSetDefaultPaymentMethodMutation,
  useRemovePaymentMethodMutation,
  useCreateCheckoutSessionMutation,
  useCreateCustomerPortalSessionMutation,
  useSubscribeBlockchainMutation,
  useGetBlockchainSubscriptionStatusQuery
} = billingApi;
