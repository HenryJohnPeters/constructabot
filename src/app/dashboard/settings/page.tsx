import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
  Settings,
  User,
  Building,
  CreditCard,
  Shield,
  Bell,
  Globe,
  Key,
  Palette,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Eye,
  EyeOff,
  Copy,
  RotateCcw,
  Trash2,
  Plus,
  ExternalLink,
  Check,
  X,
  Zap,
  Database,
  Cloud,
  Lock,
  Smartphone
} from "lucide-react";

export default async function SettingsPage() {
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
      agents: []
    }
  } as any;

  const mockIntegrations = [
    { name: "Slack", description: "Send notifications to Slack channels", connected: true, icon: "💬" },
    { name: "Microsoft Teams", description: "Collaborate with your team", connected: false, icon: "🟣" },
    { name: "Google Drive", description: "Save outputs to Google Drive", connected: true, icon: "📁" },
    { name: "Dropbox", description: "Store files in Dropbox", connected: false, icon: "📦" },
    { name: "Zapier", description: "Connect to thousands of apps", connected: true, icon: "⚡" },
    { name: "Discord", description: "Get updates in Discord", connected: false, icon: "🎮" }
  ];

  const mockApiKeys = [
    { id: "1", name: "Production API", lastUsed: "2 hours ago", created: "2024-01-15", masked: "sk-...xyz123" },
    { id: "2", name: "Development API", lastUsed: "1 day ago", created: "2024-08-20", masked: "sk-...abc789" },
    { id: "3", name: "Staging API", lastUsed: "Never", created: "2024-09-01", masked: "sk-...def456" }
  ];

  return (
    <DashboardLayout user={mockUser}>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">
              Manage your account, organization, and preferences
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4">
              <nav className="space-y-2">
                {[
                  { id: "profile", icon: User, label: "Profile", active: true },
                  { id: "organization", icon: Building, label: "Organization" },
                  { id: "billing", icon: CreditCard, label: "Billing" },
                  { id: "security", icon: Shield, label: "Security" },
                  { id: "notifications", icon: Bell, label: "Notifications" },
                  { id: "integrations", icon: Globe, label: "Integrations" },
                  { id: "api", icon: Key, label: "API Keys" },
                  { id: "appearance", icon: Palette, label: "Appearance" }
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      item.active 
                        ? "bg-brand-50 text-brand-700 border border-brand-200" 
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Settings
                </h2>
                <p className="text-slate-600 text-sm">Update your personal information and preferences</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-600 text-2xl font-bold">
                      {mockUser.name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{mockUser.name}</h3>
                    <p className="text-slate-600 text-sm">{mockUser.email}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={mockUser.name}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={mockUser.email}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gradient-brand">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            {/* Organization Settings */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Organization Settings
                </h2>
                <p className="text-slate-600 text-sm">Manage your organization's information and branding</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      defaultValue={mockUser.org.name}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Organization Slug
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                        cout.ai/
                      </span>
                      <input
                        type="text"
                        defaultValue={mockUser.org.slug}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organization Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-slate-500 mt-1">
                        Recommended: 256x256px, PNG or JPG
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-slate-300"
                        style={{ backgroundColor: mockUser.org.primaryColor }}
                      />
                      <input
                        type="text"
                        defaultValue={mockUser.org.primaryColor}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-slate-300"
                        style={{ backgroundColor: mockUser.org.secondaryColor }}
                      />
                      <input
                        type="text"
                        defaultValue={mockUser.org.secondaryColor}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gradient-brand">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </h2>
                <p className="text-slate-600 text-sm">Manage your account security and authentication</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-slate-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">Password</h4>
                        <p className="text-sm text-slate-600">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Change Password</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-slate-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-slate-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-slate-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">Active Sessions</h4>
                        <p className="text-sm text-slate-600">Manage your logged-in devices</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Sessions</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Recent Security Activity</h4>
                  <div className="space-y-3">
                    {[
                      { action: "Password changed", time: "3 months ago", ip: "192.168.1.1" },
                      { action: "Login from new device", time: "2 weeks ago", ip: "10.0.0.1" },
                      { action: "API key created", time: "1 week ago", ip: "192.168.1.1" }
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                          <p className="text-xs text-slate-600">{activity.time} • {activity.ip}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </h2>
                <p className="text-slate-600 text-sm">Configure how you want to receive notifications</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {[
                    { 
                      category: "Job Notifications",
                      description: "Get notified when jobs complete or fail",
                      settings: [
                        { name: "Email", enabled: true },
                        { name: "Browser", enabled: true },
                        { name: "Mobile Push", enabled: false }
                      ]
                    },
                    {
                      category: "Billing & Usage",
                      description: "Alerts about credits, billing, and usage",
                      settings: [
                        { name: "Email", enabled: true },
                        { name: "Browser", enabled: false },
                        { name: "Mobile Push", enabled: true }
                      ]
                    },
                    {
                      category: "Team Activity",
                      description: "Updates about team member actions",
                      settings: [
                        { name: "Email", enabled: false },
                        { name: "Browser", enabled: true },
                        { name: "Mobile Push", enabled: false }
                      ]
                    }
                  ].map((section, i) => (
                    <div key={i} className="space-y-3">
                      <div>
                        <h4 className="font-medium text-slate-900">{section.category}</h4>
                        <p className="text-sm text-slate-600">{section.description}</p>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        {section.settings.map((setting, j) => (
                          <label key={j} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                            <input
                              type="checkbox"
                              defaultChecked={setting.enabled}
                              className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                            />
                            <span className="text-sm font-medium text-slate-700">{setting.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Integrations
                </h2>
                <p className="text-slate-600 text-sm">Connect with your favorite tools and services</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {mockIntegrations.map((integration, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <h4 className="font-medium text-slate-900">{integration.name}</h4>
                          <p className="text-sm text-slate-600">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {integration.connected ? (
                          <>
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              <Check className="w-3 h-3 mr-1" />
                              Connected
                            </span>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm">
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center">
                      <Key className="w-5 h-5 mr-2" />
                      API Keys
                    </h2>
                    <p className="text-slate-600 text-sm">Manage API keys for programmatic access</p>
                  </div>
                  <Button className="gradient-brand">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Key
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockApiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-slate-900">{key.name}</h4>
                          <code className="px-2 py-1 text-xs bg-slate-100 rounded font-mono">
                            {key.masked}
                          </code>
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          Last used: {key.lastUsed} • Created: {key.created}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" title="Copy">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Regenerate">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200">
              <div className="p-6 border-b border-red-200">
                <h2 className="text-lg font-semibold text-red-900 flex items-center">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Danger Zone
                </h2>
                <p className="text-red-700 text-sm">Irreversible actions that affect your account</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium text-red-900">Delete Organization</h4>
                    <p className="text-sm text-red-700">
                      Permanently delete your organization and all associated data
                    </p>
                  </div>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                    Delete Organization
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}