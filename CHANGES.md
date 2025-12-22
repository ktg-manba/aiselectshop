# 技术方案调整说明

## 📅 更新时间
2024-12-22

## 🔄 主要变更

### 1. AI 接口更换：OpenAI → OpenRouter

#### 变更原因
- **统一接口**：OpenRouter 提供统一的 API 接口，可访问多个大模型（GPT-4、Claude、Gemini 等）
- **灵活切换**：支持在不同模型间快速切换，提高系统稳定性
- **成本优化**：通过 OpenRouter 享受更优惠的价格
- **降级方案**：主模型失败时可自动切换到备用模型

#### 技术实现变更

**环境变量**
```bash
# 之前
OPENAI_API_KEY="sk-..."

# 现在
OPENROUTER_API_KEY="sk-or-v1-..."
NEXT_PUBLIC_SITE_URL="https://ai-select-shop.edgeone.app"
```

**代码配置**
```typescript
// 之前
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 现在
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
    'X-Title': 'AI Select Shop',
  },
});
```

**模型调用**
```typescript
// 之前
model: 'gpt-4-turbo-preview'

// 现在（支持多种模型）
model: 'openai/gpt-4-turbo'  // GPT-4
// 或
model: 'anthropic/claude-3.5-sonnet'  // Claude
// 或
model: 'google/gemini-pro'  // Gemini
```

#### OpenRouter 支持的模型示例
- `openai/gpt-4-turbo` - GPT-4 Turbo
- `openai/gpt-3.5-turbo` - GPT-3.5 Turbo
- `anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
- `anthropic/claude-3-opus` - Claude 3 Opus
- `google/gemini-pro` - Gemini Pro
- `meta-llama/llama-3-70b` - Llama 3 70B

### 2. 部署平台更换：Vercel → EdgeOne

#### 变更原因
- **国内访问速度**：EdgeOne 是腾讯云的边缘计算平台，在中国大陆访问速度更快
- **边缘加速**：全球边缘节点分发，降低延迟
- **成本控制**：更适合国内市场的定价策略
- **技术生态**：与腾讯云其他服务更好集成

#### 部署流程变更

**之前（Vercel）**
1. 连接 GitHub 仓库
2. 自动部署
3. 配置环境变量
4. 配置自定义域名

**现在（EdgeOne）**
1. 安装 EdgeOne CLI
   ```bash
   npm install -g @tencent/edgeone-cli
   ```

2. 初始化配置
   ```bash
   edgeone init
   ```

3. 创建配置文件 `edgeone.config.js`
   ```javascript
   module.exports = {
     runtime: 'nodejs18',
     entry: '.next/standalone/server.js',
     output: {
       path: '.edgeone',
     },
     routes: [
       {
         path: '/_next/static/*',
         cache: { maxAge: 31536000 },
       },
       {
         path: '/api/*',
         cache: false,
       },
     ],
   };
   ```

4. 配置 GitHub Actions 自动部署
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to EdgeOne
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm install
         - run: npm run build
         - run: npx edgeone deploy
           env:
             EDGEONE_SECRET_ID: ${{ secrets.EDGEONE_SECRET_ID }}
             EDGEONE_SECRET_KEY: ${{ secrets.EDGEONE_SECRET_KEY }}
   ```

5. 部署
   ```bash
   npm run build
   edgeone deploy
   ```

6. 配置域名和 HTTPS
   - 在 EdgeOne 控制台添加域名
   - 配置 DNS 解析
   - 自动申请 SSL 证书

#### 监控和日志

**之前（Vercel）**
- Vercel Analytics
- Vercel Logs

**现在（EdgeOne + 腾讯云）**
- EdgeOne 监控控制台
- 腾讯云 CLS 日志服务
- Sentry 错误追踪（保持不变）
- MemFireDB Dashboard（保持不变）
- **新增**: OpenRouter Dashboard（API 使用监控）

## 📋 更新的文档

### 1. techdesign.md
- ✅ 更新 AI 技术栈说明
- ✅ 更新代码示例（OpenRouter 配置）
- ✅ 更新部署方案（EdgeOne 详细步骤）
- ✅ 新增 EdgeOne 配置文件示例
- ✅ 更新监控和日志方案

### 2. task.md
- ✅ 更新 Week 5 AI 功能集成任务
  - OpenRouter 账号注册
  - API Key 配置
  - 多模型测试
  - 降级方案实现
- ✅ 更新 Week 6 部署任务
  - EdgeOne CLI 安装
  - 配置文件创建
  - GitHub Actions 设置
  - 域名和 HTTPS 配置
- ✅ 新增 OpenRouter 监控任务

### 3. prd.md
- ✅ 更新 AI 问答功能技术实现说明
- ✅ 更新风险和应对策略
- ✅ 新增多模型支持说明

## 🎯 开发者需要注意的事项

### 1. 环境变量配置
确保在本地和生产环境配置以下新的环境变量：
```bash
OPENROUTER_API_KEY=sk-or-v1-xxx
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. OpenRouter 账号设置
1. 访问 https://openrouter.ai
2. 注册并获取 API Key
3. 在账户设置中配置：
   - 站点 URL（用于统计和追踪）
   - 预算限制（防止超支）
   - 模型权限

### 3. EdgeOne 准备工作
1. 注册腾讯云账号
2. 开通 EdgeOne 服务
3. 创建访问密钥（SecretId 和 SecretKey）
4. 准备域名（可选）

### 4. 代码迁移要点
- 所有 `openai` 实例需要改为 `openrouter`
- 添加 `baseURL` 和自定义 `headers`
- 模型名称需要加上提供商前缀（如 `openai/`, `anthropic/`）
- Embedding 模型同样需要加前缀

### 5. 测试建议
- 测试不同模型的响应质量
- 测试模型切换和降级机制
- 测试 API 限流和错误处理
- 进行压力测试，验证 EdgeOne 性能

## 💰 成本估算

### OpenRouter 费用（参考）
| 模型 | 输入价格 | 输出价格 | 建议用途 |
|------|---------|---------|---------|
| GPT-4 Turbo | $10/1M tokens | $30/1M tokens | 复杂问题 |
| GPT-3.5 Turbo | $0.5/1M tokens | $1.5/1M tokens | 简单问题 |
| Claude 3.5 Sonnet | $3/1M tokens | $15/1M tokens | 平衡性能 |
| Text Embedding | $0.1/1M tokens | - | 向量生成 |

### EdgeOne 费用
- 边缘函数调用：按请求次数计费
- CDN 流量：按流量计费
- 具体价格参考腾讯云官网

### 优化建议
- 对简单问题使用 GPT-3.5，复杂问题使用 GPT-4
- 实现结果缓存，减少重复调用
- 设置预算告警，防止超支
- 使用 EdgeOne 缓存策略，降低回源成本

## 📞 技术支持

### OpenRouter
- 官网：https://openrouter.ai
- 文档：https://openrouter.ai/docs
- Discord：https://discord.gg/openrouter

### EdgeOne
- 控制台：https://console.cloud.tencent.com/edgeone
- 文档：https://cloud.tencent.com/document/product/1552
- 技术支持：提交工单

## 🚀 后续优化方向

1. **模型自动选择**
   - 根据问题复杂度自动选择合适的模型
   - 实现成本和质量的平衡

2. **智能缓存**
   - 缓存常见问题的答案
   - 使用 Redis 缓存向量检索结果

3. **多区域部署**
   - EdgeOne 支持多区域部署
   - 根据用户地理位置智能路由

4. **监控和告警**
   - 实时监控 API 使用量
   - 设置费用告警
   - 性能指标追踪

## ✅ 更新完成清单

- [x] 更新 techdesign.md
- [x] 更新 task.md  
- [x] 更新 prd.md
- [x] 创建变更说明文档

## 📝 版本历史

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| v1.1 | 2024-12-22 | 更换 AI 接口为 OpenRouter，部署平台为 EdgeOne |
| v1.0 | 2024-12-22 | 初始版本（OpenAI + Vercel） |

