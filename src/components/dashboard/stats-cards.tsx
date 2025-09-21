import { CreditCard, Bot, Activity, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  creditsRemaining: number;
  jobsThisMonth: number;
  activeAgents: number;
}

export function StatsCards({
  creditsRemaining,
  jobsThisMonth,
  activeAgents,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-600">
              Credits Remaining
            </h3>
            <p className="text-2xl font-bold text-slate-900">
              {creditsRemaining.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1">Resets monthly</p>
          </div>
          <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-brand-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-600">
              Jobs This Month
            </h3>
            <p className="text-2xl font-bold text-slate-900">{jobsThisMonth}</p>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-600">
              Active Agents
            </h3>
            <p className="text-2xl font-bold text-slate-900">{activeAgents}</p>
            <p className="text-xs text-slate-500 mt-1">Across all categories</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
