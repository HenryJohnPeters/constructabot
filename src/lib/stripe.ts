import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export { stripe };

export const STRIPE_PLANS = {
  BASIC: {
    name: "Basic",
    price: 2900, // $29.00
    credits: 100,
    features: ["100 AI credits/month", "Email support", "Basic agents"],
  },
  PRO: {
    name: "Pro",
    price: 9900, // $99.00
    credits: 1000,
    features: [
      "1,000 AI credits/month",
      "Priority support",
      "All agents",
      "Analytics",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 29900, // $299.00
    credits: 5000,
    features: [
      "5,000 AI credits/month",
      "24/7 support",
      "Custom agents",
      "Advanced analytics",
      "SSO",
    ],
  },
};
