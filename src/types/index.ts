// src/types/index.ts

export type UserRole = "USER" | "MANAGER" | "ADMIN" | "SUPERADMIN";

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  colorScheme?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  orgId: string;
}

export interface Agent {
  id: string;
  name: string;
  config: Record<string, any>; // JSON config for the agent
  orgId: string;
}

export interface Job {
  id: string;
  userId: string;
  agentId: string;
  input: string;
  output: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  orgId: string;
  stripeId: string;
  plan: string; // e.g., 'Basic', 'Pro', 'Enterprise'
  status: "active" | "canceled" | "past_due";
  trialEnd?: Date;
  currentPeriodEnd: Date;
}

export interface Usage {
  id: string;
  userId: string;
  creditsUsed: number;
  createdAt: Date;
}

export interface UsageBucket {
  id: string;
  orgId: string;
  totalCredits: number;
  creditsUsed: number;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  key: string;
  orgId: string;
  createdAt: Date;
}

import {
  User,
  Org,
  Agent,
  Job,
  Subscription,
  Role,
  AgentType,
  JobStatus,
  SubscriptionPlan,
} from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      orgId: string;
      orgSlug: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    orgId: string;
    orgSlug: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    orgId: string;
    orgSlug: string;
  }
}

export interface UserWithOrg extends User {
  org: Org & {
    subscription?: Subscription | null;
    agents?: Agent[];
  };
}

export interface JobWithRelations extends Job {
  user: User;
  agent: Agent;
}

export interface AgentConfig {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  model: string;
}

export interface UsageData {
  date: string;
  credits: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export type {
  User,
  Org,
  Agent,
  Job,
  Subscription,
  Role,
  AgentType,
  JobStatus,
  SubscriptionPlan,
};
