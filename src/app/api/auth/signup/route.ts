import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  orgName: z.string().min(1),
  orgSlug: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, orgName, orgSlug } =
      signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Check if org slug is taken
    const existingOrg = await prisma.org.findUnique({
      where: { slug: orgSlug },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization name is taken" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create org and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const org = await tx.org.create({
        data: {
          name: orgName,
          slug: orgSlug,
          primaryColor: "#0ea5e9",
          secondaryColor: "#f1f5f9",
        },
      });

      // Create user as admin of the org
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
          orgId: org.id,
        },
      });

      // Create trial subscription
      const subscription = await tx.subscription.create({
        data: {
          stripeId: `trial_${org.id}`,
          plan: "BASIC",
          status: "trialing",
          credits: 100,
          currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          orgId: org.id,
        },
      });

      // Create default agents
      const defaultAgents = [
        {
          name: "Research Assistant",
          description: "Deep research and market analysis",
          category: "RESEARCH" as const,
          config: JSON.stringify({
            systemPrompt:
              "You are a research assistant that provides thorough analysis.",
            temperature: 0.7,
            maxTokens: 1000,
            model: "gpt-4",
          }),
        },
        {
          name: "Marketing Expert",
          description: "Content creation and marketing strategy",
          category: "MARKETING" as const,
          config: JSON.stringify({
            systemPrompt:
              "You are a marketing expert focused on growth and engagement.",
            temperature: 0.8,
            maxTokens: 1200,
            model: "gpt-4",
          }),
        },
      ];

      for (const agent of defaultAgents) {
        await tx.agent.create({
          data: {
            ...agent,
            orgId: org.id,
          },
        });
      }

      // Log audit
      await tx.auditLog.create({
        data: {
          action: "ORG_CREATED",
          resource: `org:${org.id}`,
          userId: user.id,
          orgId: org.id,
          metadata: JSON.stringify({ orgName, userEmail: email }),
        },
      });

      return { org, user };
    });

    return NextResponse.json({
      success: true,
      data: { orgId: result.org.id, userId: result.user.id },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Handle database table not found errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2021"
    ) {
      console.error(
        "Database tables not found. Please ensure migrations have been run."
      );
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
