"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  BarChart3,
  Settings,
  Users,
  CreditCard,
  LogOut,
  Menu,
  Bot,
  FileText,
  Zap,
  Shield,
} from "lucide-react";
import { UserWithOrg } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserWithOrg;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Agents", href: "/dashboard/agents", icon: Bot },
  { name: "Jobs", href: "/dashboard/jobs", icon: FileText },
  { name: "Usage", href: "/dashboard/usage", icon: Zap },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
  user,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
          <SidebarContent
            navigation={navigation}
            pathname={pathname}
            user={user}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:w-64 lg:flex lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r">
          <SidebarContent
            navigation={navigation}
            pathname={pathname}
            user={user}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col flex-1">
        {/* Top bar */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Welcome back, {user.name || user.email}
              </h1>
              <p className="text-sm text-slate-600">{user.org.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-brand-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-brand-700">
                {user.org.subscription?.credits || 0} credits
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-slate-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  navigation,
  pathname,
  user,
}: {
  navigation: typeof navigation;
  pathname: string;
  user: UserWithOrg;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center space-x-3 px-6 py-4 border-b">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: user.org.primaryColor }}
        >
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{user.org.name}</p>
          <p className="text-xs text-slate-500">cout.ai</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-100 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user.name || user.email}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {user.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
