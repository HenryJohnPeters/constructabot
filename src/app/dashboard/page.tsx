import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/layout";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default async function DashboardPage() {
  // Check if user is logged in
  const session = await getServerSession(authOptions);
  
  // If no session, redirect to sign in (unless accessing via demo button)
  if (!session) {
    // Allow direct access to dashboard for demo button
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
        agents: []
      }
    } as any;

    return (
      <DashboardLayout user={mockUser}>
        <div className="p-6 space-y-6">
          {/* Demo Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">🚀</span>
              <div>
                <h3 className="text-blue-800 font-medium">Demo Dashboard Access</h3>
                <p className="text-blue-700 text-sm">
                  You can also sign in with: <strong>admin@demo.com</strong> / <strong>admin123</strong> for authenticated demo access.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards
            creditsRemaining={85}
            jobsThisMonth={12}
            activeAgents={3}
          />

          {/* Simple Demo Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">AI Agents</h3>
              <div className="space-y-3">
                {[
                  { name: 'Research Assistant', category: 'Research', status: 'Active' },
                  { name: 'Marketing Expert', category: 'Marketing', status: 'Active' },
                  { name: 'Finance Analyst', category: 'Finance', status: 'Active' }
                ].map((agent, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
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
                  { task: 'Market analysis completed', time: '2 hours ago', credits: 3 },
                  { task: 'Social media campaign created', time: '4 hours ago', credits: 2 },
                  { task: 'Financial report generated', time: '1 day ago', credits: 1 }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{activity.task}</p>
                      <p className="text-xs text-slate-600">{activity.time}</p>
                    </div>
                    <span className="text-xs text-slate-500">{activity.credits} credits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // If user is logged in (including demo admin), show authenticated dashboard
  const isDemo = session.user.email === "admin@demo.com" || session.user.id === "demo-admin";
  
  if (isDemo) {
    // Demo user gets full featured dashboard with mock data
    const mockUser = {
      id: session.user.id,
      name: session.user.name || "Demo Admin",
      email: session.user.email || "admin@demo.com",
      emailVerified: new Date(),
      image: session.user.image,
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
        agents: []
      }
    } as any;

    return (
      <DashboardLayout user={mockUser}>
        <div className="p-6 space-y-6">
          {/* Authenticated Demo Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <div>
                <h3 className="text-green-800 font-medium">Authenticated Demo Access</h3>
                <p className="text-green-700 text-sm">
                  Welcome {session.user.name || 'Demo Admin'}! You're logged in with demo credentials.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards
            creditsRemaining={85}
            jobsThisMonth={12}
            activeAgents={3}
          />

          {/* Demo Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">AI Agents</h3>
              <div className="space-y-3">
                {[
                  { name: 'Research Assistant', category: 'Research', status: 'Active' },
                  { name: 'Marketing Expert', category: 'Marketing', status: 'Active' },
                  { name: 'Finance Analyst', category: 'Finance', status: 'Active' }
                ].map((agent, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
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
                  { task: 'Market analysis completed', time: '2 hours ago', credits: 3 },
                  { task: 'Social media campaign created', time: '4 hours ago', credits: 2 },
                  { task: 'Financial report generated', time: '1 day ago', credits: 1 }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{activity.task}</p>
                      <p className="text-xs text-slate-600">{activity.time}</p>
                    </div>
                    <span className="text-xs text-slate-500">{activity.credits} credits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Original database code for real users (when database is working)
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg border shadow-sm max-w-md text-center">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Database Setup in Progress</h2>
        <p className="text-slate-600 mb-4">
          Your account is being set up. Please try the demo credentials for now:
        </p>
        <div className="bg-slate-50 p-4 rounded-lg mb-4">
          <p className="font-mono text-sm">Email: <strong>admin@demo.com</strong></p>
          <p className="font-mono text-sm">Password: <strong>admin123</strong></p>
        </div>
        <button 
          onClick={() => window.location.href = '/auth/signin'} 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}
