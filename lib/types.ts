export type StatTone = "danger" | "success" | "primary";

export type Stat = {
  label: string;
  value: string;
  note: string;
  tone: StatTone;
};

export type HallucinationDatum = {
  label: string;
  withoutRag: number;
  withRag: number;
};

export type EcosystemCard = {
  title: string;
  badge: string;
  summary: string;
  highlight: string;
  detail: string;
};

export type ComparisonAxis = {
  label: string;
  mendix: number;
  openSource: number;
  commercial: number;
};

export type EtlTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
};

export type ImplementationStep = {
  title: string;
  body: string;
  keyAction: string;
};

export type SolutionParameters = {
  model: string;
  vectorDb: string;
  parser: string;
  deploymentMode: string;
  budgetTier: string;
  rerank: boolean;
  graphRag: boolean;
  hitl: boolean;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  type: string;
  excerpt: string;
  keywords: string[];
  section: string;
  trust: "gold" | "silver" | "bronze";
};

export type DemoConfig = {
  headline: string;
  subheadline: string;
  focusNote: string;
  challengeTitle: string;
  challengePoints: string[];
  stats: Stat[];
  hallucinationData: HallucinationDatum[];
  ecosystemCards: EcosystemCard[];
  comparisonAxes: ComparisonAxis[];
  etlTabs: EtlTab[];
  implementationSteps: ImplementationStep[];
};

export type ScenarioRecord = {
  slug: string;
  title: string;
  industry: string;
  summary: string;
  config: DemoConfig;
  parameters: SolutionParameters;
  knowledgeDocuments: KnowledgeDocument[];
  updatedAt: string;
};

export type ScenarioSummary = Pick<
  ScenarioRecord,
  "slug" | "title" | "industry" | "summary" | "updatedAt"
>;

export type RagSource = {
  id: string;
  title: string;
  type: string;
  excerpt: string;
  section: string;
  trust: KnowledgeDocument["trust"];
  score: number;
};

export type RagResponse = {
  answer: string;
  confidence: number;
  workflow: string[];
  sources: RagSource[];
};

export type FeedbackEntry = {
  id: number;
  scenarioSlug: string;
  question: string;
  answer: string;
  rating: "up" | "down";
  correction: string;
  createdAt: string;
};
