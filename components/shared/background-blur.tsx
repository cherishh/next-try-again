'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download, Loader2, User } from 'lucide-react';

interface ProcessedImage {
  original: string;
  processed: string;
  width: number;
  height: number;
}

export default function BackgroundBlur() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [scanPosition, setScanPosition] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Demo animation for the preview
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition(prev => (prev >= 100 ? 0 : prev + 0.6));
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
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

      // For demo purposes, we'll simulate processing by applying CSS blur
      // In a real implementation, this would call an AI API
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          // Draw original image
          ctx.drawImage(img, 0, 0);

          // Apply a simple blur effect (in real app, this would be AI-powered subject detection + blur)
          ctx.filter = 'blur(8px)';
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const processedUrl = canvas.toDataURL('image/png');

          setProcessedImage({
            original: originalUrl,
            processed: processedUrl,
            width: img.width,
            height: img.height
          });
        }

        setIsProcessing(false);
        toast.success('Background blurred successfully!');
      };

      img.src = originalUrl;

    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage.processed;
    link.download = `blurred-background-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
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
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616c10aac6e?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left Side - Upload Area */}
        <div className="space-y-6">
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />

            <div className="space-y-6">
              {/* Avatar Icon */}
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-orange-500" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-600 mb-2">Drag and drop</p>
                <p className="text-gray-400 mb-6">OR</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upload Picture'
                  )}
                </Button>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Supported formats: JPEG, PNG
          </p>

          {/* Example Images */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Or click on one of these photos to try
            </p>
            <div className="flex justify-center gap-3">
              {exampleImages.map((src, index) => (
                <button
                  key={index}
                  onClick={() => tryExampleImage(src)}
                  className="relative overflow-hidden rounded-lg hover:opacity-80 transition-opacity border border-gray-200"
                  disabled={isProcessing}
                >
                  <img
                    src={src}
                    alt={`Example ${index + 1}`}
                    className="w-14 h-14 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Download Button for Processed Image */}
          {processedImage && (
            <div className="pt-4">
              <Button
                onClick={downloadImage}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Blurred Image
              </Button>
            </div>
          )}
        </div>

        {/* Right Side - Demo/Result Display */}
        <div className="space-y-6">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-green-50 aspect-[4/3]">
            {processedImage ? (
              <div className="relative w-full h-full">
                {/* Blurred Background Image */}
                <img
                  src={processedImage.processed}
                  alt="Blurred background"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Original Image with Mask */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - scanPosition}% 0 0)` }}
                >
                  <img
                    src={processedImage.original}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Scanning Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-green-400 shadow-lg"
                  style={{ left: `${scanPosition}%` }}
                />
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Demo Blurred Background */}
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=400&fit=crop"
                  alt="Demo - Blurred"
                  className="absolute inset-0 w-full h-full object-cover blur-md"
                />

                {/* Demo Original with Mask */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - scanPosition}% 0 0)` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=400&fit=crop"
                    alt="Demo - Original"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Scanning Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-green-400 shadow-lg"
                  style={{ left: `${scanPosition}%` }}
                />

                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="text-center text-white">
                    <p className="text-lg font-semibold mb-2">See the Magic</p>
                    <p className="text-sm opacity-90">Upload your photo to get started</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
