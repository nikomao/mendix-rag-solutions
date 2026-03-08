"use client";

import { startTransition, useEffect, useState } from "react";
import type {
  ComparisonAxis,
  FeedbackEntry,
  RagResponse,
  ScenarioRecord,
  ScenarioSummary,
  SolutionParameters,
  Stat
} from "@/lib/types";

type DemoConsoleProps = {
  initialScenario: ScenarioRecord;
  scenarioSummaries: ScenarioSummary[];
  initialFeedback: FeedbackEntry[];
};

const sectionIds = [
  { id: "overview", label: "核心概览" },
  { id: "ecosystem", label: "中国 RAG 生态" },
  { id: "comparison", label: "方案对比" },
  { id: "etl", label: "数据解析" },
  { id: "implementation", label: "落地指南" }
] as const;

const parameterOptions = {
  model: ["DeepSeek-V3", "Qwen-Max", "Doubao-1.5-Pro", "GPT-4.1", "Claude 3.7 Sonnet"],
  vectorDb: ["Milvus", "Elasticsearch + Milvus", "pgvector", "Weaviate", "Pinecone"],
  parser: ["Ragflow DeepDoc", "FunASR + DeepDoc", "LlamaParse", "MinerU", "Unstructured"],
  deploymentMode: ["Hybrid", "Private Cloud", "On-Prem", "SaaS"],
  budgetTier: ["Lean", "Balanced", "Premium", "Enterprise"]
} satisfies Record<keyof Pick<
  SolutionParameters,
  "model" | "vectorDb" | "parser" | "deploymentMode" | "budgetTier"
>, string[]>;

export function DemoConsole({
  initialScenario,
  scenarioSummaries,
  initialFeedback
}: DemoConsoleProps) {
  const [scenarioList, setScenarioList] = useState(scenarioSummaries);
  const [scenario, setScenario] = useState(initialScenario);
  const [activeSection, setActiveSection] =
    useState<(typeof sectionIds)[number]["id"]>("overview");
  const [activeTabId, setActiveTabId] = useState(
    initialScenario.config.etlTabs[0]?.id ?? "files"
  );
  const [saving, setSaving] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState(false);
  const [status, setStatus] = useState("SQLite 场景库已加载。");
  const [question, setQuestion] = useState(
    "如果当前设备出现 E102 故障码，Mendix 页面应该如何组织 RAG 检索上下文？"
  );
  const [asking, setAsking] = useState(false);
  const [ragResponse, setRagResponse] = useState<RagResponse | null>(null);
  const [feedbackItems, setFeedbackItems] = useState(initialFeedback);
  const [correction, setCorrection] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    setActiveTabId(scenario.config.etlTabs[0]?.id ?? "files");
    setRagResponse(null);
    setCorrection("");
  }, [scenario.slug, scenario.config.etlTabs]);

  useEffect(() => {
    let cancelled = false;

    async function loadFeedback() {
      const response = await fetch(`/api/feedback?scenarioSlug=${scenario.slug}`);
      if (!response.ok || cancelled) {
        return;
      }

      const data = (await response.json()) as FeedbackEntry[];
      if (!cancelled) {
        setFeedbackItems(data);
      }
    }

    void loadFeedback();

    return () => {
      cancelled = true;
    };
  }, [scenario.slug]);

  async function switchScenario(slug: string) {
    setLoadingScenario(true);
    setStatus(`正在加载场景：${slug}`);

    try {
      const response = await fetch(`/api/scenarios/${slug}`);
      if (!response.ok) {
        throw new Error("场景加载失败");
      }

      const nextScenario = (await response.json()) as ScenarioRecord;
      setScenario(nextScenario);
      setStatus(`已切换到 ${nextScenario.title}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "场景加载失败");
    } finally {
      setLoadingScenario(false);
    }
  }

  function updateScenarioMeta(key: "title" | "industry" | "summary", value: string) {
    startTransition(() => {
      setScenario((current) => ({ ...current, [key]: value }));
    });
  }

  function updateConfigField(
    key: "headline" | "subheadline" | "focusNote",
    value: string
  ) {
    startTransition(() => {
      setScenario((current) => ({
        ...current,
        config: {
          ...current.config,
          [key]: value
        }
      }));
    });
  }

  function updateStat(index: number, key: keyof Stat, value: string) {
    startTransition(() => {
      setScenario((current) => ({
        ...current,
        config: {
          ...current.config,
          stats: current.config.stats.map((item, itemIndex) =>
            itemIndex === index ? { ...item, [key]: value } : item
          )
        }
      }));
    });
  }

  function updateComparison(index: number, key: keyof ComparisonAxis, value: number) {
    startTransition(() => {
      setScenario((current) => ({
        ...current,
        config: {
          ...current.config,
          comparisonAxes: current.config.comparisonAxes.map((item, itemIndex) =>
            itemIndex === index ? { ...item, [key]: value } : item
          )
        }
      }));
    });
  }

  function updateParameter<K extends keyof SolutionParameters>(
    key: K,
    value: SolutionParameters[K]
  ) {
    startTransition(() => {
      setScenario((current) => ({
        ...current,
        parameters: {
          ...current.parameters,
          [key]: value
        }
      }));
    });
  }

  async function saveScenario() {
    setSaving(true);
    setStatus("正在保存场景配置...");

    try {
      const response = await fetch(`/api/scenarios/${scenario.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(scenario)
      });

      if (!response.ok) {
        throw new Error("场景保存失败");
      }

      const nextScenario = (await response.json()) as ScenarioRecord;
      setScenario(nextScenario);
      setScenarioList((current) =>
        current.map((item) =>
          item.slug === nextScenario.slug
            ? {
                slug: nextScenario.slug,
                title: nextScenario.title,
                industry: nextScenario.industry,
                summary: nextScenario.summary,
                updatedAt: nextScenario.updatedAt
              }
            : item
        )
      );
      setStatus(`已保存 ${nextScenario.title}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "场景保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function runRagDemo() {
    setAsking(true);
    setStatus("正在执行 RAG 演示查询...");

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scenarioSlug: scenario.slug,
          question,
          parameters: scenario.parameters
        })
      });

      if (!response.ok) {
        throw new Error("问答请求失败");
      }

      const data = (await response.json()) as RagResponse;
      setRagResponse(data);
      setStatus(`已生成回答，置信度 ${data.confidence}%`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "问答请求失败");
    } finally {
      setAsking(false);
    }
  }

  async function submitFeedback(rating: "up" | "down") {
    if (!ragResponse) {
      return;
    }

    setSubmittingFeedback(true);
    setStatus("正在提交反馈...");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scenarioSlug: scenario.slug,
          question,
          answer: ragResponse.answer,
          rating,
          correction
        })
      });

      if (!response.ok) {
        throw new Error("反馈提交失败");
      }

      const entry = (await response.json()) as FeedbackEntry;
      setFeedbackItems((current) => [entry, ...current].slice(0, 12));
      setCorrection("");
      setStatus("反馈已写入 SQLite。");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "反馈提交失败");
    } finally {
      setSubmittingFeedback(false);
    }
  }

  const currentTab =
    scenario.config.etlTabs.find((tab) => tab.id === activeTabId) ?? scenario.config.etlTabs[0];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Mendix x RAG Console</p>
          <h1>行业方案展示台</h1>
          <p className="sidebar-copy">{scenario.config.focusNote}</p>
        </div>

        <section className="editor-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Scenarios</p>
              <h2>行业方案库</h2>
            </div>
          </div>
          <div className="scenario-list">
            {scenarioList.map((item) => (
              <button
                key={item.slug}
                className={item.slug === scenario.slug ? "scenario-card active" : "scenario-card"}
                onClick={() => void switchScenario(item.slug)}
                type="button"
                disabled={loadingScenario}
              >
                <strong>{item.title}</strong>
                <span>{item.industry}</span>
                <small>{item.summary}</small>
              </button>
            ))}
          </div>
        </section>

        <nav className="nav-list" aria-label="Sections">
          {sectionIds.map((section) => (
            <button
              key={section.id}
              className={activeSection === section.id ? "nav-item active" : "nav-item"}
              onClick={() => setActiveSection(section.id)}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </nav>

        <section className="editor-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Editable</p>
              <h2>方案参数面板</h2>
            </div>
            <button className="primary-button" onClick={saveScenario} disabled={saving} type="button">
              {saving ? "保存中..." : "保存场景"}
            </button>
          </div>

          <label className="field">
            <span>场景名称</span>
            <input
              value={scenario.title}
              onChange={(event) => updateScenarioMeta("title", event.target.value)}
            />
          </label>

          <label className="field">
            <span>行业</span>
            <input
              value={scenario.industry}
              onChange={(event) => updateScenarioMeta("industry", event.target.value)}
            />
          </label>

          <label className="field">
            <span>摘要</span>
            <textarea
              rows={3}
              value={scenario.summary}
              onChange={(event) => updateScenarioMeta("summary", event.target.value)}
            />
          </label>

          <div className="editor-group">
            <div className="group-title">
              <h3>技术选型</h3>
              <p>可现场切换模型、检索底座与部署方式。</p>
            </div>

            <SelectField
              label="模型"
              value={scenario.parameters.model}
              options={parameterOptions.model}
              onChange={(value) => updateParameter("model", value)}
            />
            <SelectField
              label="向量库"
              value={scenario.parameters.vectorDb}
              options={parameterOptions.vectorDb}
              onChange={(value) => updateParameter("vectorDb", value)}
            />
            <SelectField
              label="解析器"
              value={scenario.parameters.parser}
              options={parameterOptions.parser}
              onChange={(value) => updateParameter("parser", value)}
            />
            <SelectField
              label="部署模式"
              value={scenario.parameters.deploymentMode}
              options={parameterOptions.deploymentMode}
              onChange={(value) => updateParameter("deploymentMode", value)}
            />
            <SelectField
              label="预算档位"
              value={scenario.parameters.budgetTier}
              options={parameterOptions.budgetTier}
              onChange={(value) => updateParameter("budgetTier", value)}
            />

            <div className="toggle-grid">
              <ToggleField
                label="Rerank"
                checked={scenario.parameters.rerank}
                onChange={(checked) => updateParameter("rerank", checked)}
              />
              <ToggleField
                label="Graph RAG"
                checked={scenario.parameters.graphRag}
                onChange={(checked) => updateParameter("graphRag", checked)}
              />
              <ToggleField
                label="HITL"
                checked={scenario.parameters.hitl}
                onChange={(checked) => updateParameter("hitl", checked)}
              />
            </div>
          </div>

          <div className="editor-group">
            <div className="group-title">
              <h3>展示文案</h3>
              <p>用于售前现场快速改写演示重点。</p>
            </div>
            <label className="field">
              <span>主标题</span>
              <textarea
                rows={2}
                value={scenario.config.headline}
                onChange={(event) => updateConfigField("headline", event.target.value)}
              />
            </label>
            <label className="field">
              <span>副标题</span>
              <textarea
                rows={4}
                value={scenario.config.subheadline}
                onChange={(event) => updateConfigField("subheadline", event.target.value)}
              />
            </label>
            <label className="field">
              <span>焦点提示</span>
              <input
                value={scenario.config.focusNote}
                onChange={(event) => updateConfigField("focusNote", event.target.value)}
              />
            </label>
          </div>

          <div className="editor-group">
            <div className="group-title">
              <h3>KPI 与方案评分</h3>
              <p>支持现场调整 KPI 口径和三类方案打分。</p>
            </div>
            {scenario.config.stats.map((stat, index) => (
              <div className="compact-card" key={`${stat.label}-${index}`}>
                <label className="field">
                  <span>标签</span>
                  <input
                    value={stat.label}
                    onChange={(event) => updateStat(index, "label", event.target.value)}
                  />
                </label>
                <label className="field">
                  <span>数值</span>
                  <input
                    value={stat.value}
                    onChange={(event) => updateStat(index, "value", event.target.value)}
                  />
                </label>
                <label className="field">
                  <span>说明</span>
                  <input
                    value={stat.note}
                    onChange={(event) => updateStat(index, "note", event.target.value)}
                  />
                </label>
              </div>
            ))}

            {scenario.config.comparisonAxes.map((axis, index) => (
              <div className="compact-card" key={axis.label}>
                <label className="field">
                  <span>维度</span>
                  <input value={axis.label} readOnly />
                </label>
                <ScoreField
                  label="Mendix"
                  value={axis.mendix}
                  onChange={(value) => updateComparison(index, "mendix", value)}
                />
                <ScoreField
                  label="开源"
                  value={axis.openSource}
                  onChange={(value) => updateComparison(index, "openSource", value)}
                />
                <ScoreField
                  label="商业"
                  value={axis.commercial}
                  onChange={(value) => updateComparison(index, "commercial", value)}
                />
              </div>
            ))}
          </div>

          <p className="status-text">{status}</p>
        </section>
      </aside>

      <main className="content">
        <section className="section-stack">
          <article className="hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">{scenario.industry}</p>
              <h2>{scenario.config.headline}</h2>
              <p>{scenario.config.subheadline}</p>
            </div>
            <div className="hero-meta">
              <div className="meta-chip">{scenario.parameters.model}</div>
              <div className="meta-chip">{scenario.parameters.vectorDb}</div>
              <div className="meta-chip">{scenario.parameters.deploymentMode}</div>
            </div>
          </article>

          <section className="playground-grid">
            <article className="panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">RAG Playground</p>
                  <h3>真实后端模拟接口</h3>
                </div>
                <button
                  className="primary-button"
                  onClick={() => void runRagDemo()}
                  disabled={asking}
                  type="button"
                >
                  {asking ? "查询中..." : "执行问答"}
                </button>
              </div>
              <label className="field light">
                <span>提问</span>
                <textarea
                  rows={4}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                />
              </label>

              {ragResponse ? (
                <div className="rag-result">
                  <div className="result-header">
                    <strong>回答输出</strong>
                    <span>置信度 {ragResponse.confidence}%</span>
                  </div>
                  <p className="result-answer">{ragResponse.answer}</p>

                  <div className="workflow-list">
                    {ragResponse.workflow.map((item) => (
                      <div className="workflow-chip" key={item}>
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="source-list">
                    {ragResponse.sources.map((source) => (
                      <article className="source-card" key={source.id}>
                        <div className="source-topline">
                          <strong>{source.title}</strong>
                          <span>{source.score}</span>
                        </div>
                        <p>{source.excerpt}</p>
                        <div className="source-meta">
                          <small>{source.section}</small>
                          <small>{source.type}</small>
                          <small>{source.trust}</small>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="placeholder-copy">执行一次问答后，这里会展示回答、命中来源和工作流。</p>
              )}
            </article>

            <article className="panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Human In The Loop</p>
                  <h3>反馈闭环</h3>
                </div>
              </div>

              <label className="field light">
                <span>人工修正</span>
                <textarea
                  rows={4}
                  value={correction}
                  onChange={(event) => setCorrection(event.target.value)}
                  placeholder="补充更准确的回答、来源或业务上下文。"
                />
              </label>

              <div className="feedback-actions">
                <button
                  className="ghost-button"
                  disabled={!ragResponse || submittingFeedback}
                  onClick={() => void submitFeedback("up")}
                  type="button"
                >
                  点赞写入
                </button>
                <button
                  className="ghost-button danger"
                  disabled={!ragResponse || submittingFeedback}
                  onClick={() => void submitFeedback("down")}
                  type="button"
                >
                  纠错写入
                </button>
              </div>

              <div className="feedback-list">
                {feedbackItems.map((item) => (
                  <article className="feedback-card" key={item.id}>
                    <div className="source-topline">
                      <strong>{item.rating === "up" ? "正向反馈" : "纠错反馈"}</strong>
                      <span>{new Date(item.createdAt).toLocaleString("zh-CN")}</span>
                    </div>
                    <p>{item.question}</p>
                    {item.correction ? <small>修正：{item.correction}</small> : null}
                  </article>
                ))}
              </div>
            </article>
          </section>

          {activeSection === "overview" ? <OverviewSection scenario={scenario} /> : null}
          {activeSection === "ecosystem" ? <EcosystemSection scenario={scenario} /> : null}
          {activeSection === "comparison" ? <ComparisonSection scenario={scenario} /> : null}
          {activeSection === "etl" ? (
            <EtlSection
              scenario={scenario}
              activeTabId={currentTab?.id ?? ""}
              onSelectTab={setActiveTabId}
            />
          ) : null}
          {activeSection === "implementation" ? (
            <ImplementationSection scenario={scenario} />
          ) : null}
        </section>
      </main>
    </div>
  );
}

function OverviewSection({ scenario }: { scenario: ScenarioRecord }) {
  return (
    <section className="section-stack">
      <div className="stats-grid">
        {scenario.config.stats.map((stat) => (
          <article className={`stat-card ${stat.tone}`} key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
            <span>{stat.note}</span>
          </article>
        ))}
      </div>

      <div className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Hallucination Delta</p>
              <h3>工业场景常见幻觉类型</h3>
            </div>
          </div>
          <BarComparisonChart data={scenario.config.hallucinationData} />
        </article>

        <article className="panel challenge-panel">
          <p className="panel-kicker">Why RAG</p>
          <h3>{scenario.config.challengeTitle}</h3>
          <ul className="bullet-list">
            {scenario.config.challengePoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function EcosystemSection({ scenario }: { scenario: ScenarioRecord }) {
  return (
    <section className="section-stack">
      <div className="section-intro">
        <p className="eyebrow">China Ecosystem</p>
        <h2>{scenario.title} 的 RAG 技术栈</h2>
        <p>{scenario.summary}</p>
      </div>

      <div className="ecosystem-grid">
        {scenario.config.ecosystemCards.map((card) => (
          <article className="panel info-panel" key={card.title}>
            <span className="badge">{card.badge}</span>
            <h3>{card.title}</h3>
            <p>{card.summary}</p>
            <div className="highlight-box">
              <strong>{card.highlight}</strong>
              <p>{card.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComparisonSection({ scenario }: { scenario: ScenarioRecord }) {
  return (
    <section className="section-stack">
      <div className="section-intro">
        <p className="eyebrow">Decision Matrix</p>
        <h2>方案能力对比</h2>
        <p>当前评分可由左侧面板直接调整，并保存在 SQLite 场景库中。</p>
      </div>

      <article className="panel">
        <div className="comparison-table">
          {scenario.config.comparisonAxes.map((axis) => (
            <div className="comparison-row" key={axis.label}>
              <div className="comparison-label">{axis.label}</div>
              <ScoreBar label="Mendix" value={axis.mendix} tone="primary" />
              <ScoreBar label="开源" value={axis.openSource} tone="success" />
              <ScoreBar label="商业" value={axis.commercial} tone="warning" />
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function EtlSection({
  scenario,
  activeTabId,
  onSelectTab
}: {
  scenario: ScenarioRecord;
  activeTabId: string;
  onSelectTab: (value: string) => void;
}) {
  const activeTab =
    scenario.config.etlTabs.find((tab) => tab.id === activeTabId) ?? scenario.config.etlTabs[0];

  return (
    <section className="section-stack">
      <div className="section-intro">
        <p className="eyebrow">Knowledge Ingestion</p>
        <h2>数据解析与 ETL 能力</h2>
        <p>根据行业素材切换文档、音视频和 3D 相关知识接入方式。</p>
      </div>

      <div className="tab-row">
        {scenario.config.etlTabs.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === activeTab?.id ? "tab-button active" : "tab-button"}
            onClick={() => onSelectTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab ? (
        <article className="panel">
          <h3>{activeTab.title}</h3>
          <p className="section-copy">{activeTab.description}</p>
          <ul className="bullet-list">
            {activeTab.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      ) : null}
    </section>
  );
}

function ImplementationSection({ scenario }: { scenario: ScenarioRecord }) {
  return (
    <section className="section-stack">
      <div className="section-intro">
        <p className="eyebrow">Delivery Blueprint</p>
        <h2>{scenario.title} 落地路径</h2>
        <p>以 Mendix 为业务前台，以独立 RAG 服务为知识与推理后端，形成可演示也可扩展的混合架构。</p>
      </div>

      <div className="steps-grid">
        {scenario.config.implementationSteps.map((step, index) => (
          <article className="panel step-card" key={step.title}>
            <span className="step-index">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <strong>{step.keyAction}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function BarComparisonChart({
  data
}: {
  data: ScenarioRecord["config"]["hallucinationData"];
}) {
  return (
    <div className="bar-chart">
      {data.map((item) => (
        <div className="bar-row" key={item.label}>
          <div className="bar-label">{item.label}</div>
          <div className="bar-track">
            <div className="bar-set">
              <span className="bar-caption">无 RAG</span>
              <div className="bar-fill danger" style={{ width: `${item.withoutRag}%` }} />
              <span className="bar-value">{item.withoutRag}%</span>
            </div>
            <div className="bar-set">
              <span className="bar-caption">有 RAG</span>
              <div className="bar-fill success" style={{ width: `${item.withRag}%` }} />
              <span className="bar-value">{item.withRag}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreBar({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: "primary" | "success" | "warning";
}) {
  return (
    <div className="score-cell">
      <span>{label}</span>
      <div className="score-track">
        <div className={`score-fill ${tone}`} style={{ width: `${value}%` }} />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function ScoreField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>{value}</small>
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle-field">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
