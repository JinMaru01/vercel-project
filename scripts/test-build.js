const { execSync } = require("child_process")

console.log("🔍 Testing local build...")

try {
  // Clean previous builds
  console.log("🧹 Cleaning previous builds...")
  execSync("rm -rf .next", { stdio: "inherit" })

  // Install dependencies
  console.log("📦 Installing dependencies...")
  execSync("npm install", { stdio: "inherit" })

  // Type check
  console.log("🔍 Type checking...")
  execSync("npm run type-check", { stdio: "inherit" })

  // Build
  console.log("🏗️ Building application...")
  execSync("npm run build", { stdio: "inherit" })

  console.log("✅ Build successful! Ready for deployment.")
} catch (error) {
  console.error("❌ Build failed:", error.message)
  process.exit(1)
}
