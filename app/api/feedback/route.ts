import { NextResponse } from "next/server";
import { insertFeedback, listFeedback } from "@/lib/scenario-db";

type FeedbackPayload = {
  scenarioSlug: string;
  question: string;
  answer: string;
  rating: "up" | "down";
  correction: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scenarioSlug = searchParams.get("scenarioSlug");

  if (!scenarioSlug) {
    return NextResponse.json({ message: "scenarioSlug is required" }, { status: 400 });
  }

  return NextResponse.json(listFeedback(scenarioSlug));
}

export async function POST(request: Request) {
  const payload = (await request.json()) as FeedbackPayload;

  if (!payload.scenarioSlug || !payload.question || !payload.answer) {
    return NextResponse.json({ message: "Incomplete feedback payload" }, { status: 400 });
  }

  return NextResponse.json(
    insertFeedback({
      scenarioSlug: payload.scenarioSlug,
      question: payload.question,
      answer: payload.answer,
      rating: payload.rating,
      correction: payload.correction
    })
  );
}
