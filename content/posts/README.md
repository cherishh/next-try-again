# MDX 博客功能使用指南

## 概述

本项目已集成 MDX 支持，可以创建和发布技术博客文章。博客文件支持 Markdown 语法和丰富的元数据。

## 功能特性

- ✅ MDX 文件解析和渲染
- ✅ 博客元数据支持
- ✅ 响应式设计
- ✅ 暗黑模式支持
- ✅ 标签和分类系统
- ✅ 列表页面展示
- ✅ 代码高亮显示

## 文件结构

```
content/posts/
├── README.md                        # 使用说明
├── ai-future-work.mdx              # AI与未来工作文章
└── web-development-trends-2024.mdx  # Web开发趋势文章
```

## MDX 文件格式

每个博客 MDX 文件包含两部分：

### 1. Frontmatter（元数据）

```yaml
---
title: "文章标题"
description: "文章描述"
type: "article"
category: "分类"
publishDate: "2024-12-27"
author: "作者姓名"
readTime: "8分钟"
coverImage: "/images/cover.jpg"
tags: ["标签1", "标签2"]
---
```

### 2. Markdown 内容

支持所有标准 Markdown 语法：

```markdown
# 标题
## 子标题
### 小标题

**粗体文本**
*斜体文本*

> 引用块

- 列表项
- 列表项

1. 有序列表
2. 有序列表

[链接文本](https://example.com)

\`\`\`typescript
// 代码块
const example = "Hello World";
\`\`\`
```

## 如何添加新文章

1. 在 `content/posts/` 目录下创建新的 `.mdx` 文件
2. 文件名将作为 URL 路径（如：`my-article.mdx` → `/posts/my-article`）
3. 添加必要的 frontmatter 元数据
4. 编写 Markdown 内容

## 访问路径

- 博客列表：`/posts`
- 单篇文章：`/posts/[slug]`

## 示例文章

本项目包含两篇示例技术文章：

1. **AI革命：重塑未来工作的五大趋势** (`/posts/ai-future-work`)
   - 探讨 AI 技术对职场的深远影响
   - 包含实用的个人发展建议

2. **2024年Web开发趋势：构建下一代用户体验** (`/posts/web-development-trends-2024`)
   - 全面分析当前Web开发技术栈
   - 涵盖前端框架、工具和最佳实践

## 开发说明

### 相关依赖

- `@next/mdx` - Next.js MDX 支持
- `@mdx-js/loader` - MDX 加载器
- `@mdx-js/react` - React MDX 组件
- `gray-matter` - Frontmatter 解析
- `next-mdx-remote` - 远程 MDX 渲染

### 文件结构

```
lib/
└── posts-api.ts           # 博客数据API

components/
└── shared/
    └── mdx-content.tsx    # MDX内容渲染组件

app/
└── posts/
    ├── page.tsx           # 博客列表页
    ├── layout.tsx         # 博客布局
    └── [slug]/
        └── page.tsx       # 单篇文章页面
```

## 自定义样式

MDX 组件使用 Tailwind CSS 进行样式设计，支持：

- 响应式布局
- 暗黑模式
- 优雅的排版
- 代码语法高亮
- 交互式元素

如需自定义样式，可以修改 `components/shared/mdx-content.tsx` 中的样式类。

## 元数据字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `description` | string | ✅ | 文章简介 |
| `type` | string | ✅ | 内容类型（通常为 "article"） |
| `category` | string | ❌ | 文章分类 |
| `publishDate` | string | ✅ | 发布日期（YYYY-MM-DD） |
| `author` | string | ❌ | 作者姓名 |
| `readTime` | string | ❌ | 预估阅读时间 |
| `coverImage` | string | ❌ | 封面图片路径 |
| `tags` | string[] | ❌ | 标签数组 |

## 最佳实践

### 文章结构建议

1. **引人入胜的开头**：简明扼要地介绍文章主题
2. **清晰的章节划分**：使用标题层级组织内容
3. **实用的代码示例**：提供可运行的代码片段
4. **总结和资源**：在文章末尾提供要点总结和延伸阅读

### SEO优化

- 使用描述性的文件名
- 编写吸引人的 title 和 description
- 合理使用标签和分类
- 包含相关的内部和外部链接

### 图片和媒体

- 将图片放置在 `public/images/` 目录
- 使用 Next.js Image 组件优化加载
- 添加适当的 alt 文本

## 注意事项

- 确保 MDX 文件的 frontmatter 格式正确
- 文件名使用小写字母和连字符
- 避免在文件名中使用特殊字符
- 图片资源放置在 `public/images/` 目录
- 代码块指定正确的语言以启用语法高亮

## 扩展功能

### 即将支持的功能

- [ ] 文章搜索功能
- [ ] 评论系统集成
- [ ] 社交分享按钮
- [ ] 阅读进度指示器
- [ ] 相关文章推荐
- [ ] RSS订阅支持

---

开始创作你的技术博客内容吧！📝 