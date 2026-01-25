// routes/payment.ts
import express, { Request, Response } from "express";
import Stripe from "stripe";

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key not configured");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia", // Latest version
});

// Create a payment intent
router.post("/create-payment-intent", async (req: Request, res: Response) => {
  try {
    const { amount, currency = "ZAR" } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure integer
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true, // ✅ Modern approach
      },
      // Optional: Add metadata
      metadata: {
        integration_check: "accept_a_payment",
      },
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (err: any) {
    console.error("Stripe Error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to create payment intent" 
    });
  }
});

// Optional: Webhook endpoint for handling payment confirmation
router.post("/webhook", express.raw({ type: "application/json" }), 
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          // Update your database here
          console.log("Payment succeeded:", paymentIntent.id);
          break;
        case "payment_intent.payment_failed":
          console.log("Payment failed");
          break;
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("Webhook Error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

export default router;