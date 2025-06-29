# Next.js SaaS 模板技术文档

## 项目概述

这是一个基于 Next.js 15 的现代化 SaaS 应用模板，集成了身份验证、数据库管理、AI 聊天功能、MDX 内容支持和现代化的 UI 组件系统。

## 技术栈

### 核心框架
- **Next.js 15.4.0-canary.71**: React 全栈框架，支持 App Router
- **React 19.1.0**: 用户界面库
- **TypeScript**: 类型安全的 JavaScript

### 内容管理
- **MDX**: Markdown + JSX，支持在 Markdown 中使用 React 组件
- **@next/mdx**: Next.js MDX 集成
- **@mdx-js/loader**: MDX 文件加载器
- **@mdx-js/react**: MDX React 集成

### 样式和 UI
- **Tailwind CSS 3.4.1**: 实用优先的 CSS 框架
- **Radix UI**: 无障碍的低级 UI 组件
- **Lucide React**: 图标库
- **next-themes**: 主题切换支持
- **tailwindcss-animate**: CSS 动画支持
- **Sonner**: 现代 Toast 通知组件

### 数据库和 ORM
- **Drizzle ORM**: 现代 TypeScript ORM
- **Neon Database**: PostgreSQL 云数据库
- **Drizzle Kit**: 数据库迁移工具

### 身份验证
- **Better Auth**: 现代身份验证库
- **GitHub OAuth**: 社交登录支持
- **邮箱密码登录**: 传统身份验证

### AI 和聊天
- **AI SDK**: Vercel AI SDK
- **OpenAI**: GPT 模型集成
- **@ai-sdk/openai**: OpenAI 适配器

### 开发工具
- **ESLint**: 代码检查
- **PostCSS**: CSS 处理
- **PNPM**: 包管理器
- **TSX**: TypeScript 执行器

## 项目结构

```
next-try-again/
├── app/                    # Next.js App Router 应用目录
│   ├── (analytics)/        # 路由组 - 分析相关页面
│   ├── (legal)/           # 路由组 - 法律相关页面
│   ├── actions/           # Server Actions
│   ├── api/               # API 路由
│   │   ├── auth/          # 身份验证 API
│   │   ├── chat/          # 聊天 API
│   │   ├── checkout/      # 支付 API
│   │   ├── invite/        # 邀请 API
│   │   └── user/          # 用户 API
│   ├── dashboard/         # 仪表板页面
│   │   └── user/          # 用户管理子页面
│   │       └── [id]/      # 动态用户详情页面
│   ├── deferred/          # 延迟渲染示例
│   ├── posts/            # 博客/文章页面
│   │   └── [id]/         # 动态文章详情页面
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局 (集成 Toaster)
│   ├── not-found.tsx     # 404 页面
│   └── page.tsx          # 首页
├── components/            # React 组件
│   ├── shared/           # 共享组件
│   │   ├── login-btn.tsx # 登录按钮
│   │   ├── mode-toggle.tsx # 主题切换
│   │   └── nav-link.tsx  # 导航链接 (简化版)
│   ├── ui/               # UI 组件库
│   │   ├── sonner.tsx    # Toast 通知组件
│   │   └── ...           # 其他 Radix UI 组件
│   └── styles/           # 样式组件
├── db/                   # 数据库相关
│   ├── migrations/       # 数据库迁移文件
│   ├── queries/          # 数据库查询
│   ├── schema/           # 数据库模式
│   ├── index.ts          # 数据库连接
│   └── seed.ts           # 数据种子
├── hooks/                # React Hooks
├── lib/                  # 工具库
│   ├── auth.ts           # 身份验证配置
│   ├── auth-client.ts    # 身份验证客户端
│   ├── posts-api.ts      # 文章 API
│   └── utils.ts          # 工具函数
└── public/               # 静态资源
```

## 核心功能模块

### 1. 身份验证系统

#### 配置文件: `lib/auth.ts`
- 使用 Better Auth 提供全面的身份验证解决方案
- 支持邮箱密码登录和 GitHub OAuth
- 集成管理员权限系统
- 使用 Drizzle 适配器连接 PostgreSQL 数据库

#### 数据库模式: `db/schema/auth-schema.ts`
- **users 表**: 存储用户基本信息、角色、封禁状态
- **sessions 表**: 管理用户会话，支持会话冒充
- **accounts 表**: 存储第三方账户关联信息
- **verifications 表**: 处理邮箱验证等验证流程

### 2. 数据库架构

#### 配置: `drizzle.config.ts`
- PostgreSQL 数据库
- 自动生成迁移文件
- 环境变量配置数据库连接

#### 连接: `db/index.ts`
- 使用 Neon serverless PostgreSQL
- Drizzle ORM 集成
- 环境变量管理数据库 URL

### 3. UI 组件系统和通知

#### 设计系统
- 基于 Radix UI 的无障碍组件
- Tailwind CSS 实用优先样式
- 支持暗色/明色主题切换
- CSS 变量驱动的颜色系统

#### 核心组件
- **Button**: 按钮组件，支持多种变体
- **Dialog**: 模态对话框
- **Form**: 表单组件，集成验证
- **Input**: 输入框组件
- **Alert**: 警告提示组件
- **Sonner**: 现代 Toast 通知系统

### 4. 内容管理 (MDX 支持)

#### MDX 集成
- **@next/mdx**: Next.js 原生 MDX 支持
- **@mdx-js/loader**: 构建时 MDX 文件处理
- **@mdx-js/react**: React 组件在 MDX 中的使用
- **@types/mdx**: TypeScript 类型支持

#### 使用场景
- 博客文章内容管理
- 文档页面编写
- 动态内容与 React 组件结合
- 富文本内容展示

### 5. 路由和导航

#### App Router 结构
- 使用 Next.js 15 App Router
- 支持路由组 (Route Groups)
- 嵌套布局系统
- 动态路由和参数传递

#### 导航优化: `components/shared/nav-link.tsx`
- **核心页面导航**: Home、Posts、Dashboard
- **路径高亮显示**: 当前页面路径加粗显示
- **集成主题和身份验证**: 主题切换和登录按钮

## 开发脚本

### 核心脚本
```bash
# 开发服务器
pnpm dev          # 标准开发模式 (端口 3000)
pnpm dev2         # 代理模式开发 (端口 3002，支持 SOCKS 代理)

# 构建和部署
pnpm build        # 生产构建
pnpm start        # 启动生产服务器

# 数据库管理
pnpm db:generate  # 生成迁移文件
pnpm db:migrate   # 执行数据库迁移
pnpm db:studio    # 启动 Drizzle Studio
pnpm db:seed      # 执行数据种子

# 依赖管理
pnpm deps         # 交互式依赖更新
```

## 配置文件详解

### Next.js 配置: `next.config.ts`
- 启用实验性功能（useCache）
- 图片优化配置
- ESLint 构建时忽略
- 禁用 instrumentation hook

### TypeScript 配置: `tsconfig.json`
- 严格模式启用
- 路径别名 `@/*` 映射到根目录
- Next.js 插件集成
- ES2017 目标编译

### Tailwind 配置: `tailwind.config.ts`
- 暗色模式支持
- 扩展颜色系统
- 动画插件集成
- 响应式断点

### ESLint 配置: `eslint.config.mjs`
- Next.js 和 TypeScript 规则集成
- 自定义规则配置
- 未使用变量警告禁用

## 环境变量

### 必需的环境变量
```env
# 数据库
DATABASE_URL=postgresql://...

# 身份验证
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OpenAI (可选)
OPENAI_API_KEY=your_openai_api_key
```

## 数据库架构更新
1. 修改 `db/schema/` 中的模式文件
2. 运行 `pnpm db:generate` 生成迁移
3. 执行 `pnpm db:migrate` 应用迁移
4. 更新相关查询和操作

