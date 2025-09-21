// src/types/index.ts
import { User, Org, Agent, Job, Subscription } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type UserRole = "USER" | "MANAGER" | "ADMIN" | "SUPERADMIN";

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
    role: string;
    orgId: string;
    orgSlug?: string;
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

// Re-export Prisma types
export type { User, Org, Agent, Job, Subscription };
