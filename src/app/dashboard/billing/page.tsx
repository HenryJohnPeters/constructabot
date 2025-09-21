import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Download,
  Calendar,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Plus,
  ExternalLink,
  RefreshCw,
  Shield,
  Gift,
  Users,
  Crown,
  Star,
  Banknote,
  Receipt,
  Settings
} from "lucide-react";

// Mock billing data for demo
const mockBillingData = {
  currentPlan: {
    name: "Pro",
    price: 99,
    billingCycle: "monthly",
    features: [
      "1,000 credits per month",
      "Unlimited agents",
      "Team collaboration", 
      "Priority support",
      "Advanced analytics",
      "API access"
    ]
  },
  usage: {
    creditsUsed: 215,
    creditsTotal: 1000,
    percentUsed: 21.5,
    resetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  },
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiry: "12/27"
  },
  invoices: [
    {
      id: "inv_001",
      date: new Date("2025-09-01"),
      amount: 99,
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "inv_002", 
      date: new Date("2025-08-01"),
      amount: 99,
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "inv_003",
      date: new Date("2025-07-01"),
      amount: 79,
      status: "paid",
      downloadUrl: "#"
    }
  ],
  usageHistory: [
    { month: "Sep", credits: 215, cost: 99 },
    { month: "Aug", credits: 890, cost: 99 },
    { month: "Jul", credits: 654, cost: 79 },
    { month: "Jun", credits: 432, cost: 79 }
  ]
};

const plans = [
  {
    name: "Starter",
    price: 29,
    credits: 250,
    features: [
      "250 credits per month",
      "5 AI agents",
      "Basic analytics",
      "Email support",
      "Standard processing"
    ],
    recommended: false
  },
  {
    name: "Pro", 
    price: 99,
    credits: 1000,
    features: [
      "1,000 credits per month",
      "Unlimited agents",
      "Team collaboration",
      "Priority support", 
      "Advanced analytics",
      "API access"
    ],
    recommended: true,
    current: true
  },
  {
    name: "Enterprise",
    price: 299,
    credits: 5000,
    features: [
      "5,000 credits per month",
      "Unlimited everything",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantees",
      "Custom deployment"
    ],
    recommended: false
  }
];

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  
  const mockUser = {
    id: session?.user?.id || "demo-user",
    name: session?.user?.name || "Demo User",
    email: session?.user?.email || "demo@cout.ai",
    emailVerified: new Date(),
    image: session?.user?.image,
    password: "",
    role: "ADMIN",
    orgId: "demo-org",
    createdAt: new Date(),
    updatedAt: new Date(),
    org: {
      id: "demo-org",
      name: "Demo Organization",
      slug: "demo-org",
      logo: null,
      primaryColor: "#0ea5e9",
      secondaryColor: "#f1f5f9",
      stripeCustomerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      subscription: {
        id: "demo-sub",
        stripeId: "demo-stripe-id",
        orgId: "demo-org",
        plan: "PRO",
        status: "active",
        credits: 785, // 1000 - 215 used
        currentPeriodEnd: mockBillingData.usage.resetDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  } as any;

  const { usage, currentPlan, paymentMethod, invoices } = mockBillingData;

  return (
    <DashboardLayout user={mockUser}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
            <p className="text-slate-600">
              Manage your subscription, usage, and payment methods
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
          </div>
        </div>

        {/* Current Plan & Usage */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Plan Overview */}
          <div className="lg:col-span-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">{currentPlan.name} Plan</h2>
                </div>
                <p className="text-brand-100">
                  ${currentPlan.price}/{currentPlan.billingCycle} • Next billing: {usage.resetDate.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{usage.creditsTotal - usage.creditsUsed}</div>
                <div className="text-brand-100">Credits Remaining</div>
              </div>
            </div>
            
            {/* Usage Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Credits Used: {usage.creditsUsed}</span>
                <span>{usage.percentUsed}% of {usage.creditsTotal}</span>
              </div>
              <div className="w-full bg-brand-400 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${usage.percentUsed}%` }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Plus className="w-4 h-4 mr-2" />
                Buy More Credits
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Gift className="w-4 h-4 mr-2" />
                View Offers
              </Button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <CreditCard className="w-8 h-8 text-slate-600" />
                <div className="flex-1">
                  <p className="font-medium">•••• •••• •••• {paymentMethod.last4}</p>
                  <p className="text-sm text-slate-600">{paymentMethod.brand} • Expires {paymentMethod.expiry}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <Button variant="outline" className="w-full">
                Update Payment Method
              </Button>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Credits Used</h3>
                <p className="text-2xl font-bold text-slate-900">{usage.creditsUsed}</p>
                <p className="text-xs text-slate-500 mt-1">This billing period</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Monthly Spend</h3>
                <p className="text-2xl font-bold text-slate-900">${currentPlan.price}</p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowDown className="w-3 h-3 mr-1" />
                  20% vs last month
                </div>
              </div>
              <Banknote className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Cost per Credit</h3>
                <p className="text-2xl font-bold text-slate-900">$0.10</p>
                <p className="text-xs text-slate-500 mt-1">Average rate</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Next Reset</h3>
                <p className="text-2xl font-bold text-slate-900">15</p>
                <p className="text-xs text-slate-500 mt-1">Days remaining</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Available Plans</h3>
              <p className="text-slate-600 text-sm">Choose the plan that fits your team's needs</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Monthly</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition ml-1" />
              </button>
              <span className="text-sm text-slate-600">Yearly (Save 20%)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-lg border-2 ${
                  plan.current
                    ? "border-brand-500 bg-brand-50"
                    : plan.recommended
                    ? "border-brand-300 bg-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Recommended
                    </span>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <p className="text-sm text-slate-600">{plan.credits.toLocaleString()} credits included</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.current
                      ? "bg-slate-100 text-slate-600 cursor-not-allowed"
                      : plan.recommended
                      ? "gradient-brand"
                      : "border border-slate-300"
                  }`}
                  variant={plan.current ? "ghost" : plan.recommended ? "default" : "outline"}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : plan.recommended ? "Upgrade to Pro" : "Select Plan"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Usage History & Invoices */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Usage History */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Usage History</h3>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="space-y-4">
              {mockBillingData.usageHistory.map((month, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">{month.month} 2025</p>
                      <p className="text-sm text-slate-600">{month.credits} credits used</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">${month.cost}</p>
                    <p className="text-xs text-slate-600">Billed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Invoices</h3>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Receipt className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Invoice #{invoice.id}
                      </p>
                      <p className="text-sm text-slate-600">
                        {invoice.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium text-slate-900">${invoice.amount}</p>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {invoice.status}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Billing Alerts */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Billing Alerts & Notifications</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Payment Successful</h4>
                  <p className="text-sm text-green-700">
                    Your last payment of $99 was processed successfully on September 1st.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Usage Update</h4>
                  <p className="text-sm text-blue-700">
                    You've used 21.5% of your monthly credits. Stay on track for great value!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Upcoming Renewal</h4>
                  <p className="text-sm text-yellow-700">
                    Your Pro plan will renew on {usage.resetDate.toLocaleDateString()} for $99.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <Gift className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">Special Offer</h4>
                  <p className="text-sm text-purple-700">
                    Upgrade to Enterprise and get 20% off your first 3 months!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
