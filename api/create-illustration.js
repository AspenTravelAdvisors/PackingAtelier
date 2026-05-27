import { callOpenAI } from "./openai.js";

export async function createIllustration(body = {}) {
  const prompt = String(body.prompt || "").trim();
  if (!prompt) throw new Error("Illustration prompt is required.");
  if (!process.env.OPENAI_API_KEY) {
    return {
      demo: true,
      image: null,
      prompt
    };
  }

  const response = await callOpenAI("/images/generations", {
    model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5",
    prompt: [
      prompt,
      "Luxury travel editorial packing-board illustration.",
      "Fine ink linework with soft watercolor fill, crisp object silhouette.",
      "White or transparent background, no text, no watermark, no logos."
    ].join(" "),
    size: "1024x1024",
    quality: "medium",
    background: "transparent",
    output_format: "png"
  });

  const first = response.data?.[0];
  const image = first?.b64_json ? `data:image/png;base64,${first.b64_json}` : first?.url || null;
  if (!image) throw new Error("No image returned from OpenAI.");
  return { image, demo: false, prompt };
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
