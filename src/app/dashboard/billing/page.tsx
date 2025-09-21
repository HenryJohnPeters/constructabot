import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STRIPE_PLANS } from "@/lib/stripe";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Calendar, Users, Zap } from "lucide-react";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      org: {
        include: {
          subscription: true,
          _count: { select: { users: true } },
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const handleUpgrade = async (plan: string) => {
    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const result = await response.json();
    if (result.success) {
      window.location.href = result.url;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        {/* Current Plan */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">
                {user.org.subscription?.plan || "Free Trial"}
              </h3>
              <p className="text-slate-600">
                {user.org.subscription?.credits || 0} credits remaining
              </p>
              {user.org.subscription?.currentPeriodEnd && (
                <p className="text-sm text-slate-500">
                  Renews on{" "}
                  {new Date(
                    user.org.subscription.currentPeriodEnd
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="text-right">
              <div
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  user.org.subscription?.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {user.org.subscription?.status || "Trial"}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Team Size
                </h3>
                <p className="text-2xl font-bold">{user.org._count.users}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Credits Used
                </h3>
                <p className="text-2xl font-bold">
                  {(STRIPE_PLANS[
                    user.org.subscription?.plan as keyof typeof STRIPE_PLANS
                  ]?.credits || 100) - (user.org.subscription?.credits || 100)}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Next Billing
                </h3>
                <p className="text-sm font-bold">
                  {user.org.subscription?.currentPeriodEnd
                    ? new Date(
                        user.org.subscription.currentPeriodEnd
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-6">Upgrade Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(STRIPE_PLANS).map(([key, plan]) => (
              <div
                key={key}
                className={`border rounded-lg p-6 ${
                  user.org.subscription?.plan === key
                    ? "border-brand-500 bg-brand-50"
                    : "border-slate-200"
                }`}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ${plan.price / 100}
                    </span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <p className="text-slate-600 mb-6">
                    {plan.credits.toLocaleString()} credits per month
                  </p>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-600 mr-3" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {user.org.subscription?.plan === key ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade(key)}
                      className="w-full"
                      variant={key === "PRO" ? "default" : "outline"}
                    >
                      {user.org.subscription?.plan ? "Upgrade" : "Choose Plan"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Billing History</h2>
          <div className="text-center py-8 text-slate-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p>No billing history available</p>
            <p className="text-sm">
              Invoices will appear here after your first payment
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
