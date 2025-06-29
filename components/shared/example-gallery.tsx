'use client';

import { useState } from 'react';

const exampleImages = [
  {
    url: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400&h=600&fit=crop',
    prompt: 'A serene Japanese garden with cherry blossoms and a traditional wooden bridge'
  },
  {
    url: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=400&h=300&fit=crop',
    prompt: 'Cyberpunk cityscape with neon lights and futuristic architecture'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    prompt: 'Majestic mountain landscape with snow-capped peaks and alpine lake'
  },
  {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    prompt: 'Cute robot companion in a cozy living room setting'
  },
  {
    url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&h=500&fit=crop',
    prompt: 'Mystical forest with glowing mushrooms and ethereal lighting'
  },
  {
    url: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400&h=300&fit=crop',
    prompt: 'Steampunk airship floating above Victorian London streets'
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    prompt: 'Elegant woman in flowing dress on a golden sunset beach'
  },
  {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    prompt: 'Ancient dragon soaring over medieval castle ruins'
  },
  {
    url: 'https://images.unsplash.com/photo-1640622300473-977435c38c04?w=400&h=500&fit=crop',
    prompt: 'Adorable Pikachu in a field of sunflowers, anime style'
  },
  {
    url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop',
    prompt: 'Crystal sphere floating in space with cosmic background'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    prompt: 'Darth Vader helmet reimagined in red lightsaber glow'
  },
  {
    url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=600&fit=crop',
    prompt: 'Portrait of a blonde woman with vintage car, retro aesthetic'
  },
  {
    url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop',
    prompt: 'Cyberpunk girl with neon hair and futuristic headphones'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
    prompt: 'Enchanted library with floating books and magical atmosphere'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    prompt: 'Train traveling through purple cloudy mountain landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=400&h=400&fit=crop',
    prompt: 'Close-up portrait of a character with detailed anime art style'
  }
];

export default function ExampleGallery() {
  const [selectedImage, setSelectedImage] = useState<typeof exampleImages[0] | null>(null);

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Get Inspired</h2>
        <p className="text-muted-foreground">
          Get inspired by what others are creating with our AI Image Generator
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {exampleImages.map((image, index) => (
          <div
            key={index}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.url}
              alt={image.prompt}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for selected image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-card rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.prompt}
              className="w-full h-auto"
            />
            <div className="p-4">
              <p className="text-sm text-muted-foreground">{selectedImage.prompt}</p>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
