import { NextResponse } from "next/server";
import { readScenario, updateScenario } from "@/lib/scenario-db";
import type { ScenarioRecord } from "@/lib/types";

type Params = Promise<{ slug: string }>;

export async function GET(_: Request, context: { params: Params }) {
  const { slug } = await context.params;

  try {
    return NextResponse.json(readScenario(slug));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Scenario not found" },
      { status: 404 }
    );
  }
}

export async function PUT(request: Request, context: { params: Params }) {
  const { slug } = await context.params;
  const payload = (await request.json()) as ScenarioRecord;

  if (payload.slug !== slug) {
    return NextResponse.json({ message: "Slug mismatch" }, { status: 400 });
  }

  return NextResponse.json(updateScenario(payload));
}
