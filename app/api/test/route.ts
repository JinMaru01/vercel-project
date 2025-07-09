import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "API is working correctly",
    timestamp: new Date().toISOString(),
    method: "GET",
    status: "success",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({
      message: "POST request received successfully",
      timestamp: new Date().toISOString(),
      method: "POST",
      receivedData: body,
      status: "success",
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to parse request body",
        timestamp: new Date().toISOString(),
        method: "POST",
        error: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      { status: 400 },
    )
  }
}
