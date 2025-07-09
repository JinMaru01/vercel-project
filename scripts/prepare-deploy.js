const fs = require("fs")
const path = require("path")

console.log("🚀 Preparing for Yarn deployment...")

// Remove conflicting lock files
const lockFiles = ["package-lock.json", "pnpm-lock.yaml"]

lockFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`🗑️  Removing ${file}...`)
    fs.unlinkSync(filePath)
  }
})

// Ensure yarn.lock exists
const yarnLockPath = path.join(process.cwd(), "yarn.lock")
if (!fs.existsSync(yarnLockPath)) {
  console.log("📦 Generating yarn.lock...")
  const { execSync } = require("child_process")
  try {
    execSync("yarn install --frozen-lockfile", { stdio: "inherit" })
  } catch (error) {
    console.log("📦 Running yarn install to generate lock file...")
    execSync("yarn install", { stdio: "inherit" })
  }
}

// Check for .npmrc
const npmrcPath = path.join(process.cwd(), ".npmrc")
if (!fs.existsSync(npmrcPath)) {
  console.log("⚙️  Creating .npmrc...")
  fs.writeFileSync(
    npmrcPath,
    `# Yarn configuration
package-manager=yarn
enable-pnpm=false
`,
  )
}

console.log("✅ Yarn deployment preparation complete!")
console.log("📝 Next steps:")
console.log("   1. git add .")
console.log("   2. git commit -m 'Configure project for Yarn deployment'")
console.log("   3. git push")
