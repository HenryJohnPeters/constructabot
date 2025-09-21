import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/layout";
import { ChatInterface } from "@/components/chat/chat-interface";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default async function DashboardPage() {
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
}
