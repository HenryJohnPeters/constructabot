import { Worker, Job } from "bullmq";
import { prisma } from "../src/lib/prisma";
import Redis from "ioredis";

// Lazy Redis connection - only connect when worker actually starts
let redisConnection: Redis | null = null;

function getRedisConnection() {
  if (!redisConnection) {
    redisConnection = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
    });
  }
  return redisConnection;
}

interface JobData {
  jobId: string;
  prompt: string;
  agentConfig: any;
  orgId: string;
  userId: string;
}

// Mock AI service - replace with actual Relevance AI integration
async function callAIService(prompt: string, config: any): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 3000)
  );

  // Mock responses based on agent type
  const responses = {
    RESEARCH: `Based on my research analysis of "${prompt}", here are the key findings:\n\n1. Market trends indicate...\n2. Key competitors include...\n3. Recommended next steps...`,
    MARKETING: `Marketing strategy for "${prompt}":\n\n✅ Target audience: ...\n✅ Key messaging: ...\n✅ Channel recommendations: ...\n✅ Budget allocation: ...`,
    FINANCE: `Financial analysis for "${prompt}":\n\n📊 Revenue projections: ...\n📊 Cost breakdown: ...\n📊 ROI estimates: ...\n📊 Risk assessment: ...`,
    CUSTOMER_SUPPORT: `Customer support response for "${prompt}":\n\nI understand your concern. Let me help you with this issue...\n\nSteps to resolve:\n1. ...\n2. ...\n3. ...`,
    CONTENT: `Content created for "${prompt}":\n\n[Generated content would appear here with proper formatting, engaging copy, and SEO optimization...]`,
    ANALYTICS: `Data analysis for "${prompt}":\n\n📈 Key metrics: ...\n📈 Trends identified: ...\n📈 Actionable insights: ...\n📈 Recommendations: ...`,
  };

  return (
    responses[config.category as keyof typeof responses] ||
    `AI response for: ${prompt}\n\nThis is a mock response. In production, this would call the actual Relevance AI API with the configured parameters.`
  );
}

// Only create worker if this file is run directly (not imported during build)
if (require.main === module) {
  const redis = getRedisConnection();

  const worker = new Worker(
    "ai-jobs",
    async (job: Job<JobData>) => {
      const { jobId, prompt, agentConfig, orgId, userId } = job.data;

      try {
        console.log(`Processing job ${jobId} for org ${orgId}`);

        // Update job status to processing
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "PROCESSING" },
        });

        // Call AI service (mock implementation)
        const output = await callAIService(prompt, agentConfig);

        // Update job with output
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "COMPLETED",
            output,
          },
        });

        // Deduct credits from organization
        await prisma.subscription.update({
          where: { orgId },
          data: { credits: { decrement: 1 } },
        });

        // Track usage
        await prisma.usage.create({
          data: {
            credits: 1,
            action: "AI_JOB_COMPLETED",
            userId,
            orgId,
          },
        });

        // Update usage bucket
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        await prisma.usageBucket.upsert({
          where: {
            orgId_month: {
              orgId,
              month: currentMonth,
            },
          },
          update: {
            totalCredits: { increment: 1 },
          },
          create: {
            orgId,
            month: currentMonth,
            totalCredits: 1,
          },
        });

        // Log audit
        await prisma.auditLog.create({
          data: {
            action: "JOB_COMPLETED",
            resource: `job:${jobId}`,
            userId,
            orgId,
            metadata: JSON.stringify({ credits: 1, outputLength: output.length }),
          },
        });

        console.log(`Job ${jobId} completed successfully`);
      } catch (error) {
        console.error(`Job ${jobId} failed:`, error);

        // Update job status to failed
        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "FAILED",
            output: "An error occurred while processing your request.",
          },
        });

        // Log audit
        await prisma.auditLog.create({
          data: {
            action: "JOB_FAILED",
            resource: `job:${jobId}`,
            userId,
            orgId,
            metadata: JSON.stringify({
              error: error instanceof Error ? error.message : "Unknown error",
            }),
          },
        });

        throw error;
      }
    },
    { connection: redis }
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
  });

  console.log("🚀 AI Jobs Worker started");

  process.on("SIGINT", async () => {
    console.log("Shutting down worker...");
    await worker.close();
    await redis.disconnect();
    process.exit(0);
  });
}
