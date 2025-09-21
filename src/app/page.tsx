import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Zap,
  Shield,
  BarChart3,
  Bot,
  Sparkles,
  Users,
  Clock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center animate-pulse-glow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">cout.ai</span>
            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
              BETA
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="gradient-brand">Get Started</Button>
            </Link>
            {/* Development bypass button */}
            <Link href="/dashboard">
              <Button variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200">
                🚀 Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-brand-50 px-4 py-2 rounded-full border border-brand-200">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-sm text-brand-700 font-medium">
                Custom AI Agents for Enterprise
              </span>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Bespoke AI Agents
            <br />
            <span className="text-brand-600">Tailored for Your Business</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Deploy intelligent AI agents customized to your workflow. Research,
            marketing, finance, customer support - all powered by cutting-edge
            AI models with enterprise-grade security.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 gradient-brand text-lg h-12">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg h-12">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose cout.ai?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built for enterprises that need custom AI solutions with
              enterprise-grade reliability
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-200 transition-colors">
                <Zap className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-slate-600">
                Get results in seconds with our optimized AI pipeline and queue
                system
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-200 transition-colors">
                <Shield className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Enterprise Security
              </h3>
              <p className="text-slate-600">
                SOC2 compliant with end-to-end encryption and GDPR compliance
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-200 transition-colors">
                <BarChart3 className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-slate-600">
                Track usage, ROI, and performance with detailed insights and
                reporting
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-200 transition-colors">
                <Bot className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Agent</h3>
              <p className="text-slate-600">
                Deploy multiple specialized agents for different business
                functions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Pre-Built Agent Templates
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Research Assistant",
                desc: "Deep research and analysis",
                icon: "🔍",
              },
              {
                name: "Marketing Expert",
                desc: "Content creation and strategy",
                icon: "📈",
              },
              {
                name: "Finance Analyst",
                desc: "Financial modeling and insights",
                icon: "💰",
              },
              {
                name: "Customer Support",
                desc: "Intelligent customer assistance",
                icon: "🎧",
              },
              {
                name: "Content Creator",
                desc: "Blog posts, social media, copy",
                icon: "✍️",
              },
              {
                name: "Data Analyst",
                desc: "Extract insights from your data",
                icon: "📊",
              },
            ].map((agent, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-300 transition-colors"
              >
                <div className="text-3xl mb-4">{agent.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                <p className="text-slate-600">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-brand-400 mb-2">50K+</div>
              <div className="text-slate-300">AI Tasks Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-400 mb-2">
                99.9%
              </div>
              <div className="text-slate-300">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-400 mb-2">500+</div>
              <div className="text-slate-300">Enterprise Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-400 mb-2">24/7</div>
              <div className="text-slate-300">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 gradient-brand rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">cout.ai</span>
              </div>
              <p className="text-slate-400">
                Next-generation AI agents for enterprise workflows
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/features" className="hover:text-brand-400">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-brand-400">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-brand-400">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-brand-400">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-brand-400">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-brand-400">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-brand-400">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-brand-400">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-brand-400">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 cout.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
