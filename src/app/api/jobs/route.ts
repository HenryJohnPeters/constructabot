import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Queue } from "bullmq";
import { z } from "zod";

const redis = new (require("ioredis"))({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const jobQueue = new Queue("ai-jobs", { connection: redis });

const createJobSchema = z.object({
  prompt: z.string().min(1).max(5000),
  agentId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, agentId } = createJobSchema.parse(body);

    // Check if user has credits
    const org = await prisma.org.findUnique({
      where: { id: session.user.orgId },
      include: { subscription: true },
    });

    if (!org?.subscription || org.subscription.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    // Verify agent belongs to org
    const agent = await prisma.agent.findFirst({
      where: { id: agentId, orgId: session.user.orgId },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        prompt,
        userId: session.user.id,
        orgId: session.user.orgId,
        agentId,
        status: "PENDING",
      },
    });

    // Add to queue
    await jobQueue.add("process-ai-job", {
      jobId: job.id,
      prompt,
      agentConfig: agent.config,
      orgId: session.user.orgId,
      userId: session.user.id,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: "JOB_CREATED",
        resource: `job:${job.id}`,
        userId: session.user.id,
        orgId: session.user.orgId,
        metadata: JSON.stringify({ agentId, prompt: prompt.slice(0, 100) }),
      },
    });

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      where: { orgId: session.user.orgId },
      include: { agent: true, user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
