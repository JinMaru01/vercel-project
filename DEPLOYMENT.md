# Deployment Guide - Yarn Configuration

## Package Manager: Yarn

This project is configured to use Yarn for consistent dependency management.

### Local Development Setup:

1. **Install Yarn (if not already installed):**
   \`\`\`bash
   npm install -g yarn
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   yarn install
   \`\`\`

3. **Run development server:**
   \`\`\`bash
   yarn dev
   \`\`\`

### Deployment Steps:

1. **Prepare for deployment:**
   \`\`\`bash
   yarn prepare-deploy
   \`\`\`

2. **Test build locally:**
   \`\`\`bash
   yarn test-build
   \`\`\`

3. **Commit and push:**
   \`\`\`bash
   git add .
   git commit -m "Configure project for Yarn deployment"
   git push
   \`\`\`

### Vercel Configuration:

The project includes:
- `vercel.json` - Specifies `yarn install` and `yarn build`
- `package.json` - Sets `packageManager: "yarn@1.22.19"`
- `.vercelignore` - Excludes npm/pnpm lock files
- `.gitignore` - Only tracks `yarn.lock`

### Available Scripts:

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript checks
- `yarn test-build` - Test build locally
- `yarn prepare-deploy` - Prepare for deployment

### Troubleshooting:

If deployment fails:

1. **Ensure only yarn.lock exists:**
   \`\`\`bash
   rm -f package-lock.json pnpm-lock.yaml
   yarn install
   \`\`\`

2. **Clear Vercel cache:**
   - Go to Vercel dashboard
   - Redeploy without cache

3. **Manual deployment:**
   \`\`\`bash
   yarn global add vercel
   vercel --prod
   \`\`\`

### File Structure:

- `yarn.lock` ✅ (tracked)
- `package-lock.json` ❌ (ignored)
- `pnpm-lock.yaml` ❌ (ignored)
