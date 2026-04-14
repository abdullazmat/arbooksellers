/**
 * Application Configuration
 */

export const APP_CONFIG = {
  shipping: {
    freeShippingThreshold: 50,
    baseShippingCost: 5.99,
  },
  contact: {
    email: "contact@arbooksellers.com",
  },
  auth: {
    requireEmailVerification: true,
  },
  test: {
    skipConfirmationForDomains: ["example.com", "antigravity.com"],
  }
};
