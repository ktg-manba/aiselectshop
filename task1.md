# 数据库建设准备（MemFireDB）

## 数据格式（你来补充真实数据）

### categories.json
```json
[
  {
    "id": "uuid-optional",
    "name": {
      "zh": "AI 编程",
      "en": "AI Coding"
    },
    "description": {
      "zh": "提升开发效率的工具。",
      "en": "Tools that supercharge development workflows."
    },
    "icon": "code",
    "order_index": 1
  }
]
```

### tools.json
```json
[
  {
    "id": "uuid-optional",
    "name": {
      "zh": "DeepSeek V2",
      "en": "DeepSeek V2"
    },
    "description": {
      "zh": "开源冠军，轻松部署智能模型。",
      "en": "Open source champion. Deploy smart models with ease."
    },
    "detailed_intro": {
      "zh": "长文本介绍...",
      "en": "Long-form introduction text..."
    },
    "official_url": "https://deepseek.com",
    "logo_url": "https://.../logo.png",
    "category_name": {
      "zh": "AI 编程",
      "en": "AI Coding"
    },
    "pricing_type": "free|paid|freemium",
    "tags": {
      "zh": ["开源", "大模型"],
      "en": ["Open Source", "LLM"]
    },
    "is_featured": true,
    "view_count": 0,
    "created_at": "2024-06-01T00:00:00Z"
  }
]
```

### cases.json
```json
[
  {
    "id": "uuid-optional",
    "title": {
      "zh": "生成式视频与 3D 工作流",
      "en": "Generative Video & 3D Workflow"
    },
    "description": {
      "zh": "短描述...",
      "en": "Short description..."
    },
    "detailed_content": {
      "zh": "案例长文内容...",
      "en": "Long-form case content..."
    },
    "thumbnail_url": "https://.../thumb.jpg",
    "case_type": {
      "zh": "AI 视频",
      "en": "AI Video"
    },
    "tags": {
      "zh": ["视频", "3D", "自动化"],
      "en": ["Video", "3D", "Automation"]
    },
    "tools_used": {
      "zh": ["DeepSeek V2", "Runway", "Blender"],
      "en": ["DeepSeek V2", "Runway", "Blender"]
    },
    "results_data": {
      "speed": "3x",
      "cost": "-40%",
      "match": "98%"
    },
    "is_featured": true,
    "view_count": 0,
    "created_at": "2024-06-18T00:00:00Z"
  }
]
```

### case_tools.json（可选，用于明确关联）
```json
[
  {
    "case_title": "Generative Video & 3D Workflow",
    "tool_name": "DeepSeek V2"
  }
]
```

## 你需要完成的事项（数据库能力建设）

1. 提供 MemFireDB 实例信息  
   - `DATABASE_URL`  
   - `MEMFIREDB_ANON_KEY` / `SERVICE_KEY`（如果需要写入）

2. 确认数据字段是否需要扩展  
   - 是否需要多语言字段  
   - 是否需要评分/收藏/访问量

3. 提供真实数据文件  
   - `categories.json`  
   - `tools.json`  
   - `cases.json`

4. 确认数据导入方式  
   - 是否使用 Prisma migrate + seed  
   - 或使用 Supabase SQL/CSV 导入

5. 确认权限策略  
   - 公开读取、管理员写  
   - 是否需要 RLS
