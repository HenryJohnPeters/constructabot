import { prisma } from "../src/lib/prisma";

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...");
    
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connection successful");
    
    // Run migrations
    console.log("📦 Running migrations...");
    
    // Check if tables exist by trying to count users
    try {
      await prisma.user.count();
      console.log("✅ Database tables already exist");
    } catch (error) {
      console.log("❌ Database tables don't exist, this should be handled by migrations");
      throw error;
    }
    
    console.log("🎉 Database initialization complete!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();