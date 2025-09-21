import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Mail,
  Shield,
  Settings,
  MoreVertical,
  Crown,
  UserCheck,
  UserX,
  Calendar,
  Activity,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Send
} from "lucide-react";

// Mock team data for demo
const mockTeamMembers = [
  {
    id: "user-1",
    name: "Demo User",
    email: "demo@cout.ai",
    role: "ADMIN",
    status: "active",
    avatar: null,
    joinedAt: new Date("2024-01-15"),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    creditsUsed: 89,
    jobsCompleted: 19,
    permissions: ["all"]
  },
  {
    id: "user-2", 
    name: "Sarah Johnson",
    email: "sarah.johnson@cout.ai",
    role: "MANAGER",
    status: "active",
    avatar: null,
    joinedAt: new Date("2024-02-01"),
    lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    creditsUsed: 67,
    jobsCompleted: 14,
    permissions: ["agents", "jobs", "billing"]
  },
  {
    id: "user-3",
    name: "Mike Chen", 
    email: "mike.chen@cout.ai",
    role: "USER",
    status: "active",
    avatar: null,
    joinedAt: new Date("2024-03-10"),
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    creditsUsed: 43,
    jobsCompleted: 9,
    permissions: ["agents", "jobs"]
  },
  {
    id: "user-4",
    name: "Lisa Wang",
    email: "lisa.wang@cout.ai", 
    role: "USER",
    status: "pending",
    avatar: null,
    joinedAt: new Date("2024-09-18"),
    lastActive: null,
    creditsUsed: 0,
    jobsCompleted: 0,
    permissions: ["agents"]
  },
  {
    id: "user-5",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@cout.ai",
    role: "USER", 
    status: "suspended",
    avatar: null,
    joinedAt: new Date("2024-05-20"),
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    creditsUsed: 156,
    jobsCompleted: 32,
    permissions: []
  }
];

const mockInvitations = [
  {
    id: "inv-1",
    email: "john.doe@company.com",
    role: "USER",
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    sentBy: "Demo User",
    status: "pending"
  },
  {
    id: "inv-2", 
    email: "jane.smith@company.com",
    role: "MANAGER",
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    sentBy: "Demo User",
    status: "expired"
  }
];

export default async function TeamPage() {
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
        credits: 785,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      users: mockTeamMembers
    }
  } as any;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN": return <Crown className="w-4 h-4 text-yellow-600" />;
      case "MANAGER": return <Shield className="w-4 h-4 text-blue-600" />;
      case "USER": return <Users className="w-4 h-4 text-slate-600" />;
      default: return <Users className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const activeMembers = mockTeamMembers.filter(m => m.status === "active").length;
  const pendingMembers = mockTeamMembers.filter(m => m.status === "pending").length;
  const totalCreditsUsed = mockTeamMembers.reduce((acc, m) => acc + m.creditsUsed, 0);

  return (
    <DashboardLayout user={mockUser}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
            <p className="text-slate-600">
              Manage team members, roles, and permissions
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="gradient-brand">
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Total Members</h3>
                <p className="text-2xl font-bold text-slate-900">{mockTeamMembers.length}</p>
                <p className="text-xs text-slate-500 mt-1">All team members</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Active</h3>
                <p className="text-2xl font-bold text-green-600">{activeMembers}</p>
                <p className="text-xs text-green-600 mt-1">Currently active</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Pending</h3>
                <p className="text-2xl font-bold text-yellow-600">{pendingMembers}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting activation</p>
              </div>
              <Mail className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Credits Used</h3>
                <p className="text-2xl font-bold text-purple-600">{totalCreditsUsed}</p>
                <p className="text-xs text-purple-600 mt-1">This period</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Pending Invitations */}
        {mockInvitations.length > 0 && (
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Pending Invitations</h3>
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4 mr-2" />
                Send Reminder
              </Button>
            </div>
            <div className="space-y-3">
              {mockInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{invitation.email}</p>
                      <p className="text-sm text-slate-600">
                        Invited {getTimeAgo(invitation.sentAt)} by {invitation.sentBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      invitation.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                    }`}>
                      {invitation.status}
                    </span>
                    <span className="text-sm text-slate-500">{invitation.role}</span>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search team members..."
                className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <select className="px-3 py-2 border border-slate-300 rounded-lg">
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="USER">User</option>
            </select>
            <select className="px-3 py-2 border border-slate-300 rounded-lg">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockTeamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                          <span className="text-brand-600 font-medium">
                            {member.name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-600">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(member.role)}
                        <span className="font-medium text-slate-900">{member.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-900">{member.creditsUsed} credits</p>
                        <p className="text-slate-600">{member.jobsCompleted} jobs</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-slate-900">{getTimeAgo(member.lastActive)}</p>
                        <p className="text-slate-600">
                          Joined {member.joinedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {member.status === "active" ? (
                          <Button variant="ghost" size="sm" title="Suspend" className="text-red-600">
                            <Lock className="w-4 h-4" />
                          </Button>
                        ) : member.status === "suspended" ? (
                          <Button variant="ghost" size="sm" title="Reactivate" className="text-green-600">
                            <Unlock className="w-4 h-4" />
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="sm" title="More options">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Permissions */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Role Permissions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Crown className="w-5 h-5 text-yellow-600" />
                <h4 className="font-medium text-slate-900">Admin</h4>
              </div>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Full system access</li>
                <li>• Manage team members</li>
                <li>• Billing & subscription</li>
                <li>• All agent operations</li>
                <li>• System settings</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-slate-900">Manager</h4>
              </div>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Manage agents</li>
                <li>• View job history</li>
                <li>• View billing info</li>
                <li>• Team usage analytics</li>
                <li>• Limited user management</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-slate-600" />
                <h4 className="font-medium text-slate-900">User</h4>
              </div>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Use assigned agents</li>
                <li>• View own job history</li>
                <li>• Basic chat interface</li>
                <li>• Download results</li>
                <li>• Personal settings</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Team Activity</h3>
          <div className="space-y-4">
            {[
              { user: "Sarah Johnson", action: "completed a marketing analysis job", time: "2 hours ago", type: "job" },
              { user: "Mike Chen", action: "joined the organization", time: "1 day ago", type: "join" },
              { user: "Demo User", action: "invited Lisa Wang to the team", time: "3 days ago", type: "invite" },
              { user: "Alex Rodriguez", action: "was suspended from the team", time: "1 week ago", type: "suspend" },
              { user: "Sarah Johnson", action: "was promoted to Manager role", time: "2 weeks ago", type: "role" }
            ].map((activity, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === "job" ? "bg-green-100" :
                  activity.type === "join" ? "bg-blue-100" :
                  activity.type === "invite" ? "bg-purple-100" :
                  activity.type === "suspend" ? "bg-red-100" :
                  "bg-yellow-100"
                }`}>
                  {activity.type === "job" ? <Activity className="w-4 h-4 text-green-600" /> :
                   activity.type === "join" ? <UserCheck className="w-4 h-4 text-blue-600" /> :
                   activity.type === "invite" ? <Mail className="w-4 h-4 text-purple-600" /> :
                   activity.type === "suspend" ? <UserX className="w-4 h-4 text-red-600" /> :
                   <Settings className="w-4 h-4 text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}