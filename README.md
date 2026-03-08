# Mendix RAG Solutions Demo

这是一个基于 Next.js 的 Mendix RAG 方案演示站，用来向客户展示：

- Mendix 企业知识问答与流程助手
- RAG 在工业和企业知识场景中的落地方式
- Mendix + Workflow + 知识库 + 大模型的组合价值
- Mendix GenAI 官方能力速览

项目当前包含两类内容：

- `/`：客户演示主站，按 `docs/index.md` 的原始结构渲染，并融合了架构流程、价值与优势、FAQ、Mendix GenAI 官方能力等模块
- `/console`：交互式演示控制台

## 封面图

仓库封面素材：

- `assets/social-preview.svg`

如果你要给 GitHub 仓库、文档首页或提案封面配图，可以直接使用这张 SVG。

## 技术栈

- Next.js 16.1.6
- React
- TypeScript
- Chart.js
- Node SQLite
- PostgreSQL + pgvector（方案展示口径）
- Docker / Docker Compose

## 主要演示内容

首页左侧菜单当前包含：

- `📊 核心概览`
- `🇨🇳 中国RAG生态`
- `⚖️ 方案深度对比`
- `📂 数据解析与ETL`
- `🚀 Mendix落地指南`
- `🧭 架构流程`
- `💎 价值与优势`
- `🧠 Mendix GenAI 官方能力`
- `❓ 常用问题`

其中重点新增模块包括：

- `架构流程`
  说明你的 Demo 实际链路：模型配置、知识库配置、PDF 上传、Docling 解析、`BAAI/bge-m3` embedding、`PostgreSQL + pgvector` 入库、DeepSeek 问答、Workflow 闭环
- `价值与优势`
  用客户决策视角解释为什么不是只做一个开源 RAG，而是用 Mendix 落地
- `Mendix GenAI 官方能力`
  汇总 Mendix 官方 GenAI 文档入口，便于现场快速验证能力边界
- `常用问题`
  收口售前最常被客户追问的问题

## 本地启动

要求：

- Node.js 20+
- npm

安装依赖：

```bash
npm install
```

开发模式启动：

```bash
npm run dev
```

访问地址：

```text
http://localhost:3009
```

Windows 下也可以直接使用：

- `start.bat`
- `start.ps1`

## Docker 启动

如果你希望把源码拷到有 Docker 环境的 Mac 上直接运行，可以使用以下脚本：

- `docker-start.command`
- `docker-update.command`
- `docker-remove.command`
- `docker-remove-all.command`

详细说明见：

- [README-docker.md](C:/Users/Niko.Mao/CodesR/Mendix-RAG/README-docker.md)

极简启动说明见：

- [README-quickstart.md](C:/Users/Niko.Mao/CodesR/Mendix-RAG/README-quickstart.md)

## 构建

```bash
npm run build
```

生产启动：

```bash
npm run start
```

## 项目结构

```text
app/
  api/                  后端接口
  console/              交互控制台
  page.tsx              首页入口
components/
  original-site.tsx     主展示页面与自定义模块
  original-site-charts.tsx
docs/
  index.md              原始页面结构来源
lib/
  original-site-doc.ts  原始文档解析
  rag-simulator.ts      RAG 模拟逻辑
  scenario-db.ts        本地场景数据
data/
  本地数据与数据库文件
```

## 当前 Demo 口径

当前架构流程页围绕以下真实 Demo 设定展开：

- 应用平台：`Mendix`
- 文档解析：`Docling`
- LLM：`DeepSeek`
- Embedding：`BAAI/bge-m3`
- 知识库：`PostgreSQL + pgvector`
- 闭环能力：`Mendix Workflow`

## 演示建议

建议现场按这个顺序讲：

1. `核心概览`
2. `中国RAG生态`
3. `方案深度对比`
4. `架构流程`
5. `价值与优势`
6. `Mendix GenAI 官方能力`
7. `常用问题`

这样更符合客户的接受路径：

- 先理解问题
- 再看市场选型
- 再看你的方案
- 再看真实 Demo
- 最后看官方背书和 FAQ

## 注意事项

- 当前项目使用 Node 内置 `node:sqlite`，运行时会出现 experimental warning
- `data/*.db` 已被 `.gitignore` 忽略，不会被提交
- 首页原始章节内容来自 `docs/index.md`，如果你要改 `/` 的原始主内容，应优先修改这个文件
- 自定义扩展模块主要在 `components/original-site.tsx`

## 仓库

GitHub：

```text
https://github.com/nikomao/mendix-rag-solutions.git
```
