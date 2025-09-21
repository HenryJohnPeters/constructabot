import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/chat-interface";
import { 
  Bot, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  MessageSquare,
  Brain,
  BarChart3,
  Target,
  Zap,
  Users,
  FileText,
  TrendingUp
} from "lucide-react";

// Mock data for demo
const mockAgents = [
  {
    id: "1",
    name: "Research Assistant",
    description: "Deep research and market analysis with comprehensive reporting capabilities",
    category: "RESEARCH",
    config: JSON.stringify({
      systemPrompt: "You are a research assistant specialized in market analysis",
      temperature: 0.7,
      maxTokens: 1000,
      model: "gpt-4",
    }),
    isActive: true,
    orgId: "demo-org",
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { jobs: 142 }
  },
  {
    id: "2",
    name: "Marketing Expert",
    description: "Content creation, campaign strategy, and brand positioning specialist",
    category: "MARKETING",
    config: JSON.stringify({
      systemPrompt: "You are a marketing expert focused on growth and engagement",
      temperature: 0.8,
      maxTokens: 1200,
      model: "gpt-4",
    }),
    isActive: true,
    orgId: "demo-org",
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { jobs: 98 }
  },
  {
    id: "3",
    name: "Finance Analyst",
    description: "Financial modeling, budgeting, and investment analysis expert",
    category: "FINANCE",
    config: JSON.stringify({
      systemPrompt: "You are a finance analyst with expertise in modeling and analysis",
      temperature: 0.5,
      maxTokens: 1000,
      model: "gpt-4",
    }),
    isActive: true,
    orgId: "demo-org",
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { jobs: 67 }
  },
  {
    id: "4",
    name: "Customer Support Pro",
    description: "Advanced customer service with product knowledge and escalation handling",
    category: "CUSTOMER_SUPPORT",
    config: JSON.stringify({
      systemPrompt: "You are a customer support specialist",
      temperature: 0.6,
      maxTokens: 800,
      model: "gpt-4",
    }),
    isActive: true,
    orgId: "demo-org",
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { jobs: 234 }
  },
  {
    id: "5",
    name: "Content Creator",
    description: "Blog posts, social media content, and copywriting specialist",
    category: "CONTENT",
    config: JSON.stringify({
      systemPrompt: "You are a content creator and copywriter",
      temperature: 0.9,
      maxTokens: 1500,
      model: "gpt-4",
    }),
    isActive: false,
    orgId: "demo-org",
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { jobs: 89 }
  },
  {
    id: "6",
    name: "Data Scientist",
    description: "Advanced analytics, statistical modeling, and insights generation",
    category: "ANALYTICS",
    config: JSON.stringify({
      systemPrompt: "You are a data scientist specializing in analysis",
      temperature: 0.4,
      maxTokens: 1200,
      model: "gpt-4",
    }),
    isActive: true,
    orgId: "demo-org",
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { jobs: 156 }
  }
];

export default async function AgentsPage() {
  // For demo purposes, use mock data
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
        credits: 85,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      agents: mockAgents
    }
  } as any;

  const agentTypeColors: Record<string, string> = {
    RESEARCH: "bg-blue-100 text-blue-800",
    MARKETING: "bg-green-100 text-green-800",
    FINANCE: "bg-purple-100 text-purple-800",
    CUSTOMER_SUPPORT: "bg-orange-100 text-orange-800",
    CONTENT: "bg-pink-100 text-pink-800",
    ANALYTICS: "bg-indigo-100 text-indigo-800",
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "RESEARCH": return <Brain className="w-5 h-5" />;
      case "MARKETING": return <TrendingUp className="w-5 h-5" />;
      case "FINANCE": return <BarChart3 className="w-5 h-5" />;
      case "CUSTOMER_SUPPORT": return <Users className="w-5 h-5" />;
      case "CONTENT": return <FileText className="w-5 h-5" />;
      case "ANALYTICS": return <Target className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  return (
    <DashboardLayout user={mockUser}>
      <div className="p-6 space-y-6">
        {/* Header with Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Agents</h1>
            <p className="text-slate-600">
              Manage your custom AI agents and chat with them directly
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span>{mockAgents.filter(a => a.isActive).length} Active</span>
              <span>{mockAgents.reduce((acc, a) => acc + a._count.jobs, 0)} Total Jobs</span>
            </div>
            <Button className="gradient-brand">
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Agents</p>
                <p className="text-2xl font-bold text-slate-900">{mockAgents.length}</p>
              </div>
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Agents</p>
                <p className="text-2xl font-bold text-green-600">{mockAgents.filter(a => a.isActive).length}</p>
              </div>
              <Zap className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Jobs Completed</p>
                <p className="text-2xl font-bold text-purple-600">{mockAgents.reduce((acc, a) => acc + a._count.jobs, 0)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Categories</p>
                <p className="text-2xl font-bold text-orange-600">{new Set(mockAgents.map(a => a.category)).size}</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="border-b p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-semibold">Chat with AI Agents</h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Select an agent below and start chatting immediately
            </p>
          </div>
          <div className="p-4">
            <ChatInterface agents={mockAgents} />
          </div>
        </div>

        {/* Agents Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your AI Agents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-lg border p-6 hover:shadow-lg transition-all duration-200 hover:border-brand-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      agentTypeColors[agent.category]?.replace('text', 'bg')?.replace('800', '100') || 'bg-gray-100'
                    }`}>
                      {getCategoryIcon(agent.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {agent.name}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          agentTypeColors[agent.category] ||
                          "bg-gray-100 text-gray-800"
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

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{agent.description}</p>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-slate-500">
                    {agent._count.jobs} jobs completed
                  </span>
                  <span
                    className={`font-medium flex items-center space-x-1 ${
                      agent.isActive ? "text-green-600" : "text-slate-400"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      agent.isActive ? "bg-green-500" : "bg-slate-400"
                    }`} />
                    <span>{agent.isActive ? "Active" : "Inactive"}</span>
                  </span>
                </div>

                {/* Agent Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
        </div>

        {/* Agent Templates */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Agent Templates</h2>
          <p className="text-slate-600 mb-6">
            Quick start templates for common business functions
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Sales Assistant",
                category: "CUSTOMER_SUPPORT",
                description: "Handle sales inquiries and lead qualification with CRM integration",
                icon: <Users className="w-5 h-5" />
              },
              {
                name: "HR Specialist",
                category: "ANALYTICS",
                description: "Employee onboarding, policy guidance, and HR documentation",
                icon: <Users className="w-5 h-5" />
              },
              {
                name: "Legal Advisor",
                category: "RESEARCH",
                description: "Contract analysis, compliance checks, and legal research",
                icon: <FileText className="w-5 h-5" />
              },
              {
                name: "Product Manager",
                category: "ANALYTICS",
                description: "Product requirements, roadmap planning, and feature analysis",
                icon: <Target className="w-5 h-5" />
              },
              {
                name: "Social Media Manager",
                category: "MARKETING",
                description: "Social media content, engagement strategies, and analytics",
                icon: <TrendingUp className="w-5 h-5" />
              },
              {
                name: "Technical Writer",
                category: "CONTENT",
                description: "Documentation, API guides, and technical communication",
                icon: <FileText className="w-5 h-5" />
              },
            ].map((template, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      agentTypeColors[template.category]?.replace('text', 'bg')?.replace('800', '100') || 'bg-gray-100'
                    }`}>
                      {template.icon}
                    </div>
                    <h4 className="font-medium text-slate-900">
                      {template.name}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      agentTypeColors[template.category as keyof typeof agentTypeColors]
                    }`}
                  >
                    {template.category.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {template.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
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
