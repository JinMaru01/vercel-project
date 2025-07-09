import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      message: "pong",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  )
}
