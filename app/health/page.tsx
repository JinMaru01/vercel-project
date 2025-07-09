"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, AlertCircle, XCircle, Activity, Server, Database, Globe } from "lucide-react"

interface HealthData {
  status: string
  timestamp: string
  uptime: number
  environment: string
  version: string
  responseTime?: number
  services?: {
    database: string
    api: string
    storage: string
  }
  checks?: {
    database: { status: string; responseTime: number; details?: string }
    externalAPI: { status: string; responseTime: number; details?: string }
    fileSystem: { status: string; details?: string }
  }
  memory: {
    used: number
    total: number
    percentage?: number
  }
  system: {
    platform: string
    nodeVersion: string
    pid: number
    cpu?: {
      loadAverage: number[]
      platform: string
      arch: string
    }
    node?: {
      version: string
      pid: number
    }
  }
  deployment?: {
    region: string
    deploymentId: string
    gitCommit: string
  }
}

export default function HealthPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [detailedData, setDetailedData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchHealthData = async () => {
    setLoading(true)
    try {
      const [basicResponse, detailedResponse] = await Promise.all([
        fetch("/api/health", { cache: "no-store" }),
        fetch("/api/health/detailed", { cache: "no-store" }),
      ])

      if (basicResponse.ok) {
        const basicData = await basicResponse.json()
        setHealthData(basicData)
      }

      if (detailedResponse.ok) {
        const detailedData = await detailedResponse.json()
        setDetailedData(detailedData)
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch health data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variant = status === "healthy" ? "default" : status === "degraded" ? "secondary" : "destructive"
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.toUpperCase()}
      </Badge>
    )
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor application status and performance</p>
        </div>
        <Button onClick={fetchHealthData} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {lastUpdated && <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</div>}

      {/* Basic Health Status */}
      {healthData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">{getStatusBadge(healthData.status)}</div>
              <p className="text-xs text-muted-foreground mt-2">Environment: {healthData.environment}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatUptime(healthData.uptime)}</div>
              <p className="text-xs text-muted-foreground">Since last restart</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.memory.used} MB</div>
              <p className="text-xs text-muted-foreground">
                {healthData.memory.percentage ? `${healthData.memory.percentage}% of ` : ""}
                {healthData.memory.total} MB total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Version</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.version}</div>
              <p className="text-xs text-muted-foreground">Node.js {healthData.system.nodeVersion}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Services Status */}
      {healthData?.services && (
        <Card>
          <CardHeader>
            <CardTitle>Services Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(healthData.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium capitalize">{service}</span>
                  {getStatusBadge(status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Health Checks */}
      {detailedData?.checks && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(detailedData.checks).map(([checkName, checkData]) => (
                <div key={checkName} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">{checkName.replace(/([A-Z])/g, " $1")}</span>
                      {getStatusBadge(checkData.status)}
                    </div>
                    {checkData.details && <p className="text-sm text-muted-foreground">{checkData.details}</p>}
                  </div>
                  {"responseTime" in checkData && (
                    <div className="text-right">
                      <div className="text-sm font-medium">{checkData.responseTime}ms</div>
                      <div className="text-xs text-muted-foreground">Response time</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Information */}
      {detailedData && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Platform:</span>
                <span className="font-medium">{detailedData.system.platform}</span>
              </div>
              <div className="flex justify-between">
                <span>Architecture:</span>
                <span className="font-medium">{detailedData.system.cpu?.arch || "unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span>Process ID:</span>
                <span className="font-medium">{detailedData.system.pid}</span>
              </div>
              {detailedData.system.cpu?.loadAverage && (
                <div className="flex justify-between">
                  <span>Load Average:</span>
                  <span className="font-medium">
                    {detailedData.system.cpu.loadAverage.map((load) => load.toFixed(2)).join(", ")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {detailedData.deployment && (
            <Card>
              <CardHeader>
                <CardTitle>Deployment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Region:</span>
                  <span className="font-medium">{detailedData.deployment.region}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deployment ID:</span>
                  <span className="font-medium text-xs">{detailedData.deployment.deploymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Git Commit:</span>
                  <span className="font-medium text-xs">{detailedData.deployment.gitCommit}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
