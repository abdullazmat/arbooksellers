/**
 * Application Configuration
 */

export const APP_CONFIG = {
  shipping: {
    freeShippingThreshold: 3000,
    baseShippingCost: 200,
  },
  contact: {
    email: "contact@arbooksellers.com",
  },
  auth: {
    requireEmailVerification: true,
  },
  test: {
    skipConfirmationForDomains: ["example.com", "antigravity.com"],
  },
};
