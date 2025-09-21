import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.upsert({
          where: { stripeId: subscription.id },
          update: {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            plan:
              subscription.items.data[0]?.price?.nickname === "pro"
                ? "PRO"
                : subscription.items.data[0]?.price?.nickname === "enterprise"
                ? "ENTERPRISE"
                : "BASIC",
          },
          create: {
            stripeId: subscription.id,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            plan:
              subscription.items.data[0]?.price?.nickname === "pro"
                ? "PRO"
                : subscription.items.data[0]?.price?.nickname === "enterprise"
                ? "ENTERPRISE"
                : "BASIC",
            credits:
              subscription.items.data[0]?.price?.nickname === "pro"
                ? 1000
                : subscription.items.data[0]?.price?.nickname === "enterprise"
                ? 5000
                : 100,
            orgId: subscription.metadata.orgId,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: { stripeId: subscription.id },
          data: {
            status: "cancelled",
            credits: 0,
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          // Reset credits for new billing period
          const subscription = await prisma.subscription.findUnique({
            where: { stripeId: invoice.subscription as string },
          });

          if (subscription) {
            const newCredits =
              subscription.plan === "PRO"
                ? 1000
                : subscription.plan === "ENTERPRISE"
                ? 5000
                : 100;

            await prisma.subscription.update({
              where: { id: subscription.id },
              data: { credits: newCredits },
            });

            // Log audit
            await prisma.auditLog.create({
              data: {
                action: "CREDITS_RESET",
                resource: `subscription:${subscription.id}`,
                orgId: subscription.orgId,
                metadata: JSON.stringify({ newCredits, plan: subscription.plan }),
              },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          await prisma.subscription.update({
            where: { stripeId: invoice.subscription as string },
            data: { status: "past_due" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
