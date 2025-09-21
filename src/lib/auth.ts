import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Development bypass
        if (
          process.env.SKIP_AUTH === "true" &&
          credentials.email === "dev@cout.ai"
        ) {
          return {
            id: "dev-user",
            email: "dev@cout.ai",
            name: "Development User",
            role: "ADMIN",
            orgId: "dev-org",
            orgSlug: "dev-org", // Add missing orgSlug
          };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { org: true },
          });

          if (
            user &&
            user.password &&
            (await bcrypt.compare(credentials.password, user.password))
          ) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              orgId: user.orgId,
              orgSlug: user.org.slug,
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
          // If database tables don't exist, return null instead of crashing
          if (error && typeof error === 'object' && 'code' in error && error.code === 'P2021') {
            console.error("Database tables not found. Please ensure migrations have been run.");
            return null;
          }
        }

        return null;
      },
    }),
    // Only include Google provider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.orgId = user.orgId;
        token.orgSlug = user.orgSlug || ""; // Handle potential undefined
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.orgId = token.orgId as string;
        session.user.orgSlug = token.orgSlug as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Handle Google OAuth sign-in
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user and org for Google sign-in
            const orgName = user.name?.split(" ")[0] + "'s Organization";
            const orgSlug =
              user.name?.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-org";

            const org = await prisma.org.create({
              data: {
                name: orgName,
                slug: orgSlug,
                primaryColor: "#0ea5e9",
                secondaryColor: "#f1f5f9",
              },
            });

            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                role: "ADMIN",
                orgId: org.id,
                password: "", // No password for OAuth users
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
