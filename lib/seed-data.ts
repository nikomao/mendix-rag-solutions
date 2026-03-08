import type { ScenarioRecord } from "@/lib/types";

const baseConfig = {
  headline: "工业 AI 幻觉治理与 Mendix RAG 方案展示",
  subheadline:
    "围绕工业知识库、文档解析、混合检索和 Mendix 低代码编排，构建一个可演示、可调整、可逐步扩展为售前方案台的交互应用。",
  focusNote: "当前焦点：工业 AI 幻觉消除、Mendix GenAI 集成、RAG 演示可配置化。",
  challengeTitle: "为什么不只是接一个 AI Gateway",
  challengePoints: [
    "知识工程必须先处理复杂工业文档，包括手册、图纸、BOM 和故障案例。",
    "检索链路需要关键词检索、向量检索和重排模型协同，而不是单一路径。",
    "Mendix 更适合承担业务编排、人机回路和前端交互，而不是重文档 ETL。",
    "售前展示时需要快速改写指标、方案评分和行业重点，因此页面必须支持交互配置。"
  ],
  stats: [
    {
      label: "通用 LLM 工业幻觉率",
      value: "15-30%",
      note: "无外部知识库支撑时的高风险区间",
      tone: "danger" as const
    },
    {
      label: "RAG 引入后的准确率",
      value: ">92%",
      note: "建立高质量知识库后的参考值",
      tone: "success" as const
    },
    {
      label: "Mendix 交付效率提升",
      value: "4x-6x",
      note: "相对纯代码全栈交付的常见收益",
      tone: "primary" as const
    }
  ],
  hallucinationData: [
    { label: "事实捏造", withoutRag: 35, withRag: 5 },
    { label: "过期信息", withoutRag: 25, withRag: 8 },
    { label: "逻辑错误", withoutRag: 20, withRag: 12 },
    { label: "引用失效", withoutRag: 15, withRag: 2 },
    { label: "安全越界", withoutRag: 5, withRag: 1 }
  ],
  ecosystemCards: [
    {
      title: "Ragflow",
      badge: "核心编排",
      summary: "更偏向复杂文档理解的开源 RAG 引擎，适合工业手册、多栏 PDF 和表格文档。",
      highlight: "为什么重要",
      detail: "相比通用链路框架，Ragflow 在文档解析与知识入库的现成能力更适合工业知识工程。"
    },
    {
      title: "Milvus / Zilliz",
      badge: "向量存储",
      summary: "面向高规模向量检索的数据库，适合设备知识库、案例库和 FAQ 的统一索引。",
      highlight: "优势",
      detail: "高性能、可扩展，适合承接工业场景中大量知识片段的毫秒级召回。"
    },
    {
      title: "NebulaGraph / Neo4j",
      badge: "图谱增强",
      summary: "用知识图谱补强复杂故障关系、设备部件依赖和推理路径。",
      highlight: "工业应用",
      detail: "当故障排查涉及多跳关系时，Graph RAG 能有效弥补纯向量检索的短板。"
    }
  ],
  comparisonAxes: [
    { label: "开发速度", mendix: 90, openSource: 40, commercial: 95 },
    { label: "定制灵活性", mendix: 40, openSource: 95, commercial: 30 },
    { label: "数据隐私", mendix: 70, openSource: 90, commercial: 50 },
    { label: "运维成本", mendix: 80, openSource: 30, commercial: 90 },
    { label: "工业解析能力", mendix: 50, openSource: 95, commercial: 75 }
  ],
  etlTabs: [
    {
      id: "files",
      label: "文件文档",
      title: "复杂文档解析",
      description: "适用于 PDF、Word、PPT、工艺规程、设备说明书等静态知识源。",
      bullets: [
        "优先选用支持表格、页眉页脚、多栏布局识别的解析器。",
        "在生产实践里，Chunking 策略往往比单纯换模型更影响召回质量。",
        "建议为每个知识片段保留来源页码、版本号和文档权限信息。"
      ]
    },
    {
      id: "multimedia",
      label: "音视频",
      title: "音视频解析",
      description: "用于维修录音、培训视频、专家答疑和现场巡检视频。",
      bullets: [
        "中文语音识别可以优先考虑 FunASR 一类更贴合中文工业术语的方案。",
        "视频应拆分为关键帧、字幕和时间线摘要后再进入知识库。",
        "售前演示可用一条检维修视频串联 ASR、摘要和知识检索流程。"
      ]
    },
    {
      id: "3d",
      label: "3D / CAD",
      title: "3D 模型关联检索",
      description: "不建议一开始直接把几何体作为主检索对象，更务实的是做模型与文档知识的关联。",
      bullets: [
        "先解析 STEP、BOM、零件元数据，再将模型与手册、参数表建立映射。",
        "Mendix 负责 3D Viewer 展示和交互，RAG 负责回答该模型对应的知识问题。",
        "这条路线更适合企业真实落地，也更容易在售前场景中讲清价值。"
      ]
    }
  ],
  implementationSteps: [
    {
      title: "知识库后端先行",
      body: "在 Python 或 Go 服务中完成文档解析、切片、向量化与索引，不把重 ETL 放在 Mendix 里做。",
      keyAction: "关键动作：优先部署向量库、Embedding 模型和文档解析链路。"
    },
    {
      title: "Mendix 做业务编排",
      body: "通过 GenAI Commons、REST 或 OData 接入外部 RAG 服务，承接表单、聊天、审批和业务实体上下文。",
      keyAction: "关键动作：把检索到的上下文与 Mendix 业务对象一起注入 Prompt。"
    },
    {
      title: "加入行业上下文",
      body: "设备型号、工单状态、故障码、工厂区域等企业对象，是低代码平台相对纯聊天系统的核心优势。",
      keyAction: "关键动作：让回答始终围绕当前业务对象而不是泛泛问答。"
    },
    {
      title: "建立人机回路",
      body: "让专家能对回答点赞、纠错、补充资料，并将反馈重新沉淀为知识资产。",
      keyAction: "关键动作：把反馈闭环也纳入演示流程，体现企业级可治理能力。"
    }
  ]
};

export const seedScenarios: ScenarioRecord[] = [
  {
    slug: "smart-factory",
    title: "离散制造售前方案",
    industry: "离散制造",
    summary: "聚焦设备维修、BOM、工单和 3D 模型关联检索。",
    config: {
      ...baseConfig,
      focusNote: "场景焦点：产线设备故障诊断、工单上下文、3D 模型关联文档。"
    },
    parameters: {
      model: "DeepSeek-V3",
      vectorDb: "Milvus",
      parser: "Ragflow DeepDoc",
      deploymentMode: "Hybrid",
      budgetTier: "Balanced",
      rerank: true,
      graphRag: true,
      hitl: true
    },
    knowledgeDocuments: [
      {
        id: "sf-1",
        title: "数控机床故障排查手册",
        type: "PDF",
        excerpt: "故障码 E102 通常与主轴驱动温升和冷却回路堵塞有关，排查时应先确认工单历史和冷却系统状态。",
        keywords: ["故障", "主轴", "冷却", "E102", "机床", "维修"],
        section: "维修知识库",
        trust: "gold"
      },
      {
        id: "sf-2",
        title: "泵站 3D 模型 BOM 对照表",
        type: "XLSX",
        excerpt: "3D 模型中的 P-204 泵组件对应备件包 A17，与振动传感器和轴承维护周期有关。",
        keywords: ["3d", "cad", "bom", "备件", "泵", "轴承"],
        section: "工程资产",
        trust: "silver"
      },
      {
        id: "sf-3",
        title: "设备工单与停机事件规范",
        type: "DOCX",
        excerpt: "在 Mendix 工单页中，应将设备编号、停机时长、故障码和班次信息注入到检索请求中。",
        keywords: ["mendix", "工单", "设备编号", "停机", "故障码"],
        section: "业务流程",
        trust: "gold"
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    slug: "energy-ops",
    title: "能源运维知识助手",
    industry: "能源电力",
    summary: "覆盖巡检录音、视频培训材料和多站点资产手册。",
    config: {
      ...baseConfig,
      headline: "能源运维 AI 助手与 Mendix RAG 展示",
      subheadline:
        "围绕巡检、缺陷处理、运行规程和培训视频，演示 Mendix 如何与多模态 RAG 服务协作，构建运维知识助手。",
      focusNote: "场景焦点：巡检音视频解析、站点权限隔离、运维 SOP 引导。"
    },
    parameters: {
      model: "Qwen-Max",
      vectorDb: "Elasticsearch + Milvus",
      parser: "FunASR + DeepDoc",
      deploymentMode: "Private Cloud",
      budgetTier: "Premium",
      rerank: true,
      graphRag: false,
      hitl: true
    },
    knowledgeDocuments: [
      {
        id: "eo-1",
        title: "变电站巡检录音转写摘要",
        type: "Audio Transcript",
        excerpt: "巡检员提到 2 号变压器风冷系统报警复现，建议结合近三次告警时间线进行原因比对。",
        keywords: ["巡检", "录音", "变压器", "告警", "风冷"],
        section: "巡检记录",
        trust: "gold"
      },
      {
        id: "eo-2",
        title: "新能源场站缺陷处理 SOP",
        type: "PDF",
        excerpt: "高频告警场景下需要优先检查通讯链路，再根据保护装置版本选择对应处置步骤。",
        keywords: ["sop", "缺陷", "处置", "告警", "通讯", "保护装置"],
        section: "运行规程",
        trust: "gold"
      },
      {
        id: "eo-3",
        title: "培训视频关键帧说明",
        type: "Video Summary",
        excerpt: "视频第 03:12 至 05:45 演示了断路器机构箱检查步骤，可直接作为回答来源引用。",
        keywords: ["视频", "培训", "断路器", "关键帧", "步骤"],
        section: "培训资料",
        trust: "silver"
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    slug: "quality-trace",
    title: "汽车质量追溯助手",
    industry: "汽车制造",
    summary: "围绕质检记录、供应商文档和异常案例做跨系统追溯。",
    config: {
      ...baseConfig,
      headline: "汽车质量追溯与 Mendix RAG 展示",
      subheadline:
        "面向零部件异常、批次追溯和供应商协同，展示 Mendix 如何联合 RAG 服务构建质量调查助手。",
      focusNote: "场景焦点：供应商资料整合、批次追溯、异常案例复用。"
    },
    parameters: {
      model: "Doubao-1.5-Pro",
      vectorDb: "pgvector",
      parser: "LlamaParse",
      deploymentMode: "On-Prem",
      budgetTier: "Lean",
      rerank: false,
      graphRag: true,
      hitl: true
    },
    knowledgeDocuments: [
      {
        id: "qt-1",
        title: "供应商 8D 报告模板",
        type: "DOCX",
        excerpt: "针对来料异常，问答界面需同时展示 8D 节点、责任人和历史纠正措施。",
        keywords: ["8d", "供应商", "异常", "纠正措施", "责任人"],
        section: "供应商协同",
        trust: "gold"
      },
      {
        id: "qt-2",
        title: "焊装线缺陷案例库",
        type: "PDF",
        excerpt: "当问题涉及焊点虚焊与夹具偏移时，应关联批次号、班次和设备维护历史一起检索。",
        keywords: ["焊装", "缺陷", "批次", "班次", "夹具", "维护"],
        section: "案例知识库",
        trust: "gold"
      },
      {
        id: "qt-3",
        title: "质量追溯对象模型说明",
        type: "Markdown",
        excerpt: "Mendix 页面中的 VIN、批次号、供应商编号是最关键的业务对象上下文。",
        keywords: ["mendix", "vin", "批次号", "供应商", "对象模型"],
        section: "业务模型",
        trust: "silver"
      }
    ],
    updatedAt: new Date().toISOString()
  }
];
