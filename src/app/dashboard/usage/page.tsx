import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  CreditCard,
  Bot,
  Users,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";

// Mock usage data for demo
const mockUsageData = {
  currentPeriod: {
    creditsUsed: 215,
    creditsTotal: 1000,
    jobsCompleted: 47,
    avgJobCost: 4.6,
    activeAgents: 5,
    topCategory: "RESEARCH"
  },
  previousPeriod: {
    creditsUsed: 189,
    jobsCompleted: 38,
    avgJobCost: 4.9,
    activeAgents: 4
  },
  dailyUsage: [
    { date: "2025-09-15", credits: 23, jobs: 5 },
    { date: "2025-09-16", credits: 31, jobs: 7 },
    { date: "2025-09-17", credits: 18, jobs: 4 },
    { date: "2025-09-18", credits: 27, jobs: 6 },
    { date: "2025-09-19", credits: 35, jobs: 8 },
    { date: "2025-09-20", credits: 42, jobs: 9 },
    { date: "2025-09-21", credits: 39, jobs: 8 }
  ],
  categoryBreakdown: [
    { category: "RESEARCH", credits: 67, jobs: 14, percentage: 31 },
    { category: "MARKETING", credits: 52, jobs: 11, percentage: 24 },
    { category: "FINANCE", credits: 43, jobs: 9, percentage: 20 },
    { category: "ANALYTICS", credits: 31, jobs: 7, percentage: 14 },
    { category: "CUSTOMER_SUPPORT", credits: 22, jobs: 6, percentage: 11 }
  ],
  teamUsage: [
    { user: "Demo User", credits: 89, jobs: 19, role: "ADMIN" },
    { user: "Sarah Johnson", credits: 67, jobs: 14, role: "MANAGER" },
    { user: "Mike Chen", credits: 43, jobs: 9, role: "USER" },
    { user: "Lisa Wang", credits: 16, jobs: 5, role: "USER" }
  ],
  monthlyTrends: [
    { month: "Jun", credits: 156, jobs: 32 },
    { month: "Jul", credits: 189, jobs: 38 },
    { month: "Aug", credits: 201, jobs: 41 },
    { month: "Sep", credits: 215, jobs: 47 }
  ]
};

export default async function UsagePage() {
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
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      agents: []
    }
  } as any;

  const { currentPeriod, previousPeriod } = mockUsageData;
  
  // Calculate percentage changes
  const creditsChange = ((currentPeriod.creditsUsed - previousPeriod.creditsUsed) / previousPeriod.creditsUsed * 100);
  const jobsChange = ((currentPeriod.jobsCompleted - previousPeriod.jobsCompleted) / previousPeriod.jobsCompleted * 100);
  const costChange = ((currentPeriod.avgJobCost - previousPeriod.avgJobCost) / previousPeriod.avgJobCost * 100);
  
  const usagePercentage = (currentPeriod.creditsUsed / currentPeriod.creditsTotal) * 100;

  return (
    <DashboardLayout user={mockUser}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Usage Analytics</h1>
            <p className="text-slate-600">
              Track your AI agent usage patterns and optimize your workflow
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </div>

        {/* Current Period Overview */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Current Billing Period</h2>
              <p className="text-brand-100">September 1 - September 30, 2025</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentPeriod.creditsTotal - currentPeriod.creditsUsed}</div>
              <div className="text-brand-100">Credits Remaining</div>
            </div>
          </div>
          
          {/* Usage Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Credits Used: {currentPeriod.creditsUsed}</span>
              <span>{usagePercentage.toFixed(1)}% of {currentPeriod.creditsTotal}</span>
            </div>
            <div className="w-full bg-brand-400 rounded-full h-3">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-300"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{currentPeriod.jobsCompleted}</div>
              <div className="text-brand-100 text-sm">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">${currentPeriod.avgJobCost}</div>
              <div className="text-brand-100 text-sm">Avg Cost/Job</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{currentPeriod.activeAgents}</div>
              <div className="text-brand-100 text-sm">Active Agents</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Credits Used</h3>
                <p className="text-2xl font-bold text-slate-900">{currentPeriod.creditsUsed}</p>
                <div className={`flex items-center text-sm ${creditsChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {creditsChange >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                  {Math.abs(creditsChange).toFixed(1)}% vs last period
                </div>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Jobs Completed</h3>
                <p className="text-2xl font-bold text-slate-900">{currentPeriod.jobsCompleted}</p>
                <div className={`flex items-center text-sm ${jobsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {jobsChange >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                  {Math.abs(jobsChange).toFixed(1)}% vs last period
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Avg Cost per Job</h3>
                <p className="text-2xl font-bold text-slate-900">${currentPeriod.avgJobCost}</p>
                <div className={`flex items-center text-sm ${costChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {costChange >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                  {Math.abs(costChange).toFixed(1)}% vs last period
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Peak Category</h3>
                <p className="text-2xl font-bold text-slate-900">{currentPeriod.topCategory}</p>
                <div className="text-sm text-slate-500">
                  Most used this period
                </div>
              </div>
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Usage Trend */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Daily Usage Trend</h3>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {mockUsageData.dailyUsage.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-brand-500 rounded-t-sm mb-2 min-h-[20px]"
                    style={{ height: `${(day.credits / 50) * 200}px` }}
                    title={`${day.credits} credits, ${day.jobs} jobs`}
                  />
                  <div className="text-xs text-slate-500 text-center">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>Credits per day</span>
              <span className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                +15% this week
              </span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Usage by Category</h3>
              <Button variant="outline" size="sm">
                <PieChart className="w-4 h-4 mr-2" />
                Full Report
              </Button>
            </div>
            <div className="space-y-4">
              {mockUsageData.categoryBreakdown.map((category, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.category.replace('_', ' ')}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold">{category.credits}</span>
                      <span className="text-xs text-slate-500 ml-1">credits</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{category.jobs} jobs</span>
                    <span>{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Usage */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Team Usage Breakdown</h3>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Manage Team
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Team Member</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Role</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Credits Used</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Jobs</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Avg/Job</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Usage %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockUsageData.teamUsage.map((member, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                          <span className="text-brand-600 text-sm font-medium">
                            {member.user[0]}
                          </span>
                        </div>
                        <span className="font-medium">{member.user}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        member.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 font-medium">{member.credits}</td>
                    <td className="py-4 text-slate-600">{member.jobs}</td>
                    <td className="py-4 text-slate-600">${(member.credits / member.jobs).toFixed(1)}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-brand-500 h-2 rounded-full"
                            style={{ width: `${(member.credits / currentPeriod.creditsUsed) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600">
                          {Math.round((member.credits / currentPeriod.creditsUsed) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Monthly Usage Trends</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Last 6 Months</Button>
              <Button variant="outline" size="sm">Last Year</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {mockUsageData.monthlyTrends.map((month, i) => (
              <div key={i} className="text-center p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">{month.month} 2025</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-2xl font-bold text-brand-600">{month.credits}</span>
                    <p className="text-xs text-slate-500">Credits</p>
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-slate-700">{month.jobs}</span>
                    <p className="text-xs text-slate-500">Jobs</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Insights */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Usage Insights & Recommendations</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Efficient Usage</h4>
                  <p className="text-sm text-green-700">
                    Your team is using credits efficiently with an average cost of ${currentPeriod.avgJobCost} per job.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Growing Usage</h4>
                  <p className="text-sm text-blue-700">
                    Usage has increased {creditsChange.toFixed(1)}% this period. Consider upgrading your plan for better value.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Optimization Opportunity</h4>
                  <p className="text-sm text-yellow-700">
                    {currentPeriod.topCategory} category accounts for 31% of usage. Consider optimizing prompts for better efficiency.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">Usage Pattern</h4>
                  <p className="text-sm text-purple-700">
                    Peak usage occurs on weekdays. Consider batch processing for cost optimization.
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