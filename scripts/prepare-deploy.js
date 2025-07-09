const fs = require("fs")
const path = require("path")

console.log("🚀 Preparing for deployment...")

// Remove conflicting lock files
const lockFiles = ["yarn.lock", "pnpm-lock.yaml"]

lockFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`🗑️  Removing ${file}...`)
    fs.unlinkSync(filePath)
  }
})

// Ensure package-lock.json exists
const packageLockPath = path.join(process.cwd(), "package-lock.json")
if (!fs.existsSync(packageLockPath)) {
  console.log("📦 Generating package-lock.json...")
  const { execSync } = require("child_process")
  execSync("npm install --package-lock-only", { stdio: "inherit" })
}

// Check for .npmrc
const npmrcPath = path.join(process.cwd(), ".npmrc")
if (!fs.existsSync(npmrcPath)) {
  console.log("⚙️  Creating .npmrc...")
  fs.writeFileSync(
    npmrcPath,
    `# Force npm as package manager
package-manager=npm
enable-pnpm=false
save-exact=false
package-lock=true
`,
  )
}

console.log("✅ Deployment preparation complete!")
console.log("📝 Next steps:")
console.log("   1. git add .")
console.log("   2. git commit -m 'Fix package manager configuration'")
console.log("   3. git push")
