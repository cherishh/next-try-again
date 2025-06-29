import sharp from 'sharp';

/**
 * 使用 Canvas 实现精确的背景模糊合成
 * ModNet蒙版格式：白色=前景，黑色=背景
 */
export async function canvasBlurBackground(originalBuffer: Buffer, maskBuffer: Buffer): Promise<Buffer> {
  try {
    // 创建图片元素
    const originalBlob = new Blob([originalBuffer]);
    const maskBlob = new Blob([maskBuffer]);

    const originalImg = await createImageFromBlob(originalBlob);
    const maskImg = await createImageFromBlob(maskBlob);

    const { width, height } = { width: originalImg.width, height: originalImg.height };

    // 创建Canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d')!;

    // 1. 先绘制模糊的背景
    ctx.filter = 'blur(15px)';
    ctx.drawImage(originalImg, 0, 0, width, height);

    // 2. 获取模糊背景的图像数据
    const blurredImageData = ctx.getImageData(0, 0, width, height);

    // 3. 清空画布，绘制原图
    ctx.filter = 'none';
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(originalImg, 0, 0, width, height);
    const originalImageData = ctx.getImageData(0, 0, width, height);

    // 4. 获取蒙版数据
    const maskCanvas = createCanvas(width, height);
    const maskCtx = maskCanvas.getContext('2d')!;
    maskCtx.drawImage(maskImg, 0, 0, width, height);
    const maskImageData = maskCtx.getImageData(0, 0, width, height);

    // 5. 像素级合成：前景用原图，背景用模糊图
    const resultImageData = ctx.createImageData(width, height);

    for (let i = 0; i < originalImageData.data.length; i += 4) {
      // 获取蒙版亮度值 (0-255)
      const maskValue = maskImageData.data[i]; // R通道，因为是灰度图

      // 归一化到 0-1
      const alpha = maskValue / 255;

      // 线性插值：alpha=1(白色)用原图，alpha=0(黑色)用模糊图
      resultImageData.data[i] = alpha * originalImageData.data[i] + (1 - alpha) * blurredImageData.data[i]; // R
      resultImageData.data[i + 1] = alpha * originalImageData.data[i + 1] + (1 - alpha) * blurredImageData.data[i + 1]; // G
      resultImageData.data[i + 2] = alpha * originalImageData.data[i + 2] + (1 - alpha) * blurredImageData.data[i + 2]; // B
      resultImageData.data[i + 3] = 255; // Alpha通道设为不透明
    }

    // 6. 绘制最终结果
    ctx.putImageData(resultImageData, 0, 0);

    // 7. 转换为Buffer
    return canvasToBuffer(canvas);
  } catch (error) {
    console.error('Canvas背景模糊处理错误:', error);
    throw new Error('Canvas背景模糊处理失败');
  }
}

/**
 * 辅助函数：从Blob创建Image
 */
function createImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

/**
 * 辅助函数：创建Canvas (Node.js环境需要特殊处理)
 */
function createCanvas(width: number, height: number): HTMLCanvasElement {
  if (typeof document !== 'undefined') {
    // 浏览器环境
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  } else {
    // Node.js环境，使用sharp作为fallback
    throw new Error('Canvas在Node.js环境中不可用，请使用Sharp实现');
  }
}

/**
 * 辅助函数：Canvas转Buffer
 */
function canvasToBuffer(canvas: HTMLCanvasElement): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Canvas转换失败'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(Buffer.from(arrayBuffer));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    }, 'image/png');
  });
}

/**
 * 使用 Sharp 对背景进行模糊处理并与前景合成
 */
export async function blurBackground(originalBuffer: Buffer, maskBuffer: Buffer): Promise<Buffer> {
  try {
    // 获取原图信息
    const originalImage = sharp(originalBuffer);
    const { width, height } = await originalImage.metadata();

    if (!width || !height) {
      throw new Error('无法获取图片尺寸信息');
    }

    // 处理蒙版图像
    const processedMask = await sharp(maskBuffer).resize(width, height, { fit: 'fill' }).greyscale().toBuffer();

    // 创建模糊的背景
    const blurredBackground = await sharp(originalBuffer)
      .blur(12) // 调整模糊强度
      .toBuffer();

    // 使用蒙版合成图像
    const result = await originalImage
      .composite([
        {
          input: blurredBackground,
          blend: 'multiply',
          premultiplied: true,
        },
        {
          input: processedMask,
          blend: 'multiply',
          premultiplied: true,
        },
      ])
      .png({ quality: 90 })
      .toBuffer();

    return result;
  } catch (error) {
    console.error('背景模糊处理错误:', error);
    throw new Error('背景模糊处理失败');
  }
}

/**
 * 改进的Sharp背景模糊实现
 */
export async function improvedSharpBlurBackground(originalBuffer: Buffer, maskBuffer: Buffer): Promise<Buffer> {
  try {
    const { width, height } = await sharp(originalBuffer).metadata();

    if (!width || !height) {
      throw new Error('无法获取图片尺寸信息');
    }

    // 1. 处理蒙版：调整大小并确保是灰度图
    const mask = await sharp(maskBuffer).resize(width, height, { fit: 'fill' }).greyscale().toBuffer();

    // 2. 创建模糊背景
    const blurredBg = await sharp(originalBuffer).blur(15).toBuffer();

    // 3. 创建反向蒙版（背景区域为白色）
    const invertedMask = await sharp(mask).negate().toBuffer();

    // 4. 将模糊背景应用到背景区域
    const blurredResult = await sharp(blurredBg)
      .composite([
        {
          input: invertedMask,
          blend: 'dest-in',
        },
      ])
      .toBuffer();

    // 5. 将原图前景应用到前景区域
    const foregroundResult = await sharp(originalBuffer)
      .composite([
        {
          input: mask,
          blend: 'dest-in',
        },
      ])
      .toBuffer();

    // 6. 合成最终结果
    const finalResult = await sharp(blurredResult)
      .composite([
        {
          input: foregroundResult,
          blend: 'over',
        },
      ])
      .png({ quality: 90 })
      .toBuffer();

    return finalResult;
  } catch (error) {
    console.error('改进Sharp背景模糊处理错误:', error);
    throw new Error('背景模糊处理失败');
  }
}

/**
 * 替代方案：简化的背景模糊处理
 */
export async function simpleBlurBackground(originalBuffer: Buffer, maskBuffer: Buffer): Promise<Buffer> {
  try {
    const originalImage = sharp(originalBuffer);
    const { width, height } = await originalImage.metadata();

    if (!width || !height) {
      throw new Error('无法获取图片尺寸信息');
    }

    // 创建强模糊背景
    const heavyBlurred = await sharp(originalBuffer).blur(20).toBuffer();

    // 处理蒙版 - 反转颜色，使前景为白色，背景为黑色
    const invertedMask = await sharp(maskBuffer)
      .resize(width, height, { fit: 'fill' })
      .greyscale()
      .negate() // 反转颜色
      .toBuffer();

    // 合成：使用反转的蒙版将模糊背景合成到原图上
    const result = await originalImage
      .composite([
        {
          input: heavyBlurred,
          blend: 'over',
          premultiplied: false,
        },
        {
          input: invertedMask,
          blend: 'dest-in',
          premultiplied: false,
        },
      ])
      .png({ quality: 90 })
      .toBuffer();

    return result;
  } catch (error) {
    console.error('简化背景模糊处理错误:', error);
    throw new Error('背景模糊处理失败');
  }
}

/**
 * 验证图片格式和大小
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '请上传有效的图片文件' };
  }

  // 检查支持的格式
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: '仅支持 JPEG、PNG 和 WebP 格式' };
  }

  // 检查文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: '图片大小不能超过 5MB' };
  }

  return { valid: true };
}

/**
 * 生成唯一的文件名
 */
export function generateFileName(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'png';

  return `${prefix}${timestamp}-${random}.${extension}`;
}
