# Deployment Troubleshooting Guide

## Current Issue: pnpm install error

The error occurs because Vercel is trying to use pnpm instead of npm.

### Solution Steps:

1. **Run the preparation script:**
   \`\`\`bash
   npm run prepare-deploy
   \`\`\`

2. **Commit and push changes:**
   \`\`\`bash
   git add .
   git commit -m "Fix package manager configuration for Vercel"
   git push
   \`\`\`

3. **Alternative: Manual Vercel CLI deployment:**
   \`\`\`bash
   npm install -g vercel
   vercel --prod
   \`\`\`

### Files that fix the issue:

- \`.npmrc\` - Forces npm usage
- \`vercel.json\` - Explicitly sets install command
- \`package.json\` - Specifies packageManager
- \`.gitignore\` - Excludes conflicting lock files

### If still failing:

1. **Clear Vercel cache:**
   - Go to Vercel dashboard
   - Project Settings → Functions
   - Clear deployment cache

2. **Check for conflicting files:**
   - Ensure no \`pnpm-lock.yaml\` in repository
   - Ensure no \`yarn.lock\` in repository
   - Only \`package-lock.json\` should exist

3. **Manual deployment:**
   \`\`\`bash
   vercel --prod --force
   \`\`\`

### Environment Variables:

Make sure these are set in Vercel dashboard if needed:
- \`NODE_ENV=production\`
- Any custom API keys or database URLs

### Build Command Override:

If automatic detection fails, set in Vercel dashboard:
- **Install Command:** \`npm install\`
- **Build Command:** \`npm run build\`
- **Output Directory:** \`.next\`
\`\`\`
