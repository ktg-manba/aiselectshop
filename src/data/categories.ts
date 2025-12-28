export type LocalizedText = {
  en: string;
  zh: string;
};

export type CategorySubTag = {
  id: string;
  name: LocalizedText;
};

export type CategoryGroup = {
  id: string;
  slug?: string;
  name: LocalizedText;
  subTags: CategorySubTag[];
};

export const categoryGroups: CategoryGroup[] = [
  {
    id: "ai-chatbot",
    slug: "ai-chatbot",
    name: { en: "AI Chatbot", zh: "AI 对话" },
    subTags: [
      { id: "chatbot-latest", name: { en: "Top Picks", zh: "最新最强" } },
      { id: "chatbot-cn", name: { en: "Chinese", zh: "中文" } },
    ],
  },
  {
    id: "ai-coding",
    slug: "ai-coding",
    name: { en: "AI Coding", zh: "AI 编程" },
    subTags: [
      { id: "coding-dev", name: { en: "Coding", zh: "写代码" } },
      { id: "coding-ui", name: { en: "UI Design", zh: "画前端" } },
      { id: "coding-template", name: { en: "Templates", zh: "找模版" } },
      { id: "coding-deploy", name: { en: "Deployment", zh: "部署" } },
      { id: "coding-db", name: { en: "Database", zh: "数据库" } },
    ],
  },
  {
    id: "ai-image",
    slug: "ai-image",
    name: { en: "AI Image", zh: "AI 图像" },
    subTags: [
      { id: "image-fast", name: { en: "Fast Gen", zh: "高速生图" } },
      { id: "image-hq", name: { en: "High Quality", zh: "高画质" } },
    ],
  },
  {
    id: "ai-video",
    slug: "ai-video",
    name: { en: "AI Video", zh: "AI 视频" },
    subTags: [
      { id: "video-short", name: { en: "Short Video", zh: "短视频" } },
      { id: "video-cn", name: { en: "Chinese", zh: "中文" } },
    ],
  },
  {
    id: "ai-audio",
    slug: "ai-audio",
    name: { en: "AI Audio", zh: "AI 音频" },
    subTags: [{ id: "audio-latest", name: { en: "Top Picks", zh: "最新最强" } }],
  },
];
