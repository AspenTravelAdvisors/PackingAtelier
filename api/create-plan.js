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
    "luggagePlan",
    "packingRecommendations",
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
    luggagePlan: {
      type: "object",
      additionalProperties: false,
      required: ["headline", "bags", "constraints"],
      properties: {
        headline: { type: "string" },
        bags: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } },
        constraints: { type: "array", minItems: 2, maxItems: 6, items: { type: "string" } }
      }
    },
    packingRecommendations: {
      type: "array",
      minItems: 4,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category", "quantity", "items", "reasoning"],
        properties: {
          category: { type: "string" },
          quantity: { type: "string" },
          items: { type: "array", minItems: 2, maxItems: 8, items: { type: "string" } },
          reasoning: { type: "string" }
        }
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
  if (!file) return [];

  // A single optimized image (downscaled photo or screenshot).
  if (file.kind === "image" && file.base64) {
    const type = file.type || "image/jpeg";
    return [{ type: "input_image", image_url: `data:${type};base64,${file.base64}`, detail: "high" }];
  }

  // Rendered pages from a scanned / image-only PDF.
  if (file.kind === "images" && Array.isArray(file.images)) {
    return file.images
      .slice(0, 6)
      .filter(Boolean)
      .map((base64) => ({ type: "input_image", image_url: `data:image/jpeg;base64,${base64}`, detail: "high" }));
  }

  // Browser-extracted text travels in the prompt, not as a file part.
  if (file.kind === "text") return [];

  // Legacy / fallback base64 path (small raw files).
  if (file.base64 && file.name) {
    const type = file.type || "application/octet-stream";
    if (type.startsWith("image/")) {
      return [{ type: "input_image", image_url: `data:${type};base64,${file.base64}`, detail: "high" }];
    }
    return [{ type: "input_file", filename: file.name, file_data: `data:${type};base64,${file.base64}` }];
  }

  return [];
}

// Does the uploaded file carry any usable content?
function fileHasContent(file) {
  if (!file) return false;
  if (file.kind === "text") return Boolean(String(file.text || "").trim());
  if (file.kind === "image") return Boolean(file.base64);
  if (file.kind === "images") return Array.isArray(file.images) && file.images.some(Boolean);
  return Boolean(file.base64);
}

export async function createPlan(body = {}) {
  const manualText = String(body.manualText || "").trim();
  const preferences = String(body.preferences || "").trim();
  const itineraryStops = Array.isArray(body.itineraryStops) ? body.itineraryStops : [];
  const tripProfile = body.tripProfile && typeof body.tripProfile === "object" ? body.tripProfile : {};
  const wardrobe = Array.isArray(body.wardrobe) ? body.wardrobe : [];
  const wardrobeText = wardrobe
    .filter((category) => category?.category && Array.isArray(category.items) && category.items.length)
    .map((category) => `${category.category}: ${category.items.join(", ")}`)
    .join("\n");
  const stopsText = itineraryStops
    .filter((stop) => stop?.location || stop?.startDate || stop?.endDate || stop?.notes)
    .map((stop, index) => {
      const dates = [stop.startDate, stop.endDate].filter(Boolean).join(" to ");
      const nights = Number.isFinite(stop.nights) ? `${stop.nights} nights` : "";
      const details = [dates, nights, stop.notes].filter(Boolean).join(" | ");
      return `${index + 1}. ${stop.location || "Location not specified"}${details ? ` | ${details}` : ""}`;
    })
    .join("\n");
  const profileText = [
    tripProfile.wardrobeProfileLabel ? `Wardrobe profile: ${tripProfile.wardrobeProfileLabel}` : "",
    tripProfile.travelerCount ? `Travelers: ${tripProfile.travelerCount}` : "",
    tripProfile.colorScheme ? `Requested color scheme: ${tripProfile.colorScheme}` : "",
    tripProfile.luggageTypeLabel ? `Luggage: ${tripProfile.luggageTypeLabel}` : "",
    tripProfile.luggageDetails ? `Luggage details: ${tripProfile.luggageDetails}` : "",
    tripProfile.laundryAccessLabel ? `Laundry access: ${tripProfile.laundryAccessLabel}` : "",
    tripProfile.formalityLabel ? `Formality mix: ${tripProfile.formalityLabel}` : "",
    tripProfile.climateComfortLabel ? `Climate comfort: ${tripProfile.climateComfortLabel}` : "",
    tripProfile.fitNotes ? `Fit, modesty, or activity notes: ${tripProfile.fitNotes}` : ""
  ].filter(Boolean).join("\n");
  const file = body.file || null;
  const fileText = file && file.kind === "text" ? String(file.text || "").trim() : "";
  const hasFile = fileHasContent(file);

  if (!manualText && !stopsText && !hasFile && !process.env.OPENAI_API_KEY) {
    return { plan: demoPlan(), demo: true };
  }

  if (!manualText && !stopsText && !hasFile) {
    throw new Error("Add itinerary details or upload a file first.");
  }

  if (!process.env.OPENAI_API_KEY) {
    const plan = demoPlan();
    plan.subtitle = "Demo mode: add OPENAI_API_KEY for itinerary-specific planning";
    return { plan, demo: true };
  }

  const fileName = file?.name ? ` (${file.name})` : "";
  const itinerarySourceText = manualText
    ? `Itinerary text:\n${manualText}`
    : fileText
      ? `Itinerary extracted from the uploaded file${fileName}:\n${fileText}`
      : hasFile
        ? `The itinerary is attached as image(s)${fileName}. Read the trip details from them.`
        : "Use the structured itinerary stops as the itinerary.";

  const text = [
    "Create a generalized luxury travel editorial packing plan from this submitted itinerary.",
    "Do not mention any destination, route, date, or trip detail unless it appears in or is directly implied by the submitted itinerary.",
    "Do not copy wording, destinations, dates, or item choices from any reference image.",
    "Infer a trip title, route rhythm, outfit styling, laundry plan, and capsule packing strategy from the itinerary itself.",
    "Create an automatic packing recommendation with specific quantities and clothing types, scaled to the number of travelers, nights, laundry access, climate needs, formality, and luggage capacity.",
    "When the wardrobe profile is male or female, use garment language and fit assumptions appropriate to that profile; when gender-neutral or custom, avoid gendered assumptions and use the notes.",
    "Use the requested color scheme as the palette when provided; otherwise infer an elegant palette from the trip.",
    "Respect the stated luggage. If capacity is tight, recommend fewer shoes, repeatable layers, and laundry; if checked luggage is available, only expand where the itinerary justifies it.",
    "Use concise polished language suitable for a premium client-facing visual board.",
    "Prefer neutral, elegant clothing terms unless the itinerary clearly requires technical gear.",
    wardrobeText
      ? "Use the submitted wardrobe as the primary source of outfit pieces. Do not add clothing outside this list unless there is an itinerary-critical gap; if a gap exists, mention it as an optional add."
      : "No wardrobe list was submitted, so infer a compact wardrobe from the itinerary.",
    wardrobeText ? `Submitted wardrobe:\n${wardrobeText}` : "",
    stopsText ? `Structured itinerary stops:\n${stopsText}` : "",
    profileText ? `Traveler and packing brief:\n${profileText}` : "",
    preferences ? `User style and constraints: ${preferences}` : "",
    itinerarySourceText
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
  let plan;
  try {
    plan = JSON.parse(raw);
  } catch {
    throw new Error("The planner returned an unreadable response. Please try again.");
  }
  return { plan, demo: false };
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
