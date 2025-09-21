import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building,
  CreditCard,
  Activity,
  Shield,
  UserX,
  UserCheck,
  Edit3,
} from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  const orgs = await prisma.org.findMany({
    include: {
      users: true,
      subscription: true,
      _count: {
        select: {
          jobs: true,
          users: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = await prisma.user.count();
  const activeSubscriptions = await prisma.subscription.count({
    where: { status: "active" },
  });
  const totalJobs = await prisma.job.count();
  const revenue = activeSubscriptions * 99; // Simplified calculation

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Super Admin Dashboard
            </h1>
            <p className="text-slate-600">
              Manage organizations, users, and system health
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              System Health
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Total Organizations
                </h3>
                <p className="text-2xl font-bold text-slate-900">
                  {orgs.length}
                </p>
              </div>
              <Building className="w-8 h-8 text-brand-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Total Users
                </h3>
                <p className="text-2xl font-bold text-slate-900">
                  {totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Active Subscriptions
                </h3>
                <p className="text-2xl font-bold text-slate-900">
                  {activeSubscriptions}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">
                  Total Jobs
                </h3>
                <p className="text-2xl font-bold text-slate-900">{totalJobs}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Organizations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Jobs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orgs.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                          style={{ backgroundColor: org.primaryColor }}
                        >
                          <Building className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {org.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {org.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-900">
                        {org._count.users}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {org.subscription ? (
                        <div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              org.subscription.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {org.subscription.plan}
                          </span>
                          <div className="text-xs text-slate-500 mt-1">
                            {org.subscription.credits} credits
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">
                          No subscription
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {org._count.jobs}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
