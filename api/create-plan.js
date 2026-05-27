import { callOpenAI, extractResponseText } from "./openai.js";
import { demoPlan } from "./demo-plan.js";

const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "subtitle",
    "dateLine",
    "strategy",
    "palette",
    "destinations",
    "laundry",
    "outfits",
    "packingList",
    "bestLooks",
    "verdict",
    "illustrationPrompts"
  ],
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    dateLine: { type: "string" },
    strategy: { type: "string" },
    palette: { type: "array", minItems: 4, maxItems: 7, items: { type: "string" } },
    destinations: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "nights", "mood", "heroPrompt"],
        properties: {
          name: { type: "string" },
          nights: { type: "number" },
          mood: { type: "string" },
          heroPrompt: { type: "string" }
        }
      }
    },
    laundry: {
      type: "object",
      additionalProperties: false,
      required: ["headline", "bullets"],
      properties: {
        headline: { type: "string" },
        bullets: { type: "array", minItems: 2, maxItems: 5, items: { type: "string" } }
      }
    },
    outfits: {
      type: "array",
      minItems: 3,
      maxItems: 18,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["destination", "label", "dayLook", "dinnerLook", "note"],
        properties: {
          destination: { type: "string" },
          label: { type: "string" },
          dayLook: { type: "array", minItems: 3, maxItems: 6, items: { type: "string" } },
          dinnerLook: { type: "array", minItems: 3, maxItems: 6, items: { type: "string" } },
          note: { type: "string" }
        }
      }
    },
    packingList: { type: "array", minItems: 6, maxItems: 20, items: { type: "string" } },
    bestLooks: { type: "array", minItems: 3, maxItems: 7, items: { type: "string" } },
    verdict: { type: "string" },
    illustrationPrompts: { type: "array", minItems: 4, maxItems: 10, items: { type: "string" } }
  }
};

function fileContent(file) {
  if (!file?.base64 || !file?.name) return [];
  const type = file.type || "application/octet-stream";
  if (type.startsWith("image/")) {
    return [{ type: "input_image", image_url: `data:${type};base64,${file.base64}`, detail: "high" }];
  }
  return [{ type: "input_file", filename: file.name, file_data: `data:${type};base64,${file.base64}` }];
}

export async function createPlan(body = {}) {
  const manualText = String(body.manualText || "").trim();
  const preferences = String(body.preferences || "").trim();
  const file = body.file || null;

  if (!manualText && !file?.base64 && !process.env.OPENAI_API_KEY) {
    return { plan: demoPlan(), demo: true };
  }

  if (!manualText && !file?.base64) {
    throw new Error("Add itinerary text or upload a file first.");
  }

  if (!process.env.OPENAI_API_KEY) {
    const plan = demoPlan();
    plan.subtitle = "Demo mode: add OPENAI_API_KEY for itinerary-specific planning";
    return { plan, demo: true };
  }

  const text = [
    "Create a generalized luxury travel editorial packing plan from this submitted itinerary.",
    "Do not mention any destination, route, date, or trip detail unless it appears in or is directly implied by the submitted itinerary.",
    "Do not copy wording, destinations, dates, or item choices from any reference image.",
    "Infer a trip title, route rhythm, outfit styling, laundry plan, and capsule packing strategy from the itinerary itself.",
    "Use concise polished language suitable for a premium client-facing visual board.",
    "Prefer neutral, elegant clothing terms unless the itinerary clearly requires technical gear.",
    preferences ? `User style and constraints: ${preferences}` : "",
    manualText ? `Itinerary text:\n${manualText}` : "The itinerary is attached as a file."
  ].filter(Boolean).join("\n\n");

  const response = await callOpenAI("/responses", {
    model: process.env.OPENAI_TEXT_MODEL || "gpt-5.1",
    input: [
      {
        role: "user",
        content: [
          ...fileContent(file),
          { type: "input_text", text }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "packing_plan",
        strict: true,
        schema
      }
    }
  });

  const raw = extractResponseText(response);
  return { plan: JSON.parse(raw), demo: false };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const result = await createPlan(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Request failed" });
  }
}
