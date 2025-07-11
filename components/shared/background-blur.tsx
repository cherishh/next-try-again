'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download, Loader2, User } from 'lucide-react';

// 防抖函数
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// 高斯模糊算法 - 用于蒙版羽化
function gaussianBlur(imageData: ImageData, radius: number): ImageData {
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);

  // 创建高斯核
  const kernel = createGaussianKernel(radius);
  const kernelSize = kernel.length;
  const halfKernel = Math.floor(kernelSize / 2);

  // 水平方向模糊
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let weightSum = 0;

      for (let i = 0; i < kernelSize; i++) {
        const px = x + i - halfKernel;
        if (px >= 0 && px < width) {
          const idx = (y * width + px) * 4;
          sum += data[idx] * kernel[i]; // 只处理R通道（灰度蒙版）
          weightSum += kernel[i];
        }
      }

      const outputIdx = (y * width + x) * 4;
      const blurredValue = Math.round(sum / weightSum);
      output.data[outputIdx] = blurredValue; // R
      output.data[outputIdx + 1] = blurredValue; // G
      output.data[outputIdx + 2] = blurredValue; // B
      output.data[outputIdx + 3] = 255; // A
    }
  }

  // 垂直方向模糊
  const temp = new ImageData(width, height);
  temp.data.set(output.data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let weightSum = 0;

      for (let i = 0; i < kernelSize; i++) {
        const py = y + i - halfKernel;
        if (py >= 0 && py < height) {
          const idx = (py * width + x) * 4;
          sum += temp.data[idx] * kernel[i];
          weightSum += kernel[i];
        }
      }

      const outputIdx = (y * width + x) * 4;
      const blurredValue = Math.round(sum / weightSum);
      output.data[outputIdx] = blurredValue;
      output.data[outputIdx + 1] = blurredValue;
      output.data[outputIdx + 2] = blurredValue;
      output.data[outputIdx + 3] = 255;
    }
  }

  return output;
}

// 创建高斯核
function createGaussianKernel(radius: number): number[] {
  const size = Math.ceil(radius * 2) * 2 + 1;
  const kernel = new Array(size);
  const sigma = radius / 3;
  const sigmaSq = sigma * sigma;
  const center = Math.floor(size / 2);
  let sum = 0;

  for (let i = 0; i < size; i++) {
    const x = i - center;
    kernel[i] = Math.exp(-(x * x) / (2 * sigmaSq));
    sum += kernel[i];
  }

  // 归一化
  for (let i = 0; i < size; i++) {
    kernel[i] /= sum;
  }

  return kernel;
}

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

  // 模糊强度控制
  const [blurIntensity, setBlurIntensity] = useState(15);
  const [isAdjustingBlur, setIsAdjustingBlur] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [maskImageUrl, setMaskImageUrl] = useState<string>('');
  const [hasError, setHasError] = useState(false); // 追踪错误状态
  const [lastFailedFile, setLastFailedFile] = useState<File | null>(null); // 保存失败的文件用于重试

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // API请求中止控制
  const abortControllerRef = useRef<AbortController | null>(null);

  // Demo animation for the preview (only when not processed and not dragging)
  useEffect(() => {
    if (processedImage || isDragging) return;

    const interval = setInterval(() => {
      setScanPosition(prev => (prev >= 100 ? 0 : prev + 0.6));
    }, 25);
    return () => clearInterval(interval);
  }, [processedImage, isDragging]);

  // 处理页面关闭时中止API请求
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    // 监听页面卸载事件
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 组件卸载时清理
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

  // Touch events for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!processedImage) return;

    setIsDragging(true);
    updateScanPositionTouch(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !processedImage) return;
    e.preventDefault(); // Prevent scrolling
    updateScanPositionTouch(e);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateScanPosition = (e: React.MouseEvent) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setScanPosition(percentage);
  };

  const updateScanPositionTouch = (e: React.TouchEvent) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
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
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size cannot exceed 5MB');
      return;
    }

    // 清除之前的错误状态（用户上传新文件）
    setHasError(false);
    setLastFailedFile(null);

    setSelectedFile(file);
    processImage(file);
  };

  // 重试处理失败的文件
  const retryLastFile = () => {
    if (lastFailedFile) {
      setHasError(false);
      processImage(lastFailedFile);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setHasError(false); // 清除之前的错误状态

    // 创建新的AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Create preview URL for original image
      const originalUrl = URL.createObjectURL(file);

      // Create form data for API call
      const formData = new FormData();
      formData.append('image', file);

      // Call our blur background API with abort signal
      const response = await fetch('/api/blur-background', {
        method: 'POST',
        body: formData,
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Image processing failed');
      }

      const data = await response.json();

      // 保存原图和蒙版URL以供后续调整模糊强度使用
      setOriginalImageUrl(originalUrl);
      setMaskImageUrl(data.maskUrl);

      // Now we have originalUrl and maskUrl, we need to composite them using Canvas
      const processedImageUrl = await compositeImageWithCanvas(
        originalUrl,
        data.maskUrl,
        blurIntensity,
        true // 默认启用边缘羽化
      );

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
        setHasError(false); // 成功时清除错误状态
        setLastFailedFile(null);
        toast.success('Background blur processing completed!');
      };
      img.onerror = () => {
        // 设置错误状态
        setHasError(true);
        setLastFailedFile(file);

        setIsProcessing(false);
        setSelectedFile(null);
        setProcessedImage(null);
        setOriginalImageUrl('');
        setMaskImageUrl('');
        setIsAdjustingBlur(false);

        // 清理文件输入
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        toast.error('Failed to load processed image, please try again');
      };
      img.src = processedImageUrl;
    } catch (error) {
      // 如果是请求被中止，不显示错误信息
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Image processing request aborted');
        return;
      }

      console.error('Error processing image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image, please try again');

      // 设置错误状态并保存失败的文件
      setHasError(true);
      setLastFailedFile(file);

      // 重置处理状态，但保留错误信息
      setIsProcessing(false);
      setSelectedFile(null);
      setProcessedImage(null);
      setOriginalImageUrl('');
      setMaskImageUrl('');
      setIsAdjustingBlur(false);

      // 清理文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      // 清理AbortController引用
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  };

  // Canvas合成函数：将原图与蒙版合成为背景模糊图片
  const compositeImageWithCanvas = async (
    originalUrl: string,
    maskUrl: string,
    intensity: number = 15,
    useFeathering: boolean = true
  ): Promise<string> => {
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
            ctx.filter = `blur(${intensity}px)`;
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
            let maskImageData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);

            // 5. 蒙版边缘羽化处理（自适应强度）
            if (useFeathering) {
              const featherRadius = Math.max(1, Math.min(intensity * 0.25, 8)); // 自适应羽化半径
              if (featherRadius > 1) {
                console.log(`Applying mask feathering, radius: ${featherRadius.toFixed(1)}px`);
                maskImageData = gaussianBlur(maskImageData, featherRadius);
              }
            }

            // 6. 像素级合成：前景用原图，背景用模糊图（使用羽化蒙版）
            const resultImageData = ctx.createImageData(canvas.width, canvas.height);

            for (let i = 0; i < originalImageData.data.length; i += 4) {
              // 获取羽化后的蒙版亮度值 (0-255)
              const maskValue = maskImageData.data[i]; // R通道，因为是灰度图

              // 归一化到 0-1（羽化后的值可能不是纯0或255）
              const alpha = maskValue / 255;

              // 线性插值：alpha=1(白色)用原图，alpha=0(黑色)用模糊图
              // 羽化边缘会有0-1之间的渐变值，创造柔和过渡
              resultImageData.data[i] = alpha * originalImageData.data[i] + (1 - alpha) * blurredImageData.data[i]; // R
              resultImageData.data[i + 1] =
                alpha * originalImageData.data[i + 1] + (1 - alpha) * blurredImageData.data[i + 1]; // G
              resultImageData.data[i + 2] =
                alpha * originalImageData.data[i + 2] + (1 - alpha) * blurredImageData.data[i + 2]; // B
              resultImageData.data[i + 3] = 255; // Alpha通道设为不透明
            }

            // 7. 绘制最终结果
            ctx.putImageData(resultImageData, 0, 0);

            // 8. 转换为DataURL
            const resultUrl = canvas.toDataURL('image/png');
            resolve(resultUrl);
          } catch (error) {
            reject(error);
          }
        }
      };

      const onImageError = () => {
        reject(new Error('Image loading failed'));
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

  // 重新合成图片（用于调整模糊强度）
  const recompositeImage = useCallback(
    async (intensity: number) => {
      if (!originalImageUrl || !maskImageUrl) return;

      try {
        const newProcessedUrl = await compositeImageWithCanvas(
          originalImageUrl,
          maskImageUrl,
          intensity,
          true // 始终启用边缘羽化
        );

        setProcessedImage(prev =>
          prev
            ? {
                ...prev,
                processed: newProcessedUrl,
              }
            : null
        );

        setIsAdjustingBlur(false);
      } catch (error) {
        console.error('Recomposite failed:', error);
        toast.error('Failed to adjust blur intensity');
        setIsAdjustingBlur(false);
      }
    },
    [originalImageUrl, maskImageUrl]
  );

  // 防抖的重新合成
  const debouncedRecomposite = useMemo(
    () =>
      debounce((intensity: number) => {
        recompositeImage(intensity);
      }, 300),
    [recompositeImage]
  );

  // 处理模糊强度变化
  const handleBlurIntensityChange = (intensity: number) => {
    setBlurIntensity(intensity);
    if (processedImage) {
      setIsAdjustingBlur(true);
      debouncedRecomposite(intensity);
    }
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

      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed, please try again');
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
        toast.error('Failed to load example image');
      });
  };

  const exampleImages = [
    // 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=1000&fit=crop&crop=face',
    // 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&h=1000&fit=crop',
    // 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&h=1000&fit=crop',
    'https://pub-e1371aeef5e949c9a5df46cc9d875345.r2.dev/kids1%202.jpg',
    'https://pub-e1371aeef5e949c9a5df46cc9d875345.r2.dev/kids2_%E5%89%AF%E6%9C%AC.jpg',
  ];

  return (
    <>
      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          background: #e5e7eb;
          outline: none;
          border-radius: 8px;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .slider:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
        }

        .slider:disabled::-moz-range-thumb {
          cursor: not-allowed;
        }
      `}</style>
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
                  <p className='text-lg font-medium text-gray-600 mb-2'>Drag and drop image here</p>
                  <p className='text-gray-400 mb-6'>or</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className='bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium'
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Processing...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <p className='text-sm text-gray-500 text-center'>Supported format: JPEG, PNG (Size limit 5MB)</p>

            {/* Example Images */}
            <div className='space-y-3'>
              <p className='text-sm text-gray-600 text-center'>Or click 👇 to try</p>
              <div className='flex justify-center gap-3'>
                {exampleImages.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => tryExampleImage(src)}
                    className='relative overflow-hidden rounded-lg hover:opacity-80 transition-opacity border border-gray-200'
                    disabled={isProcessing}
                  >
                    <img src={src} alt={`Example ${index + 1}`} className='w-14 h-14 object-cover' />
                  </button>
                ))}
              </div>
            </div>

            {/* Blur Intensity Control */}
            {processedImage && (
              <div className='space-y-4 pt-4'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='text-sm font-medium text-gray-700 mb-3'>Blur Intensity</h3>

                  {/* Preset Buttons */}
                  <div className='flex gap-2 mb-4'>
                    <button
                      onClick={() => handleBlurIntensityChange(5)}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                        blurIntensity <= 8 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      Mild
                    </button>
                    <button
                      onClick={() => handleBlurIntensityChange(15)}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                        blurIntensity > 8 && blurIntensity <= 20
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      Moderate
                    </button>
                    <button
                      onClick={() => handleBlurIntensityChange(25)}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                        blurIntensity > 20 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      Strong
                    </button>
                  </div>

                  {/* Slider */}
                  <div className='space-y-2'>
                    <input
                      type='range'
                      min='0'
                      max='25'
                      value={blurIntensity}
                      onChange={e => handleBlurIntensityChange(Number(e.target.value))}
                      className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
                      disabled={isAdjustingBlur}
                    />
                    <div className='flex justify-between text-xs text-gray-500'>
                      <span>No blur</span>
                      <span>Strong blur</span>
                    </div>
                  </div>

                  {/* Status */}
                  {isAdjustingBlur && (
                    <div className='flex items-center gap-2 mt-2 text-xs text-orange-600'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      <span>Adjusting...</span>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <Button
                  onClick={downloadImage}
                  className='w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium'
                  disabled={isAdjustingBlur}
                >
                  <Download className='mr-2 h-4 w-4' />
                  Download
                </Button>
              </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <div className='flex items-center space-x-3'>
                  <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
                  <div>
                    <p className='text-sm font-medium text-blue-800'>Processing...</p>
                    <p className='text-xs text-blue-600'>
                      Your image is being processed, please wait...(Due to the high demand, it may take up to a few
                      minutes)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Status with Retry */}
            {hasError && lastFailedFile && !isProcessing && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='flex items-start space-x-3'>
                  <div className='flex-shrink-0'>
                    <div className='w-5 h-5 rounded-full bg-red-100 flex items-center justify-center'>
                      <span className='text-red-600 text-xs'>✕</span>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-red-800'>Failed</p>
                    <p className='text-xs text-red-600 mb-3'>
                      File: {lastFailedFile.name} - This could be due to a network timeout or a busy AI service.
                    </p>
                    <Button
                      onClick={retryLastFile}
                      className='bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 h-auto'
                      disabled={isProcessing}
                    >
                      Retry
                    </Button>
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
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: 'none' }}
            >
              {processedImage ? (
                <div className='relative w-full h-full'>
                  {/* Blurred Background Image */}
                  <img
                    src={processedImage.processed}
                    alt='Background blur effect'
                    className='absolute inset-0 w-full h-full object-cover'
                  />

                  {/* Original Image with Mask */}
                  <div
                    className='absolute inset-0 overflow-hidden'
                    style={{ clipPath: `inset(0 ${100 - scanPosition}% 0 0)` }}
                  >
                    <img src={processedImage.original} alt='Original' className='w-full h-full object-cover' />
                  </div>

                  {/* Scanning Line with Handle */}
                  <div
                    className='absolute top-0 bottom-0 w-1 bg-green-400 shadow-lg'
                    style={{ left: `${scanPosition}%` }}
                  >
                    {/* Drag Handle - Centered */}
                    <div className='absolute top-1/2 -translate-y-1/2 -left-2 w-5 h-5 bg-green-500 rounded-full shadow-md border-2 border-white cursor-col-resize flex items-center justify-center'>
                      <div className='w-1 h-3 bg-white rounded-full opacity-70'></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='relative w-full h-full'>
                  {/* Demo Blurred Background */}
                  <img
                    src='https://pub-e1371aeef5e949c9a5df46cc9d875345.r2.dev/1.webp'
                    alt='Demo - Blurred'
                    className='w-full h-full object-cover'
                  />

                  {/* Demo Original with Mask */}
                  <div
                    className='absolute inset-0 overflow-hidden'
                    style={{ clipPath: `inset(0 ${100 - scanPosition}% 0 0)` }}
                  >
                    <img
                      src='https://pub-e1371aeef5e949c9a5df46cc9d875345.r2.dev/2.webp'
                      alt='Demo - Original'
                      className='w-full h-full object-cover'
                    />
                  </div>

                  {/* Scanning Line (Demo - No Handle) */}
                  <div
                    className='absolute top-0 bottom-0 w-1 bg-green-400 shadow-lg'
                    style={{ left: `${scanPosition}%` }}
                  />

                  {/* Overlay Text */}
                  <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                    <div className='text-center text-white'>
                      <p className='text-lg font-semibold mb-2'>Try AI Background Blur</p>
                      <p className='text-sm opacity-90'>Upload your image to start</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Result Info */}
            {processedImage && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <h3 className='font-medium text-green-800 mb-2'>Complete!</h3>
                <p className='text-sm text-green-700'>
                  AI has successfully identified and separated the foreground, with blur effect applied to the
                  background.
                </p>
                <div className='mt-3 space-y-1'>
                  <div className='flex items-center text-xs text-green-600'>
                    <div className='w-3 h-3 bg-green-400 rounded-full mr-2'></div>
                    <span>Drag the green handle to compare: left is original, right is blurred</span>
                  </div>
                  <p className='text-xs text-gray-500 ml-5'>
                    💡 Click and drag the green handle to compare at different positions
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
