import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  TrendingUp,
  Calendar,
  RefreshCw,
  BarChart3,
  Bot,
  User,
  Zap,
  Activity
} from "lucide-react";

// Mock jobs data for demo
const mockJobs = [
  {
    id: "job_1",
    prompt: "Analyze Q3 financial performance and provide recommendations for Q4 strategy",
    output: "Based on Q3 analysis, revenue grew 15% YoY with strong performance in digital channels. Key recommendations: 1) Increase digital marketing spend by 25%, 2) Optimize operational costs in traditional channels, 3) Expand into emerging markets.",
    status: "COMPLETED",
    credits: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(),
    agent: { id: "3", name: "Finance Analyst", category: "FINANCE" },
    user: { id: "demo-user", name: "Demo User", email: "demo@cout.ai" }
  },
  {
    id: "job_2", 
    prompt: "Create a comprehensive social media campaign for our new product launch",
    output: "Multi-platform campaign strategy developed with content calendar, targeting parameters, and performance metrics. Includes Instagram Stories, LinkedIn articles, Twitter threads, and YouTube videos with projected 2M+ reach.",
    status: "COMPLETED",
    credits: 4,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(),
    agent: { id: "2", name: "Marketing Expert", category: "MARKETING" },
    user: { id: "demo-user", name: "Demo User", email: "demo@cout.ai" }
  },
  {
    id: "job_3",
    prompt: "Research competitor pricing strategies in the SaaS space",
    output: null,
    status: "PROCESSING",
    credits: 2,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    updatedAt: new Date(),
    agent: { id: "1", name: "Research Assistant", category: "RESEARCH" },
    user: { id: "demo-user", name: "Demo User", email: "demo@cout.ai" }
  },
  {
    id: "job_4",
    prompt: "Generate customer support FAQ based on recent tickets",
    output: "Comprehensive FAQ created covering 15 most common issues including account setup, billing questions, feature usage, and troubleshooting steps. Response time reduced by estimated 40%.",
    status: "COMPLETED",
    credits: 2,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(),
    agent: { id: "4", name: "Customer Support Pro", category: "CUSTOMER_SUPPORT" },
    user: { id: "demo-user", name: "Demo User", email: "demo@cout.ai" }
  },
  {
    id: "job_5",
    prompt: "Analyze user engagement data and identify improvement opportunities",
    output: "Data analysis revealed 3 key insights: 1) 65% drop-off at onboarding step 3, 2) Power users spend 4x more time in analytics section, 3) Mobile engagement 30% lower than desktop. Recommended UX improvements provided.",
    status: "COMPLETED", 
    credits: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(),
    agent: { id: "6", name: "Data Scientist", category: "ANALYTICS" },
    user: { id: "demo-user", name: "Demo User", email: "demo@cout.ai" }
  },
  {
    id: "job_6",
    prompt: "Write blog post about AI automation trends",
    output: null,
    status: "FAILED",
    credits: 2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(),
    agent: { id: "5", name: "Content Creator", category: "CONTENT" },
    user: { id: "demo-user", name: "Demo User", email: "demo@cout.ai" }
  },
  {
    id: "job_7",
    prompt: "Develop market expansion strategy for European markets",
    output: "Comprehensive market analysis for UK, Germany, and France completed. Total addressable market: €2.3B. Recommended entry sequence: UK (Q1), Germany (Q2), France (Q3). Regulatory considerations and localization requirements detailed.",
    status: "COMPLETED",
    credits: 5,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(),
    agent: { id: "1", name: "Research Assistant", category: "RESEARCH" },
    user: { id: "demo-user", name: "Demo User", email: "demo@cout.ai" }
  },
  {
    id: "job_8",
    prompt: "Create email templates for customer onboarding sequence",
    output: "5-email onboarding sequence created with personalization tokens, A/B testing variants, and automation triggers. Expected 25% improvement in activation rates based on industry benchmarks.",
    status: "COMPLETED",
    credits: 3,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    updatedAt: new Date(),
    agent: { id: "2", name: "Marketing Expert", category: "MARKETING" },
    user: { id: "demo-user", name: "Demo User", email: "demo@cout.ai" }
  }
];

export default async function JobsPage() {
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
      jobs: mockJobs
    }
  } as any;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "PROCESSING":
        return <Clock className="w-4 h-4 text-yellow-600 animate-spin" />;
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const jobStats = {
    total: mockJobs.length,
    completed: mockJobs.filter((job) => job.status === "COMPLETED").length,
    processing: mockJobs.filter((job) => job.status === "PROCESSING").length,
    failed: mockJobs.filter((job) => job.status === "FAILED").length,
  };

  const totalCreditsUsed = mockJobs.reduce((acc, job) => acc + job.credits, 0);
  const avgCreditsPerJob = Math.round(totalCreditsUsed / mockJobs.length * 10) / 10;

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <DashboardLayout user={mockUser}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Job History</h1>
            <p className="text-slate-600">
              View and manage all AI agent executions and their results
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Total Jobs
                </h3>
                <p className="text-2xl font-bold text-slate-900">
                  {jobStats.total}
                </p>
                <p className="text-xs text-slate-500 mt-1">All time</p>
              </div>
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Completed
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {jobStats.completed}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {Math.round((jobStats.completed / jobStats.total) * 100)}% success rate
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Processing
                </h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {jobStats.processing}
                </p>
                <p className="text-xs text-yellow-600 mt-1">In progress</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Failed</h3>
                <p className="text-2xl font-bold text-red-600">
                  {jobStats.failed}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {Math.round((jobStats.failed / jobStats.total) * 100)}% failure rate
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Credits Used</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {totalCreditsUsed}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {avgCreditsPerJob} avg per job
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Job Activity Over Time</h3>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <div className="text-center">
                <Activity className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">Job activity chart would go here</p>
                <p className="text-sm text-slate-400">Showing completion trends and patterns</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Agents</h3>
            <div className="space-y-4">
              {[
                { name: "Customer Support Pro", jobs: 234, category: "CUSTOMER_SUPPORT" },
                { name: "Data Scientist", jobs: 156, category: "ANALYTICS" },
                { name: "Research Assistant", jobs: 142, category: "RESEARCH" },
                { name: "Marketing Expert", jobs: 98, category: "MARKETING" }
              ].map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-slate-500">{agent.category.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{agent.jobs}</p>
                    <p className="text-xs text-slate-500">jobs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs by prompt, agent, or output..."
                className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <select className="px-3 py-2 border border-slate-300 rounded-lg">
              <option value="">All Agents</option>
              <option value="1">Research Assistant</option>
              <option value="2">Marketing Expert</option>
              <option value="3">Finance Analyst</option>
              <option value="4">Customer Support Pro</option>
              <option value="5">Content Creator</option>
              <option value="6">Data Scientist</option>
            </select>
            <select className="px-3 py-2 border border-slate-300 rounded-lg">
              <option value="">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
            </select>
            <select className="px-3 py-2 border border-slate-300 rounded-lg">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {job.prompt}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: {job.id}
                        </p>
                        {job.output && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {job.output.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mr-3">
                          <Bot className="w-4 h-4 text-brand-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-900">
                            {job.agent.name}
                          </span>
                          <p className="text-xs text-slate-500">{job.agent.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status.toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-sm text-slate-900">
                          {job.credits}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm text-slate-900">
                          {getTimeAgo(job.createdAt)}
                        </span>
                        <p className="text-xs text-slate-500">
                          {job.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {job.status === "COMPLETED" && (
                          <Button variant="ghost" size="sm" title="Download Results">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        {job.status === "FAILED" && (
                          <Button variant="ghost" size="sm" title="Retry Job">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {mockJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-start space-x-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex-shrink-0">
                  {getStatusIcon(job.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    <span className="text-brand-600">{job.agent.name}</span> {job.status.toLowerCase()} a job
                  </p>
                  <p className="text-sm text-slate-600 truncate">
                    "{job.prompt}"
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {getTimeAgo(job.createdAt)} • {job.credits} credits
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
