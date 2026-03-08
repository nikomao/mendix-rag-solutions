import { readScenario } from "@/lib/scenario-db";
import type { RagResponse, ScenarioRecord, SolutionParameters } from "@/lib/types";

function scoreDocuments(scenario: ScenarioRecord, question: string) {
  const tokens = question.toLowerCase().split(/[\s,，。；;:：/]+/).filter(Boolean);

  return scenario.knowledgeDocuments
    .map((document) => {
      const matchCount = document.keywords.reduce((count, keyword) => {
        return count + (question.toLowerCase().includes(keyword.toLowerCase()) ? 2 : 0);
      }, 0);

      const tokenCount = tokens.reduce((count, token) => {
        return count + (document.excerpt.toLowerCase().includes(token) ? 1 : 0);
      }, 0);

      const trustBonus =
        document.trust === "gold" ? 15 : document.trust === "silver" ? 8 : 3;

      return {
        id: document.id,
        title: document.title,
        type: document.type,
        excerpt: document.excerpt,
        section: document.section,
        trust: document.trust,
        score: matchCount * 12 + tokenCount * 5 + trustBonus
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

function buildAnswer(
  scenario: ScenarioRecord,
  question: string,
  parameters: SolutionParameters,
  sourceTitles: string[]
) {
  const sourceSummary =
    sourceTitles.length > 0 ? `优先参考 ${sourceTitles.join("、")}。` : "当前未命中高置信来源。";

  return [
    `针对“${scenario.title}”场景，推荐由 Mendix 承担业务编排与交互层，外部 RAG 服务负责知识检索与生成。`,
    `本次演示假设使用 ${parameters.model} 作为生成模型，${parameters.vectorDb} 作为检索底座，${parameters.parser} 负责知识入库。`,
    parameters.graphRag
      ? "该方案启用了 Graph RAG，用于补强设备关系、故障因果或供应商链路上的多跳推理。"
      : "该方案当前以文档检索为主，适合快速启动但复杂关系推理能力相对有限。",
    sourceSummary,
    `结合问题“${question}”，建议在 Mendix 页面里同时注入业务对象上下文，例如设备编号、工单状态、VIN、批次号或站点信息，再发起检索请求。`,
    parameters.hitl
      ? "为了让方案具备企业级治理能力，回答页应保留点赞、纠错和人工补充入口，持续沉淀高价值知识。"
      : "如果未来要进入生产场景，建议补充 Human-in-the-loop 反馈机制。"
  ].join("");
}

export function simulateRagAnswer(input: {
  scenarioSlug: string;
  question: string;
  parameters: SolutionParameters;
}): RagResponse {
  const scenario = readScenario(input.scenarioSlug);
  const sources = scoreDocuments(scenario, input.question);
  const workflow = [
    `解析器：${input.parameters.parser}`,
    `检索策略：混合检索${input.parameters.rerank ? " + Rerank" : ""}`,
    `向量底座：${input.parameters.vectorDb}`,
    `部署模式：${input.parameters.deploymentMode}`,
    `预算档位：${input.parameters.budgetTier}`,
    input.parameters.graphRag ? "推理增强：Graph RAG 已开启" : "推理增强：Graph RAG 未开启"
  ];

  const confidenceBase = sources.reduce((sum, source) => sum + source.score, 0);
  const confidence = Math.max(58, Math.min(96, Math.round(confidenceBase / 3)));

  return {
    answer: buildAnswer(
      scenario,
      input.question,
      input.parameters,
      sources.map((source) => source.title)
    ),
    confidence,
    workflow,
    sources
  };
}
