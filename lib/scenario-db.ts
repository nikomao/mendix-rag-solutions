import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { seedScenarios } from "@/lib/seed-data";
import type { FeedbackEntry, ScenarioRecord, ScenarioSummary } from "@/lib/types";

type ScenarioRow = {
  slug: string;
  title: string;
  industry: string;
  summary: string;
  payload_json: string;
  updated_at: string;
};

type FeedbackRow = {
  id: number;
  scenario_slug: string;
  question: string;
  answer: string;
  rating: "up" | "down";
  correction: string;
  created_at: string;
};

let db: DatabaseSync | null = null;

function getDatabasePath() {
  const dataDir = path.join(process.cwd(), "data");
  mkdirSync(dataDir, { recursive: true });
  return path.join(dataDir, "app.db");
}

function getDb() {
  if (db) {
    return db;
  }

  db = new DatabaseSync(getDatabasePath());
  db.exec(`
    CREATE TABLE IF NOT EXISTS scenarios (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      industry TEXT NOT NULL,
      summary TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_slug TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      rating TEXT NOT NULL,
      correction TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
  `);

  const countRow = db.prepare("SELECT COUNT(*) as count FROM scenarios").get() as {
    count: number;
  };

  if (countRow.count === 0) {
    const insert = db.prepare(`
      INSERT INTO scenarios (slug, title, industry, summary, payload_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const scenario of seedScenarios) {
      insert.run(
        scenario.slug,
        scenario.title,
        scenario.industry,
        scenario.summary,
        JSON.stringify(scenario),
        scenario.updatedAt
      );
    }
  }

  return db;
}

function mapScenario(row: ScenarioRow): ScenarioRecord {
  const payload = JSON.parse(row.payload_json) as ScenarioRecord;
  return {
    ...payload,
    slug: row.slug,
    title: row.title,
    industry: row.industry,
    summary: row.summary,
    updatedAt: row.updated_at
  };
}

export function listScenarios(): ScenarioSummary[] {
  const database = getDb();
  const rows = database.prepare(`
    SELECT slug, title, industry, summary, payload_json, updated_at
    FROM scenarios
    ORDER BY title ASC
  `).all() as ScenarioRow[];

  return rows.map((row) => {
    const scenario = mapScenario(row);
    return {
      slug: scenario.slug,
      title: scenario.title,
      industry: scenario.industry,
      summary: scenario.summary,
      updatedAt: scenario.updatedAt
    };
  });
}

export function readScenario(slug: string): ScenarioRecord {
  const database = getDb();
  const row = database.prepare(`
    SELECT slug, title, industry, summary, payload_json, updated_at
    FROM scenarios
    WHERE slug = ?
  `).get(slug) as ScenarioRow | undefined;

  if (!row) {
    throw new Error(`Scenario not found: ${slug}`);
  }

  return mapScenario(row);
}

export function updateScenario(scenario: ScenarioRecord) {
  const database = getDb();
  const updatedAt = new Date().toISOString();

  const nextScenario = {
    ...scenario,
    updatedAt
  };

  database.prepare(`
    UPDATE scenarios
    SET title = ?, industry = ?, summary = ?, payload_json = ?, updated_at = ?
    WHERE slug = ?
  `).run(
    nextScenario.title,
    nextScenario.industry,
    nextScenario.summary,
    JSON.stringify(nextScenario),
    updatedAt,
    nextScenario.slug
  );

  return nextScenario;
}

export function listFeedback(scenarioSlug: string): FeedbackEntry[] {
  const database = getDb();
  const rows = database.prepare(`
    SELECT id, scenario_slug, question, answer, rating, correction, created_at
    FROM feedback
    WHERE scenario_slug = ?
    ORDER BY id DESC
    LIMIT 12
  `).all(scenarioSlug) as FeedbackRow[];

  return rows.map((row) => ({
    id: row.id,
    scenarioSlug: row.scenario_slug,
    question: row.question,
    answer: row.answer,
    rating: row.rating,
    correction: row.correction,
    createdAt: row.created_at
  }));
}

export function insertFeedback(entry: Omit<FeedbackEntry, "id" | "createdAt">) {
  const database = getDb();
  const createdAt = new Date().toISOString();
  const result = database.prepare(`
    INSERT INTO feedback (scenario_slug, question, answer, rating, correction, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    entry.scenarioSlug,
    entry.question,
    entry.answer,
    entry.rating,
    entry.correction,
    createdAt
  );

  return {
    id: Number(result.lastInsertRowid),
    ...entry,
    createdAt
  };
}
