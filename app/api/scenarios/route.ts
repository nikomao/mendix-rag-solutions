import { NextResponse } from "next/server";
import { listScenarios } from "@/lib/scenario-db";

export async function GET() {
  return NextResponse.json(listScenarios());
}
