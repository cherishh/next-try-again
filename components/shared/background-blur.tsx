'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download, Loader2, User } from 'lucide-react';

interface ProcessedImage {
  original: string;
  processed: string;
  maskUrl?: string;
  width: number;
  height: number;
}

export default function BackgroundBlur() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [scanPosition, setScanPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Demo animation for the preview (only when not processed and not dragging)
  useEffect(() => {
    if (processedImage || isDragging) return;

    const interval = setInterval(() => {
      setScanPosition(prev => (prev >= 100 ? 0 : prev + 0.6));
    }, 25);
    return () => clearInterval(interval);
  }, [processedImage, isDragging]);

  // Handle drag interaction for comparison
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!processedImage) return;
    setIsDragging(true);
    updateScanPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !processedImage) return;
    updateScanPosition(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateScanPosition = (e: React.MouseEvent) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setScanPosition(percentage);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB');
      return;
    }

    setSelectedFile(file);
    processImage(file);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);

    try {
      // Create preview URL for original image
      const originalUrl = URL.createObjectURL(file);

      // Create form data for API call
      const formData = new FormData();
      formData.append('image', file);

      // Call our blur background API
      const response = await fetch('/api/blur-background', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '处理图片失败');
      }

      const data = await response.json();

      // Now we have originalUrl and maskUrl, we need to composite them using Canvas
      const processedImageUrl = await compositeImageWithCanvas(originalUrl, data.maskUrl);

      // Create a temporary image to get dimensions
      const img = new Image();
      img.onload = () => {
        setProcessedImage({
          original: originalUrl,
          processed: processedImageUrl,
          maskUrl: data.maskUrl,
          width: img.width,
          height: img.height,
        });
        setIsProcessing(false);
        toast.success('背景模糊处理成功！');
      };
      img.onerror = () => {
        setIsProcessing(false);
        toast.error('加载处理后的图片失败');
      };
      img.src = processedImageUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(error instanceof Error ? error.message : '处理图片失败，请稍后再试');
      setIsProcessing(false);
    }
  };

  // Canvas合成函数：将原图与蒙版合成为背景模糊图片
  const compositeImageWithCanvas = async (originalUrl: string, maskUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 创建图片元素
      const originalImg = new Image();
      const maskImg = new Image();
      let loadedCount = 0;

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
          // 两张图片都加载完成，开始合成
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // 设置画布尺寸
            canvas.width = originalImg.width;
            canvas.height = originalImg.height;

            // 1. 先绘制模糊的背景
            ctx.filter = 'blur(15px)';
            ctx.drawImage(originalImg, 0, 0);

            // 2. 获取模糊背景的图像数据
            const blurredImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // 3. 清空画布，绘制原图
            ctx.filter = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(originalImg, 0, 0);
            const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // 4. 获取蒙版数据
            const maskCanvas = document.createElement('canvas');
            const maskCtx = maskCanvas.getContext('2d')!;
            maskCanvas.width = canvas.width;
            maskCanvas.height = canvas.height;
            maskCtx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);
            const maskImageData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);

            // 5. 像素级合成：前景用原图，背景用模糊图
            const resultImageData = ctx.createImageData(canvas.width, canvas.height);

            for (let i = 0; i < originalImageData.data.length; i += 4) {
              // 获取蒙版亮度值 (0-255)
              const maskValue = maskImageData.data[i]; // R通道，因为是灰度图

              // 归一化到 0-1
              const alpha = maskValue / 255;

              // 线性插值：alpha=1(白色)用原图，alpha=0(黑色)用模糊图
              resultImageData.data[i] = alpha * originalImageData.data[i] + (1 - alpha) * blurredImageData.data[i]; // R
              resultImageData.data[i + 1] =
                alpha * originalImageData.data[i + 1] + (1 - alpha) * blurredImageData.data[i + 1]; // G
              resultImageData.data[i + 2] =
                alpha * originalImageData.data[i + 2] + (1 - alpha) * blurredImageData.data[i + 2]; // B
              resultImageData.data[i + 3] = 255; // Alpha通道设为不透明
            }

            // 6. 绘制最终结果
            ctx.putImageData(resultImageData, 0, 0);

            // 7. 转换为DataURL
            const resultUrl = canvas.toDataURL('image/png');
            resolve(resultUrl);
          } catch (error) {
            reject(error);
          }
        }
      };

      const onImageError = () => {
        reject(new Error('图片加载失败'));
      };

      // 设置CORS和加载事件
      originalImg.crossOrigin = 'anonymous';
      maskImg.crossOrigin = 'anonymous';
      originalImg.onload = onImageLoad;
      maskImg.onload = onImageLoad;
      originalImg.onerror = onImageError;
      maskImg.onerror = onImageError;

      // 开始加载图片
      originalImg.src = originalUrl;
      maskImg.src = maskUrl;
    });
  };

  const downloadImage = async () => {
    if (!processedImage) return;

    try {
      // Convert DataURL to Blob and download
      const response = await fetch(processedImage.processed);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `blurred-background-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.success('图片下载成功！');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('下载失败，请稍后再试');
    }
  };

  const tryExampleImage = (imageSrc: string) => {
    // Convert image URL to File object for processing
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'example.jpg', { type: 'image/jpeg' });
        handleFile(file);
      })
      .catch(() => {
        toast.error('加载示例图片失败');
      });
  };

  const exampleImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
  ];

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <div className='grid lg:grid-cols-2 gap-16 items-start'>
        {/* Left Side - Upload Area */}
        <div className='space-y-6'>
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors
              ${dragActive ? 'border-orange-400 bg-orange-50/50' : 'border-gray-300'}
              ${isProcessing ? 'opacity-50 pointer-events-none' : 'hover:border-orange-400/50'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileInput} className='hidden' />

            <div className='space-y-6'>
              {/* Avatar Icon */}
              <div className='w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center'>
                <User className='h-8 w-8 text-orange-500' />
              </div>

              <div>
                <p className='text-lg font-medium text-gray-600 mb-2'>拖放图片到此处</p>
                <p className='text-gray-400 mb-6'>或者</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className='bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium'
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      正在处理中...
                    </>
                  ) : (
                    '上传图片'
                  )}
                </Button>
              </div>
            </div>
          </div>

          <p className='text-sm text-gray-500 text-center'>支持格式：JPEG、PNG（最大 5MB）</p>

          {/* Example Images */}
          <div className='space-y-3'>
            <p className='text-sm text-gray-600 text-center'>或者点击以下示例图片来试试</p>
            <div className='flex justify-center gap-3'>
              {exampleImages.map((src, index) => (
                <button
                  key={index}
                  onClick={() => tryExampleImage(src)}
                  className='relative overflow-hidden rounded-lg hover:opacity-80 transition-opacity border border-gray-200'
                  disabled={isProcessing}
                >
                  <img src={src} alt={`示例 ${index + 1}`} className='w-14 h-14 object-cover' />
                </button>
              ))}
            </div>
          </div>

          {/* Download Button for Processed Image */}
          {processedImage && (
            <div className='pt-4'>
              <Button
                onClick={downloadImage}
                className='w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium'
              >
                <Download className='mr-2 h-4 w-4' />
                下载背景模糊图片
              </Button>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
                <div>
                  <p className='text-sm font-medium text-blue-800'>正在处理您的图片</p>
                  <p className='text-xs text-blue-600'>AI 正在分离前景与背景，请稍候...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Demo/Result Display */}
        <div className='space-y-6'>
          <div
            ref={previewRef}
            className={`relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-green-50 aspect-[4/3] ${
              processedImage ? 'cursor-col-resize' : ''
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {processedImage ? (
              <div className='relative w-full h-full'>
                {/* Blurred Background Image */}
                <img
                  src={processedImage.processed}
                  alt='背景模糊效果'
                  className='absolute inset-0 w-full h-full object-cover'
                />

                {/* Original Image with Mask */}
                <div
                  className='absolute inset-0 overflow-hidden'
                  style={{ clipPath: `inset(0 ${100 - scanPosition}% 0 0)` }}
                >
                  <img src={processedImage.original} alt='原图' className='w-full h-full object-cover' />
                </div>

                {/* Scanning Line */}
                <div
                  className='absolute top-0 bottom-0 w-1 bg-green-400 shadow-lg'
                  style={{ left: `${scanPosition}%` }}
                />
              </div>
            ) : (
              <div className='relative w-full h-full'>
                {/* Demo Blurred Background */}
                <img
                  src='https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=400&fit=crop'
                  alt='演示 - 背景模糊'
                  className='absolute inset-0 w-full h-full object-cover blur-md'
                />

                {/* Demo Original with Mask */}
                <div
                  className='absolute inset-0 overflow-hidden'
                  style={{ clipPath: `inset(0 ${100 - scanPosition}% 0 0)` }}
                >
                  <img
                    src='https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=400&fit=crop'
                    alt='演示 - 原图'
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Scanning Line */}
                <div
                  className='absolute top-0 bottom-0 w-1 bg-green-400 shadow-lg'
                  style={{ left: `${scanPosition}%` }}
                />

                {/* Overlay Text */}
                <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                  <div className='text-center text-white'>
                    <p className='text-lg font-semibold mb-2'>体验 AI 背景模糊</p>
                    <p className='text-sm opacity-90'>上传您的照片开始处理</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Result Info */}
          {processedImage && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <h3 className='font-medium text-green-800 mb-2'>处理完成！</h3>
              <p className='text-sm text-green-700'>AI 已成功识别并分离前景主体，背景已应用模糊效果。</p>
              <div className='mt-3 space-y-1'>
                <div className='flex items-center text-xs text-green-600'>
                  <div className='w-3 h-3 bg-green-400 rounded-full mr-2'></div>
                  <span>拖动绿色线条对比效果：左侧原图，右侧背景模糊</span>
                </div>
                <p className='text-xs text-gray-500 ml-5'>💡 在预览区域点击并拖动鼠标来查看不同位置的对比效果</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
