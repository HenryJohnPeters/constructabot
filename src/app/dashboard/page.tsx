import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/layout";
import { ChatInterface } from "@/components/chat/chat-interface";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default async function DashboardPage() {
  // Demo mode - works without database
  const isDemoMode = true; // Set to false when database is working
  
  if (isDemoMode) {
    // Mock data for demo
    const mockUser = {
      id: "demo-user",
      email: "demo@cout.ai", 
      name: "Demo User",
      role: "ADMIN",
      orgId: "demo-org",
      org: {
        id: "demo-org",
        name: "Demo Organization",
        slug: "demo-org",
        primaryColor: "#0ea5e9",
        secondaryColor: "#f1f5f9",
        subscription: {
          credits: 85,
          plan: "PRO",
          status: "active"
        },
        agents: [
          {
            id: "1",
            name: "Research Assistant",
            description: "Deep research and market analysis",
            category: "RESEARCH",
            isActive: true
          },
          {
            id: "2", 
            name: "Marketing Expert",
            description: "Content creation and marketing strategy",
            category: "MARKETING",
            isActive: true
          },
          {
            id: "3",
            name: "Finance Analyst", 
            description: "Financial modeling and insights",
            category: "FINANCE",
            isActive: true
          }
        ]
      }
    };

    const mockUsageData = [
      { createdAt: new Date('2024-12-01'), _sum: { credits: 25 } },
      { createdAt: new Date('2024-12-02'), _sum: { credits: 18 } },
      { createdAt: new Date('2024-12-03'), _sum: { credits: 32 } },
      { createdAt: new Date('2024-12-04'), _sum: { credits: 41 } },
      { createdAt: new Date('2024-12-05'), _sum: { credits: 29 } },
    ];

    return (
      <DashboardLayout user={mockUser}>
        <div className="p-6 space-y-6">
          {/* Demo Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">🚀</span>
              <div>
                <h3 className="text-yellow-800 font-medium">Demo Mode Active</h3>
                <p className="text-yellow-700 text-sm">You're viewing the dashboard with mock data. Database setup is in progress.</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards
            creditsRemaining={mockUser.org.subscription?.credits || 0}
            jobsThisMonth={12}
            activeAgents={mockUser.org.agents?.length || 0}
          />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <ChatInterface agents={mockUser.org.agents || []} />
            </div>

            {/* Usage Chart */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Usage Overview</h3>
                <UsageChart data={mockUsageData} />
              </div>

              {/* Recent Jobs */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
                <div className="space-y-3">
                  {[
                    { id: '1', agent: { name: 'Research Assistant' }, prompt: 'Analyze market trends for Q4', status: 'COMPLETED', credits: 2 },
                    { id: '2', agent: { name: 'Marketing Expert' }, prompt: 'Create social media campaign', status: 'PROCESSING', credits: 3 },
                    { id: '3', agent: { name: 'Finance Analyst' }, prompt: 'Budget forecast for next quarter', status: 'COMPLETED', credits: 1 }
                  ].map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{job.agent.name}</p>
                        <p className="text-xs text-slate-600 truncate max-w-[200px]">
                          {job.prompt}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            job.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : job.status === "PROCESSING"
                              ? "bg-yellow-100 text-yellow-700"
                              : job.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.status.toLowerCase()}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {job.credits} credits
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Original database-dependent code (when isDemoMode = false)
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        org: {
          include: {
            subscription: true,
            agents: { where: { isActive: true } },
          },
        },
      },
    });

    if (!user) {
      redirect("/auth/signin");
    }

    const recentJobs = await prisma.job.findMany({
      where: {
        orgId: user.orgId,
        userId: session.user.id,
      },
      include: { agent: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const usageData = await prisma.usage.groupBy({
      by: ["createdAt"],
      where: {
        orgId: user.orgId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      _sum: { credits: true },
      orderBy: { createdAt: "asc" },
    });

    return (
      <DashboardLayout user={user}>
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <StatsCards
            creditsRemaining={user.org.subscription?.credits || 0}
            jobsThisMonth={recentJobs.length}
            activeAgents={user.org.agents?.length || 0}
          />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <ChatInterface agents={user.org.agents || []} />
            </div>

            {/* Usage Chart */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Usage Overview</h3>
                <UsageChart data={usageData} />
              </div>

              {/* Recent Jobs */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{job.agent.name}</p>
                        <p className="text-xs text-slate-600 truncate max-w-[200px]">
                          {job.prompt}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            job.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : job.status === "PROCESSING"
                              ? "bg-yellow-100 text-yellow-700"
                              : job.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.status.toLowerCase()}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {job.credits} credits
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    // If database error, show error page
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-lg border shadow-sm max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Database Setup Required</h2>
          <p className="text-slate-600 mb-4">
            The database tables are not yet set up. Please wait for deployment to complete.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}
