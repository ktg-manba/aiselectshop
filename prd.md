# AI Select Shop - 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品定位
AI Select Shop 是一个精选 AI 工具导航站，为用户提供经过精心筛选的高质量 AI 工具和实际应用案例，帮助用户快速找到适合自己需求的 AI 解决方案。

### 1.2 产品愿景
打造最具设计感和交互性的 AI 工具导航平台，让用户能够轻松发现、了解和使用优质的 AI 工具。

### 1.3 目标用户
- AI 工具探索者：希望发现新的 AI 工具
- 专业工作者：寻找提升工作效率的 AI 解决方案
- 开发者：了解 AI 工具的技术实现和应用场景
- 内容创作者：需要 AI 辅助创作工具

## 2. 核心功能需求

### 2.1 首页 Bento Grid 布局

#### 2.1.1 商标模块 (Brand Module)
- **功能描述**：展示 "AI SELECT SHOP" 品牌标识
- **位置**：网格左上角（grid-column: 1/4; grid-row: 1/5）
- **尺寸**：3列 x 4行
- **交互**：可拖动调整位置
- **设计细节**：
  - 顶部装饰条：2px 高度，Klein Blue (#002FA7)
  - 左上角文件名提示："brand_identity.svg"（等宽字体，灰色）
  - 主标题：
    ```
    AI
    SELECT  
    SHOP
    ```
    - 字体：Space Grotesk Bold
    - 字号：text-6xl (60px)
    - 颜色：前两行 Klein Blue，最后一行黑色（深色模式为灰色）
    - letter-spacing: -0.05em（紧凑）
    - 悬停时旋转 6° (`group-hover:rotate-6`)
  - 底部标签：
    - 内容："Est. 2024"
    - 样式：白色圆角胶囊按钮，带阴影
    - 字体：Medium，text-sm
  - 背景：白色/深灰卡片，圆角 3xl (32px)
  - 阴影：shadow-float
  - 居中对齐，垂直和水平居中

#### 2.1.2 简介模块 (Hero Module)
- **功能描述**：展示产品核心价值主张
- **位置**：网格中央偏左（grid-column: 4/9; grid-row: 1/4）
- **尺寸**：5列 x 3行
- **内容结构**：
  - **主标题**：
    - 文案："Curating the best AI tools"
    - 字体：Space Grotesk Bold
    - 字号：text-4xl (36px)
    - 颜色：主色调 Klein Blue + text-3xl
    - 行高：leading-tight
    - 下边距：mb-6
  - **描述文案**：
    - 内容："Stop searching through thousands of mediocre apps. Our boutique features only the high-impact, design-forward AI solutions that actually transform your workflow."
    - 字体：Inter Light
    - 字号：text-lg (18px)
    - 颜色：text-gray-500（深色模式 text-gray-400）
    - 行高：leading-relaxed
  - **探索按钮**：
    - 位置：右下角（flex justify-end）
    - 样式：圆形黑色按钮（深色模式白色）
    - 尺寸：p-3
    - 图标：arrow_outward
    - 悬停效果：scale-110
- **布局**：Flexbox 列，justify-between
- **背景**：白色/深灰卡片
- **圆角**：rounded-3xl
- **内边距**：p-8
- **交互**：可拖动

#### 2.1.3 工具分类列表模块 (Directions Module)
- **功能描述**：展示 AI 工具的主要分类
- **位置**：网格右侧（grid-column: 9/13; grid-row: 1/6）
- **尺寸**：4列 x 5行（较高的垂直模块）
- **支持分类**（5个）：
  - AI Chatbot（AI 对话）
  - AI Coding（AI 编程）
  - AI Image Gen（AI 图像生成）
  - AI Video（AI 视频）
  - AI Audio（AI 音频）
  
- **界面结构**：
  - **顶部标题栏**（sticky）：
    - 背景：半透明毛玻璃效果（backdrop-blur-sm）
    - 标题："Directions"（Space Grotesk Bold, text-lg, 主色调）
    - 标签："5 Categories"（主色调背景 opacity-10，圆角，text-xs）
    - 底部边框：border-b
    - 内边距：px-6 pt-6 pb-2
  
  - **滚动列表区**：
    - 可滚动：overflow-y-auto
    - 隐藏滚动条（no-scrollbar）
    - 内边距：p-6
    - 间距：space-y-3
  
  - **列表项设计**：
    - 背景：白色/深色卡片（bg-white dark:bg-neutral-800）
    - 圆角：rounded-xl
    - 内边距：p-4
    - 阴影：shadow-sm
    - 布局：flex items-center justify-between
    - 左侧：分类名称（font-bold）
    - 右侧：chevron_right 图标（text-gray-400）
    - 悬停效果：
      - 边框：border-primary
      - 文字：group-hover:text-primary
      - 图标：group-hover:translate-x-1
      - 显示预览弹出框（absolute，动画淡入）
    
  - **预览弹出框**（Hover 显示）：
    - 定位：absolute, left-0, top-full, mt-2
    - 宽度：w-full
    - 背景：白色/深色卡片
    - 圆角：rounded-xl
    - 阴影：shadow-xl
    - 内容：最新工具小卡片示例（如 Claude 3.5）
    - 层级：z-50
  
  - **底部操作栏**：
    - 背景：白色/深色（bg-white dark:bg-neutral-900）
    - 边框：border-t
    - 内边距：p-4
    - 按钮："All Categories"
      - 样式：主色调背景，白色文字，圆形
      - 图标：filter_list
      - 阴影：shadow-lg

- **背景**：渐变（from-gray-50 to-gray-100, dark 模式 from-neutral-900 to-neutral-800）
- **边框**：border border-white/20
- **交互流程**：
  1. 鼠标悬停：显示边框高亮 + 预览
  2. 点击分类：弹出弹窗2（显示该分类下的 3 个推荐工具）
  3. 点击具体工具：弹出弹窗1（工具详情）
  4. 点击底部按钮：跳转到工具分类详情页
- **可拖动**：支持

#### 2.1.4 最新工具推荐模块 (New Arrival Module)
- **功能描述**：展示最新添加的 AI 工具
- **位置**：网格中部偏左（grid-column: 2/5; grid-row: 5/8）
- **尺寸**：3列 x 3行
- **显示信息**：
  - **头部区域**（flex justify-between）：
    - 左侧标题："New Arrival"（Space Grotesk Bold, text-xl）
    - 右侧时间戳："2m ago"（font-mono, text-xs, 灰色背景胶囊标签）
  - **工具名称**：
    - 示例："DeepSeek V2"
    - 字体：Bold, text-lg
    - 下边距：mb-2
  - **工具描述**：
    - 示例："Open source champion. Deploy smart models with ease and cost efficiency."
    - 字体：text-sm
    - 颜色：text-gray-600（深色模式 text-gray-300）
    - 下边距：mb-6
  - **ASCII 艺术装饰**：
    - 字体：font-mono
    - 字号：text-[10px]
    - 行高：leading-[10px]
    - 颜色：text-gray-400, opacity-50
    - 预格式化：whitespace-pre
    - 不可选择：select-none
    - 悬停时：opacity-80
    - 示例内容：
      ```
      :::    ::: :::::::::: :::::::::: 
      :+:    :+: :+:        :+:        
      +:+    +:+ +:+        +:+        
      +#++:++#++ +#++:++#   +#++:++#   
      +#+    +#+ +#+        +#+        
      #+#    #+# #+#        #+#        
      ###    ### ########## ##########
      ```
  - **查看按钮**：
    - 位置：右下角（absolute bottom-4 right-4）
    - 样式：灰色背景圆角按钮
    - 图标：arrow_forward
    - 悬停效果：背景加深 + scale-110
- **背景**：白色/深灰卡片
- **圆角**：rounded-3xl
- **内边距**：p-6
- **阴影**：shadow-float
- **交互**：
  - 整个卡片可点击
  - 弹出弹窗1：显示工具详细信息
- **可拖动**：支持

#### 2.1.5 最新案例模块 (Latest Case Module)
- **功能描述**：展示精选应用案例
- **位置**：网格中部（grid-column: 5/8; grid-row: 4/7）
- **尺寸**：3列 x 3行
- **设计结构**：
  - **背景层**：
    - 渐变背景：
      - 浅色模式：from-[#FFDEE9] to-[#B5FFFC]（粉蓝渐变）
      - 深色模式：from-purple-900 to-blue-900
    - 背景图：
      - AI 神经网络 3D 流体形状图片
      - mix-blend-overlay 混合模式
      - opacity-80
      - 填充：object-cover
  - **信息层**（底部渐变遮罩）：
    - 定位：absolute bottom-0 left-0 w-full
    - 背景：gradient from-black/60 to-transparent
    - 内边距：p-6
    - 内容：
      - 标题："Latest Case"（white, bold, text-xl）
      - 描述："Generative Video & 3D Workflow"（white/80, text-sm, mt-1）
  - **悬停遮罩层**：
    - 默认：透明（opacity-0）
    - 悬停：完全不透明（opacity-100）
    - 背景：black/60 + backdrop-blur-sm
    - 布局：flex items-center justify-center
    - 按钮："View Case"
      - 样式：白色背景，黑色文字，圆形胶囊
      - 内边距：px-4 py-2
      - 字体：bold, text-sm
      - 动画：translate-y-4 → translate-y-0（上浮）
      - 过渡：duration-300ms
- **圆角**：rounded-3xl
- **阴影**：shadow-float
- **溢出**：overflow-hidden（确保圆角裁剪）
- **交互流程**：
  1. 默认显示：渐变背景 + 底部信息
  2. 鼠标悬停：显示半透明遮罩 + "View Case" 按钮
  3. 点击卡片：弹出弹窗3（案例描述）
  4. 点击"详情"：跳转案例详情页
- **可拖动**：支持

#### 2.1.6 社交媒体模块 (Social Links Module)
- **功能描述**：提供社交媒体链接
- **位置**：网格中部偏右（grid-column: 8/9; grid-row: 4/7）
- **尺寸**：1列 x 3行（窄高模块）
- **设计结构**：
  - 布局：Flexbox 列，gap-4
  - 居中对齐：items-center justify-center
  - 内边距：p-4
  
  - **Instagram 按钮**：
    - 高度：h-14
    - 宽度：w-full
    - 背景：bg-pink-500（Instagram 品牌色）
    - 圆角：rounded-2xl
    - 文字：白色，Bold, text-xl
    - 内容："Ig"
    - 阴影：shadow-lg
    - 悬停：scale-105
  
  - **X (Twitter) 按钮**：
    - 高度：h-14
    - 宽度：w-full
    - 背景：bg-blue-400（X 品牌色）
    - 圆角：rounded-2xl
    - 文字：白色，Bold, text-xl
    - 内容："X"
    - 阴影：shadow-lg
    - 悬停：scale-105

- **背景**：白色/深灰卡片
- **圆角**：rounded-3xl
- **阴影**：shadow-float
- **交互**：
  - 点击跳转到对应社交媒体主页（新标签页打开）
  - 悬停时按钮放大到 105%
  - 平滑过渡动画
- **可拖动**：支持

#### 2.1.7 AI 问答模块 (AI Assistant Module)
- **功能描述**：智能助手对话界面
- **位置**：网格右下角（grid-column: 9/13; grid-row: 6/10）
- **尺寸**：4列 x 4行
- **最小高度**：min-h-[240px]
- **核心能力**：
  - 用户输入想解决的问题或需求
  - AI 基于知识库推荐相关工具
  - 提供工具链接和案例链接

- **界面结构**：
  - **聊天显示区**（上方）：
    - 背景：灰色背景（bg-gray-50 dark:bg-neutral-800）
    - 布局：flex flex-col justify-end（底部对齐）
    - 内边距：p-6
    - 弹性增长：flex-1
    
    - **AI 消息气泡**：
      - 布局：flex gap-3
      - 头像：
        - 尺寸：w-8 h-8
        - 圆形：rounded-full
        - 背景：主色调
        - 图标：smart_toy（白色, text-sm）
      - 气泡：
        - 背景：白色/深色（bg-white dark:bg-neutral-900）
        - 圆角：rounded-2xl rounded-tl-none（左上角直角）
        - 内边距：p-3
        - 文字：text-sm
        - 阴影：shadow-sm
        - 最大宽度：max-w-[80%]
      - 初始消息："Hello! I'm your AI shopping assistant. What tool are you looking for today?"
    
    - **用户消息气泡**（右对齐）：
      - 布局：flex gap-3 justify-end
      - 气泡：
        - 背景：主色调
        - 圆角：rounded-2xl rounded-tr-none（右上角直角）
        - 文字：白色
  
  - **输入区**（下方）：
    - 背景：白色/深色（bg-white dark:bg-neutral-900）
    - 边框：border-t（顶部边框）
    - 内边距：p-4
    
    - **输入框容器**（relative）：
      - 输入框：
        - 宽度：w-full
        - 背景：灰色（bg-gray-100 dark:bg-neutral-800）
        - 边框：无（border-none）
        - 圆角：rounded-full
        - 内边距：py-3 px-4 pr-12
        - 占位符："Ask anything..."
        - 聚焦：ring-2 ring-primary
      
      - **发送按钮**（绝对定位）：
        - 位置：absolute right-2 top-1/2 -translate-y-1/2
        - 尺寸：w-8 h-8
        - 形状：圆形（rounded-full）
        - 背景：主色调
        - 图标：arrow_upward（白色, text-sm）
        - 悬停：bg-blue-700

- **背景**：白色/深灰卡片
- **圆角**：rounded-3xl
- **阴影**：shadow-float
- **溢出**：overflow-hidden
- **交互**：
  - 输入问题后按 Enter 或点击发送
  - AI 实时回复
  - 推荐结果以卡片形式展示（可点击）
  - 点击工具/案例链接打开相应弹窗
  - 支持多轮对话
- **可拖动**：支持

#### 2.1.8 提交工具模块 (Submit Tool Module)
- **功能描述**：引导用户提交新工具或案例
- **位置**：网格左下角（grid-column: 1/5; grid-row: 8/10）
- **尺寸**：4列 x 2行
- **设计结构**：
  - 背景：Klein Blue 主色调
  - 文字颜色：白色
  - 圆角：rounded-3xl
  - 内边距：p-8
  - 阴影：shadow-float
  - 布局：Flexbox 列，justify-between
  
  - **内容区域**：
    - 标题：
      - 文字："Submit a Tool"
      - 字体：Space Grotesk Bold
      - 字号：text-2xl
      - 下边距：mb-2
    - 副标题：
      - 文字："Building the future?"
      - 颜色：text-blue-100（浅蓝色）
      - 字号：text-sm
  
  - **行动召唤**：
    - 位置：底部（mt-4）
    - 布局：flex items-center gap-2
    - 字体：font-mono, text-sm
    - 透明度：opacity-80
    - 悬停：opacity-100
    - 图标：add_circle (text-sm)
    - 文字："Submit Now"

- **悬停效果**：
  - group 状态管理
  - 透明度变化
  - 轻微上浮（继承 hover-card）
- **交互**：
  - 点击整个卡片
  - 跳转到管理后台登录页 `/admin/login`
  - 仅管理员登录后可提交
- **可拖动**：支持

#### 2.1.9 快捷导航按钮模块

**按钮 1 - Explore Categories**
- **功能**：跳转到工具分类详情页
- **位置**：网格底部中间偏左（grid-column: 5/7; grid-row: 7/8）
- **尺寸**：2列 x 1行
- **设计**：
  - 形状：圆形胶囊（rounded-full）
  - 背景：白色/深灰卡片
  - 内边距：p-4
  - 阴影：shadow-float
  - 边框：border border-transparent
  - 悬停边框：hover:border-gray-200
  - 布局：flex flex-col items-center justify-center
  - 文字居中：text-center
  - 内容：
    - 文字："Explore Categories"
    - 字体：Space Grotesk Bold
    - 字号：text-sm
- **交互**：
  - 点击跳转到工具分类页
  - 悬停时边框显示
  - 光标：cursor-pointer
- **可拖动**：支持

**按钮 2 - Explore Case**
- **功能**：跳转到案例详情页
- **位置**：网格底部中间偏右（grid-column: 7/9; grid-row: 7/8）
- **尺寸**：2列 x 1行
- **设计**：
  - 形状：圆形胶囊（rounded-full）
  - 背景：白色/深灰卡片
  - 内边距：p-4
  - 阴影：shadow-float
  - 边框：border border-transparent
  - 悬停边框：hover:border-gray-200
  - 布局：flex flex-col items-center justify-center
  - 文字居中：text-center
  - 内容：
    - 文字："Explore Case"
    - 字体：Space Grotesk Bold
    - 字号：text-sm
- **交互**：
  - 点击跳转到案例列表页
  - 悬停时边框显示
  - 光标：cursor-pointer
- **可拖动**：支持

### 2.2 弹窗系统

#### 2.2.1 弹窗1：工具详情弹窗
- **触发位置**：
  - 点击"最新工具推荐模块"
  - 点击"工具列表模块"中的具体工具
- **显示内容**：
  - 工具 Logo/图标
  - 工具名称
  - 详细介绍（功能特点、使用场景）
  - 官方网址（可点击跳转）
  - 相关案例列表（点击可查看案例详情）
  - 分类标签
  - 定价信息（免费/付费）
- **交互**：
  - 点击背景或关闭按钮关闭
  - 支持滚动查看完整内容
  - 点击案例链接打开弹窗3
  
- **视觉与布局细节**：
  - **弹窗尺寸**：桌面端 max-w-[920px]，宽度 80vw；移动端 94vw，高度自适应
  - **容器样式**：bg-white/dark:bg-neutral-900，rounded-3xl，shadow-float，border border-white/20
  - **标题区（顶部粘性）**：
    - sticky top-0，backdrop-blur-sm，bg-white/80 dark:bg-neutral-900/80
    - 左侧 Logo 圆形容器（w-12 h-12），右侧工具名称（text-2xl, Space Grotesk Bold）
    - 右上角关闭按钮：icon "close"，圆形灰底，hover:scale-110
  - **基础信息区**：
    - 两列布局（桌面）：左 60% 文案，右 40% 标签/价格/CTA
    - 移动端为单列堆叠，间距 gap-4
  - **详细介绍**：
    - text-base leading-relaxed，段落间距 space-y-4
    - 若有要点，使用轻量列表点（text-sm, text-gray-500）
  - **标签与分类**：
    - 标签胶囊（rounded-full, text-xs），主色 opacity-10 背景
  - **CTA 区**：
    - "Visit Website" 主按钮（primary，rounded-full）
    - "Save" 次按钮（outline）
    - 外链图标 arrow_outward
  - **相关案例**：
    - 小卡片横向滚动（snap-x, no-scrollbar）
    - 卡片 hover-card，点击打开弹窗3
  - **可访问性**：
    - role="dialog" aria-modal="true"
    - ESC 关闭，焦点陷阱
  - **动效**：
    - 打开 scale-in + fade-in 200ms
    - 关闭 scale-out + fade-out 150ms

#### 2.2.2 弹窗2：分类工具列表弹窗
- **触发位置**：点击"工具列表模块"中的某个分类
- **显示内容**：
  - 分类名称
  - 该分类下的 3 个推荐工具
  - 每个工具包含：图标、名称、一句话描述
- **交互**：
  - 点击某个工具，打开弹窗1
  - 点击"查看更多"，跳转到工具分类详情页
  - 点击背景或关闭按钮关闭
  
- **视觉与布局细节**：
  - **弹窗尺寸**：桌面端 max-w-[720px]，宽度 70vw；移动端 92vw
  - **头部**：
    - 分类名称（text-2xl, Space Grotesk Bold）
    - 分类描述（text-sm, text-gray-500）
    - 右上角关闭按钮（圆形淡灰背景）
  - **工具列表**：
    - 3 张卡片纵向排列，space-y-3
    - 卡片结构：左侧图标（w-10 h-10），中间名称+一句话描述，右侧 chevron_right
    - hover：边框主色 + 轻微上浮
  - **底部操作**：
    - "查看更多" 按钮置右，rounded-full，主色
    - 次级文案：显示总工具数（font-mono, text-xs）
  - **交互补充**：
    - 列表支持键盘上下选择，Enter 打开弹窗1
    - 点击遮罩关闭

#### 2.2.3 弹窗3：案例描述弹窗
- **触发位置**：点击"最新案例模块"
- **显示内容**：
  - 案例标题
  - 案例描述（背景、目标、解决方案）
  - 使用的工具列表
  - 效果展示图/视频
  - "查看详情"按钮
- **交互**：
  - 点击工具名称，打开弹窗1
  - 点击"查看详情"，跳转到案例详情页
  - 点击背景或关闭按钮关闭
  
- **视觉与布局细节**：
  - **弹窗尺寸**：桌面端 max-w-[980px]，宽度 85vw；移动端 94vw
  - **头图区**：
    - 16:9 大图或视频预览，rounded-2xl，overlay 渐变
    - 左下角叠加标题与标签（white text, text-xl）
  - **内容区**：
    - 两列布局：左侧案例概述与背景，右侧工具清单 + 关键数据
    - 关键数据卡片：3 列小卡，数字大号（text-2xl）
  - **工具清单**：
    - 工具标签列表（rounded-full）
    - 点击标签触发弹窗1
  - **底部 CTA**：
    - "查看详情" 主按钮（primary, rounded-full）
    - "分享" 次按钮（outline，带 share 图标）
  - **动效**：
    - 打开时内容分段上浮（staggered 60ms）
  - **可访问性**：
    - role="dialog" aria-modal="true"
    - ESC 关闭，焦点陷阱

### 2.3 工具分类详情页

#### 2.3.1 页面结构
- **页面头部**：
  - 分类名称
  - 分类描述
  - 返回首页按钮
- **工具网格**：
  - 展示该分类下所有工具
  - 卡片式布局
  - 每个卡片显示：图标、名称、简介、标签
- **筛选和排序**：
  - 按价格筛选：全部/免费/付费
  - 按流行度排序
  - 按更新时间排序
  
#### 2.3.2 视觉与布局细节
- **整体背景**：延续主页径向渐变，顶部轻亮区，滚动后渐变降低
- **头部区域**：
  - 左侧大标题（text-4xl, Space Grotesk）
  - 右侧信息块：工具数量、更新时间（font-mono, text-xs）
  - 返回按钮：圆形轻灰底，icon "arrow_back"
- **筛选区（sticky）**：
  - sticky top-4，rounded-full，backdrop-blur
  - 筛选 chip：rounded-full，选中态主色 + 白字
  - 排序 dropdown：白色卡片，shadow-card
- **工具卡片**：
  - 3-4 列响应式网格（lg:4, md:3, sm:2, xs:1）
  - 卡片结构：顶部 logo + 标题，正文简介，底部标签+价格
  - hover：translateY(-5px) + shadow-float
  - 价格标记：免费/付费颜色区分（免费绿色，付费蓝色）
- **加载**：
  - 无限滚动触底触发，显示 skeleton 卡片
  
#### 2.3.3 交互补充
- 点击卡片打开弹窗1，并记录来源分类
- 顶部筛选变化后平滑淡入刷新列表
- 页面返回使用渐变淡出动画

#### 2.3.4 交互
- 点击工具卡片，打开弹窗1
- 页面进入/返回时有渐变动画效果
- 支持无限滚动加载
  
#### 2.3.5 空状态与加载状态
- **加载状态**：
  - 顶部筛选区显示灰度骨架条（rounded-full）
  - 工具卡片使用 3 行骨架（logo 方块 + 标题条 + 描述条）
  - 列表加载追加时底部显示 spinner + "Loading more"
- **空状态（无匹配工具）**：
  - 居中空状态卡片（rounded-2xl, shadow-soft）
  - 文案："No tools found in this filter."
  - 操作按钮："Reset Filters"（主按钮）+ "Submit a Tool"（次按钮）
  - 提示最近更新分类（font-mono, text-xs）
- **错误状态**：
  - 文案："Failed to load tools."
  - 重试按钮（outline）+ 返回首页按钮

### 2.4 案例详情页

#### 2.4.1 页面结构
- **页面头部**：
  - 案例标题
  - 案例标签/分类
  - 发布时间
  - 返回首页按钮
- **案例内容**：
  - 背景介绍
  - 使用的工具列表（可点击查看工具详情）
  - 实施过程/步骤
  - 效果展示（图片/视频）
  - 关键数据/成果
- **相关推荐**：
  - 相关工具推荐
  - 相似案例推荐
  
#### 2.4.2 视觉与布局细节
- **头部 Hero**：
  - 大图横幅（16:9），叠加渐变遮罩
  - 标题 text-4xl，标签胶囊+发布时间（font-mono, text-xs）
  - 返回按钮与分享按钮固定在右上角
- **内容区**：
  - 12 列网格：主内容 8 列，侧栏 4 列
  - 主内容：背景、过程、结果分段卡片，p-6，rounded-2xl
  - 侧栏：工具列表卡片 + 关键数据卡片（KPI）
- **工具列表**：
  - 使用列表卡片展示，点击打开弹窗1
  - 标注工具类别和定价
- **效果展示**：
  - 图片瀑布流，hover 放大预览
  - 视频卡片带播放按钮，点击弹出视频灯箱
- **相关推荐**：
  - 横向滚动卡片（snap-x）
  - 相似案例卡片采用缩略图 + 标题
  
#### 2.4.3 交互补充
- 页面进入：顶部 Hero 渐显 + 内容分段上浮
- 分享：复制链接 + 社交弹出
- 工具点击弹窗1，弹窗关闭后保持滚动位置

#### 2.4.4 交互
- 页面进入/返回时有渐变动画效果
- 支持分享到社交媒体
- 点击工具名称，打开弹窗1
  
#### 2.4.5 空状态与加载状态
- **加载状态**：
  - Hero 区域显示 16:9 骨架图
  - 内容区卡片骨架（标题条 + 2-3 行文本）
  - 右侧工具列表使用简化标签骨架
- **空状态（案例不存在/已下线）**：
  - 全屏居中提示：标题 "Case not found"
  - 辅助文案：建议浏览相似案例或返回首页
  - CTA："Back to Home" 主按钮 + "Explore Cases" 次按钮
- **相关推荐为空**：
  - 显示简短提示与 2 个精选工具卡片兜底
- **错误状态**：
  - 文案："Failed to load case details."
  - 重试按钮 + 返回上一页

### 2.5 管理后台

#### 2.5.1 登录系统
- **认证方式**：邮箱 + 密码
- **权限管理**：仅管理员账号可登录
- **安全措施**：
  - 密码加密存储
  - JWT Token 认证
  - 会话超时保护
  
#### 2.5.1.1 登录页视觉与交互
- **布局**：左右分栏（桌面），移动端单列
- **左侧品牌区**：
  - Klein Blue 背景 + 品牌文案
  - 轻量图形纹理（点阵或线性纹理）
- **右侧表单区**：
  - 卡片容器 rounded-3xl，shadow-soft
  - 输入框：rounded-full，focus ring-primary
  - 登录按钮：primary，加载中显示 spinner
- **交互**：
  - 错误提示：红色轻背景胶囊
  - 忘记密码入口（灰色链接）
  - Enter 提交

#### 2.5.2 工具管理
- **工具列表**：
  - 显示所有工具
  - 支持搜索、筛选
  - 分页展示
- **新增工具**：
  - 工具名称（必填）
  - 工具描述（必填）
  - 官方网址（必填）
  - Logo/图标上传
  - 分类选择（必填）
  - 定价类型（免费/付费）
  - 详细介绍（富文本编辑）
  - 相关标签
- **编辑工具**：修改已有工具信息
- **删除工具**：软删除，支持恢复
  
#### 2.5.2.1 工具管理界面细节
- **页面框架**：
  - 左侧导航栏（固定宽 240px）
  - 右侧内容区（表格 + 详情抽屉）
- **顶部工具条**：
  - 搜索框（rounded-full）
  - 筛选 chip（分类、价格）
  - "新增工具" 主按钮（右上）
- **列表样式**：
  - 表格卡片化行（行高 64px，悬停高亮）
  - 关键字段：名称、分类、价格、更新时间、状态
  - 状态标签：正常/隐藏/删除（颜色区分）
- **详情抽屉**：
  - 从右侧滑出，宽度 420px
  - 展示工具详情与快捷操作
- **表单交互**：
  - Logo 上传支持拖拽
  - 富文本编辑器内置字数统计
  - 保存按钮 fixed at bottom

#### 2.5.3 案例管理
- **案例列表**：
  - 显示所有案例
  - 支持搜索、筛选
  - 分页展示
- **新增案例**：
  - 案例标题（必填）
  - 案例描述（必填）
  - 缩略图上传
  - 案例类型/标签
  - 使用的工具（多选）
  - 详细内容（富文本编辑，支持图片/视频）
  - 效果数据
- **编辑案例**：修改已有案例信息
- **删除案例**：软删除，支持恢复
  
#### 2.5.3.1 案例管理界面细节
- **列表视图**：
  - 支持表格/卡片切换
  - 缩略图列固定宽度 96px
  - 案例标签显示为胶囊标签
- **新增/编辑**：
  - 步骤式表单（Basic Info → Content → Publish）
  - 内容编辑支持拖拽图片排序
  - 预览模式：右侧实时预览
- **媒体管理**：
  - 图片/视频统一上传池
  - 自动生成 3 种尺寸缩略图

#### 2.5.4 管理后台通用设计规范
- **视觉风格**：延续主站极简 + 高端感，控制色彩，突出 Klein Blue
- **字体**：标题 Space Grotesk，正文 Inter
- **交互**：
  - 表格行 hover 高亮
  - 操作按钮分级：主按钮 Klein Blue，次按钮灰
  - 全局 toast 通知（右上角）
  - 确认删除弹窗（二次确认 + 输入名称）

#### 2.5.4 AI 知识库管理
- **工具知识库维护**：
  - 自动从工具数据生成知识库
  - 支持手动添加补充信息
  - 向量化存储
- **案例知识库维护**：
  - 自动从案例数据生成知识库
  - 关联工具和使用场景

### 2.6 AI 问答功能

#### 2.6.1 功能特性
- **自然语言理解**：理解用户需求描述
- **智能推荐**：
  - 基于问题推荐相关工具
  - 推荐相关应用案例
  - 提供使用建议
- **上下文对话**：支持多轮对话
- **结果展示**：
  - 以对话形式呈现
  - 提供工具/案例链接
  - 支持点击查看详情

#### 2.6.2 技术实现
- 使用 OpenRouter API（统一接口访问多个大模型）
- 基于 RAG（检索增强生成）
- 向量数据库存储知识库（pgvector）
- 语义搜索匹配
- 支持多模型切换（GPT-4、Claude、Gemini 等）

## 3. 用户体验需求

### 3.1 视觉设计规范

#### 3.1.1 设计风格
- **整体风格**：现代、简洁、精致、高端
- **设计理念**：精品店（Boutique）美学，强调精选和品质
- **视觉特征**：
  - 大胆的 Klein Blue 主色调
  - 柔和的圆角和阴影
  - 充足的留白和呼吸感
  - 微妙的动画和交互反馈

#### 3.1.2 色彩系统

**主色调**
```css
primary: #002FA7 (Klein Blue - 克莱因蓝)
```

**背景色**
```css
/* 浅色模式 */
background-light: #F0F2F5 (浅灰)
card-light: #FFFFFF (纯白)

/* 深色模式 */
background-dark: #0A0A0A (深黑)
card-dark: #171717 (深灰)
```

**渐变背景**
```css
/* 主页背景 - 径向渐变 */
background: radial-gradient(
  circle at 50% 10%, 
  #4364F7 0%,    /* 浅蓝 */
  #002FA7 100%   /* Klein Blue */
);
background-attachment: fixed; /* 固定背景 */
```

**卡片特殊渐变**
```css
/* 案例模块背景 */
from-[#FFDEE9] to-[#B5FFFC] (粉蓝渐变)

/* 深色模式案例背景 */
from-purple-900 to-blue-900
```

**中性色**
```css
/* 文字 */
text-gray-800 (深色模式下 text-gray-100)
text-gray-500 (二级文字)
text-gray-400 (辅助文字)

/* 边框 */
border-gray-100 (浅色边框)
border-gray-200 (中等边框)
```

**社交媒体品牌色**
```css
Instagram: #E4405F (粉色)
X/Twitter: #60A5FA (蓝色)
```

#### 3.1.3 字体系统

**字体家族**
```css
/* 标题字体 */
font-display: 'Space Grotesk', sans-serif
权重: 400 (Regular), 500 (Medium), 700 (Bold)
用途: Logo、大标题、模块标题

/* 正文字体 */
font-sans: 'Inter', sans-serif  
权重: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
用途: 正文、描述、按钮、表单

/* 等宽字体（装饰用）*/
font-mono: 系统等宽字体
用途: 时间戳、文件名提示、技术信息
```

**字体大小规范**
```css
/* 超大标题 */
text-6xl (60px): Logo 主标题
text-4xl (36px): 页面主标题

/* 标题 */
text-3xl (30px): 区块标题
text-2xl (24px): 卡片大标题
text-xl (20px): 卡片标题
text-lg (18px): 小标题

/* 正文 */
text-base (16px): 标准正文
text-sm (14px): 小号文字
text-xs (12px): 辅助信息
```

**行高规范**
```css
leading-none: 1 (紧凑标题)
leading-tight: 1.25 (标题)
leading-relaxed: 1.625 (舒适正文)
```

#### 3.1.4 圆角系统

```css
/* 全局默认 */
rounded: 0.5rem (8px)

/* 卡片圆角 */
rounded-xl: 1rem (16px) - 小卡片
rounded-2xl: 1.5rem (24px) - 中卡片  
rounded-3xl: 2rem (32px) - 大模块卡片

/* 特殊元素 */
rounded-full: 完全圆形 - 按钮、标签、头像
```

#### 3.1.5 阴影系统

```css
/* 卡片阴影 */
shadow-card: 0 4px 6px -1px rgba(0,0,0,0.1), 
             0 2px 4px -1px rgba(0,0,0,0.06)

/* 柔和阴影 */
shadow-soft: 0 10px 40px -10px rgba(0,0,0,0.08)

/* 悬浮阴影（主色调）*/
shadow-float: 0 20px 60px -15px rgba(0,47,167,0.25)

/* 悬停增强阴影 */
hover: 0 25px 50px -12px rgba(0,0,0,0.25)
```

#### 3.1.6 间距系统

```css
/* Bento Grid 布局 */
grid-gap: 24px (桌面端)
grid-gap: 20px (移动端)
padding: 40px (容器内边距 - 桌面)
padding: 20px (容器内边距 - 移动)

/* 卡片内边距 */
p-4: 16px (小卡片)
p-6: 24px (标准卡片)
p-8: 32px (大卡片)

/* 元素间距 */
space-y-3: 12px (列表项)
gap-2: 8px (小元素)
gap-3: 12px (标准元素)
gap-4: 16px (大元素)
```

#### 3.1.7 图标系统

使用 **Material Symbols Outlined**

**常用图标**
```
arrow_outward: 外部链接
arrow_forward: 前进/查看更多
chevron_right: 列表箭头
smart_toy: AI 机器人
arrow_upward: 发送/上传
add_circle: 添加
filter_list: 筛选
```

**图标尺寸**
```css
text-sm: 14px (小图标)
text-base: 16px (标准)
text-xl: 20px (大图标)
```

### 3.2 交互设计规范

#### 3.2.1 拖拽交互

**实现方式**
- 使用原生 HTML5 Drag & Drop API
- 所有 Bento Grid 模块设置 `draggable="true"`
- 鼠标样式：`cursor-grab` (可抓取), `cursor-grabbing` (抓取中)

**视觉反馈**
```css
/* 拖拽开始 */
.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

/* 拖拽目标 */
.drag-over {
  border: 2px dashed #002FA7;
}
```

**拖拽逻辑**
1. 用户按住鼠标拖动卡片
2. 卡片变为半透明（opacity: 0.5）
3. 计算鼠标位置与其他卡片的距离
4. 找到最近的插入点
5. 实时重排其他卡片
6. 释放鼠标完成拖拽
7. 保存新布局到 localStorage

**移动端适配**
- 触摸设备支持触摸拖拽
- 长按 500ms 触发拖拽模式
- 提供"编辑布局"按钮切换拖拽模式

#### 3.2.2 悬停效果

**卡片悬停动画**
```css
.hover-card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px) scale(1.02); /* 上浮 + 微放大 */
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  z-index: 10; /* 提升层级 */
}
```

**按钮悬停**
```css
/* 圆形按钮 */
hover:scale-110 /* 放大到 110% */

/* 社交媒体按钮 */
hover:scale-105 /* 放大到 105% */

/* 文字按钮 */
hover:bg-blue-700 /* 背景色加深 */
```

**列表项悬停**
```css
/* 工具分类列表 */
hover:border-primary /* 边框变为主色 */
group-hover:text-primary /* 文字变为主色 */
group-hover:translate-x-1 /* 箭头右移 */
```

#### 3.2.3 点击交互

**点击反馈**
- 按钮点击时有轻微的缩放动画（scale: 0.95）
- 涟漪效果（ripple effect）- 可选
- 触觉反馈（移动端）- 可选

**弹窗打开动画**
```css
/* 背景遮罩 */
fade-in: opacity 0 → 1, duration: 200ms

/* 弹窗内容 */
scale-in: scale(0.95) → scale(1), duration: 200ms
fade-in: opacity 0 → 1, duration: 200ms
```

**弹窗关闭动画**
```css
/* 反向播放打开动画 */
fade-out: opacity 1 → 0, duration: 150ms
scale-out: scale(1) → scale(0.95), duration: 150ms
```

#### 3.2.4 滚动交互

**平滑滚动**
```css
scroll-behavior: smooth;
```

**无滚动条显示（保持功能）**
```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

**滚动到顶部按钮**
- 滚动超过 300px 时显示
- 点击平滑滚动到顶部
- 使用 fade-in 动画出现

#### 3.2.5 加载状态

**骨架屏**
- 使用灰色占位块
- 带有闪烁动画（shimmer effect）
- 保持实际内容的布局结构

**加载指示器**
```html
<!-- 旋转圆圈 -->
<div class="animate-spin">...</div>

<!-- 脉冲动画 -->
<div class="animate-pulse">...</div>
```

**图片懒加载**
- 使用 Intersection Observer API
- 占位符使用模糊背景色
- 加载完成后淡入显示

### 3.3 响应式设计

#### 3.3.1 断点系统

```css
/* Tailwind 默认断点 */
sm: 640px   /* 小屏幕（手机横屏）*/
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大桌面 */
2xl: 1536px /* 超大屏 */
```

#### 3.3.2 布局适配

**桌面端（≥ 1024px）**
- Bento Grid 12 列网格布局
- 每个模块占据特定的网格区域
- 最大宽度：1440px，居中显示

**布局定义**
```css
.card-logo { grid-column: 1/4; grid-row: 1/5; }
.card-hero { grid-column: 4/9; grid-row: 1/4; }
.card-list { grid-column: 9/13; grid-row: 1/6; }
.card-latest { grid-column: 2/5; grid-row: 5/8; }
.card-about { grid-column: 5/8; grid-row: 4/7; }
.card-visual { grid-column: 8/9; grid-row: 4/7; }
.card-contact { grid-column: 1/5; grid-row: 8/10; }
.card-pill-1 { grid-column: 5/7; grid-row: 7/8; }
.card-pill-2 { grid-column: 7/9; grid-row: 7/8; }
.card-qa { grid-column: 9/13; grid-row: 6/10; }
```

**平板端（768px - 1023px）**
- 网格缩小为 6-8 列
- 部分模块堆叠显示
- 保持核心交互功能

**移动端（< 768px）**
- 垂直堆叠布局（Flexbox column）
- 单列显示
- 拖拽功能简化或禁用
- 优先显示核心内容

#### 3.3.3 触摸优化

**点击区域**
- 最小点击区域：44x44px（符合 WCAG 标准）
- 按钮增加内边距确保易点击

**手势支持**
- 长按拖拽（移动端）
- 双击放大（图片）
- 滑动返回（页面导航）

### 3.4 性能要求

#### 3.4.1 加载性能
- **首屏加载（LCP）**：< 2.5 秒
- **首次输入延迟（FID）**：< 100ms
- **累积布局偏移（CLS）**：< 0.1
- **Time to Interactive（TTI）**：< 3.5 秒

#### 3.4.2 运行时性能
- **页面滚动**：60fps
- **动画执行**：60fps
- **交互响应**：< 100ms

#### 3.4.3 资源优化
- **图片格式**：WebP（主流）+ AVIF（渐进支持）+ JPEG/PNG（降级）
- **图片压缩**：质量 85%
- **图片尺寸**：响应式多尺寸
- **代码分割**：按路由懒加载，首屏 < 200KB
- **字体优化**：仅加载使用的字重，使用 font-display: swap

#### 3.4.4 缓存策略
- **静态资源**：Cache-Control: max-age=31536000（1年）
- **API 响应**：Cache-Control: max-age=300（5分钟）
- **图片**：Cache-Control: max-age=86400（1天）
- **HTML**：Cache-Control: no-cache（实时验证）

### 3.5 无障碍设计（Accessibility）

#### 3.5.1 ARIA 支持
- 所有交互元素添加适当的 ARIA 标签
- 弹窗使用 `role="dialog"` 和 `aria-modal="true"`
- 导航使用 `role="navigation"`
- 搜索框使用 `role="search"`

#### 3.5.2 键盘导航
- 所有交互元素可通过 Tab 键访问
- Enter/Space 触发点击
- ESC 关闭弹窗
- 拖拽提供键盘替代方案（方向键 + Ctrl）

#### 3.5.3 视觉辅助
- **对比度**：文字与背景对比度 ≥ 4.5:1（正文）、≥ 3:1（大标题）
- **焦点指示**：明显的焦点环（outline）
- **颜色独立**：不仅依赖颜色传达信息

#### 3.5.4 屏幕阅读器
- 图片提供有意义的 alt 文本
- 装饰性图片使用 `alt=""`
- 语义化 HTML 标签
- 可跳过重复内容（Skip Links）

## 4. 数据模型

### 4.1 工具 (Tools)
```
- id: UUID
- name: 工具名称
- description: 简短描述
- detailed_intro: 详细介绍
- official_url: 官方网址
- logo_url: Logo 链接
- category: 分类
- pricing_type: 定价类型 (free/paid)
- tags: 标签数组
- created_at: 创建时间
- updated_at: 更新时间
- is_featured: 是否精选
- is_deleted: 是否删除
```

### 4.2 案例 (Cases)
```
- id: UUID
- title: 案例标题
- description: 简短描述
- detailed_content: 详细内容
- thumbnail_url: 缩略图
- case_type: 案例类型
- tools_used: 使用的工具 ID 数组
- tags: 标签数组
- results_data: 效果数据
- created_at: 创建时间
- updated_at: 更新时间
- is_featured: 是否精选
- is_deleted: 是否删除
```

### 4.3 分类 (Categories)
```
- id: UUID
- name: 分类名称
- description: 分类描述
- icon: 图标
- order: 排序
```

### 4.4 管理员 (Admins)
```
- id: UUID
- email: 邮箱
- password_hash: 密码哈希
- name: 姓名
- created_at: 创建时间
- last_login: 最后登录时间
```

### 4.5 知识库向量 (Knowledge Vectors)
```
- id: UUID
- content: 文本内容
- embedding: 向量
- source_type: 来源类型 (tool/case)
- source_id: 来源 ID
- created_at: 创建时间
```

## 5. 非功能性需求

### 5.1 可用性
- 7x24 小时可访问
- 99.9% 可用性

### 5.2 可维护性
- 代码规范统一
- 组件化开发
- 完整的文档

### 5.3 可扩展性
- 支持新增分类
- 支持多语言（预留）
- 支持主题切换

### 5.4 安全性
- HTTPS 加密传输
- SQL 注入防护
- XSS 攻击防护
- CSRF 保护
- 管理后台权限控制

## 6. 项目里程碑

### Phase 1：基础框架（1-2 周）
- 项目架构搭建
- 数据库设计和初始化
- 基础 UI 组件库
- 首页 Bento Grid 布局

### Phase 2：核心功能（2-3 周）
- 三个弹窗系统
- 工具分类详情页
- 案例详情页
- 拖拽功能实现

### Phase 3：管理后台（1-2 周）
- 登录认证系统
- 工具管理 CRUD
- 案例管理 CRUD
- 图片上传功能

### Phase 4：AI 功能（1-2 周）
- AI 问答接口集成
- 知识库构建
- RAG 实现
- 对话界面优化

### Phase 5：优化上线（1 周）
- 性能优化
- 测试和修复
- 部署上线
- 监控配置

## 7. 成功指标

- **用户指标**：
  - 日活跃用户数
  - 平均访问时长
  - 工具点击率
  - 案例浏览率

- **功能指标**：
  - AI 问答使用率
  - 拖拽功能使用率
  - 弹窗转化率

- **性能指标**：
  - 首屏加载时间
  - 页面响应时间
  - 错误率

## 8. 风险和挑战

### 8.1 技术风险
- AI 问答质量依赖大模型效果
- 拖拽在移动端体验可能不佳
- 向量数据库性能需要优化
- EdgeOne 部署可能需要适配调整

### 8.2 产品风险
- 工具内容需要持续更新
- 案例质量需要人工把控
- 用户需求可能多变
- AI API 费用控制

### 8.3 应对策略
- 使用 OpenRouter 支持多模型切换，确保服务稳定性
- 移动端提供替代交互方案
- 建立内容审核流程
- 收集用户反馈快速迭代
- EdgeOne 国内部署，提升访问速度
- 设置 API 调用限流和预算告警
