# 背景模糊功能使用说明

## 功能概述

背景模糊功能使用 AI 技术自动识别图片中的前景主体，并对背景区域进行模糊处理，创造出专业的景深效果。

## 技术架构

### 核心技术
- **AI 模型**: 使用 Replicate 的 ModNet 模型进行前景-背景分离
- **图片处理**: 使用 Sharp 库进行高质量图片合成和模糊处理
- **存储**: 使用 Cloudflare R2 存储原图和处理结果

### 处理流程
1. 用户上传图片 → 验证格式和大小
2. 上传原图到 Cloudflare R2
3. 调用 Replicate ModNet API 生成前景蒙版
4. 使用 Sharp 合成背景模糊图片
5. 上传最终结果到 R2
6. 返回处理结果供用户下载

## 环境配置

### 必需的环境变量

在 `.env` 文件中需要包含以下配置：

```bash
# Replicate API Configuration
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Cloudflare R2 Configuration  
R2_ENDPOINT=https://c5644b395a7110c8c52917968c1d0e2a.r2.cloudflarestorage.com
R2_BUCKET=blur-bg
R2_ACCESS_KEY_ID=your_r2_access_key_here
R2_SECRET_ACCESS_KEY=your_r2_secret_key_here
R2_REGION=auto
```

### 获取 API 密钥

1. **Replicate API Token**: 
   - 访问 [Replicate.com](https://replicate.com)
   - 注册并获取 API Token
   - 将 Token 添加到 `.env` 文件中

2. **Cloudflare R2 配置**:
   - 访问 Cloudflare Dashboard
   - 创建 R2 存储桶
   - 生成 API 密钥
   - 配置相应的环境变量到 `.env` 文件

## 使用限制

- **支持格式**: JPEG、PNG、WebP
- **文件大小**: 最大 5MB
- **处理时间**: 通常 10-30 秒，取决于图片大小和复杂度

## API 接口

### POST /api/blur-background

上传图片并进行背景模糊处理。

**请求格式**: multipart/form-data
**参数**: 
- `image`: 图片文件

**响应格式**: JSON
```json
{
  "success": true,
  "originalUrl": "https://...",
  "maskUrl": "https://...",
  "resultUrl": "https://..."
}
```

**错误响应**:
```json
{
  "error": "错误描述"
}
```

## 前端组件

主要组件位于 `components/shared/background-blur.tsx`，包含：

- 拖放上传界面
- 处理进度显示
- 结果预览和下载
- 示例图片快速测试

## 故障排除

### 常见问题

1. **AI 处理失败**
   - 检查 Replicate API Token 是否正确
   - 确认图片格式符合要求
   - 检查网络连接

2. **上传失败**
   - 检查 Cloudflare R2 配置
   - 确认存储桶权限设置
   - 验证 API 密钥有效性

3. **处理结果不理想**
   - 尝试使用主体更明显的图片
   - 确保图片清晰度足够
   - 避免过于复杂的背景

### 调试模式

开发环境下，API 会在控制台输出详细的处理日志，包括：
- 图片上传状态
- AI 处理进度
- 图片合成结果
- 错误详情

## 测试功能

现在您可以立即测试功能，因为所有 API 密钥都已正确配置：

1. **启动开发服务器**:
   ```bash
   pnpm dev
   ```

2. **访问页面**: 导航到包含背景模糊组件的页面

3. **上传测试图片**: 
   - 可以拖放图片到上传区域
   - 或点击示例图片快速测试
   - 或点击"上传图片"按钮选择文件

4. **查看处理结果**: 
   - AI 会自动识别前景主体
   - 背景会被智能模糊
   - 可以下载最终结果

## 扩展功能

### 未来计划
- [ ] 支持批量处理
- [ ] 自定义模糊强度
- [ ] 更多背景效果选项
- [ ] 处理历史记录
- [ ] 分享功能

### 自定义开发

如需修改模糊效果或添加新功能，主要文件：
- `lib/image-processing.ts`: 图片处理逻辑
- `app/api/blur-background/route.ts`: API 路由
- `components/shared/background-blur.tsx`: 前端组件

## 成本说明

- **Replicate API**: 按使用量计费
- **Cloudflare R2**: 存储和流量费用
- **计算资源**: 服务器处理成本

建议在生产环境中添加使用限制和缓存机制以控制成本。 