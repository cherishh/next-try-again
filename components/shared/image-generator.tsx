'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Download, Shuffle } from 'lucide-react';

interface GeneratedImage {
  url: string;
  width: number;
  height: number;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageSize, setImageSize] = useState('landscape_4_3');
  const [highQuality, setHighQuality] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const generateRandomPrompt = () => {
    const randomPrompts = [
      "A futuristic cityscape at sunset with flying cars",
      "A magical forest with glowing mushrooms and fairy lights",
      "A cute robot playing with a cat in a cozy living room",
      "A steampunk airship floating above Victorian London",
      "A serene Japanese garden with cherry blossoms",
      "A cyberpunk street scene with neon lights and rain",
      "A majestic dragon soaring over snow-capped mountains",
      "A vintage bookstore filled with floating books and magical items"
    ];
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPrompt);
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negative_prompt: negativePrompt.trim(),
          image_size: imageSize,
          num_inference_steps: highQuality ? 28 : 20,
          guidance_scale: 3.5,
          num_images: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.success && data.images?.length > 0) {
        setGeneratedImages(data.images);
        toast.success('Image generated successfully!');
      } else {
        throw new Error('No images returned');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Generation Form */}
      <div className="bg-card/50 backdrop-blur border rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Description prompt
            </Label>
            <div className="relative">
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What do you want to see?"
                className="pr-12 min-h-[50px] text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateImage();
                  }
                }}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={generateRandomPrompt}
                title="Random prompt"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Options Row */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="square-aspect"
                className="rounded"
                checked={imageSize === 'square'}
                onChange={(e) => setImageSize(e.target.checked ? 'square' : 'landscape_4_3')}
              />
              <Label htmlFor="square-aspect" className="text-sm text-muted-foreground">
                Square Aspect
              </Label>
            </div>

            <div className="text-sm text-muted-foreground">No Style</div>
            <div className="text-sm text-muted-foreground">No Color</div>
            <div className="text-sm text-muted-foreground">No Lighting</div>
            <div className="text-sm text-muted-foreground">No Composition</div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="negative-prompt"
                  checked={false}
                  disabled
                />
                <Label htmlFor="negative-prompt" className="text-sm text-muted-foreground">
                  Negative Prompt
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="high-quality"
                  checked={highQuality}
                  onCheckedChange={setHighQuality}
                />
                <Label htmlFor="high-quality" className="text-sm">
                  High Quality
                </Label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={generateRandomPrompt}>
                Random
              </Button>
              <Button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Images Display */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Image</h3>
          <div className="grid gap-4">
            {generatedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Generated image ${index + 1}`}
                  className="w-full rounded-lg shadow-lg"
                  style={{ maxHeight: '600px', objectFit: 'contain' }}
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => downloadImage(image.url)}
                    className="bg-black/50 hover:bg-black/70 text-white"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
