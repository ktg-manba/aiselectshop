# AI Select Shop - 技术方案设计

## 1. 技术架构总览

### 1.1 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         前端层                               │
│  Next.js 14 + React + TypeScript + Tailwind CSS             │
│  - 页面路由 (App Router)                                     │
│  - 组件库 (shadcn/ui)                                        │
│  - 状态管理 (Zustand)                                        │
│  - 动画库 (Framer Motion)                                    │
│  - 拖拽库 (dnd-kit)                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        API 层                                │
│  Next.js API Routes / Server Actions                         │
│  - RESTful API                                              │
│  - 认证中间件 (JWT)                                          │
│  - 数据验证 (Zod)                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ↓                           ↓
┌──────────────────────────┐   ┌─────────────────────────┐
│    数据库层               │   │    AI 服务层             │
│  MemFireDB (Supabase)    │   │  - OpenAI API            │
│  - PostgreSQL            │   │  - 向量数据库 (pgvector)│
│  - Row Level Security    │   │  - Langchain             │
│  - Storage (图片)        │   │  - RAG Pipeline          │
└──────────────────────────┘   └─────────────────────────┘
```

### 1.2 技术栈选型

#### 前端技术栈
- **框架**: Next.js 14 (App Router)
  - 理由：SSR/SSG 支持，SEO 友好，性能优秀
- **UI 框架**: React 18
  - 理由：生态成熟，组件化开发
- **类型系统**: TypeScript
  - 理由：类型安全，提升代码质量
- **样式**: Tailwind CSS + shadcn/ui
  - 理由：快速开发，一致性好，现代设计
- **状态管理**: Zustand
  - 理由：轻量级，简单易用
- **动画**: Framer Motion
  - 理由：强大的动画能力，声明式 API
- **拖拽**: @dnd-kit
  - 理由：性能好，支持触摸设备，无障碍友好

#### 后端技术栈
- **运行时**: Node.js (Next.js 内置)
- **API**: Next.js API Routes / Server Actions
  - 理由：与前端集成，简化开发
- **数据库**: MemFireDB (Supabase 兼容)
  - 理由：实时数据库，内置认证，对象存储
- **ORM**: Prisma
  - 理由：类型安全，自动生成，迁移管理
- **认证**: NextAuth.js + JWT
  - 理由：完整的认证解决方案
- **验证**: Zod
  - 理由：TypeScript 优先，运行时验证

#### AI 技术栈
- **大模型**: OpenRouter API
  - 理由：统一接口访问多个模型（GPT-4、Claude、Gemini 等），灵活切换，价格优惠
  - 支持模型：openai/gpt-4-turbo、anthropic/claude-3.5-sonnet、google/gemini-pro 等
- **向量数据库**: pgvector (PostgreSQL 扩展)
  - 理由：与主数据库集成，管理简单
- **RAG 框架**: Langchain
  - 理由：成熟的 RAG 实现，丰富的工具链，支持 OpenRouter
- **Embedding**: OpenRouter 支持的 Embedding 模型（如 openai/text-embedding-3-small）
  - 理由：性价比高，效果好，与主模型使用统一接口

#### 部署和运维
- **部署平台**: 腾讯云 EdgeOne
  - 理由：国内访问速度快，边缘加速，支持 Serverless
- **CDN**: EdgeOne 边缘网络
- **图片存储**: MemFireDB Storage
- **监控**: EdgeOne 监控 + Sentry
- **日志**: EdgeOne 日志服务

## 2. 数据库设计

### 2.1 ER 图

```
┌─────────────┐          ┌──────────────┐
│ Categories  │◄─────────┤    Tools     │
│             │ 1      * │              │
└─────────────┘          └──────┬───────┘
                                │
                                │ *
                                │
                                │ *
                         ┌──────┴───────┐
                         │  CaseTools   │
                         │ (关联表)      │
                         └──────┬───────┘
                                │ *
                                │
                                │ *
                         ┌──────┴───────┐
                         │    Cases     │
                         │              │
                         └──────────────┘
```

### 2.2 数据表设计

#### categories 表
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### tools 表
```sql
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  detailed_intro TEXT,
  official_url VARCHAR(500) NOT NULL,
  logo_url VARCHAR(500),
  category_id UUID REFERENCES categories(id),
  pricing_type VARCHAR(20) CHECK (pricing_type IN ('free', 'paid', 'freemium')),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_featured ON tools(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_tools_deleted ON tools(is_deleted) WHERE is_deleted = FALSE;
```

#### cases 表
```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  detailed_content TEXT,
  thumbnail_url VARCHAR(500),
  case_type VARCHAR(100),
  tags TEXT[],
  results_data JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cases_featured ON cases(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_cases_deleted ON cases(is_deleted) WHERE is_deleted = FALSE;
```

#### case_tools 表（关联表）
```sql
CREATE TABLE case_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(case_id, tool_id)
);

CREATE INDEX idx_case_tools_case ON case_tools(case_id);
CREATE INDEX idx_case_tools_tool ON case_tools(tool_id);
```

#### admins 表
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_admins_email ON admins(email);
```

#### knowledge_vectors 表（向量存储）
```sql
-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI embedding 维度
  source_type VARCHAR(20) CHECK (source_type IN ('tool', 'case')),
  source_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 向量相似度搜索索引
CREATE INDEX idx_knowledge_vectors_embedding ON knowledge_vectors 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_knowledge_vectors_source ON knowledge_vectors(source_type, source_id);
```

#### user_layouts 表（用户布局偏好，可选）
```sql
CREATE TABLE user_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  layout_config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.3 Row Level Security (RLS) 策略

```sql
-- 启用 RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 公开读取未删除的内容
CREATE POLICY "Allow public read access" ON tools
  FOR SELECT USING (is_deleted = FALSE);

CREATE POLICY "Allow public read access" ON cases
  FOR SELECT USING (is_deleted = FALSE);

CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (TRUE);

-- 管理员写权限
CREATE POLICY "Allow admin write access" ON tools
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admin write access" ON cases
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

## 3. 前端架构设计

### 3.1 项目目录结构

```
ai-select-shop/
├── app/                          # Next.js App Router
│   ├── (main)/                   # 主站路由组
│   │   ├── page.tsx              # 首页
│   │   ├── categories/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 分类详情页
│   │   ├── cases/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # 案例详情页
│   │   └── layout.tsx            # 主站布局
│   ├── admin/                    # 管理后台路由组
│   │   ├── login/
│   │   │   └── page.tsx          # 登录页
│   │   ├── dashboard/
│   │   │   └── page.tsx          # 仪表板
│   │   ├── tools/
│   │   │   ├── page.tsx          # 工具列表
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # 新建工具
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx  # 编辑工具
│   │   ├── cases/
│   │   │   ├── page.tsx          # 案例列表
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # 新建案例
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx  # 编辑案例
│   │   └── layout.tsx            # 管理后台布局
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── tools/
│   │   │   ├── route.ts          # GET, POST
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PUT, DELETE
│   │   ├── cases/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── categories/
│   │   │   └── route.ts
│   │   ├── ai/
│   │   │   └── chat/
│   │   │       └── route.ts      # AI 问答接口
│   │   └── upload/
│   │       └── route.ts          # 图片上传
│   ├── layout.tsx                # 根布局
│   └── globals.css               # 全局样式
├── components/                   # 组件目录
│   ├── ui/                       # shadcn/ui 组件
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── home/                     # 首页组件
│   │   ├── BentoGrid.tsx         # Bento Grid 容器
│   │   ├── BrandModule.tsx       # 商标模块
│   │   ├── HeroModule.tsx        # 简介模块
│   │   ├── DirectionsModule.tsx  # 工具分类列表
│   │   ├── NewArrivalModule.tsx  # 最新工具推荐
│   │   ├── LatestCaseModule.tsx  # 最新案例
│   │   ├── SocialModule.tsx      # 社交媒体
│   │   ├── AIAssistantModule.tsx # AI 问答
│   │   ├── SubmitModule.tsx      # 提交工具
│   │   └── QuickNavModule.tsx    # 快捷导航
│   ├── modals/                   # 弹窗组件
│   │   ├── ToolDetailModal.tsx   # 弹窗1
│   │   ├── CategoryToolsModal.tsx # 弹窗2
│   │   └── CaseDetailModal.tsx   # 弹窗3
│   ├── admin/                    # 管理后台组件
│   │   ├── Sidebar.tsx
│   │   ├── ToolForm.tsx
│   │   ├── CaseForm.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── ImageUpload.tsx
│   ├── shared/                   # 共享组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ToolCard.tsx
│   │   ├── CaseCard.tsx
│   │   └── LoadingSpinner.tsx
│   └── providers/                # Context Providers
│       ├── ThemeProvider.tsx
│       └── ModalProvider.tsx
├── lib/                          # 工具函数
│   ├── db.ts                     # 数据库客户端
│   ├── auth.ts                   # 认证工具
│   ├── api.ts                    # API 客户端
│   ├── ai/                       # AI 相关
│   │   ├── embeddings.ts         # Embedding 生成
│   │   ├── vectorStore.ts        # 向量存储
│   │   ├── rag.ts                # RAG 实现
│   │   └── chat.ts               # 聊天功能
│   ├── utils.ts                  # 通用工具
│   └── constants.ts              # 常量定义
├── hooks/                        # 自定义 Hooks
│   ├── useTools.ts
│   ├── useCases.ts
│   ├── useCategories.ts
│   ├── useModal.ts
│   ├── useDraggable.ts
│   └── useChat.ts
├── store/                        # Zustand Store
│   ├── modalStore.ts
│   ├── layoutStore.ts
│   └── chatStore.ts
├── types/                        # TypeScript 类型
│   ├── tool.ts
│   ├── case.ts
│   ├── category.ts
│   ├── admin.ts
│   └── api.ts
├── prisma/                       # Prisma ORM
│   ├── schema.prisma
│   └── migrations/
├── public/                       # 静态资源
│   ├── images/
│   └── fonts/
├── .env.local                    # 环境变量
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 3.2 核心组件设计

#### BentoGrid 组件（拖拽容器）
```typescript
// components/home/BentoGrid.tsx
import { useDndMonitor, DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

export function BentoGrid() {
  const [items, setItems] = useState(defaultLayout);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event) => {
    // 处理拖拽结束逻辑
    // 保存布局到 localStorage 或服务器
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="bento-grid">
          {items.map(item => (
            <SortableModule key={item.id} id={item.id}>
              {/* 渲染对应模块 */}
            </SortableModule>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

#### Modal 系统
```typescript
// store/modalStore.ts
import { create } from 'zustand';

interface ModalStore {
  toolDetailModal: { isOpen: boolean; toolId: string | null };
  categoryToolsModal: { isOpen: boolean; categoryId: string | null };
  caseDetailModal: { isOpen: boolean; caseId: string | null };
  openToolDetail: (toolId: string) => void;
  openCategoryTools: (categoryId: string) => void;
  openCaseDetail: (caseId: string) => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  toolDetailModal: { isOpen: false, toolId: null },
  categoryToolsModal: { isOpen: false, categoryId: null },
  caseDetailModal: { isOpen: false, caseId: null },
  openToolDetail: (toolId) => set({ 
    toolDetailModal: { isOpen: true, toolId } 
  }),
  // ... 其他方法
}));
```

### 3.3 页面路由设计

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | Bento Grid 布局 |
| `/categories/[slug]` | 分类详情页 | 展示某分类下所有工具 |
| `/cases/[id]` | 案例详情页 | 展示案例完整信息 |
| `/admin/login` | 管理员登录 | 认证入口 |
| `/admin/dashboard` | 管理仪表板 | 数据概览 |
| `/admin/tools` | 工具管理 | CRUD 操作 |
| `/admin/cases` | 案例管理 | CRUD 操作 |

### 3.4 页面状态与骨架设计

#### 3.4.1 工具分类详情页（/categories/[slug]）
- **加载状态**：
  - 使用 `ToolCard` 的骨架版本（logo 占位 + 标题条 + 2 行描述条）
  - 筛选区显示圆角骨架 chip（width: 64-96px）
  - 列表追加加载时展示 `LoadingSpinner` + 文案
- **空状态**：
  - `EmptyState` 组件：标题 + 说明 + 主/次按钮
  - 主按钮重置筛选，次按钮跳转 `/admin/login`
- **错误状态**：
  - `ErrorState` 组件：错误说明 + 重试回调
  - 保留返回首页入口

#### 3.4.2 案例详情页（/cases/[id]）
- **加载状态**：
  - Hero 区域 16:9 骨架图（rounded-2xl）
  - 内容卡片骨架（标题条 + 3 行文本）
  - 侧栏工具列表使用标签骨架
- **空状态**：
  - 案例不存在或已下线时展示 `NotFoundState`
  - CTA：返回首页 + 浏览案例列表
- **错误状态**：
  - 展示 `ErrorState`，支持重试与返回上一页

### 3.5 状态组件 API 约定

#### 3.5.1 EmptyState
- **路径**：`components/shared/EmptyState.tsx`
- **用途**：筛选无结果、列表为空、下线内容兜底
- **Props**：
  - `title: string`
  - `description?: string`
  - `primaryAction?: { label: string; onClick?: () => void; href?: string }`
  - `secondaryAction?: { label: string; onClick?: () => void; href?: string }`
  - `icon?: ReactNode`
- **交互**：主按钮 primary，次按钮 outline，支持无操作时隐藏按钮

#### 3.5.2 ErrorState
- **路径**：`components/shared/ErrorState.tsx`
- **用途**：数据加载失败、网络错误
- **Props**：
  - `title?: string` (默认 "Something went wrong")
  - `description?: string`
  - `onRetry?: () => void`
  - `secondaryAction?: { label: string; href?: string }`
- **交互**：出现重试按钮时优先高亮，保留返回入口

#### 3.5.3 Skeletons
- **路径**：`components/shared/Skeleton.tsx`
- **基础骨架组件**：
  - `Skeleton`：`className` 可控，内置 `animate-pulse` 与圆角
- **业务骨架组件**：
  - `ToolCardSkeleton`：logo 方块 + 标题条 + 描述条
  - `CaseDetailSkeleton`：Hero 16:9 + 内容卡片条 + 侧栏标签条
  - `FilterChipSkeleton`：rounded-full 64-96px

#### 3.5.4 使用示例（伪代码）
```tsx
{isLoading && <ToolCardSkeleton />}
{isError && <ErrorState onRetry={refetch} />}
{!isLoading && !data.length && (
  <EmptyState
    title="No tools found"
    description="Try resetting your filters."
    primaryAction={{ label: "Reset Filters", onClick: reset }}
    secondaryAction={{ label: "Submit a Tool", href: "/admin/login" }}
  />
)}
```

## 4. 后端架构设计

### 4.1 API 设计

#### RESTful API 规范

**工具相关 API**
```
GET    /api/tools              # 获取工具列表（支持分页、筛选）
GET    /api/tools/:id          # 获取工具详情
POST   /api/tools              # 创建工具（需认证）
PUT    /api/tools/:id          # 更新工具（需认证）
DELETE /api/tools/:id          # 删除工具（需认证）
GET    /api/tools/featured     # 获取精选工具
GET    /api/tools/latest       # 获取最新工具
```

**案例相关 API**
```
GET    /api/cases              # 获取案例列表
GET    /api/cases/:id          # 获取案例详情
POST   /api/cases              # 创建案例（需认证）
PUT    /api/cases/:id          # 更新案例（需认证）
DELETE /api/cases/:id          # 删除案例（需认证）
GET    /api/cases/featured     # 获取精选案例
```

**分类相关 API**
```
GET    /api/categories         # 获取所有分类
GET    /api/categories/:id/tools # 获取分类下的工具
```

**认证相关 API**
```
POST   /api/auth/login         # 管理员登录
POST   /api/auth/logout        # 登出
GET    /api/auth/me            # 获取当前用户信息
```

**AI 问答 API**
```
POST   /api/ai/chat            # 发送消息，获取 AI 回复
```

**上传 API**
```
POST   /api/upload             # 上传图片
```

#### API 响应格式
```typescript
// 成功响应
{
  success: true,
  data: { ... },
  message: "操作成功"
}

// 错误响应
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "错误信息"
  }
}

// 分页响应
{
  success: true,
  data: [ ... ],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 100,
    totalPages: 5
  }
}
```

### 4.2 认证和授权

#### JWT 认证流程
```typescript
// lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function login(email: string, password: string) {
  // 1. 查询管理员
  const admin = await prisma.admin.findUnique({ 
    where: { email } 
  });
  
  if (!admin) {
    throw new Error('Invalid credentials');
  }
  
  // 2. 验证密码
  const isValid = await bcrypt.compare(password, admin.password_hash);
  
  if (!isValid) {
    throw new Error('Invalid credentials');
  }
  
  // 3. 生成 JWT
  const token = jwt.sign(
    { 
      userId: admin.id, 
      email: admin.email,
      role: 'admin'
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  // 4. 更新最后登录时间
  await prisma.admin.update({
    where: { id: admin.id },
    data: { last_login: new Date() }
  });
  
  return { token, admin };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
}
```

#### 中间件保护
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  // 保护管理后台路由
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 登录页除外
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

### 4.3 数据验证

使用 Zod 进行运行时类型验证：

```typescript
// types/tool.ts
import { z } from 'zod';

export const toolSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  detailed_intro: z.string().optional(),
  official_url: z.string().url(),
  logo_url: z.string().url().optional(),
  category_id: z.string().uuid(),
  pricing_type: z.enum(['free', 'paid', 'freemium']),
  tags: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
});

export type ToolInput = z.infer<typeof toolSchema>;
```

在 API 中使用：

```typescript
// app/api/tools/route.ts
import { toolSchema } from '@/types/tool';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = toolSchema.parse(body);
    
    const tool = await prisma.tool.create({
      data: validated,
    });
    
    return NextResponse.json({ success: true, data: tool });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: error.errors } },
        { status: 400 }
      );
    }
    // ... 其他错误处理
  }
}
```

## 5. AI 功能实现

### 5.1 RAG 架构

```
用户问题 → Embedding → 向量检索 → 上下文构建 → LLM 生成 → 返回回答
                           ↓                        ↓
                      知识库（向量数据库）        OpenRouter API
                      - 工具信息向量              (多模型支持)
                      - 案例信息向量
```

### 5.2 知识库构建

```typescript
// lib/ai/embeddings.ts
import OpenAI from 'openai';

// OpenRouter 兼容 OpenAI SDK
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
    'X-Title': 'AI Select Shop',
  },
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openrouter.embeddings.create({
    model: 'openai/text-embedding-3-small',
    input: text,
  });
  
  return response.data[0].embedding;
}

// 为工具生成向量
export async function embedTool(tool: Tool) {
  const content = `
    工具名称: ${tool.name}
    分类: ${tool.category}
    描述: ${tool.description}
    详细介绍: ${tool.detailed_intro}
    标签: ${tool.tags.join(', ')}
  `.trim();
  
  const embedding = await generateEmbedding(content);
  
  await prisma.knowledgeVector.create({
    data: {
      content,
      embedding,
      source_type: 'tool',
      source_id: tool.id,
      metadata: {
        name: tool.name,
        category: tool.category,
        url: tool.official_url,
      },
    },
  });
}
```

### 5.3 向量检索

```typescript
// lib/ai/vectorStore.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function searchSimilar(
  queryEmbedding: number[],
  limit: number = 5
) {
  // 使用 pgvector 的余弦相似度搜索
  const results = await prisma.$queryRaw`
    SELECT 
      id,
      content,
      source_type,
      source_id,
      metadata,
      1 - (embedding <=> ${queryEmbedding}::vector) as similarity
    FROM knowledge_vectors
    ORDER BY embedding <=> ${queryEmbedding}::vector
    LIMIT ${limit}
  `;
  
  return results;
}
```

### 5.4 RAG 实现

```typescript
// lib/ai/rag.ts
import { generateEmbedding } from './embeddings';
import { searchSimilar } from './vectorStore';
import OpenAI from 'openai';

// 使用 OpenRouter
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
    'X-Title': 'AI Select Shop',
  },
});

export async function ragQuery(question: string) {
  // 1. 将问题转换为向量
  const questionEmbedding = await generateEmbedding(question);
  
  // 2. 检索相关内容
  const similarDocs = await searchSimilar(questionEmbedding, 5);
  
  // 3. 构建上下文
  const context = similarDocs
    .map((doc) => doc.content)
    .join('\n\n---\n\n');
  
  // 4. 构建提示词
  const systemPrompt = `
你是 AI Select Shop 的智能助手。根据以下知识库内容回答用户问题。
如果知识库中有相关的工具或案例，请推荐给用户，并提供名称和链接。
如果知识库中没有相关信息，请礼貌地告知用户。

知识库内容：
${context}
  `.trim();
  
  // 5. 调用 LLM（通过 OpenRouter）
  const completion = await openrouter.chat.completions.create({
    model: 'openai/gpt-4-turbo', // 可选模型：anthropic/claude-3.5-sonnet, google/gemini-pro
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });
  
  const answer = completion.choices[0].message.content;
  
  // 6. 提取推荐的工具和案例
  const recommendations = similarDocs.map((doc) => ({
    type: doc.source_type,
    id: doc.source_id,
    name: doc.metadata.name,
    similarity: doc.similarity,
  }));
  
  return {
    answer,
    recommendations,
  };
}
```

### 5.5 流式响应（可选）

```typescript
// app/api/ai/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  const { message } = await req.json();
  
  // RAG 检索
  const context = await getRelevantContext(message);
  
  // 创建流式响应（OpenRouter 支持流式）
  const response = await openrouter.chat.completions.create({
    model: 'openai/gpt-4-turbo',
    stream: true,
    messages: [
      { role: 'system', content: buildPrompt(context) },
      { role: 'user', content: message },
    ],
  });
  
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

## 6. 部署方案

### 6.1 EdgeOne 部署

#### 环境变量配置
```bash
# .env.local
DATABASE_URL="postgresql://..."
MEMFIREDB_URL="..."
MEMFIREDB_ANON_KEY="..."
MEMFIREDB_SERVICE_KEY="..."

JWT_SECRET="..."

OPENROUTER_API_KEY="sk-or-v1-..."

NEXT_PUBLIC_SITE_URL="https://ai-select-shop.edgeone.app" # 或自定义域名
```

#### 部署步骤
1. **准备 Next.js 项目**
   - 确保项目支持 Node.js 运行时
   - 构建生产版本：`npm run build`
   
2. **腾讯云 EdgeOne 配置**
   - 登录腾讯云控制台
   - 进入 EdgeOne 服务
   - 创建新的边缘函数应用
   
3. **部署方式选择**
   - **方式 1**: 使用 EdgeOne CLI 部署
     ```bash
     npm install -g @tencent/edgeone-cli
     edgeone init
     edgeone deploy
     ```
   
   - **方式 2**: 通过 GitHub Actions 自动部署
     - 配置 `.github/workflows/deploy.yml`
     - 推送到 main 分支自动触发部署
   
   - **方式 3**: 使用腾讯云控制台手动上传
     - 打包项目为 zip
     - 在控制台上传部署包
   
4. **配置环境变量**
   - 在 EdgeOne 控制台添加所有环境变量
   - 确保敏感信息加密存储
   
5. **配置域名**
   - 添加自定义域名
   - 配置 DNS 解析
   - 启用 HTTPS（自动申请 SSL 证书）
   
6. **配置边缘加速**
   - 启用全球边缘节点
   - 配置缓存策略
   - 设置回源规则

#### EdgeOne 配置文件示例
```javascript
// edgeone.config.js
module.exports = {
  runtime: 'nodejs18',
  entry: '.next/standalone/server.js',
  output: {
    path: '.edgeone',
  },
  routes: [
    {
      path: '/_next/static/*',
      cache: {
        maxAge: 31536000, // 1 年
      },
    },
    {
      path: '/api/*',
      cache: false,
    },
  ],
};
```

### 6.2 数据库部署

使用 MemFireDB 云服务：
1. 创建项目
2. 启用 pgvector 扩展
3. 运行数据库迁移
4. 配置 RLS 策略
5. 创建 Storage Bucket（存储图片）
6. 配置 CORS（允许 EdgeOne 域名访问）

### 6.3 监控和日志

- **性能监控**: EdgeOne 监控控制台
- **错误追踪**: Sentry（独立部署）
- **日志查看**: EdgeOne 日志服务 + 腾讯云 CLS
- **数据库监控**: MemFireDB Dashboard
- **API 监控**: OpenRouter Dashboard（查看 API 使用情况和费用）

## 7. 性能优化

### 7.1 前端优化

- **代码分割**: 使用 Next.js 的动态导入
- **图片优化**: Next/Image 组件，WebP 格式
- **字体优化**: next/font 优化字体加载
- **缓存策略**: 
  - 静态页面使用 ISR（增量静态再生）
  - API 响应使用 SWR
- **懒加载**: React.lazy + Suspense
- **Tree Shaking**: 自动移除未使用代码

### 7.2 后端优化

- **数据库索引**: 为常查询字段添加索引
- **查询优化**: 避免 N+1 查询，使用 include
- **缓存**: Redis 缓存热门数据（可选）
- **CDN**: 图片和静态资源使用 CDN
- **API 限流**: 防止滥用

### 7.3 AI 功能优化

- **向量缓存**: 缓存常见问题的检索结果
- **批量处理**: 批量生成 Embedding
- **模型选择**: 根据场景选择合适的模型
- **超时控制**: 设置合理的超时时间

## 8. 测试策略

### 8.1 单元测试
- 使用 Jest + React Testing Library
- 测试工具函数
- 测试组件渲染

### 8.2 集成测试
- 测试 API 端点
- 测试数据库操作
- 测试认证流程

### 8.3 E2E 测试
- 使用 Playwright
- 测试关键用户流程
- 测试拖拽功能

## 9. 安全考虑

### 9.1 前端安全
- XSS 防护：React 自动转义
- CSRF 防护：使用 CSRF Token
- 安全的 Cookie 配置

### 9.2 后端安全
- SQL 注入防护：使用 Prisma ORM
- 密码哈希：bcryptjs
- JWT 安全：设置合理过期时间
- Rate Limiting：防止暴力破解

### 9.3 数据安全
- RLS 策略：数据库级别权限控制
- 环境变量：敏感信息不提交到代码库
- HTTPS：强制使用 HTTPS

## 10. 开发规范

### 10.1 代码规范
- ESLint + Prettier
- TypeScript 严格模式
- 组件命名：PascalCase
- 文件命名：kebab-case

### 10.2 Git 工作流
- 主分支：main
- 功能分支：feature/*
- 修复分支：fix/*
- Commit 规范：Conventional Commits

### 10.3 Code Review
- 至少一人审核
- 检查代码质量
- 检查测试覆盖率

## 11. 项目时间表

| 阶段 | 任务 | 工作量 | 完成标准 |
|------|------|--------|----------|
| Week 1 | 项目初始化、数据库设计 | 3-5天 | 环境搭建完成，数据库表创建 |
| Week 2 | 首页 Bento Grid 开发 | 5-7天 | 所有模块正常显示，拖拽功能可用 |
| Week 3 | 弹窗系统、详情页 | 5-7天 | 三个弹窗完成，两个详情页完成 |
| Week 4 | 管理后台开发 | 5-7天 | 登录、CRUD 功能完整 |
| Week 5 | AI 功能集成（OpenRouter） | 5-7天 | RAG 系统可用，问答功能正常 |
| Week 6 | 测试、优化、EdgeOne 部署 | 3-5天 | 通过测试，性能达标，成功部署 |

## 12. 风险控制

### 12.1 技术风险
- **AI API 限制**: 准备降级方案，使用缓存
- **数据库性能**: 优化查询，添加索引
- **拖拽兼容性**: 充分测试不同设备

### 12.2 进度风险
- **功能蔓延**: 严格按照 PRD 开发
- **技术债务**: 定期 Code Review
- **依赖问题**: 锁定依赖版本

### 12.3 应对措施
- 每日站会同步进度
- 及时识别和解决阻塞
- 保持灵活，适时调整计划
