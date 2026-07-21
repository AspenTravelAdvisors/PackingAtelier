import { callOpenAI } from "./openai.js";

export async function createIllustration(body = {}) {
  const prompt = String(body.prompt || "").trim();
  if (!prompt) throw new Error("Illustration prompt is required.");
  const style = body.style === "photo" ? "photo" : "illustration";
  if (!process.env.OPENAI_API_KEY) {
    return {
      demo: true,
      image: null,
      prompt,
      style
    };
  }

  const payload = {
    model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5",
    quality: "medium",
    output_format: "png"
  };

  if (style === "photo") {
    // Photorealistic full-length outfit shot for a daily look.
    payload.prompt = [
      prompt,
      "Photorealistic full-length fashion editorial photograph of a real person.",
      "Natural lighting, sharp focus, true-to-life fabric textures, colors, and proportions, head-to-toe framing.",
      "Clean uncluttered background, no text, no watermark, no logos."
    ].join(" ");
    payload.size = "1024x1536";
  } else {
    payload.prompt = [
      prompt,
      "Luxury travel editorial packing-board illustration.",
      "Fine ink linework with soft watercolor fill, crisp object silhouette.",
      "White or transparent background, no text, no watermark, no logos."
    ].join(" ");
    payload.size = "1024x1024";
    payload.background = "transparent";
  }

  const response = await callOpenAI("/images/generations", payload);

  const first = response.data?.[0];
  const image = first?.b64_json ? `data:image/png;base64,${first.b64_json}` : first?.url || null;
  if (!image) throw new Error("No image returned from OpenAI.");
  return { image, demo: false, prompt, style };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const result = await createIllustration(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Request failed" });
  }
}
