# cout.ai - Bespoke AI Agent Platform

A complete multi-tenant SaaS application for deploying custom AI agents tailored to enterprise workflows. Built with Next.js 14, TypeScript, Prisma, and modern web technologies.

## 🚀 Features

- **Multi-tenant Architecture**: Complete org isolation with role-based access control
- **Custom AI Agents**: Pre-built templates for Research, Marketing, Finance, Customer Support, Content, and Analytics
- **Real-time Chat Interface**: Interactive messaging with AI agents
- **Subscription Management**: Stripe integration with tiered plans and credit system
- **Usage Analytics**: Detailed tracking and reporting dashboards
- **Admin Portal**: Super admin tools for managing organizations and users
- **Enterprise Security**: GDPR compliant with audit logging and data encryption
- **Queue System**: Background job processing with Redis and BullMQ

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Cache/Queue**: Redis (Upstash recommended)
- **Payments**: Stripe subscriptions + webhooks
- **Auth**: NextAuth.js with Google OAuth + credentials
- **Deployment**: Vercel (frontend) + Fly.io/Render (worker)

## 📋 Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Redis instance (Upstash recommended)
- Stripe account
- Google OAuth credentials

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd cout-ai
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in your environment variables:

- Database URL (Neon, Supabase, or local PostgreSQL)
- Redis credentials (Upstash recommended)
- Stripe keys and webhook secret
- NextAuth secret and Google OAuth credentials

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm db:migrate

# Seed demo data
pnpm db:seed
```

### 4. Start Development

```bash
# Start Next.js dev server
pnpm dev

# Start worker (in separate terminal)
pnpm worker
```

Visit `http://localhost:3000` and login with:

- **Admin**: admin@demo.com / admin123
- **Super Admin**: superadmin@cout.ai / superadmin123

## 🏗 Project Structure

```
cout-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── admin/             # Super admin portal
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   └── chat/              # Chat interface
│   ├── lib/                   # Utilities and configs
│   └── types/                 # TypeScript definitions
├── prisma/                    # Database schema and migrations
├── worker/                    # Background job processor
└── public/                    # Static assets
```

## 🔧 Configuration

### Stripe Setup

1. Create products in Stripe dashboard:

   - Basic Plan: $29/month, 100 credits
   - Pro Plan: $99/month, 1000 credits
   - Enterprise Plan: $299/month, 5000 credits

2. Set up webhook endpoint: `/api/webhooks/stripe`

3. Configure webhook events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Redis Queue

The application uses BullMQ for job processing. Ensure your Redis instance supports:

- Pub/Sub
- Streams
- Key expiration

## 🔐 Security Features

- **Multi-tenant isolation**: All data scoped by `orgId`
- **Role-based access**: USER, MANAGER, ADMIN, SUPERADMIN
- **Audit logging**: All sensitive actions logged
- **Rate limiting**: Per-user and per-org limits
- **Data encryption**: Sensitive data encrypted at rest

## 📊 Usage Tracking

The system tracks:

- Credit consumption per job
- Monthly usage buckets per organization
- Individual user activity
- System-wide analytics for admins

## 🚀 Deployment

### Vercel (Frontend)

```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
```

### Fly.io (Worker)

Create `fly.toml`:

```toml
app = "cout-ai-worker"

[build]
  builder = "paketobuildpacks/builder:base"

[[services]]
  internal_port = 3001
  protocol = "tcp"
```

Deploy worker:

```bash
fly deploy
```

## 🧪 Testing

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Test database connection
pnpm prisma studio
```

## 📈 Monitoring

- Check worker logs: `fly logs -a cout-ai-worker`
- Monitor Redis: Use Redis CLI or web interface
- Track errors: Implement Sentry or similar service
- Database health: Use Prisma Studio or database monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

Private - All rights reserved

## 🆘 Support

For support, contact: support@cout.ai

---

Built with ❤️ by the cout.ai team
