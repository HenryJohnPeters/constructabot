import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { org: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create Stripe customer if not exists
    let customerId = user.org.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.org.name,
        metadata: {
          orgId: user.orgId,
        },
      });
      customerId = customer.id;

      await prisma.org.update({
        where: { id: user.orgId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const session_stripe = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `cout.ai ${
                STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].name
              } Plan`,
            },
            unit_amount: STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS].price,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
      metadata: {
        orgId: user.orgId,
        plan: plan,
      },
    });

    return NextResponse.json({ success: true, url: session_stripe.url });
  } catch (error) {
    console.error("Billing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
