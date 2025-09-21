import DashboardLayout from "@/components/dashboard/layout";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default async function DashboardPage() {
  // Simple demo dashboard without complex typing
  const mockUser = {
    id: "demo-user",
    name: "Demo User",
    email: "demo@cout.ai",
    emailVerified: new Date(),
    image: null,
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
        credits: 85,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      agents: [],
    },
  } as any;

  return (
    <DashboardLayout user={mockUser}>
      <div className="p-6 space-y-6">
        {/* Demo Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">🚀</span>
            <div>
              <h3 className="text-yellow-800 font-medium">Demo Dashboard</h3>
              <p className="text-yellow-700 text-sm">
                You're viewing the dashboard with mock data. Click the 🚀 Demo
                Dashboard button to access this anytime!
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards creditsRemaining={85} jobsThisMonth={12} activeAgents={3} />

        {/* Simple Demo Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">AI Agents</h3>
            <div className="space-y-3">
              {[
                {
                  name: "Research Assistant",
                  category: "Research",
                  status: "Active",
                },
                {
                  name: "Marketing Expert",
                  category: "Marketing",
                  status: "Active",
                },
                {
                  name: "Finance Analyst",
                  category: "Finance",
                  status: "Active",
                },
              ].map((agent, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{agent.name}</p>
                    <p className="text-xs text-slate-600">{agent.category}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                {
                  task: "Market analysis completed",
                  time: "2 hours ago",
                  credits: 3,
                },
                {
                  task: "Social media campaign created",
                  time: "4 hours ago",
                  credits: 2,
                },
                {
                  task: "Financial report generated",
                  time: "1 day ago",
                  credits: 1,
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{activity.task}</p>
                    <p className="text-xs text-slate-600">{activity.time}</p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {activity.credits} credits
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
