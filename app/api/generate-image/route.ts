import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

fal.config({
  credentials: process.env.FAL_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, negative_prompt, image_size = "landscape_4_3", num_inference_steps = 28, guidance_scale = 3.5, num_images = 1 } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt,
        negative_prompt,
        image_size,
        num_inference_steps,
        guidance_scale,
        num_images,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Generation in progress...");
        }
      },
    });

    return NextResponse.json({
      success: true,
      images: result.data.images,
      prompt: result.data.prompt,
    });
  } catch (error: any) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image", details: error.message },
      { status: 500 }
    );
  }
}
