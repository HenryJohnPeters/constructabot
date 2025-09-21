import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create development organization
  const devOrg = await prisma.org.upsert({
    where: { slug: "dev-org" },
    update: {},
    create: {
      id: "dev-org",
      name: "Development Organization",
      slug: "dev-org",
      primaryColor: "#0ea5e9",
      secondaryColor: "#f1f5f9",
    },
  });

  // Create demo organization
  const demoOrg = await prisma.org.upsert({
    where: { slug: "demo-company" },
    update: {},
    create: {
      name: "Demo Company",
      slug: "demo-company",
      primaryColor: "#0ea5e9",
      secondaryColor: "#f1f5f9",
    },
  });

  // Create development user (for bypass)
  await prisma.user.upsert({
    where: { email: "dev@cout.ai" },
    update: {},
    create: {
      id: "dev-user",
      email: "dev@cout.ai",
      name: "Development User",
      password: await bcrypt.hash("dev", 12),
      role: "ADMIN",
      orgId: devOrg.id,
    },
  });

  // Create demo admin user
  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      name: "Demo Admin",
      password: await bcrypt.hash("admin123", 12),
      role: "ADMIN",
      orgId: demoOrg.id,
    },
  });

  // Create demo regular user
  await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: {
      email: "user@demo.com",
      name: "Demo User",
      password: await bcrypt.hash("user123", 12),
      role: "USER",
      orgId: demoOrg.id,
    },
  });

  // Create trial subscriptions
  await prisma.subscription.upsert({
    where: { orgId: devOrg.id },
    update: {},
    create: {
      stripeId: `trial_${devOrg.id}`,
      plan: "PRO",
      status: "active",
      credits: 1000,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      orgId: devOrg.id,
    },
  });

  await prisma.subscription.upsert({
    where: { orgId: demoOrg.id },
    update: {},
    create: {
      stripeId: `trial_${demoOrg.id}`,
      plan: "BASIC",
      status: "trialing",
      credits: 100,
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      orgId: demoOrg.id,
    },
  });

  // Create default agents for both orgs
  const agents = [
    {
      name: "Research Assistant",
      description: "Deep research and market analysis specialist",
      category: "RESEARCH",
      config: JSON.stringify({
        systemPrompt:
          "You are a research assistant that provides thorough analysis and insights.",
        temperature: 0.7,
        maxTokens: 1000,
        model: "gpt-4",
      }),
    },
    {
      name: "Marketing Expert",
      description: "Content creation and marketing strategy specialist",
      category: "MARKETING",
      config: JSON.stringify({
        systemPrompt:
          "You are a marketing expert focused on growth and engagement strategies.",
        temperature: 0.8,
        maxTokens: 1200,
        model: "gpt-4",
      }),
    },
    {
      name: "Finance Analyst",
      description: "Financial modeling and business insights",
      category: "FINANCE",
      config: JSON.stringify({
        systemPrompt:
          "You are a finance expert providing detailed financial analysis and recommendations.",
        temperature: 0.6,
        maxTokens: 1000,
        model: "gpt-4",
      }),
    },
    {
      name: "Customer Support",
      description: "Intelligent customer assistance and support",
      category: "CUSTOMER_SUPPORT",
      config: JSON.stringify({
        systemPrompt:
          "You are a helpful customer support agent focused on solving customer issues.",
        temperature: 0.7,
        maxTokens: 800,
        model: "gpt-3.5-turbo",
      }),
    },
  ];

  // Clear existing agents to avoid duplicates
  await prisma.agent.deleteMany({
    where: {
      orgId: {
        in: [demoOrg.id, devOrg.id],
      },
    },
  });

  for (const agent of agents) {
    // Create for demo org
    await prisma.agent.create({
      data: {
        ...agent,
        orgId: demoOrg.id,
      },
    });

    // Create for dev org
    await prisma.agent.create({
      data: {
        ...agent,
        orgId: devOrg.id,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log("🔐 Demo credentials:");
  console.log("   Admin: admin@demo.com / admin123");
  console.log("   User:  user@demo.com / user123");
  console.log("   Dev:   dev@cout.ai / dev (bypass mode)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
