import { NextResponse } from "next/server"

// Simulate checking various services
async function checkDatabase(): Promise<{ status: string; responseTime: number; details?: string }> {
  const start = Date.now()
  try {
    // Simulate database connection check
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100))
    return {
      status: "healthy",
      responseTime: Date.now() - start,
      details: "Mock database connection successful",
    }
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: Date.now() - start,
      details: error instanceof Error ? error.message : "Database connection failed",
    }
  }
}

async function checkExternalAPI(): Promise<{ status: string; responseTime: number; details?: string }> {
  const start = Date.now()
  try {
    // Simulate external API check
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 200))
    return {
      status: "healthy",
      responseTime: Date.now() - start,
      details: "External services responding",
    }
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: Date.now() - start,
      details: error instanceof Error ? error.message : "External API check failed",
    }
  }
}

async function checkFileSystem(): Promise<{ status: string; details?: string }> {
  try {
    // Check if we can access the file system
    const fs = await import("fs/promises")
    await fs.access("/tmp")
    return {
      status: "healthy",
      details: "File system accessible",
    }
  } catch (error) {
    return {
      status: "unhealthy",
      details: error instanceof Error ? error.message : "File system check failed",
    }
  }
}

export async function GET() {
  try {
    const startTime = Date.now()

    // Run all health checks in parallel
    const [databaseCheck, apiCheck, fileSystemCheck] = await Promise.all([
      checkDatabase(),
      checkExternalAPI(),
      checkFileSystem(),
    ])

    const totalResponseTime = Date.now() - startTime

    // Determine overall health status
    const allChecks = [databaseCheck, apiCheck, fileSystemCheck]
    const overallStatus = allChecks.every((check) => check.status === "healthy") ? "healthy" : "degraded"

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: totalResponseTime,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      checks: {
        database: databaseCheck,
        externalAPI: apiCheck,
        fileSystem: fileSystemCheck,
      },
      system: {
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
          percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100),
        },
        cpu: {
          loadAverage: process.platform !== "win32" ? require("os").loadavg() : [0, 0, 0],
          platform: process.platform,
          arch: process.arch,
        },
        node: {
          version: process.version,
          pid: process.pid,
        },
      },
      deployment: {
        region: process.env.VERCEL_REGION || "unknown",
        deploymentId: process.env.VERCEL_DEPLOYMENT_ID || "local",
        gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
      },
    }

    const statusCode = overallStatus === "healthy" ? 200 : 207 // 207 Multi-Status for degraded

    return NextResponse.json(healthData, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Detailed health check failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        uptime: process.uptime(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}
