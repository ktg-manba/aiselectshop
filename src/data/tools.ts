export type LocalizedText = {
  en: string;
  zh: string;
};

export type SecondaryTag = {
  id: string;
  name: LocalizedText;
};

export type Tool = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  categoryId: string;
  categorySlug?: string;
  logoUrl?: string;
  pricing: "free" | "paid" | "freemium";
  tags: LocalizedText[];
  secondaryTags: SecondaryTag[];
  url: string;
  initials: string;
};

export const tools: Tool[] = [
  {
    id: "deepseek",
    name: { en: "DeepSeek V2", zh: "DeepSeek V2" },
    description: {
      en: "Open source champion. Deploy smart models with ease and cost efficiency.",
      zh: "开源冠军，轻松部署智能模型，兼顾成本与效率。",
    },
    category: { en: "AI Chatbot", zh: "AI 对话" },
    categoryId: "ai-chatbot",
    pricing: "freemium",
    tags: [
      { en: "Open Source", zh: "开源" },
      { en: "LLM", zh: "大模型" },
      { en: "Reasoning", zh: "推理" },
    ],
    secondaryTags: [{ id: "chatbot-cn", name: { en: "Chinese", zh: "中文" } }],
    url: "https://deepseek.com",
    initials: "DS",
  },
  {
    id: "claude",
    name: { en: "Claude 3.5", zh: "Claude 3.5" },
    description: { en: "Design-forward coding partner for teams.", zh: "团队级设计向智能助手。" },
    category: { en: "AI Coding", zh: "AI 编程" },
    categoryId: "ai-coding",
    pricing: "paid",
    tags: [
      { en: "Assistant", zh: "助手" },
      { en: "Safety", zh: "安全" },
    ],
    secondaryTags: [{ id: "coding-dev", name: { en: "Coding", zh: "写代码" } }],
    url: "https://claude.ai",
    initials: "CL",
  },
  {
    id: "cursor",
    name: { en: "Cursor", zh: "Cursor" },
    description: { en: "AI pair editor with fast inline edits.", zh: "AI 结对编辑器，快速内联修改。" },
    category: { en: "AI Coding", zh: "AI 编程" },
    categoryId: "ai-coding",
    pricing: "paid",
    tags: [
      { en: "Editor", zh: "编辑器" },
      { en: "Workflow", zh: "流程" },
    ],
    secondaryTags: [{ id: "coding-dev", name: { en: "Coding", zh: "写代码" } }],
    url: "https://cursor.sh",
    initials: "CU",
  },
];
