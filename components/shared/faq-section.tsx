'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "What is Raphael AI Background Blur and how does it work?",
    answer: "Raphael AI Background Blur is a free AI-powered tool that automatically detects the main subject in your photos and blurs the background to create professional-looking depth-of-field effects. Simply upload your image and our AI does the rest."
  },
  {
    question: "Is the background blur service really free to use?",
    answer: "Yes, Raphael AI Background Blur is completely free to use! There are no hidden fees, no subscription required, and no limits on the number of photos you can process. We believe in making professional photo editing accessible to everyone."
  },
  {
    question: "What image formats are supported?",
    answer: "We support all popular image formats including JPEG, PNG, WEBP, and HEIC. You can upload photos from any device - smartphone, camera, or computer - and we'll process them quickly and accurately."
  },
  {
    question: "Do I need to create an account to blur backgrounds?",
    answer: "No account creation required! Simply visit our website, upload your photo, and download the result with blurred background immediately. We believe in keeping things simple and accessible."
  },
  {
    question: "How accurate is the AI subject detection?",
    answer: "Our AI is highly accurate at detecting people, pets, objects, and other subjects in photos. It can handle complex scenes and automatically preserves fine details like hair and edges while blurring the background smoothly."
  },
  {
    question: "How does Raphael AI protect my privacy?",
    answer: "We take privacy seriously. Your uploaded images are processed securely and are never stored on our servers. Photos are automatically deleted after processing, ensuring your personal images remain completely private."
  },
  {
    question: "Can I adjust the blur intensity?",
    answer: "Currently, our AI automatically applies the optimal blur effect for the best results. We're working on adding manual controls for blur intensity and subject refinement in future updates."
  },
  {
    question: "What's the maximum file size for uploads?",
    answer: "You can upload images up to 10MB in size. This covers most high-quality photos from smartphones and cameras. The AI works with any resolution and will maintain the original image quality."
  },
  {
    question: "Can I use the blurred images commercially?",
    answer: "Yes, you own the rights to your processed images. You can use them for both personal and commercial purposes, including social media, marketing, portfolios, and professional presentations."
  },
  {
    question: "How can I get support or report issues?",
    answer: "If you encounter any issues or have suggestions, please contact our support team at support@raphael.app. We're constantly improving our AI and appreciate your feedback!"
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">FAQ</p>
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Have another question? Contact us at support@raphael.app
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item.question}</span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <div className="pl-9 text-muted-foreground">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
