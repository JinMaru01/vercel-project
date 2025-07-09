# Expense Tracker

A modern expense tracking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 💰 Multi-currency support (USD, KHR)
- 📱 Mobile-responsive design
- 📊 Dashboard with analytics
- 💳 Wallet management
- 📥 CSV export functionality
- 🔄 Pull-to-refresh on mobile
- 🏥 Health check endpoints

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000)

### Testing Build Locally

Before deploying, test the build locally:

\`\`\`bash
npm run test-build
\`\`\`

### Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy on every push to main

#### Manual Deployment

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

## API Endpoints

- `/api/health` - Basic health check
- `/api/health/detailed` - Detailed system health
- `/api/ping` - Simple connectivity test
- `/api/test` - API functionality test

## Health Dashboard

Visit `/health` to see the system status dashboard.

## Project Structure

\`\`\`
├── app/
│   ├── api/          # API routes
│   ├── health/       # Health dashboard
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
├── data/            # Mock data and utilities
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── scripts/         # Build and deployment scripts
\`\`\`

## Environment Variables

See `.env.example` for required environment variables.

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Deployment**: Vercel
