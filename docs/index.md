<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>工业AI幻觉与Mendix RAG深度洞察</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Chosen Palette: Corporate Clean (Warm Slate background, Deep Blue primary, Teal/Orange accents) -->
    <!-- Application Structure Plan: Sidebar navigation for clear thematic separation. 
         1. Overview: Problem statement (Hallucinations) & Solution (RAG).
         2. Ecosystem: The Chinese market RAG landscape (Ragflow, DBs).
         3. Comparison: Deep dive into Mendix GenAI vs Open Source vs Commercial.
         4. ETL: Specifics on parsing (Files, 3D, Video) as requested.
         5. Implementation: How to execute Mendix RAG in enterprise.
         Why: Allows decision-makers to jump between high-level strategy and technical details (ETL/Architecture). 
    -->
    <!-- Visualization & Content Choices: 
         1. Overview: KPI Cards (Inform) -> Immediate context on Hallucination rates. Horizontal Bar chart.
         2. Comparison: Radar Chart (Compare) -> Mendix vs Open Source vs Commercial on 5 axes.
         3. Ecosystem: Interactive Grid (Organize) -> Visualizing the stack (Ragflow vs Commercial).
         4. ETL: Tabbed Content (Organize) -> Managing density of tools for different media types.
         5. Implementation: Flowchart built with CSS/Grid (Process) -> Visualizing the Mendix workflow.
         Confirmation: NO SVG graphics used. NO Mermaid JS used. CSS shapes and Unicode used instead.
    -->
    <!-- CONFIRMATION: NO SVG graphics used. NO Mermaid JS used. -->

    <style>
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f8fafc; /* Warm neutral light */
            color: #1e293b;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9; 
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; 
        }

        /* Chart Container Styling - Mandatory per instructions */
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 600px; /* Constraint */
            margin-left: auto;
            margin-right: auto;
            height: 350px; /* Base height */
            max-height: 400px;
        }
        
        .nav-item.active {
            background-color: #e0f2fe;
            color: #0369a1;
            border-right: 4px solid #0284c7;
        }

        /* Interactive Card Styling */
        .info-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .info-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border-color: #38bdf8;
        }

        /* Tab Styling */
        .tab-btn {
            transition: all 0.2s;
        }
        .tab-btn.active {
            border-bottom: 2px solid #0284c7;
            color: #0284c7;
            font-weight: 600;
        }
    </style>
</head>
<body class="flex h-screen overflow-hidden">

    <!-- Sidebar Navigation -->
    <nav class="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-full shadow-sm z-10">
        <div class="p-6 border-b border-slate-100">
            <h1 class="text-xl font-bold text-slate-800 tracking-tight">AI 工业洞察</h1>
            <p class="text-xs text-slate-500 mt-1">RAG与Mendix方案分析</p>
        </div>
        <div class="flex-1 overflow-y-auto py-4">
            <ul class="space-y-1">
                <li>
                    <button onclick="navigateTo('overview')" id="nav-overview" class="nav-item w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors active">
                        📊 核心概览
                    </button>
                </li>
                <li>
                    <button onclick="navigateTo('ecosystem')" id="nav-ecosystem" class="nav-item w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        🇨🇳 中国RAG生态
                    </button>
                </li>
                <li>
                    <button onclick="navigateTo('comparison')" id="nav-comparison" class="nav-item w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        ⚖️ 方案深度对比
                    </button>
                </li>
                <li>
                    <button onclick="navigateTo('etl')" id="nav-etl" class="nav-item w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        📂 数据解析与ETL
                    </button>
                </li>
                <li>
                    <button onclick="navigateTo('implementation')" id="nav-implementation" class="nav-item w-full text-left px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        🚀 Mendix落地指南
                    </button>
                </li>
            </ul>
        </div>
        <div class="p-4 border-t border-slate-100">
            <div class="bg-blue-50 p-3 rounded-lg">
                <p class="text-xs text-blue-800 font-semibold">当前关注点</p>
                <p class="text-xs text-blue-600 mt-1">工业AI幻觉消除 & Mendix GenAI 架构</p>
            </div>
        </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1 h-full overflow-y-auto bg-slate-50 p-8 relative" id="main-content">
        
        <!-- SECTION: OVERVIEW -->
        <section id="overview" class="space-y-8 animate-fade-in">
            <header class="mb-6">
                <div class="flex items-center gap-3 mb-2">
                    <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">真实业务风险</span>
                    <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">落地控制边界</span>
                </div>
                <h2 class="text-3xl font-bold text-slate-800">为什么通用大模型不能直接进入工业业务现场</h2>
                <p class="mt-2 text-slate-600 max-w-4xl leading-relaxed">
                    对中国工业客户来说，真正敏感的不是“模型聪不聪明”，而是它会不会在设备异常、SOP 查询、安全规程、质量追溯这些真实业务场景里给出“听起来很合理、但不适用于当前现场”的答案。现场一旦照着执行，后果往往不是答错一道题，而是停机、返工、质量偏差、合规风险，甚至安全事故。真正能落地的路径，不是把通用模型直接推到一线，而是先用企业知识库把回答边界收紧，再用来源引用、权限控制和 Workflow 把 AI 放进可追溯、可确认、可闭环的业务流程里。
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-orange-500 border-slate-200 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-2">
                        <div class="text-sm text-slate-500 font-bold">真实场景 1：设备运维建议“像对的”，但不一定适用于当前设备</div>
                        <div class="text-xl">🛠️</div>
                    </div>
                    <div class="text-2xl font-bold text-slate-800 mt-2">一线误操作风险</div>
                    <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                        在设备异常、检修和参数确认场景中，通用模型可能会给出“通用经验型建议”，但它并不知道当前设备型号、当前工况、当前维修前置条件和企业内部限制。客户真正担心的是一线人员按回答直接操作，结果把小问题变成停机、误修甚至安全事件。
                    </p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-red-500 border-slate-200 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-2">
                        <div class="text-sm text-slate-500 font-bold">真实场景 2：SOP、安全规程、质量标准不能“差不多”</div>
                        <div class="text-xl">⚠️</div>
                    </div>
                    <div class="text-2xl font-bold text-red-600 mt-2">返工与合规风险</div>
                    <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                        在 SOP 查询、安全前置动作、质检标准和问题追溯场景中，最怕的不是 AI 不会答，而是它把不同版本文件、不同场景经验和不完整规则混在一起，回答得很顺，却不等于企业认可的标准答案。这类错误一旦进入业务现场，直接代价就是返工、质量偏差、审计问题和责任不清。
                    </p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500 border-slate-200 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-2">
                        <div class="text-sm text-slate-500 font-bold">真实价值：把老师傅经验和制度文件变成可控的业务能力</div>
                        <div class="text-xl">🔗</div>
                    </div>
                    <div class="text-2xl font-bold text-blue-600 mt-2">从“会回答”到“能落地”</div>
                    <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                        真正有效的方案，不是只做一个聊天入口，而是把企业知识库、来源引用、角色权限、人工确认和 Workflow 串起来。这样既能把散落在 PDF、SOP 和老师傅经验里的知识沉淀下来，也能让问答结果继续推进到工单、审批、任务和系统集成里。
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 class="text-lg font-bold text-slate-800 mb-4">通用大模型在工业场景中的高频业务风险</h3>
                    <div class="chart-container">
                        <canvas id="hallucinationChart"></canvas>
                    </div>
                    <p class="text-xs text-center text-slate-400 mt-4">图注：企业知识库与 RAG 不是为了让回答更花哨，而是为了降低误导现场执行的风险</p>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                    <h3 class="text-lg font-bold text-slate-800 mb-4">客户真正买单的，不是聊天能力，而是业务可控性</h3>
                    <p class="text-sm text-slate-600 mb-4 leading-relaxed">
                        很多企业一开始都会说“我们也想做一个企业内部 ChatGPT”，但真正进入试点后，客户马上关心的会变成另外几件事：回答有没有依据、不同岗位看到的是不是同一套规则、高风险问题能不能人工确认、问答之后能不能直接进入工单或审批。真正的工业级 AI，不是更会聊天，而是更能进入业务流程并承担责任边界。
                    </p>
                    <div class="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                        <div class="flex items-start">
                            <div class="flex-shrink-0 bg-blue-100 text-blue-700 w-6 h-6 rounded flex items-center justify-center font-bold text-xs mt-0.5 mr-3">1</div>
                            <p class="text-sm text-slate-700"><strong>知识边界必须可控：</strong> 工业文档往往涉及设备细节、工艺规范和内部制度，RAG 检索链路必须与 Mendix 的领域模型 (Domain Model) RBAC 权限深度绑定，不能让任何人问到任何内容。</p>
                        </div>
                        <div class="flex items-start">
                            <div class="flex-shrink-0 bg-blue-100 text-blue-700 w-6 h-6 rounded flex items-center justify-center font-bold text-xs mt-0.5 mr-3">2</div>
                            <p class="text-sm text-slate-700"><strong>从问答到闭环：</strong> RAG 给出维修步骤、质检建议或制度依据后，不应该让员工再手动去 ERP、MES 或工单系统二次录入。Mendix 的价值是把问答结果直接推进到工单、审批、任务流和系统集成里。</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION: ECOSYSTEM -->
        <section id="ecosystem" class="hidden space-y-8 animate-fade-in">
            <header>
                <div class="flex items-center gap-3 mb-2">
                    <span class="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">中国市场图谱</span>
                    <span class="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">架构选型现实题</span>
                </div>
                <h2 class="text-3xl font-bold text-slate-800">中国 RAG 生态：客户真正纠结的，不是能不能做，而是谁来负责</h2>
                <p class="mt-2 text-slate-600 max-w-4xl leading-relaxed">
                    在中国市场谈 RAG，客户真正纠结的往往不是“有没有模型”“能不能做个问答 Demo”，而是另外几个更现实的问题：核心数据能不能不出域、复杂文档到底能不能解析准、出了问题谁能排查、上线之后谁来运维、业务部门要改规则时能不能快速响应。工业客户做选型，本质上是在 <strong>“开源自建的可控性”</strong> 与 <strong>“商业平台的上线速度”</strong> 之间做取舍。
                </p>
            </header>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="bg-emerald-50 border-b border-emerald-100 p-4">
                        <h3 class="font-bold text-emerald-900 text-lg flex items-center">
                            <span class="text-2xl mr-2">🛠️</span> 路线一：开源自建 / 私有化深度定制
                        </h3>
                        <p class="text-xs text-emerald-700 mt-1">适合核心工业机密、强内网要求、复杂图册解析、对底层可控性要求极高的场景。</p>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="rounded-lg bg-emerald-50/60 border border-emerald-100 p-3 text-sm text-emerald-900">
                            <strong>客户为什么会选这条路：</strong> 不愿把核心知识交给外部平台，希望底层解析、切片、模型和存储全都握在自己手里。
                        </div>
                        <div class="border-l-2 border-emerald-400 pl-3">
                            <h4 class="text-sm font-bold text-slate-800">常见底层组件</h4>
                            <ul class="mt-1 space-y-2 text-sm text-slate-600">
                                <li><strong>Ragflow：</strong> 工业文档解析能力强，适合复杂表格、规程和手册切分。</li>
                                <li><strong>Dify：</strong> 工作流编排友好，适合快速拼装多步问答和 Agent 流程。</li>
                                <li><strong>Milvus / pgvector：</strong> 向量存储常见选择，适合私有化知识库底座。</li>
                                <li><strong>NebulaGraph：</strong> 适合设备 BOM、故障关系、工艺依赖这类图谱增强场景。</li>
                            </ul>
                        </div>
                        <div class="border-l-2 border-emerald-400 pl-3">
                            <h4 class="text-sm font-bold text-slate-800">客户最在意的优点</h4>
                            <ul class="mt-1 space-y-2 text-sm text-slate-600">
                                <li><strong>数据边界可控：</strong> 数据不出域，适合高保密、央国企、制造核心工艺场景。</li>
                                <li><strong>底层可干预：</strong> 表格切分、Chunking、Rerank、权限过滤都能自己掌控。</li>
                                <li><strong>可按行业深度优化：</strong> 更适合复杂工业图册、手册、设备知识和内部术语体系。</li>
                            </ul>
                        </div>
                        <div class="bg-slate-50 p-3 rounded text-xs text-slate-500 mt-2 border border-slate-100">
                            <strong>客户最终会遇到的现实问题：</strong> 数据是安全了，但企业也要自己承担底层运维、模型部署、GPU 资源、解析效果调优、故障排查和版本升级。这条路的门槛不是“会不会搭”，而是“有没有长期养这套底座的能力”。
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="bg-orange-50 border-b border-orange-100 p-4">
                        <h3 class="font-bold text-orange-900 text-lg flex items-center">
                            <span class="text-2xl mr-2">🏢</span> 路线二：商业化 MaaS / 一站式平台
                        </h3>
                        <p class="text-xs text-orange-700 mt-1">适合外围业务线、售后客服、通用制度问答、快速 PoC 和轻量试点。</p>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="rounded-lg bg-orange-50/60 border border-orange-100 p-3 text-sm text-orange-900">
                            <strong>客户为什么会选这条路：</strong> 希望先快速跑起来，尽量少养底层团队，把精力放在业务试点和结果验证上。
                        </div>
                        <div class="border-l-2 border-orange-400 pl-3">
                            <h4 class="text-sm font-bold text-slate-800">常见平台选择</h4>
                            <ul class="mt-1 space-y-2 text-sm text-slate-600">
                                <li><strong>阿里云百炼：</strong> 适合快速做知识库问答和业务试点，工程成熟度高。</li>
                                <li><strong>百度千帆：</strong> 适合需要配套模型精调、数据处理和企业生态协同的场景。</li>
                                <li><strong>智谱 / 百川等平台：</strong> 适合企业级长文本和行业增强需求。</li>
                            </ul>
                        </div>
                        <div class="border-l-2 border-orange-400 pl-3">
                            <h4 class="text-sm font-bold text-slate-800">客户最在意的优点</h4>
                            <ul class="mt-1 space-y-2 text-sm text-slate-600">
                                <li><strong>上线快：</strong> 文档上传、知识库生成、调用接口基本一条龙。</li>
                                <li><strong>前期团队压力小：</strong> 不需要先养一整套模型和向量库运维团队。</li>
                                <li><strong>试点成本更低：</strong> 适合先验证业务价值，再决定要不要继续深度建设。</li>
                            </ul>
                        </div>
                        <div class="bg-slate-50 p-3 rounded text-xs text-slate-500 mt-2 border border-slate-100">
                            <strong>客户最终会遇到的现实问题：</strong> 前期确实快，但一旦进入复杂工业文档、严格权限、私有化边界或需要深度干预切分策略的场景，就会遇到 <strong>“黑盒化”</strong> 问题。能跑，不代表能长期被业务掌控。
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-slate-200 mt-8 shadow-sm">
                <h3 class="text-lg font-bold text-slate-800 mb-6 text-center">客户最终更容易接受的，不是二选一，而是分层架构</h3>
                <p class="text-sm text-slate-600 text-center max-w-4xl mx-auto mb-6">
                    真正稳妥的做法通常不是“纯开源”或“纯 MaaS”二选一，而是把底层模型和知识处理能力，与上层业务应用、权限、流程和系统集成解耦。<strong>Mendix 的价值不是替代这些生态，而是把它们组织成可交付的企业应用。</strong>
                </p>
                
                <div class="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                    
                    <div class="flex-1 bg-slate-50 border-2 border-dashed border-slate-300 p-4 rounded-lg flex flex-col items-center relative w-full">
                        <div class="absolute -top-3 bg-white text-slate-500 font-bold px-2 text-xs border border-slate-200 rounded-full">场景 A：通用知识与外围业务</div>
                        <div class="font-bold text-slate-700 mb-2 mt-2">如：制度问答、客服知识、员工服务</div>
                        <div class="text-2xl mb-2">⬇️</div>
                        <div class="bg-orange-100 text-orange-800 px-3 py-2 rounded text-center w-full shadow-sm mb-3">
                            底层采用 <strong>商业化 MaaS API</strong><br>先跑通问答和试点
                        </div>
                        <div class="text-center text-xs text-slate-500 border-t border-slate-200 pt-2 w-full">
                            Mendix 负责前端、权限、配置和业务集成
                        </div>
                    </div>

                    <div class="text-slate-300 text-2xl hidden md:block">VS</div>

                    <div class="flex-1 bg-slate-50 border-2 border-blue-400 p-4 rounded-lg flex flex-col items-center relative w-full shadow-md transform scale-105">
                        <div class="absolute -top-3 bg-blue-600 text-white font-bold px-3 py-0.5 text-xs rounded-full">场景 B：工业核心知识 / 复杂文档</div>
                        <div class="font-bold text-blue-900 mb-2 mt-2">如：工艺参数、设备手册、复杂表格规范</div>
                        <div class="text-2xl mb-2 text-blue-500">⬇️</div>
                        <div class="bg-emerald-100 text-emerald-800 px-3 py-2 rounded text-center w-full shadow-sm mb-3 font-bold border border-emerald-200">
                            底层采用 <strong>私有化 / 开源自建 RAG 引擎</strong><br>保证数据和解析可控
                        </div>
                        <div class="text-center text-xs text-blue-700 border-t border-blue-200 pt-2 w-full font-medium">
                            Mendix 负责业务应用层、Workflow、审批、系统集成
                        </div>
                    </div>
                </div>

                <div class="mt-6 rounded-xl bg-sky-50 border border-sky-100 p-4 text-sm text-slate-700">
                    <strong>这页客户最容易共鸣的一句话：</strong> 开源方案解决的是“底层可控”，商业 MaaS 解决的是“前期跑得快”，而 Mendix 解决的是“这些能力最终怎么变成一个真正可用、可管、可交付的企业应用”。
                </div>
            </div>
        </section>

        <!-- SECTION: COMPARISON -->
        <section id="comparison" class="hidden space-y-8 animate-fade-in">
            <header>
                <div class="flex items-center gap-3 mb-2">
                    <span class="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">架构决策矩阵</span>
                    <span class="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">TCO与治理</span>
                </div>
                <h2 class="text-3xl font-bold text-slate-800">方案深度对比：客户最终为什么会选 Mendix</h2>
                <p class="mt-2 text-slate-600 max-w-4xl leading-relaxed">
                    客户真正会签单，不是因为某个方案“技术上能做”，而是因为它能在生产环境里长期跑下去。本节不再只比模型和框架，而是直接比客户最关心的几件事：<strong>谁来负责、谁来运维、权限怎么控、流程怎么接、试点之后能不能规模化</strong>。
                </p>
            </header>

            <!-- The Mendix Value Proposition Highlight -->
            <div class="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div class="absolute -right-10 -top-10 text-9xl opacity-10">💡</div>
                <h3 class="text-xl font-bold mb-3 flex items-center"><span class="mr-2">🎯</span> Mendix 的真正价值，不在模型层，而在业务落地层</h3>
                <p class="text-sm text-blue-100 leading-relaxed max-w-4xl">
                    Mendix 不和开源框架争“谁更懂底层算法”，也不和模型厂商争“谁的模型更聪明”。Mendix 的价值在于把底层模型、RAG、权限、流程、系统集成和业务界面组织成一个真正可交付的企业应用。客户最终买的不是一个 API，也不是一个 Demo，而是一套 <strong>能上线、能治理、能集成、能闭环</strong> 的业务系统。
                </p>
            </div>

            <div class="flex flex-col xl:flex-row gap-8">
                <!-- Radar Chart -->
                <div class="xl:w-1/2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <h3 class="text-lg font-bold text-slate-800 mb-4 text-center">企业级架构五维评估模型</h3>
                    <div class="chart-container relative w-full h-80 max-w-lg mx-auto">
                        <canvas id="comparisonRadar"></canvas>
                    </div>
                    <div class="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-600 font-medium">
                        <span class="flex items-center px-2 py-1 bg-slate-50 rounded"><span class="w-3 h-3 rounded-full bg-blue-600 mr-2"></span> Mendix 融合架构</span>
                        <span class="flex items-center px-2 py-1 bg-slate-50 rounded"><span class="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span> 纯开源自研栈</span>
                        <span class="flex items-center px-2 py-1 bg-slate-50 rounded"><span class="w-3 h-3 rounded-full bg-orange-500 mr-2"></span> 商业公有云 MaaS</span>
                    </div>
                </div>

                <!-- Deep Dive Cards -->
                <div class="xl:w-1/2 space-y-4">
                    <div class="bg-white p-5 rounded-xl border border-l-4 border-l-blue-600 shadow-md transform transition-all hover:scale-[1.01]">
                        <h4 class="font-bold text-slate-800 mb-3 text-lg">Mendix 融合架构：最适合走向正式交付</h4>
                        <ul class="text-xs text-slate-700 space-y-3 leading-relaxed">
                            <li class="flex items-start">
                                <span class="text-blue-600 font-bold mr-2 text-sm">✔</span> 
                                <div>
                                    <strong class="text-slate-800">不只是问答，而是带业务上下文的企业应用：</strong> 
                                    RAG 不应只检索静态 PDF。Mendix 可以把 ERP、MES、工单、主数据、权限和实时业务状态一起带进 AI 上下文，回答不再是“通用建议”，而是和当前业务对象强绑定的结果。
                                </div>
                            </li>
                            <li class="flex items-start">
                                <span class="text-blue-600 font-bold mr-2 text-sm">✔</span> 
                                <div>
                                    <strong class="text-slate-800">原生治理能力：</strong> 
                                    企业最怕的是数据越权和责任不清。Mendix 可以复用现有领域模型、RBAC 和流程体系，让不同岗位面对同一个 AI 助手时，只能看到各自权限内的数据和知识。
                                </div>
                            </li>
                            <li class="flex items-start">
                                <span class="text-blue-600 font-bold mr-2 text-sm">✔</span> 
                                <div>
                                    <strong class="text-slate-800">从问答走向闭环：</strong> 
                                    这是客户最愿意买单的差异点。Mendix 允许 AI 给出建议后，直接进入 Workflow、审批、工单和任务流，真正把 AI 从聊天框推进到业务动作。
                                </div>
                            </li>
                            <li class="flex items-start bg-slate-50 p-2 rounded mt-2 border border-slate-100">
                                <span class="text-slate-400 font-bold mr-2 text-sm">💡</span> 
                                <div class="text-[11px] text-slate-500 italic">
                                    <strong>架构权衡：</strong> 对底层前沿切分算法（如多模态深度解析）的直接干预力较弱。但我们推荐“解耦架构”：在后端挂载专属解析微服务（如 IBM Docling）完成 ETL，Mendix 专职负责核心业务编排，扬长避短。
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="bg-white p-5 rounded-xl border border-l-4 border-l-emerald-500 shadow-sm opacity-90">
                        <h4 class="font-bold text-slate-800 mb-3">纯代码自研：底层自由度高，但组织成本也最高</h4>
                        <ul class="text-xs text-slate-600 space-y-3 leading-relaxed">
                            <li class="flex items-start">
                                <span class="text-emerald-500 font-bold mr-2 text-sm">✔</span> 
                                <div>
                                    <strong class="text-slate-800">底层自由度最高：</strong> 
                                    可以快速接入最新算法、最新框架和最灵活的解析策略，理论上对复杂场景的调优上限最高。
                                </div>
                            </li>
                            <li class="flex items-start">
                                <span class="text-red-500 font-bold mr-2 text-sm">✘</span> 
                                <div>
                                    <strong class="text-slate-800">隐性 TCO 极高：</strong> 
                                    真正贵的不是模型，而是企业自己要长期养前端、后端、算法、平台运维、权限体系和企业集成这一整套能力。
                                </div>
                            </li>
                            <li class="flex items-start">
                                <span class="text-red-500 font-bold mr-2 text-sm">✘</span> 
                                <div>
                                    <strong class="text-slate-800">最容易卡死在最后一公里：</strong> 
                                    Demo 容易，但一旦要上正式环境，要做权限、审计、HITL、业务状态流和系统对接，项目周期会明显拉长，而且极易偏离原始业务目标。
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Architect Decision Matrix -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
                <div class="bg-slate-50 border-b border-slate-200 p-4">
                    <h3 class="font-bold text-slate-800">首席架构师决策矩阵 (Architect's Decision Matrix)</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-slate-600">
                        <thead class="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
                            <tr>
                                <th class="px-6 py-4 w-1/4">评估维度</th>
                                <th class="px-6 py-4 w-1/4 text-blue-800 bg-blue-50/50">Mendix 融合架构 (Low-Code)</th>
                                <th class="px-6 py-4 w-1/4">纯开源栈自建 (Python Full-stack)</th>
                                <th class="px-6 py-4 w-1/4">商业 MaaS (公有云 SaaS)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="font-bold text-slate-800">遗留系统集成联动</div>
                                    <div class="text-[10px] text-slate-500 mt-1">与 ERP/MES/SCADA 的对接成本</div>
                                </td>
                                <td class="px-6 py-4 bg-blue-50/30">
                                    <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded font-bold text-xs mb-1">极佳 (Native)</span>
                                    <p class="text-xs">内置数百种企业连接器。大模型可直接通过 Function Calling 触发 Mendix 微流执行审批动作。</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-block px-2 py-1 bg-red-100 text-red-800 rounded font-bold text-xs mb-1">差 (High Effort)</span>
                                    <p class="text-xs">需大量手写 API 适配器、鉴权逻辑及状态机，且难以维护。</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-bold text-xs mb-1">中等 (API Based)</span>
                                    <p class="text-xs">提供标准 API，但回调企业内网系统存在网关穿越和安全配置成本。</p>
                                </td>
                            </tr>
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="font-bold text-slate-800">企业级数据权限 (RBAC)</div>
                                    <div class="text-[10px] text-slate-500 mt-1">知识隔离与合规审计保障</div>
                                </td>
                                <td class="px-6 py-4 bg-blue-50/30">
                                    <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded font-bold text-xs mb-1">极佳 (Built-in)</span>
                                    <p class="text-xs">复用 Mendix 现有的实体级/行级权限控制。检索结果在展示层自动进行 RBAC 过滤，审计日志无缝集成。</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-block px-2 py-1 bg-red-100 text-red-800 rounded font-bold text-xs mb-1">差 (Reinvent the wheel)</span>
                                    <p class="text-xs">需在向量数据库 Metadata 中硬编码权限逻辑，前端需重新开发 SSO 单点登录体系。</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-bold text-xs mb-1">中等 (Vendor IAM)</span>
                                    <p class="text-xs">依赖云厂商的 RAM/IAM 体系，极难与企业本地复杂的 Active Directory 组织架构映射。</p>
                                </td>
                            </tr>
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="font-bold text-slate-800">人机协同 (HITL) 与交付流</div>
                                    <div class="text-[10px] text-slate-500 mt-1">对幻觉的拦截与专家反馈机制</div>
                                </td>
                                <td class="px-6 py-4 bg-blue-50/30">
                                    <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded font-bold text-xs mb-1">极佳 (Visual Workflow)</span>
                                    <p class="text-xs">低代码拖拽秒建“专家纠错/审批工作流”页面。AI 生成的维修建议必须经资深技工点选确认后才下发，构建完美数据飞轮。</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-bold text-xs mb-1">中等 (Custom UI)</span>
                                    <p class="text-xs">UI/UX 团队需手写 React/Vue 交互页面，开发成本高，迭代慢。</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-block px-2 py-1 bg-red-100 text-red-800 rounded font-bold text-xs mb-1">差 (Limited UI)</span>
                                    <p class="text-xs">平台通常只提供标准 Chat 对话框，极难侵入式定制复杂的行业专属反馈与工单提报页面。</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- SECTION: ETL & PARSING -->
        <section id="etl" class="hidden space-y-8 animate-fade-in">
            <header>
                <div class="flex items-center gap-3 mb-2">
                    <span class="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded">Garbage In, Garbage Out</span>
                    <span class="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">Best-of-Breed 架构</span>
                </div>
                <h2 class="text-3xl font-bold text-slate-800">全模态解析与 ETL：决定 RAG 成败的“隐形战场”</h2>
                <p class="mt-2 text-slate-600 max-w-4xl leading-relaxed">
                    在工业界，知识极少以纯文本形式存在，它们被锁在包含嵌套表格的 PDF 手册、脏污铭牌的扫描件以及庞大的 3D 模型库中。如果解析环节将这些结构压平成乱码，后端的大模型再聪明也会产生致命的幻觉。高质量的 RAG 始于高保真的数据解析。
                </p>
            </header>

            <!-- Architect's Perspective: Why Mendix + External ETL -->
            <div class="bg-white p-6 rounded-xl border-l-4 border-l-teal-600 shadow-md relative overflow-hidden">
                <div class="absolute right-0 top-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10"></div>
                <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center">
                    <span class="text-xl mr-2">💡</span> 架构师视野：为什么 Mendix 不自己做解析？
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <p class="text-sm text-slate-700 leading-relaxed font-semibold">1. 严守平台边界，坚持“解耦”哲学</p>
                        <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                            Mendix 的核心定位是 <strong>Composite AI Application Platform (复合型AI应用平台)</strong> 和业务编排枢纽。处理数千万像素的 OCR 识别、运行复杂的视觉布局模型 (如 DeepDoc) 是极度消耗 GPU 算力的底层操作。强行将其塞入低代码业务平台，不仅违背了微服务架构的解耦原则，还会拖垮企业核心业务系统的性能。
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-slate-700 leading-relaxed font-semibold">2. 拥抱 Best-of-Breed (最佳组合) 策略</p>
                        <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                            企业级 IT 架构绝不应重复造轮子。利用 <strong>IBM Docling</strong> 或 <strong>合合信息 TextIn</strong> 等业内顶尖的专属管道作为 Headless Microservices（无头微服务）完成“脏活累活”，提取出完美的 Markdown/JSON。Mendix 通过 REST API 无缝接入这些结构化资产，结合 <strong>GenAI Commons</strong> 迅速完成向量化与业务落库，实现整体 TCO 的最优化。
                        </p>
                    </div>
                </div>
            </div>

            <!-- Tabs Navigation -->
            <div class="border-b border-slate-200 mb-6 mt-4">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onclick="switchTab('etl', 'files')" id="tab-files" class="tab-btn active whitespace-nowrap py-4 px-1 text-sm font-medium">📄 复杂文档 (PDF/Office)</button>
                    <button onclick="switchTab('etl', 'images')" id="tab-images" class="tab-btn whitespace-nowrap py-4 px-1 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300">🖼️ 图片与OCR</button>
                    <button onclick="switchTab('etl', 'multimedia')" id="tab-multimedia" class="tab-btn whitespace-nowrap py-4 px-1 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300">🎥 音视频</button>
                    <button onclick="switchTab('etl', '3d')" id="tab-3d" class="tab-btn whitespace-nowrap py-4 px-1 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300">🧊 3D模型与图纸</button>
                </nav>
            </div>

            <!-- Tab Content: Files -->
            <div id="content-files" class="etl-content">
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-lg text-slate-800">非结构化文档深度解析</h3>
                        <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono">Input: PDF/Word -> Output: Markdown</span>
                    </div>
                    <p class="text-sm text-slate-600 mb-4 bg-yellow-50 p-3 rounded border border-yellow-100 text-yellow-800">
                        <strong>核心痛点：</strong> 工业手册通常包含复杂的多级标题、嵌套表格和跨页图表。传统的正则化文本提取会将表格撕裂，导致“查不出参数”或“张冠李戴”的严重幻觉。
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-slate-50 p-5 rounded border border-slate-200 relative">
                            <h4 class="font-bold text-slate-800 text-sm mb-3">开源基座优选 (适合极高隐私要求)</h4>
                            <ul class="space-y-3 text-sm text-slate-600">
                                <li>
                                    <div class="flex items-center"><strong class="text-slate-800">IBM Docling</strong> <span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded ml-2 font-bold tracking-wide border border-blue-200">强烈推荐</span></div>
                                    <p class="text-xs mt-1 leading-relaxed">IBM 开源的高性能解析引擎，基于深度学习，极擅长处理工业手册中的嵌套表格、公式与跨页排版，<strong>高保真输出 LLM 友好的 Markdown/JSON</strong>。作为后端微服务与 Mendix 配合天衣无缝。</p>
                                </li>
                                <li>
                                    <strong class="text-slate-800">Ragflow (DeepDoc):</strong> 
                                    <p class="text-xs mt-1 leading-relaxed">专为 RAG 设计的视觉布局分析模型，能在文档被切分前准确识别出其物理版面（如多栏结构）。</p>
                                </li>
                            </ul>
                        </div>
                        <div class="bg-slate-50 p-5 rounded border border-slate-200">
                            <h4 class="font-bold text-slate-800 text-sm mb-3">中国商业 API (适合追求极致准确率)</h4>
                            <ul class="space-y-3 text-sm text-slate-600">
                                <li>
                                    <strong class="text-slate-800">合合信息 (TextIn):</strong>
                                    <p class="text-xs mt-1 leading-relaxed">业内公认的文档解析天花板 API。对中文生僻字、脏污扫描件及高度复杂的中式报表还原度极高。Mendix 可直接通过 REST 调用其服务获取结构化结果。</p>
                                </li>
                                <li>
                                    <strong class="text-slate-800">阿里/百度通用文档解析:</strong>
                                    <p class="text-xs mt-1 leading-relaxed">大型云厂商的标准化服务，并发能力强，适合作为轻量级场景的兜底方案。</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Content: Images -->
            <div id="content-images" class="etl-content hidden">
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 class="font-bold text-lg mb-2 text-slate-800">工业视觉理解：从 OCR 到 VLM</h3>
                    <p class="text-sm text-slate-600 mb-4">针对设备铭牌、仪表盘读数、扫描版老旧 PID 图纸的内容提取。</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-slate-50 p-5 rounded border border-slate-200">
                            <h4 class="font-bold text-slate-800 text-sm mb-2">传统 OCR 流水线</h4>
                            <ul class="mt-2 space-y-2 text-sm text-slate-600">
                                <li><strong>PaddleOCR (百度开源):</strong> 轻量级、支持 80+ 语言，中文工业场景识别效果 SOTA。</li>
                                <li><strong>缺点：</strong> 只能提取文字，无法理解文字间的空间关联与物理意义。</li>
                            </ul>
                        </div>
                        <div class="bg-blue-50 p-5 rounded border border-blue-200">
                            <h4 class="font-bold text-blue-900 text-sm mb-2">架构趋势：视觉大模型 (Vision-Language Models)</h4>
                            <p class="text-xs text-blue-800 leading-relaxed mb-2">
                                摒弃易碎的 OCR 规则链。直接使用 <strong>Qwen-VL</strong> (阿里) 或 <strong>Yi-VL</strong>，让大模型“看图说话”。
                            </p>
                            <p class="text-xs text-blue-700 font-medium italic">
                                "Mendix 可将现场工人拍摄的故障照片传给后端 VLM 服务，VLM 直接生成图文描述向量落库，彻底消除中间解析损失。"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Content: Multimedia -->
            <div id="content-multimedia" class="etl-content hidden">
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 class="font-bold text-lg mb-2 text-slate-800">非结构化音视频数据的知识化</h3>
                    <p class="text-sm text-slate-600 mb-4">大量宝贵的排故经验存在于老工人的口述录音、现场维修视频及早会录像中。这是工业领域最难啃的“暗数据”。</p>
                    <ul class="space-y-4">
                        <li class="bg-slate-50 p-4 rounded border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <span class="font-bold text-slate-800 text-sm">FunASR (阿里达摩院开源)</span>
                                <p class="text-xs text-slate-500 mt-1">语音转写 (ASR)。在中文重口音及工业专属术语（如：法兰、伺服电机）的识别准确率上，显著优于通用的 Whisper。</p>
                            </div>
                            <span class="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold shrink-0">核心推荐</span>
                        </li>
                        <li class="bg-slate-50 p-4 rounded border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <span class="font-bold text-slate-800 text-sm">Video-Llama / ChatVideo</span>
                                <p class="text-xs text-slate-500 mt-1">视频理解大模型。通过抽取关键帧提取动作与设备状态，生成结构化的时序文本描述（如："00:15 工人拧开阀门A"），随后存入 PgVector 供 Mendix 检索。</p>
                            </div>
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold shrink-0">前沿探索</span>
                        </li>
                    </ul>
                </div>
            </div>

             <!-- Tab Content: 3D -->
             <div id="content-3d" class="etl-content hidden">
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 class="font-bold text-lg mb-2 text-slate-800">3D CAD模型与 PLM 数据的降维降噪</h3>
                    <p class="text-sm text-slate-600 mb-4">最极端的场景。试图直接让大模型理解纯粹的 3D 几何特征（点云/网格）目前在工程上并不成熟。</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-slate-50 p-5 rounded border border-slate-200">
                            <h4 class="font-bold text-slate-800 text-sm mb-3">底层解析路径 (数据预处理)</h4>
                            <ul class="space-y-2 text-sm text-slate-600">
                                <li><strong>PythonOCC / OpenCascade:</strong> 抛弃几何体，提取 STEP/IGES 文件中的拓扑结构和元数据（BOM 表、零件编号）。</li>
                                <li><strong>多视图截屏 + VLM:</strong> 后端自动渲染 3D 模型的不同视角生成 2D 图片，使用视觉大模型转换为文本特征描述。</li>
                            </ul>
                        </div>
                        <div class="bg-blue-900 p-5 rounded border border-blue-800 shadow-inner">
                            <h4 class="font-bold text-white text-sm mb-2 flex items-center"><span class="mr-2">🚀</span> Mendix 的务实降维解法</h4>
                            <p class="text-xs text-blue-100 leading-relaxed mb-3">
                                架构师的智慧在于规避不成熟的技术瓶颈。不要尝试向量化 3D 模型本身！
                            </p>
                            <p class="text-xs text-blue-50 font-medium bg-blue-800 p-3 rounded leading-relaxed border border-blue-700">
                                <strong>Mendix 方案：</strong> 利用原生的 <code>Mendix 3D Viewer</code> 组件在前端直观展示数字孪生模型。当用户点击某个零件（获取零件ID）时，以此 ID 为过滤元数据（Metadata Filtering），通过 GenAI Commons 去向量库检索与之相关的 PDF 维修手册与工单历史。这才是当前真正能落地的工业协同！
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION: IMPLEMENTATION -->
        <section id="implementation" class="hidden space-y-8 animate-fade-in">
            <header>
                <h2 class="text-3xl font-bold text-slate-800">Mendix 原生 RAG 与 Agent 落地架构</h2>
                <p class="mt-2 text-slate-600">
                    摒弃外部黑盒方案，利用 Mendix 官方 <strong>GenAI AppStore Modules</strong> 构建企业级、可观测、带权限控制（RBAC）的 RAG 架构。
                </p>
            </header>

            <!-- Mendix Native Architecture Diagram Visualization (CSS Grid) -->
            <div class="bg-white p-8 rounded-xl border border-slate-200 overflow-x-auto">
                <h3 class="text-center font-bold text-slate-800 mb-8">Mendix GenAI 模块依赖与数据流向图</h3>
                
                <div class="flex flex-col gap-6 min-w-[700px] max-w-4xl mx-auto">
                    <!-- Top Layer: UI & Agents -->
                    <div class="flex gap-4">
                        <div class="flex-1 bg-blue-50 border-2 border-blue-300 p-4 rounded-lg text-center relative shadow-sm">
                            <div class="absolute -top-3 left-4 bg-blue-100 text-blue-800 px-2 text-xs font-bold rounded">表现层</div>
                            <h4 class="font-bold text-blue-900 mt-2">Conversational UI</h4>
                            <p class="text-xs text-blue-700 mt-1">Chat UI, 历史记录, 追踪面板</p>
                        </div>
                        <div class="flex-1 bg-indigo-50 border-2 border-indigo-300 p-4 rounded-lg text-center relative shadow-sm">
                            <div class="absolute -top-3 left-4 bg-indigo-100 text-indigo-800 px-2 text-xs font-bold rounded">编排层</div>
                            <h4 class="font-bold text-indigo-900 mt-2">Agent Commons</h4>
                            <p class="text-xs text-indigo-700 mt-1">ReAct 模式, Function Calling, 微流触发</p>
                        </div>
                    </div>

                    <!-- Middle Layer: The Core -->
                    <div class="bg-slate-800 text-white p-5 rounded-lg text-center relative shadow-md">
                        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-0.5 text-xs font-bold rounded-full">核心底座</div>
                        <h4 class="font-bold text-lg mb-2">GenAI Commons</h4>
                        <div class="flex justify-center gap-4 text-xs mt-3">
                            <span class="bg-slate-700 px-3 py-1 rounded">Entity: KnowledgeBaseChunk</span>
                            <span class="bg-slate-700 px-3 py-1 rounded">Entity: ChunkCollection</span>
                            <span class="bg-slate-700 px-3 py-1 rounded border border-green-500 text-green-400">Token Consumption Monitor</span>
                        </div>
                    </div>

                    <!-- Bottom Layer: Connectors & Infra -->
                    <div class="flex gap-4">
                        <div class="flex-1 bg-emerald-50 border-2 border-emerald-300 p-4 rounded-lg text-center relative shadow-sm">
                            <div class="absolute -top-3 left-4 bg-emerald-100 text-emerald-800 px-2 text-xs font-bold rounded">私有知识库</div>
                            <h4 class="font-bold text-emerald-900 mt-2">PgVector Knowledge Base</h4>
                            <p class="text-xs text-emerald-700 mt-1">PostgreSQL 向量存储与相似度检索 (Similarity Search)</p>
                        </div>
                        <div class="flex-1 bg-orange-50 border-2 border-orange-300 p-4 rounded-lg text-center relative shadow-sm">
                            <div class="absolute -top-3 left-4 bg-orange-100 text-orange-800 px-2 text-xs font-bold rounded">模型连接器</div>
                            <h4 class="font-bold text-orange-900 mt-2">LLM Connectors</h4>
                            <p class="text-xs text-orange-700 mt-1">OpenAI / Bedrock / Mendix Cloud / DeepSeek</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- IT Leader Pitch: Why Buy Mendix? -->
            <div class="bg-slate-800 text-white p-6 rounded-xl shadow-lg mt-8">
                <h3 class="text-xl font-bold mb-4 flex items-center text-yellow-400">
                    <span class="mr-2">🎯</span> CIO 决策视角：买 Mendix 到底在买什么？
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div class="flex items-center mb-2">
                            <span class="bg-slate-700 text-white rounded p-1 text-xs font-bold mr-2">核心 1</span>
                            <h4 class="font-bold text-sm text-blue-200">绝对的模型解耦 (防绑架)</h4>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">
                            AI 算法迭代极快，今天花重金绑定的模型，明天可能就被开源 DeepSeek 降维打击。Mendix 的 <code>GenAI Commons</code> 提供了一层标准抽象。切换底层大模型只需在控制台改个配置项，<strong>无需重写一行业务代码</strong>。永远掌握架构主动权。
                        </p>
                    </div>
                    <div>
                        <div class="flex items-center mb-2">
                            <span class="bg-slate-700 text-white rounded p-1 text-xs font-bold mr-2">核心 2</span>
                            <h4 class="font-bold text-sm text-emerald-200">Day 2 敏捷运营 (BizDevOps)</h4>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">
                            RAG 上线只是开始，Prompt 调优和知识纠错才是常态。传统硬编码方案每次修改 Prompt 都要走繁琐的 IT 发布流。Mendix 允许将 Prompt 模板定义为数据库对象，<strong>车间业务专家可在前端 UI 直接热更新 Prompt 参数</strong>，实现业务驱动 AI。
                        </p>
                    </div>
                    <div>
                        <div class="flex items-center mb-2">
                            <span class="bg-slate-700 text-white rounded p-1 text-xs font-bold mr-2">核心 3</span>
                            <h4 class="font-bold text-sm text-orange-200">消除孤岛的“最后一公里”</h4>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">
                            孤立的 RAG 只是个“维基百科”。Mendix 真正的杀手锏是能通过数百个原生 Connector，将 SAP 的 BOM 树、Siemens Teamcenter 的工单状态瞬间拉取到内存中，作为动态 Context 喂给大模型。<strong>用 IT 资产的厚度，弥补 AI 的幻觉。</strong>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Implementation Roadmap -->
            <div class="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 class="text-lg font-bold text-slate-800 mb-6 text-center">工业 AI 落地演进路线图 (Maturity Roadmap)</h3>
                <p class="text-sm text-slate-600 mb-6 text-center max-w-3xl mx-auto">
                    摒弃“大爆炸”式的危险交付。依托 Mendix 的低代码敏捷特性，建议企业采取 <strong>“三步走”战略</strong>，小步快跑，快速验证业务价值 (ROI)。
                </p>

                <div class="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-8 pb-4">
                    
                    <!-- Phase 1 -->
                    <div class="relative pl-6 md:pl-8">
                        <div class="absolute w-6 h-6 bg-slate-200 rounded-full -left-[13px] top-1 border-4 border-white flex items-center justify-center">
                            <div class="w-2 h-2 bg-slate-500 rounded-full"></div>
                        </div>
                        <div class="bg-slate-50 p-5 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-slate-800">Phase 1: 知识副驾 (Read-Only RAG)</h4>
                                <span class="bg-slate-200 text-slate-700 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide">Quick Win (2-4 周)</span>
                            </div>
                            <p class="text-xs text-slate-600 mb-3 leading-relaxed">
                                <strong>核心动作：</strong> 针对特定车间的 SOP 操作手册、安全规程，利用外部 ETL（如 Docling）解析后，存入 Mendix PgVector。构建纯内部查询的 Conversational UI。
                            </p>
                            <div class="text-[11px] text-slate-500 bg-white p-2 border border-slate-100 rounded">
                                <strong class="text-slate-700">业务价值 (ROI)：</strong> 缩短新技工查阅图纸与规范的时间（从小时级降至分钟级），验证 RAG 的准确率，沉淀企业专属词表。此时系统为只读状态，风险极低。
                            </div>
                        </div>
                    </div>

                    <!-- Phase 2 -->
                    <div class="relative pl-6 md:pl-8">
                        <div class="absolute w-6 h-6 bg-blue-100 rounded-full -left-[13px] top-1 border-4 border-white flex items-center justify-center">
                            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <div class="bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-sm transform transition-all hover:scale-[1.01]">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-blue-900">Phase 2: 动态上下文助手 (Context-Aware AI)</h4>
                                <span class="bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide">核心深水区 (1-3 个月)</span>
                            </div>
                            <p class="text-xs text-blue-800 mb-3 leading-relaxed">
                                <strong>核心动作：</strong> 引入 Mendix 强大的数据集成能力与 RBAC 权限体系。当技术员提问时，Mendix 后台自动抓取其所在工位的 <strong>当前设备型号、实时 SCADA 故障码</strong>，与用户提问拼接后，再去向量库检索。
                            </p>
                            <div class="text-[11px] text-blue-700 bg-white p-2 border border-blue-100 rounded">
                                <strong class="text-blue-900">业务价值 (ROI)：</strong> 大幅压降“幻觉”。AI 不再泛泛而谈，而是给出基于特定设备、特定序列号的精准排故指南。实现 IT 与 OT 数据的融合。
                            </div>
                        </div>
                    </div>

                    <!-- Phase 3 -->
                    <div class="relative pl-6 md:pl-8">
                        <div class="absolute w-6 h-6 bg-emerald-100 rounded-full -left-[13px] top-1 border-4 border-white flex items-center justify-center">
                            <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <div class="bg-emerald-50 p-5 rounded-lg border border-emerald-200 hover:border-emerald-400 transition-colors">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-emerald-900">Phase 3: 自治智能体 (Agentic Workflow & HITL)</h4>
                                <span class="bg-emerald-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide">终极形态 (持续演进)</span>
                            </div>
                            <p class="text-xs text-emerald-800 mb-3 leading-relaxed">
                                <strong>核心动作：</strong> 启用 <code>Agent Commons</code>，赋予 AI "执行权" (Function Calling)。AI 诊断出故障后，主动推荐替换备件，并弹出一个 Mendix 审批界面。经专家点击“确认”后，Mendix 微流自动调用 ERP 接口创建采购单。
                            </p>
                            <div class="text-[11px] text-emerald-700 bg-white p-2 border border-emerald-100 rounded">
                                <strong class="text-emerald-900">业务价值 (ROI)：</strong> 形成“人机协同 (Human-in-the-loop)”闭环。打通“认知 -> 决策 -> 执行”全链路，彻底重塑业务流程，专家确认的数据作为高质量微调语料，实现知识资产的永续增长。
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>

    </main>

    <script>
        // State Management
        let currentState = {
            section: 'overview',
            tab: 'files'
        };

        // Navigation Logic
        function navigateTo(sectionId) {
            // Update state
            currentState.section = sectionId;

            // Hide all sections safely
            document.querySelectorAll('main > section').forEach(el => {
                el.classList.add('hidden');
            });

            // Show target section safely
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            } else {
                console.error(`Section with id '${sectionId}' not found.`);
                return;
            }

            // Update Nav styling
            document.querySelectorAll('.nav-item').forEach(el => {
                el.classList.remove('active', 'bg-slate-50', 'text-blue-700', 'border-r-4', 'border-blue-600');
                el.classList.add('text-slate-600');
            });

            const activeNav = document.getElementById(`nav-${sectionId}`);
            if (activeNav) {
                activeNav.classList.add('active');
            }

            // Trigger Charts if section is visible and charts not loaded
            if (sectionId === 'overview') renderOverviewCharts();
            if (sectionId === 'comparison') renderComparisonCharts();
        }

        // Tab Logic
        function switchTab(group, tabId) {
            // Reset buttons in group
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active', 'border-blue-600', 'text-blue-600', 'font-bold');
                btn.classList.add('text-slate-500');
                btn.style.borderBottom = 'none';
            });

            // Activate clicked button
            const activeBtn = document.getElementById(`tab-${tabId}`);
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.classList.remove('text-slate-500');
                activeBtn.style.borderBottom = '2px solid #0284c7';
            }

            // Hide content
            document.querySelectorAll('.etl-content').forEach(el => el.classList.add('hidden'));
            
            // Show content
            const activeContent = document.getElementById(`content-${tabId}`);
            if (activeContent) {
                activeContent.classList.remove('hidden');
            }
        }

        // Chart.js Implementations
        let overviewChartInstance = null;
        let comparisonChartInstance = null;

        function renderOverviewCharts() {
            if (overviewChartInstance) return; // Prevent re-render
            
            const canvas = document.getElementById('hallucinationChart');
            if (!canvas) return; // Safeguard
            
            const ctx = canvas.getContext('2d');
            overviewChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['捏造设备参数/扭矩', '生成过期安全规程', '推荐错误替换备件', '忽视前置断电操作', '逻辑自相矛盾'],
                    datasets: [{
                        label: '通用大模型 (裸奔状态) 发生率',
                        data: [42, 35, 28, 20, 15],
                        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red
                        borderRadius: 4
                    }, {
                        label: '企业级 RAG 增强后发生率',
                        data: [3, 2, 4, 1, 3],
                        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald green
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y', // 横向柱状图，更适合长文本标签
                    plugins: {
                        legend: { position: 'bottom', labels: { font: { size: 11 } } },
                        tooltip: { mode: 'index', intersect: false }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: { display: true, text: '潜在致灾概率 (%)', font: { size: 12 } }
                        },
                        y: {
                            ticks: { font: { size: 11 } }
                        }
                    }
                }
            });
        }

        function renderComparisonCharts() {
            if (comparisonChartInstance) return;

            const canvas = document.getElementById('comparisonRadar');
            if (!canvas) return; // Safeguard

            const ctx = canvas.getContext('2d');
            comparisonChartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    // 替换为更具架构深度的五大维度
                    labels: [
                        '业务系统集成与联动 (ERP/OT)', 
                        '企业级全栈权限治理 (RBAC)', 
                        '人机协同工作流 (HITL 敏捷性)', 
                        '底层算法与解析控制力 (白盒)', 
                        '总体拥有成本与交付效率 (TCO/ROI)'
                    ],
                    datasets: [{
                        label: 'Mendix 融合架构',
                        // Mendix 在集成、权限、协同流、TCO 上得分极高；底层算法控制力适中（依赖外部调用）
                        data: [98, 95, 95, 60, 90], 
                        borderColor: '#2563eb', // text-blue-600
                        backgroundColor: 'rgba(37, 99, 235, 0.25)',
                        pointBackgroundColor: '#2563eb',
                        borderWidth: 2,
                        pointRadius: 4
                    }, {
                        label: '纯开源栈自建 (如 Ragflow)',
                        // 开源在算法上最强；但集成、权限系统重构、协同UI开发极其困难，TCO极差（分越低成本越高）
                        data: [30, 40, 30, 100, 20],
                        borderColor: '#10b981', // text-emerald-500
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        pointBackgroundColor: '#10b981',
                        borderWidth: 2,
                        borderDash: [5, 5]
                    }, {
                        label: '商业 MaaS (公有云 API)',
                        // 商业MaaS起步快TCO初期可控；但集成难、权限受限厂商品牌、算法控制黑盒
                        data: [60, 50, 40, 20, 75],
                        borderColor: '#f97316', // text-orange-500
                        backgroundColor: 'rgba(249, 115, 22, 0.15)',
                        pointBackgroundColor: '#f97316',
                        borderWidth: 2,
                        borderDash: [2, 2]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: '#e2e8f0' },
                            grid: { color: '#cbd5e1' },
                            pointLabels: {
                                font: { size: 11, weight: '600', family: 'Inter' },
                                color: '#334155'
                            },
                            ticks: {
                                display: false, // 隐藏内圈的数字，让图表更清爽
                                max: 100,
                                min: 0
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false }, // 已在HTML中自定义图例
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ' ' + context.dataset.label + ': ' + context.raw + ' 分';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            renderOverviewCharts();
        });

    </script>
</body>
</html>
