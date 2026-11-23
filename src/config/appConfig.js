/**
 * CENTRAL APPLICATION CONFIGURATION
 * --------------------------------------------------------------------------
 * This file controls Demo Mode and planned feature flags for Rehoyah.
 *
 * IMPORTANT FOR PRODUCTION INTEGRATION:
 * 1. When connecting a real database and backend API, set DEMO_MODE to false
 *    only after all service modules in `src/services/` are updated.
 * 2. NEVER place secret keys, private database credentials, or Paystack
 *    secret keys in this file. Vite exposes client files to the browser.
 *    Keep all secrets in server-side environment variables on your backend.
 */

export const appConfig = {
  brandName: 'REHOYAH',
  tagline: 'Transforming Spaces, Creating Lasting Impressions.',

  // Master toggle for frontend demonstration mode.
  // When true, services read/write sample data and localStorage only.
  DEMO_MODE: true,

  // Safe browser-visible API base URL placeholder (no secrets).
  // Set VITE_API_BASE_URL in `.env` when your backend server is ready.
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',

  // Currency settings for Nigeria
  currency: {
    code: 'NGN',
    symbol: '₦',
    locale: 'en-NG',
  },

  // Feature flags for planned/future capabilities.
  // Keep disabled until real backend endpoints and providers are connected.
  features: {
    realAuthentication: false,
    realFileUploads: false,
    paystackPayments: false,
    liveNotifications: false,
    liveOrderTracking: false,
    liveProjectTracking: false,
    liveAppointmentAvailability: false,
    aiCustomerAssistant: false,
    paintColorVisualizer: false,
    onlineQuotationCalculator: false,
    arFurniturePlacement: false,
    partnerPrograms: false, // Franchise, Dealer, Contractor, Affiliate, Training Academy
  },
};

export default appConfig;
