import { NextResponse } from "next/server";
import { simulateRagAnswer } from "@/lib/rag-simulator";
import type { SolutionParameters } from "@/lib/types";

type QueryPayload = {
  scenarioSlug: string;
  question: string;
  parameters: SolutionParameters;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as QueryPayload;

  if (!payload.scenarioSlug || !payload.question.trim()) {
    return NextResponse.json({ message: "Missing question or scenario" }, { status: 400 });
  }

  return NextResponse.json(simulateRagAnswer(payload));
}
