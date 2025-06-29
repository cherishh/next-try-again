import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { validateImage, generateFileName } from '@/lib/image-processing';

// 初始化 Replicate 客户端
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 初始化 S3 客户端（用于 Cloudflare R2）
const s3Client = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.R2_BUCKET || 'blur-bg';

// 工具函数：将文件上传到 R2
async function uploadToR2(buffer: Buffer, fileName: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  // 使用公开访问URL而不是内部端点
  return `https://pub-e1371aeef5e949c9a5df46cc9d875345.r2.dev/${fileName}`;
}

// 工具函数：从 URL 下载图片
async function downloadImageFromUrl(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: '请上传图片文件' }, { status: 400 });
    }

    // 验证图片
    const validation = validateImage(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = generateFileName(file.name, 'original-');

    console.log('开始处理图片:', file.name, '大小:', file.size);

    // 1. 上传原图到 R2
    const originalImageUrl = await uploadToR2(buffer, fileName, file.type);
    console.log('原图上传成功:', originalImageUrl);

    // 2. 调用 Replicate modnet API 进行前景-背景分离（使用直接 fetch 调用）
    console.log('正在调用 Replicate API 进行前景分离...');

    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Prefer: 'wait',
      },
      body: JSON.stringify({
        version: 'da7d45f3b836795f945f221fc0b01a6d3ab7f5e163f13208948ad436001e2255',
        input: {
          image: originalImageUrl,
        },
      }),
    });

    if (!replicateResponse.ok) {
      const errorText = await replicateResponse.text();
      console.error('Replicate API 错误:', replicateResponse.status, errorText);
      throw new Error(`Replicate API 调用失败: ${replicateResponse.status}`);
    }

    const predictionData = await replicateResponse.json();
    console.log('Replicate API 响应:', predictionData);

    let maskImageUrl: string;

    if (predictionData.output && typeof predictionData.output === 'string') {
      maskImageUrl = predictionData.output;
    } else if (predictionData.status === 'processing' || predictionData.status === 'starting') {
      // 如果还在处理中，需要轮询等待结果
      throw new Error('模型处理时间过长，请稍后再试');
    } else if (predictionData.error) {
      console.error('Replicate API 返回错误:', predictionData.error);
      throw new Error(`AI 处理失败: ${predictionData.error}`);
    } else {
      console.error('无法从响应中提取输出URL:', predictionData);
      throw new Error('AI 处理失败，无法获取蒙版图像');
    }

    console.log('AI处理完成，返回原图和蒙版URL供前端合成');

    return NextResponse.json({
      success: true,
      originalUrl: originalImageUrl,
      maskUrl: maskImageUrl,
    });
  } catch (error) {
    console.error('处理图片时出错:', error);

    // 提供更详细的错误信息
    let errorMessage = '处理图片时出错，请稍后再试';
    if (error instanceof Error) {
      if (error.message.includes('Failed to download image')) {
        errorMessage = '下载图片失败，请检查网络连接';
      } else if (error.message.includes('背景模糊处理失败')) {
        errorMessage = '图片处理失败，请尝试其他图片';
      } else if (error.message.includes('REPLICATE_API_TOKEN')) {
        errorMessage = 'AI 服务配置错误，请联系管理员';
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
