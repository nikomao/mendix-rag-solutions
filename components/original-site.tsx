"use client";

import { useMemo, useState } from "react";
import type {
  OriginalSectionId,
  OriginalSiteDoc,
  OriginalTabId
} from "@/lib/original-site-doc";
import { ComparisonRadarChart, HallucinationChart } from "@/components/original-site-charts";

type ExtendedSectionId = OriginalSectionId | "genai-docs" | "demo-flow" | "value" | "faq";

type CapabilityTag =
  | "rag"
  | "agent"
  | "connector"
  | "poc"
  | "governance"
  | "private";

type CapabilityItem = {
  title: string;
  href: string;
  description: string;
  fit: string;
  pitch: string;
  tags: CapabilityTag[];
};

const officialCapabilityMap: Array<{ category: string; items: CapabilityItem[] }> = [
  {
    category: "基础组件",
    items: [
      {
        title: "GenAI Commons",
        href: "https://docs.mendix.com/appstore/modules/genai/genai-for-mx/commons/",
        description: "所有 GenAI 组件的公共基础层，用统一 request、response、tools 和 knowledge 结构把不同模型能力接到 Mendix。",
        fit: "适合需要统一接多种模型和连接器的企业平台团队。",
        pitch: "可以把它讲成 Mendix GenAI 的标准底座，避免每个项目各自写一套 AI 集成逻辑。",
        tags: ["rag", "agent", "connector", "governance"]
      },
      {
        title: "Conversational UI",
        href: "https://docs.mendix.com/appstore/modules/genai/genai-for-mx/conversational-ui/",
        description: "提供聊天界面、消息流、token 监控和 prompt 管理相关 UI 片段，是客户最容易看到的交互层。",
        fit: "适合需要快速做聊天式业务界面、监控页和 demo 的场景。",
        pitch: "可以强调这不是只会聊天，而是可以快速嵌进 Mendix 业务流程里的企业级交互层。",
        tags: ["poc", "agent", "governance"]
      }
    ]
  },
  {
    category: "连接器",
    items: [
      {
        title: "OpenAI Connector",
        href: "https://docs.mendix.com/appstore/modules/genai/reference-guide/external-connectors/openai/",
        description: "支持 Chat Completions、Embeddings、Image Generations，并可结合 Azure AI Search 做知识检索。",
        fit: "适合客户想快速验证最主流大模型能力，或已有 Azure/OpenAI 资源。",
        pitch: "可以拿来说明 Mendix 接模型不是问题，关键价值在业务编排和治理。",
        tags: ["connector", "poc"]
      },
      {
        title: "Amazon Bedrock Connector",
        href: "https://docs.mendix.com/appstore/modules/aws/amazon-bedrock/",
        description: "对接 AWS Bedrock，适合已有 AWS 安全和基础设施体系的企业。",
        fit: "适合已经把安全、审计和基础设施统一放在 AWS 的客户。",
        pitch: "可以讲成 Mendix 能顺着客户现有云治理体系接入 AI，而不是逼客户换平台。",
        tags: ["connector", "private", "governance"]
      },
      {
        title: "Mendix Cloud GenAI",
        href: "https://docs.mendix.com/appstore/modules/genai/mx-cloud-genai/",
        description: "通过 Mendix Cloud Resource Packs 快速接入模型和 embedding 资源，适合快速 PoC 和平台统一治理。",
        fit: "适合想最快出 PoC、又希望能力由 Mendix 平台统一管理的团队。",
        pitch: "这个最适合讲‘先跑起来，再逐步治理和扩展’。",
        tags: ["poc", "connector", "governance"]
      }
    ]
  },
  {
    category: "知识库 / RAG",
    items: [
      {
        title: "RAG in a Mendix App",
        href: "https://docs.mendix.com/appstore/modules/genai/rag/",
        description: "官方 RAG 指南，说明如何基于 PgVector Knowledge Base 在 Mendix 中落地知识库问答。",
        fit: "适合客户第一句话就是‘我们想做企业知识库问答’的场景。",
        pitch: "这是最直接的官方论据，能说明 Mendix 对 RAG 是有官方落地路径的。",
        tags: ["rag", "poc"]
      },
      {
        title: "PgVector Knowledge Base",
        href: "https://docs.mendix.com/appstore/modules/genai/",
        description: "Mendix 官方私有知识库路径，适合把 embedding、chunk 和 retrieval 放在企业自有数据体系里。",
        fit: "适合关注私有知识库、内网部署和数据可控性的客户。",
        pitch: "可以把它讲成 Mendix 在 RAG 里不只是 UI，而是能把知识库真正纳入企业数据体系。",
        tags: ["rag", "private", "governance"]
      },
      {
        title: "Prompt Engineering",
        href: "https://docs.mendix.com/appstore/modules/genai/prompt-engineering/",
        description: "官方说明 prompt 中的 system、user、context 和 RAG information 如何一起工作。",
        fit: "适合客户开始关注回答质量、上下文拼装和 prompt 运营。",
        pitch: "这个点适合说明 Mendix 不只是调用模型，而是能管理 prompt 和上下文工程。",
        tags: ["rag", "governance", "poc"]
      }
    ]
  },
  {
    category: "Agent / MCP",
    items: [
      {
        title: "Agent Commons",
        href: "https://docs.mendix.com/appstore/modules/genai/genai-for-mx/agent-commons/",
        description: "用于定义、测试和运行 agents，可把 prompts、microflows、tools 和 models 组合成 agentic workflows。",
        fit: "适合客户想从问答走向执行、审批、工单流转等 agent 场景。",
        pitch: "可以直接讲 Mendix 的强项在这里：agent 最终要落到业务动作，而不是停在聊天框。",
        tags: ["agent", "governance"]
      },
      {
        title: "MCP Client",
        href: "https://docs.mendix.com/appstore/modules/genai/mcp-modules/mcp-client/",
        description: "让 Mendix 应用消费外部 MCP server 的 tools 和 prompts，把外部 AI 能力接进自己的聊天或 agent 流程。",
        fit: "适合客户已有企业内部 AI 平台、工具市场或外部 agent infrastructure。",
        pitch: "可以把它讲成 Mendix 能接入现有 AI 生态，不会形成新孤岛。",
        tags: ["agent", "connector"]
      },
      {
        title: "MCP Modules Overview",
        href: "https://docs.mendix.com/appstore/modules/genai/reference-guide/mcp-modules/",
        description: "官方 MCP 模块总览，说明 MCP Client / MCP Server 在企业 agent landscape 中的定位。",
        fit: "适合需要给客户解释 MCP、tool calling 和跨系统 AI 集成概念时使用。",
        pitch: "这张卡更适合做概念锚点，不是具体卖点，但对高阶客户很关键。",
        tags: ["agent", "connector", "governance"]
      },
      {
        title: "MCP Concept",
        href: "https://docs.mendix.com/appstore/modules/genai/mcp/",
        description: "从概念层解释 Mendix 如何通过 MCP 暴露工具和 prompt，或消费企业内部其他 AI 系统的能力。",
        fit: "适合架构师型客户和已经在谈 Agent 平台整合的机会。",
        pitch: "这能帮你把 Mendix 放进客户更大的 AI 架构版图里。",
        tags: ["agent", "connector", "governance"]
      }
    ]
  },
  {
    category: "示例与上手",
    items: [
      {
        title: "GenAI 官方总览",
        href: "https://docs.mendix.com/appstore/modules/genai/",
        description: "所有官方组件、Starter App、Showcase App 和能力入口的总导航页。",
        fit: "适合第一次介绍 Mendix GenAI 能力边界时使用。",
        pitch: "这是最好的‘官方背书入口’，先让客户看到体系完整性。",
        tags: ["poc", "rag", "agent", "connector", "governance", "private"]
      },
      {
        title: "How to Build Smarter Apps Using GenAI",
        href: "https://docs.mendix.com/appstore/modules/genai/how-to/",
        description: "从 blank app 到智能应用的官方路径，适合客户快速理解实施顺序。",
        fit: "适合客户问‘到底怎么做、从哪开始’的时候。",
        pitch: "可以拿它把实施路线讲清楚，而不是只讲架构概念。",
        tags: ["poc", "governance"]
      },
      {
        title: "Prompt Engineering at Runtime",
        href: "https://docs.mendix.com/appstore/modules/genai/how-to/howto-prompt-engineering/",
        description: "展示如何让业务人员在运行时调 prompt，这个点很适合拿来讲企业可运营能力。",
        fit: "适合客户关注 AI 上线后的持续优化和业务可运营性。",
        pitch: "这张卡很适合讲‘业务团队也能参与优化，不必每次都找开发’。",
        tags: ["governance", "poc"]
      }
    ]
  }
] as const;

const filters: Array<{
  id: "all" | CapabilityTag;
  label: string;
}> = [
  { id: "all", label: "全部能力" },
  { id: "rag", label: "我想做 RAG" },
  { id: "agent", label: "我想做 Agent" },
  { id: "private", label: "我想要私有化" },
  { id: "connector", label: "我想接模型/工具" },
  { id: "poc", label: "我想快速 PoC" },
  { id: "governance", label: "我关心治理" }
];

const faqItems = [
  {
    question: "这个方案到底解决什么问题？",
    answer:
      "它不是单纯做一个聊天机器人，而是把企业文档知识做成可检索、可问答、可追溯、可进入 Workflow 闭环的业务能力，适合知识问答、运维助手、制度查询、质量支持等场景。"
  },
  {
    question: "为什么要用 Mendix 来做这件事？",
    answer:
      "因为客户最终要的不是一个模型接口，而是一个可交付的业务应用。Mendix 的价值在于界面、权限、集成、流程编排、任务闭环和后续迭代速度，可以把 AI 能力真正落到业务系统里。"
  },
  {
    question: "这是不是标准 RAG？和普通 AI 问答有什么区别？",
    answer:
      "这是完整的企业 RAG 方案，不是裸调大模型。流程是知识库检索、召回相关内容、把上下文交给模型生成回答，并保留来源引用，必要时再进入 Workflow 做人工确认。"
  },
  {
    question: "支持哪些模型？能不能用本地模型？",
    answer:
      "支持按配置切换模型，既可以接远程模型服务，也可以接本地部署模型。你现在的 Demo 使用的是 DeepSeek，也保留了后续接入其他兼容接口模型的空间。"
  },
  {
    question: "知识库怎么建？支持哪些文件？",
    answer:
      "当前 Demo 以 PDF 为主，流程是上传文件后由 Docling 解析，再切片、生成 embedding，并写入 PostgreSQL + pgvector。这个链路后续也可以扩展到更多文档类型。"
  },
  {
    question: "回答能不能看到依据？会不会胡说？",
    answer:
      "可以。方案支持展示命中的文档片段、来源文件和页码，客户可以看到回答依据来自哪一段知识内容。这不能彻底消除幻觉，但能显著提升可解释性和可信度。"
  },
  {
    question: "如果回答不准确，或者涉及风险操作，怎么处理？",
    answer:
      "这时就进入 Mendix Workflow。系统可以把问题转成待办任务，交给专家确认、补充资料、发起审批或创建工单，把 AI 回答和人工处理串成闭环。"
  },
  {
    question: "这个方案能不能私有化部署？数据安不安全？",
    answer:
      "可以按企业要求做本地化或私有化部署。模型可以本地或远程配置，知识库存放在 PostgreSQL + pgvector 中，并可结合现有权限、网络和审计体系来控制数据访问。"
  },
  {
    question: "这个方案适合哪些业务场景？",
    answer:
      "比较适合文档密集、知识依赖强、又需要业务闭环的场景，比如设备运维、SOP 查询、质量追溯、内部培训助手、客服支持、制度与合规问答。"
  },
  {
    question: "从 PoC 到正式上线，大概需要做哪些工作？",
    answer:
      "通常分三步：先做 PoC 验证问答效果和用户价值，再做业务系统集成和权限流程打通，最后补治理能力，例如日志、反馈、知识更新、模型策略和运营机制。"
  }
] as const;

export function OriginalSite({
  doc,
  initialSection
}: {
  doc: OriginalSiteDoc;
  initialSection?: string;
}) {
  const defaultSection: ExtendedSectionId =
    initialSection === "genai-docs" ||
    initialSection === "demo-flow" ||
    initialSection === "value" ||
    initialSection === "faq"
      ? initialSection
      : initialSection === "overview" ||
          initialSection === "ecosystem" ||
          initialSection === "comparison" ||
          initialSection === "etl" ||
          initialSection === "implementation"
        ? initialSection
        : "overview";

  const [activeSection, setActiveSection] = useState<ExtendedSectionId>(defaultSection);
  const [activeTab, setActiveTab] = useState<OriginalTabId>("files");

  const currentSectionHtml = useMemo(() => {
    if (activeSection === "genai-docs") {
      return "";
    }

    if (activeSection === "demo-flow") {
      return "";
    }

    if (activeSection === "faq") {
      return "";
    }

    if (activeSection === "value") {
      return "";
    }

    if (activeSection === "etl") {
      return doc.etlShell
        .replace(
          "__ETL_TABS__",
          `<div class="border-b border-slate-200 mb-6 mt-4"><nav class="-mb-px flex space-x-8" aria-label="Tabs">${doc.etlTabs
            .map((tab) => {
              const activeClass =
                activeTab === tab.id
                  ? "tab-btn active whitespace-nowrap py-4 px-1 text-sm font-medium"
                  : "tab-btn whitespace-nowrap py-4 px-1 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300";
              return `<button class="${activeClass}" data-tab="${tab.id}" type="button">${tab.labelHtml}</button>`;
            })
            .join("")}</nav></div>`
        )
        .replace("__ETL_CONTENT__", doc.etlContents[activeTab]);
    }

    return doc.sections[activeSection];
  }, [activeSection, activeTab, doc]);

  return (
    <div className="original-page flex h-screen overflow-hidden bg-slate-50 text-slate-800">
      <nav className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-full shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Mendix 企业知识问答与流程助手</h1>
          <p className="text-xs text-slate-500 mt-1">RAG、GenAI 与 Workflow 企业方案演示</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {doc.nav.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`nav-item w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors ${
                    activeSection === item.id ? "active" : ""
                  }`}
                  type="button"
                  dangerouslySetInnerHTML={{ __html: item.labelHtml }}
                />
              </li>
            ))}
            <li>
              <a
                href="/?section=demo-flow"
                onClick={(event) => {
                  event.preventDefault();
                  setActiveSection("demo-flow");
                }}
                className={`nav-item block w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors ${
                  activeSection === "demo-flow" ? "active" : ""
                }`}
              >
                🧭 架构流程
              </a>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("value")}
                className={`nav-item w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors ${
                  activeSection === "value" ? "active" : ""
                }`}
                type="button"
              >
                💎 价值与优势
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("faq")}
                className={`nav-item w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors ${
                  activeSection === "faq" ? "active" : ""
                }`}
                type="button"
              >
                ❓ 常用问题
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("genai-docs")}
                className={`nav-item w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors ${
                  activeSection === "genai-docs" ? "active" : ""
                }`}
                type="button"
              >
                🧠 Mendix GenAI 官方能力
              </button>
            </li>
          </ul>
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800 font-semibold">当前关注点</p>
            <p className="text-xs text-blue-600 mt-1">工业知识问答落地边界 & Mendix GenAI 架构</p>
          </div>
        </div>
      </nav>

      <main
        className="flex-1 h-full overflow-y-auto bg-slate-50 p-8 relative"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          const tabButton = target.closest("[data-tab]") as HTMLElement | null;
          if (tabButton) {
            const tabId = tabButton.dataset.tab as OriginalTabId | undefined;
            if (tabId) {
              setActiveTab(tabId);
            }
          }
        }}
      >
        {activeSection === "genai-docs" ? (
          <OfficialGenAIDocsSection />
        ) : activeSection === "demo-flow" ? (
          <DemoFlowSection />
        ) : activeSection === "value" ? (
          <ValueSection />
        ) : activeSection === "faq" ? (
          <FaqSection />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: currentSectionHtml }} />
        )}

        {activeSection === "overview" ? (
          <div className="pointer-events-none">
            <div className="chart-mount chart-mount-overview">
              <HallucinationChart />
            </div>
          </div>
        ) : null}

        {activeSection === "comparison" ? (
          <div className="pointer-events-none">
            <div className="chart-mount chart-mount-comparison">
              <ComparisonRadarChart />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function DemoFlowSection() {
  return (
    <section className="space-y-8">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">客户演示路径</span>
          <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">端到端业务闭环</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Mendix RAG Demo 架构流程</h2>
        <p className="mt-2 max-w-4xl leading-relaxed text-slate-600">
          这不是一个“做个聊天框”的 AI Demo，而是一条完整的企业知识问答落地链路：业务人员先在
          Mendix 中配置模型与知识库，上传 PDF 文档后由 <strong>Docling</strong> 完成解析，
          再用 <strong>BAAI/bge-m3</strong> 生成向量并写入 <strong>PostgreSQL + pgvector</strong>。
          用户在 Mendix 中配置 Bot、绑定知识库后即可发起问答，回答由 <strong>DeepSeek</strong>
          基于检索结果生成，并保留来源引用；如果问题涉及风险判断、维修动作或审批要求，就直接进入
          Mendix Workflow，由人工在任务中心完成确认、补充和闭环处理。
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">客户一眼能懂的价值</div>
          <div className="mt-3 text-2xl font-bold text-slate-800">不是聊天，而是企业知识落地</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            让 PDF、手册、制度文件和老师傅经验变成可检索、可问答、可追溯、可进入流程的业务能力。
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">客户最关心的风险控制</div>
          <div className="mt-3 text-2xl font-bold text-slate-800">回答有依据，动作可确认</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            回答不是模型自由发挥，而是基于知识库检索；高风险问题可以进入 Workflow，由人工确认后再执行。
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mendix 的差异化</div>
          <div className="mt-3 text-2xl font-bold text-slate-800">问答之后还能继续办事</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            同一个应用里完成配置、问答、来源查看、工单/审批流转和任务处理，这是纯开源 RAG Demo 很难一步到位的部分。
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">核心技术选型</h3>
            <p className="mt-1 text-sm text-slate-600">把客户最关心的组件说清楚：平台、模型、知识库、解析链路分别是什么。</p>
          </div>
          <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">当前 Demo 实现</span>
        </div>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">应用平台</div>
            <div className="mt-2 font-bold text-slate-800">Mendix</div>
            <div className="mt-2 text-xs leading-5 text-slate-500">负责界面、配置、Bot、权限、任务和流程闭环。</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">文档解析</div>
            <div className="mt-2 font-bold text-slate-800">Docling</div>
            <div className="mt-2 text-xs leading-5 text-slate-500">负责把 PDF 解析成可切片、可检索的结构化内容。</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">LLM</div>
            <div className="mt-2 font-bold text-slate-800">DeepSeek</div>
            <div className="mt-2 text-xs leading-5 text-slate-500">基于检索结果生成回答，适合展示模型可替换能力。</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">Embedding</div>
            <div className="mt-2 font-bold text-slate-800">BAAI/bge-m3</div>
            <div className="mt-2 text-xs leading-5 text-slate-500">负责把知识切片转成向量，提升检索召回质量。</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">知识库</div>
            <div className="mt-2 font-bold text-slate-800">PostgreSQL + pgvector</div>
            <div className="mt-2 text-xs leading-5 text-slate-500">客户容易理解数据归属，也方便继续走私有化部署路径。</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">横向流程泳道图</h3>
            <p className="mt-1 text-sm text-slate-600">建议现场按“先配置、再入库、再问答、最后闭环”这条主线来讲，不要先讲模型参数。</p>
          </div>
          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
            User / Mendix / AI Services / Database / Workflow
          </span>
        </div>
        <div className="swimlane-board">
          <div className="swimlane-grid">
            <div className="swimlane-label">User</div>
            <div className="swimlane-step">选择模型：本地或远程</div>
            <div className="swimlane-step">选择知识库并上传 PDF</div>
            <div className="swimlane-step">查看解析与入库状态</div>
            <div className="swimlane-step">通过 Bot 发起问答</div>
            <div className="swimlane-step">查看待办并处理任务</div>

            <div className="swimlane-label">Mendix</div>
            <div className="swimlane-step">保存模型与连接配置</div>
            <div className="swimlane-step">创建 Bot 并绑定知识库</div>
            <div className="swimlane-step">触发解析、切片和入库流程</div>
            <div className="swimlane-step">展示回答、引用来源和置信度</div>
            <div className="swimlane-step">发起 Workflow 并沉淀处理记录</div>

            <div className="swimlane-label">AI Services</div>
            <div className="swimlane-step muted">读取当前模型配置</div>
            <div className="swimlane-step muted">准备解析和 embedding 参数</div>
            <div className="swimlane-step">Docling 解析 PDF 文本与结构</div>
            <div className="swimlane-step">DeepSeek 基于检索结果生成回答</div>
            <div className="swimlane-step muted">按业务规则判断是否需要人工确认</div>

            <div className="swimlane-label">Database</div>
            <div className="swimlane-step muted">保存连接与元数据</div>
            <div className="swimlane-step">建立 PostgreSQL + pgvector 知识库</div>
            <div className="swimlane-step">切片后写入向量与原文索引</div>
            <div className="swimlane-step">检索相关 chunk 作为上下文</div>
            <div className="swimlane-step">保存问答日志与 workflow 关联</div>

            <div className="swimlane-label">Workflow</div>
            <div className="swimlane-step muted">等待触发</div>
            <div className="swimlane-step muted">等待触发</div>
            <div className="swimlane-step muted">等待触发</div>
            <div className="swimlane-step">当回答涉及动作或审批时创建任务</div>
            <div className="swimlane-step">人工确认、补充信息并完成闭环</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-bold text-slate-800">这套 Demo 对客户最有说服力的点</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>模型可配置，既能讲远程模型，也能讲本地/私有化路径。</li>
            <li>知识库落在 PostgreSQL + pgvector，客户容易接受数据归属和部署边界。</li>
            <li>问答有来源引用，不是“模型看起来很聪明”但没有依据。</li>
            <li>回答之后能进 Workflow，这一点最能体现 Mendix 的企业应用价值。</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-bold text-slate-800">建议你现场重点展示的 4 个点</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>展示回答命中的来源 chunk 和原始 PDF 页码。</li>
            <li>展示解析、切片、embedding、入库的处理状态。</li>
            <li>展示 Bot 当前绑定的模型、知识库和配置快照。</li>
            <li>展示 Workflow 的触发条件、待办任务和最终处理结果。</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-bold text-slate-800">如果继续增强，优先补这 4 个能力</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>增加 rerank，提高复杂问题和长文档场景下的命中质量。</li>
            <li>给知识 chunk 增加权限元数据，支持按角色和部门隔离。</li>
            <li>把问答日志和 workflow 结果关联归档，形成审计链路。</li>
            <li>增加人工反馈回写，让知识库和回答质量持续优化。</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">回答引用来源示例</h3>
            <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
              Source Traceability
            </span>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            这一块建议你在正式 Demo 里直接展示，让客户一眼看到回答不是“模型脑补”，而是明确来自知识库里的原始 PDF 内容。
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-800">来源 1：设备维修手册.pdf</h4>
                  <p className="mt-1 text-xs text-slate-500">页码：P12-P13 · 命中分数：0.92 · 类型：操作步骤</p>
                </div>
                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">高置信度</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                “当设备出现温度异常且伴随主轴振动时，应先检查冷却回路，再确认轴承润滑状态；必要时暂停设备并提交维护审批。”
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-800">来源 2：SOP_安全规程.pdf</h4>
                  <p className="mt-1 text-xs text-slate-500">页码：P04 · 命中分数：0.88 · 类型：安全前置检查</p>
                </div>
                <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">关键安全项</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                “执行检修前必须断电并完成挂牌锁定，未经人工确认不得进入后续拆解流程。”
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Workflow 任务示例</h3>
            <span className="rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
              Human-in-the-loop
            </span>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            这块要告诉客户一件事：问答不是终点。一旦回答涉及维修动作、审批责任或知识纠偏，就进入 Mendix Workflow。
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 border-l-4 border-l-orange-500 bg-orange-50/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-slate-800">任务 1：人工确认维修建议</h4>
                <span className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-800">待处理</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Bot 根据知识库判断需要更换零件，但在执行前要求班组长确认该建议是否适用于当前设备状态。
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 border-l-4 border-l-blue-500 bg-blue-50/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-slate-800">任务 2：创建工单 / 提交审批</h4>
                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">自动发起</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                当回答触发“需要维修”条件后，系统自动创建 Mendix Workflow，并带入设备编号、故障描述、处理建议和引用来源。
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 bg-emerald-50/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-slate-800">任务 3：补充知识 / 纠正答案</h4>
                <span className="rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800">闭环优化</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                如果专家发现回答不完整，可以在任务页补充正确步骤、上传附件或修正说明，为后续知识库优化提供输入。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueSection() {
  return (
    <section className="space-y-8">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">客户决策视角</span>
          <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">Why Mendix</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800">为什么不是只做一个开源 RAG，而是用 Mendix 落地</h2>
        <p className="mt-2 max-w-4xl leading-relaxed text-slate-600">
          客户真正要买的，不是一个能回答问题的模型入口，而是一套能进入真实业务的企业应用。开源 RAG 更适合验证“能不能做出来”，
          Mendix 更适合回答“能不能快速上线、能不能接业务系统、能不能控风险、能不能持续运营”。
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-800">客户最终买的，不是模型，而是这 6 个结果</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["企业知识问答", "把 PDF、SOP、制度和经验知识转成一线、运维、质量、客服都能直接使用的问答能力。"],
              ["可追溯回答", "回答附带来源片段和页码，客户更容易接受，也更方便内部复核。"],
              ["流程闭环", "高风险或不确定问题直接进入 Mendix Workflow，不停留在聊天框里。"],
              ["快速交付", "界面、配置、权限、后台、任务页都能快速落成，而不是从零拼装整套应用。"],
              ["可私有化", "模型、知识库、部署方式都可按企业要求规划，适合逐步走向内网和私有化。"],
              ["持续演进", "先做 RAG，再扩到 Agent、MCP、治理和多知识库，不需要推倒重来。"]
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-800">{title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-800">一句话卖点</h3>
          <p className="text-base leading-8 text-slate-700">
            Mendix 的价值不在于再造一个开源 RAG，而在于把 RAG 变成可交付、可治理、可集成、可进入业务流程的企业应用。
          </p>
          <div className="mt-5 rounded-xl border border-sky-100 bg-white/80 p-4">
            <p className="text-xs font-semibold text-sky-700">适合现场怎么讲</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              如果客户只想验证检索效果，开源框架很多；如果客户要的是一个真正能上线、能接 ERP/MES/工单系统、能有人机闭环的应用，
              Mendix 的优势就会非常明显。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-800">为什么客户最后往往不会停在“纯开源自建”</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">开源自建 RAG</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>检索链路和模型调用可以快速搭出来，适合前期验证。</li>
                <li>底层自由度高，但大量企业能力需要自己补齐。</li>
                <li>UI、权限、配置后台、审批流、任务页、日志与运营都要单独建设。</li>
                <li>PoC 容易，真正走向上线时，组织成本和维护成本往往更高。</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="text-sm font-semibold text-slate-800">Mendix 方案</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>问答之外，直接具备业务应用交付能力。</li>
                <li>可以快速做界面、配置、权限、任务与流程闭环。</li>
                <li>更适合接 ERP、MES、CRM、工单和主数据系统。</li>
                <li>更容易从 Demo 走向试点、再走向真实业务上线。</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-800">Mendix 的差异化优势，重点不在模型，而在落地</h3>
          <div className="space-y-3">
            {[
              "应用交付速度：UI、表单、后台、配置页和任务页更快落地，客户更容易看到一个完整应用，而不是一堆技术组件。",
              "业务流程闭环：问答后直接进入 Workflow、审批和人工确认，真正把 AI 嵌进业务流程。",
              "企业系统集成：更容易接现有业务系统和企业数据源，不会停留在单点 Demo。",
              "治理能力：权限、日志、反馈、运营和审计更容易成体系，更适合正式上线。",
              "持续演进：先做 RAG，后续可平滑演进到 Agent 和 MCP，不需要重做应用壳层。",
              "业务参与度：不只是开发能改，业务团队也更容易参与配置和优化。"
            ].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">One-screen Comparison</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-800">开源 RAG vs Mendix 企业方案</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              这张表适合现场停留 30 秒直接讲清差异，不需要先讲太多技术细节。
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Sales-ready Matrix</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-slate-200 text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-700">
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">对比维度</th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">开源自建 RAG</th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">Mendix 企业方案</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["前期验证", "快，适合技术团队先把检索链路搭起来", "也能快做，但更适合同时做出可演示应用"],
                ["企业界面", "通常要自己补前端、后台和配置页", "界面、配置页、任务页和管理后台可以一起交付"],
                ["权限与治理", "需要自己补权限、日志、审计和运营", "更容易做成权限、日志、反馈、审计一体化"],
                ["流程闭环", "问答之后往往还是要人工跳去别的系统处理", "可直接接 Workflow、审批、工单和人工确认"],
                ["系统集成", "能做，但项目集成工作量通常更高", "更适合接 ERP、MES、CRM、工单和主数据系统"],
                ["走向上线", "PoC 常见，走向正式上线常常变慢", "更容易从 Demo 走向试点、再走向规模化交付"]
              ].map(([title, openSource, mendix]) => (
                <tr key={title} className="bg-white align-top">
                  <td className="border-b border-slate-200 px-4 py-4 font-semibold text-slate-800">{title}</td>
                  <td className="border-b border-slate-200 px-4 py-4 text-slate-600">{openSource}</td>
                  <td className="border-b border-slate-200 px-4 py-4 text-slate-700">{mendix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Decision Summary</p>
            <h3 className="mt-2 text-2xl font-bold">客户决策摘要</h3>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">Closing Story</span>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-slate-200">为什么现在做</p>
            <p className="mt-3 text-sm leading-7 text-slate-100">
              企业知识已经分散在 PDF、制度、SOP 和专家经验里，继续依赖人工查找和口口相传，效率低、传承慢、风险也越来越难控制。
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-slate-200">为什么用 Mendix 做</p>
            <p className="mt-3 text-sm leading-7 text-slate-100">
              因为客户最终需要的不是一个开源 RAG Demo，而是一套能快速交付、能接业务系统、能进 Workflow、能持续治理的企业应用。
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-slate-200">下一步怎么开始</p>
            <p className="mt-3 text-sm leading-7 text-slate-100">
              先选一个高价值、文档密集、流程明确的场景做 PoC，验证问答质量、来源引用和流程闭环，再逐步扩展到试点上线和规模推广。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  return (
    <section className="space-y-8">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">FAQ</span>
          <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">Pre-sales Ready</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800">这个方案客户最常问的 10 个问题</h2>
        <p className="mt-2 text-slate-600 max-w-4xl leading-relaxed">
          这一页的作用是把现场演示时最容易被追问的问题提前收口。默认只展示问题，单击后再展开答案，避免客户第一次进入页面时信息过载。
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_340px] gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openQuestion === index;

              return (
                <div
                  key={item.question}
                  className={`rounded-xl border transition-colors ${
                    isOpen ? "border-amber-300 bg-amber-50/50" : "border-slate-200 bg-white"
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenQuestion((current) => (current === index ? null : index))}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                        {index + 1}
                      </span>
                      <span className="text-base font-semibold text-slate-800">{item.question}</span>
                    </div>
                    <span className="text-sm text-slate-400">{isOpen ? "收起" : "展开"}</span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-amber-100 px-5 py-4">
                      <p className="pl-12 text-sm leading-7 text-slate-700">{item.answer}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-3">怎么用这页做演示</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li>先讲完方案流程，再切到 FAQ，避免一开始被细节打散。</li>
              <li>只点开客户当下在问的那一题，不要一次展开全部。</li>
              <li>如果客户追问架构边界，再顺势跳到底部的官方能力模块。</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-3">最容易被追问的三类点</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-lg bg-white/80 border border-amber-100 p-3">
                <p className="font-semibold text-slate-800">能力边界</p>
                <p className="mt-1">能不能接本地模型、能不能私有化、能不能看引用来源。</p>
              </div>
              <div className="rounded-lg bg-white/80 border border-amber-100 p-3">
                <p className="font-semibold text-slate-800">业务价值</p>
                <p className="mt-1">为什么不是普通聊天，而是能进入 Mendix 业务流程闭环。</p>
              </div>
              <div className="rounded-lg bg-white/80 border border-amber-100 p-3">
                <p className="font-semibold text-slate-800">上线路径</p>
                <p className="mt-1">PoC 怎么做、正式上线还要补哪些治理和运营能力。</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function OfficialGenAIDocsSection() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [openPitches, setOpenPitches] = useState<Record<string, boolean>>({});

  const visibleGroups = officialCapabilityMap
    .map((group) => ({
      ...group,
      items:
        activeFilter === "all"
          ? group.items
          : group.items.filter((item) => item.tags.includes(activeFilter))
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section className="space-y-8">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-2 py-1 rounded">Official Docs</span>
          <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">Mendix GenAI</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Mendix GenAI 官方能力速览</h2>
        <p className="mt-2 text-slate-600 max-w-4xl leading-relaxed">
          这个模块专门给客户快速查看 Mendix 官方 GenAI 能力、模块职责和入口文档。所有链接都指向 Mendix 官方文档，适合售前演示时一边讲方案，一边现场点开验证能力边界。
        </p>
      </header>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">按客户问题快速筛选</h3>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">客户应该先看什么</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialCapabilityMap[4].items.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <span className="text-xs text-blue-700 font-semibold shrink-0">打开文档</span>
              </div>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.description}</p>
              <p className="text-xs text-slate-400 mt-3 break-all">{item.href}</p>
            </a>
          ))}
        </div>
      </div>

      {visibleGroups.slice(0, 4).map((group) => (
        <div key={group.category} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{group.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {group.items.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                <div className="mt-3 rounded-lg bg-slate-50 border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">适用场景</p>
                  <p className="text-sm text-slate-700 mt-1">{item.fit}</p>
                </div>
                <div className="mt-3 rounded-lg border border-sky-100 bg-white">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-3 text-left"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setOpenPitches((current) => ({
                        ...current,
                        [item.title]: !current[item.title]
                      }));
                    }}
                  >
                    <span className="text-xs font-semibold text-sky-700">售前话术</span>
                    <span className="text-xs text-slate-400">
                      {openPitches[item.title] ? "收起" : "点击展开"}
                    </span>
                  </button>
                  {openPitches[item.title] ? (
                    <div className="border-t border-sky-100 bg-sky-50 px-3 py-3">
                      <p className="text-sm text-slate-700">{item.pitch}</p>
                    </div>
                  ) : null}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Mendix Docs</span>
                  <span className="text-blue-700 font-semibold">查看详情</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-r from-sky-50 to-cyan-50 p-6 rounded-xl border border-sky-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-3">给客户展示时怎么讲</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 leading-relaxed">
          <li>先点官方总览，再点 `GenAI Commons`，让客户知道 Mendix GenAI 不是单一 connector，而是一个可组合的平台能力层。</li>
          <li>客户如果问“怎么接模型”，就看 OpenAI / Bedrock / Mendix Cloud GenAI；如果问“怎么做知识库问答”，就看 RAG 和 PgVector Knowledge Base。</li>
          <li>客户如果问“能不能做 agent、调用系统动作、接企业工具”，就切到 Agent Commons 和 MCP Client / MCP Server。</li>
          <li>如果客户关注运营和落地过程，就打开 How-To 和 Runtime Prompt Engineering，说明业务团队也能参与持续优化。</li>
        </ul>
      </div>
    </section>
  );
}

