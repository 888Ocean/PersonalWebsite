export type ProjectTheme = "linkphoto" | "club" | "agent";

export type ProjectAssetKind = "prd" | "prototype" | "screenshot";
export type ProjectChapterId = "overview" | "solution" | "problem" | "process" | "challenges" | "result" | "reflection";
export const projectChapterIds: ProjectChapterId[] = ["overview", "solution", "problem", "process", "challenges", "result", "reflection"];

export type ProjectAsset = {
  id: string;
  kind: ProjectAssetKind;
  title: string;
  caption: string;
  description?: string;
  url: string;
  mediaType: "image" | "pdf" | "markdown";
  chapter?: ProjectChapterId;
  previewOffsetX?: number;
  previewOffsetY?: number;
  previewScale?: number;
};

export type ProjectChallenge = {
  id: string;
  problem: string;
  solution: string;
};

export type Project = {
  slug: string;
  index: string;
  name: string;
  cn: string;
  period: string;
  label: string;
  summary: string;
  role: string;
  stack: string;
  accent: string;
  theme: ProjectTheme;
  metrics: Array<[string, string]>;
  detail: string;
  background: string;
  goal: string;
  problem: string;
  solution: string;
  solutionAssets: ProjectAsset[];
  aiCapability: string;
  responsibility: string;
  process: Array<[string, string, string]>;
  challenges: ProjectChallenge[];
  result: string;
  reflection: string;
};

export const projects: Project[] = [
  {
    slug: "linkphoto",
    index: "01",
    name: "LinkPhoto",
    cn: "AI 摄影预约平台",
    period: "2025—2026",
    label: "FLAGSHIP CURRENT",
    summary: "让用户用一次自然对话说清拍摄需求，并完成摄影师发现、匹配与预约。",
    role: "AI Product · Full-stack",
    stack: "RAG · Vision · SQL · Workflow",
    accent: "#f17d62",
    theme: "linkphoto",
    metrics: [["8", "PRODUCT MODULES"], ["40+", "BACKEND APIS"], ["01", "BOOKING LOOP"]],
    detail: "从模糊需求到明确订单，我负责把 AI 对话、视觉资料、混合检索和预约流程连接成一个可以真正完成任务的产品闭环。",
    background: "摄影预约的需求通常从一种模糊感觉开始，但现有平台要求用户先理解专业分类，再填写冗长表单。",
    goal: "用一次自然对话完成需求澄清、摄影师匹配与预约，同时让 AI 的判断可见、可修改。",
    problem: "用户知道自己想要什么样的照片，却很难把氛围、场景、预算和时间翻译成摄影师可以执行的需求。传统表单让需求变得更完整，却没有让表达变得更自然。",
    solution: "用一段对话先捕捉意图，再将非结构化表达拆成拍摄时间、地点、风格、预算等可编辑字段，最后连接摄影师发现、匹配和预约。",
    solutionAssets: [],
    aiCapability: "AI 负责需求抽取、图片语义理解和候选排序；产品层保留字段确认、结果解释和人工兜底，让模型的判断可见、可改、可追溯。",
    responsibility: "从用户旅程、信息架构和 PRD，到接口设计、数据模型、AI 流程和核心页面实现，负责把产品判断推进到可运行的闭环。",
    process: [["01", "Listen", "拆解用户如何描述一次拍摄，而不是先设计一个表单。"], ["02", "Model", "建立需求字段、摄影师标签与混合检索之间的映射。"], ["03", "Prototype", "用真实对话和候选结果验证 AI 是否减少了表达成本。"], ["04", "Ship", "完成从需求输入到预约订单的端到端流程。"]],
    challenges: [
      { id: "linkphoto-01", problem: "模糊的风格词难以直接变成检索条件。", solution: "将对话拆成可编辑字段，并用图像语义与结构化标签共同排序。" },
      { id: "linkphoto-02", problem: "AI 推荐结果容易让用户失去控制感。", solution: "在提交前增加字段确认、匹配理由与人工修改入口。" },
    ],
    result: "完成 8 个产品模块、40+ 个后端 API，并跑通从 AI 需求提取、摄影师匹配到预约下单的完整链路。",
    reflection: "下一步不是继续堆更多模型，而是通过真实用户测试比较“对话入口”和“传统表单”的完成率、修改次数与信任感。",
  },
  {
    slug: "club-copilot",
    index: "02",
    name: "Club Copilot",
    cn: "AI 社团管理助手",
    period: "2025",
    label: "FIELD TESTED",
    summary: "把重复的信息识别、活动整理和成员协作，变成一个随时可调用的校园 AI 助手。",
    role: "Product · AI Application",
    stack: "OCR · Agent · Automation",
    accent: "#f3c467",
    theme: "club",
    metrics: [["30+", "ACTIVE USERS"], ["95%", "RECOGNITION"], ["60%", "TIME SAVED"]],
    detail: "这不是停留在演示里的聊天机器人。它在真实社团工作中被使用，通过识别、结构化与自动执行减少重复劳动。",
    background: "社团负责人需要在群聊、图片和表格之间反复搬运信息，大量时间消耗在识别、核对和提醒上。",
    goal: "把最高频的三类重复任务收敛成一个可确认、可追踪的 AI 助手工作流。",
    problem: "活动报名、成员信息和群消息散落在图片、表格与聊天记录中，负责人每天都在重复复制、核对和提醒。",
    solution: "让助手先识别和结构化信息，再把任务拆成可确认的动作：去重名单、生成摘要、提醒负责人，最后把需要人工判断的节点留出来。",
    solutionAssets: [],
    aiCapability: "OCR 识别负责把图片里的信息变成数据，Agent 负责编排后续动作；每一步都保留状态和人工确认，避免自动化变成不可控的黑箱。",
    responsibility: "负责场景访谈、任务拆解、交互原型、识别结果验证与产品迭代，持续根据真实使用反馈调整流程。",
    process: [["01", "Observe", "记录负责人一周内最频繁、最耗时的重复操作。"], ["02", "Reduce", "把大而泛的聊天助手收敛成三个高频任务。"], ["03", "Verify", "用真实报名图片测试识别边界和异常情况。"], ["04", "Adopt", "让结果先可确认，再逐步增加自动执行范围。"]],
    challenges: [
      { id: "club-01", problem: "报名图片来源复杂，OCR 结果容易受排版和画质影响。", solution: "增加字段级置信度、异常高亮和人工确认，再根据错误样本迭代。" },
      { id: "club-02", problem: "自动化步骤过多时，负责人不敢直接使用。", solution: "先输出可审核的任务清单，只对低风险动作开启自动执行。" },
    ],
    result: "服务 30+ 位真实用户，识别准确率从 72% 提升到 95%，重复工作时间减少约 60%。",
    reflection: "效率工具的价值不只在于自动完成多少，也在于它是否让人更放心地把一部分工作交出去。",
  },
  {
    slug: "drift-os",
    index: "03",
    name: "Drift OS",
    cn: "Agent 工作流实验",
    period: "NOW",
    label: "LIVE CURRENT",
    summary: "探索人如何与多个 Agent 共同研究、判断和执行，并保持过程可见、结果可控。",
    role: "Vibe Coding · Creative Tech",
    stack: "Agents · Tools · Interface",
    accent: "#84cfc7",
    theme: "agent",
    metrics: [["04", "SPECIALIST AGENTS"], ["12", "VISIBLE STEPS"], ["∞", "ITERATIONS"]],
    detail: "一个持续变化的个人实验场：把隐形的 Agent 推理过程转化为可观察的协作流，并测试新的 AI 原生界面。",
    background: "多 Agent 系统开始从单次对话走向持续协作，但它们的分工、工具调用和冲突经常对用户不可见。",
    goal: "探索一套能让人理解过程、介入关键节点并复盘结果的 Agent 原生交互模型。",
    problem: "当多个 Agent 参与研究和执行时，用户很难知道谁做了什么、依据是什么，以及什么时候应该介入。",
    solution: "把工作流拆成可观察的节点，让 Agent 的输入、工具调用、判断和交接都成为界面中的一等信息。",
    solutionAssets: [],
    aiCapability: "通过角色化 Agent、工具调用、状态追踪和人工 review 节点，把不可见的推理过程变成可检查的协作轨迹。",
    responsibility: "负责实验命题、交互模型、Agent 编排、Vibe Coding 实现和每轮结果复盘。",
    process: [["01", "Frame", "先定义人需要看见和控制的状态，而不是先追求 Agent 数量。"], ["02", "Compose", "把研究、批评、综合等角色组合成可替换的工作流。"], ["03", "Expose", "将过程、冲突和失败直接呈现在界面里。"], ["04", "Reflect", "记录每次提示、工具和界面调整带来的变化。"]],
    challenges: [
      { id: "drift-01", problem: "多个 Agent 同时运行时，用户难以判断当前状态与责任归属。", solution: "统一节点状态、输入输出摘要与交接记录，让每次转移都可追踪。" },
      { id: "drift-02", problem: "展示完整推理会产生大量噪音，隐藏过程又会降低信任。", solution: "默认展示可审核摘要，将工具记录与冲突细节放在逐层展开中。" },
    ],
    result: "形成 4 个专业 Agent、12 个可观察步骤，并持续沉淀一套 AI 原生工作界面。",
    reflection: "Agent 产品的核心体验不是“看起来很聪明”，而是用户知道何时相信它、何时修正它。",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
