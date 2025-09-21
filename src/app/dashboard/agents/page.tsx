import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Bot, Plus, Settings, Play, Pause, Trash2 } from "lucide-react";

export default async function AgentsPage() {
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
          agents: {
            include: {
              _count: { select: { jobs: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const agentTypeColors: Record<string, string> = {
    RESEARCH: "bg-blue-100 text-blue-800",
    MARKETING: "bg-green-100 text-green-800",
    FINANCE: "bg-purple-100 text-purple-800",
    CUSTOMER_SUPPORT: "bg-orange-100 text-orange-800",
    CONTENT: "bg-pink-100 text-pink-800",
    ANALYTICS: "bg-indigo-100 text-indigo-800",
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Agents</h1>
            <p className="text-slate-600">
              Manage your custom AI agents and their configurations
            </p>
          </div>
          <Button className="gradient-brand">
            <Plus className="w-4 h-4 mr-2" />
            Create Agent
          </Button>
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.org.agents?.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {agent.name}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        agentTypeColors[agent.category] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agent.category.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      agent.isActive ? "text-green-600" : "text-slate-400"
                    }
                  >
                    {agent.isActive ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4">{agent.description}</p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  {agent._count.jobs} jobs completed
                </span>
                <span
                  className={`font-medium ${
                    agent.isActive ? "text-green-600" : "text-slate-400"
                  }`}
                >
                  {agent.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}

          {/* Create New Agent Card */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-brand-400 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="font-medium text-slate-900 mb-2">
              Create New Agent
            </h3>
            <p className="text-sm text-slate-600">
              Add a custom AI agent for your specific use case
            </p>
          </div>
        </div>

        {/* Agent Templates */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Agent Templates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Sales Assistant",
                category: "CUSTOMER_SUPPORT",
                description: "Handle sales inquiries and lead qualification",
              },
              {
                name: "HR Specialist",
                category: "ANALYTICS",
                description: "Employee onboarding and HR documentation",
              },
              {
                name: "Legal Advisor",
                category: "RESEARCH",
                description: "Contract analysis and legal research",
              },
              {
                name: "Product Manager",
                category: "ANALYTICS",
                description: "Product requirements and roadmap planning",
              },
              {
                name: "Social Media Manager",
                category: "MARKETING",
                description: "Social media content and engagement",
              },
              {
                name: "Data Scientist",
                category: "ANALYTICS",
                description: "Advanced data analysis and modeling",
              },
            ].map((template, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">
                    {template.name}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      agentTypeColors[
                        template.category as keyof typeof agentTypeColors
                      ]
                    }`}
                  >
                    {template.category.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {template.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
