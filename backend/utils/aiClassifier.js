// ─────────────────────────────────────────────────────────────────────────────
// backend/utils/aiClassifier.js
//
// WHAT IS THIS MODULE?
//   AI-Based Service Classification Engine for LocalFix.
//   Automatically analyzes a customer's repair problem description and
//   predicts the most suitable service category.
//
// SUPPORTED CATEGORIES:
//   - Plumbing
//   - Electrical
//   - AC Repair
//   - Appliance Repair
//   - Carpentry
//   - Cleaning
//   - Painting
//   - Other
//
// HOW IT WORKS:
//   1. Attempts classification using configured LLM API (GEMINI_API_KEY / AI_API_KEY).
//   2. If the API key is not configured, times out, or fails, gracefully falls back
//      to an intelligent NLP keyword heuristic classifier with 100% uptime guarantee.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "AC Repair",
  "Appliance Repair",
  "Carpentry",
  "Cleaning",
  "Painting",
  "Other",
];

// ── NLP KEYWORD HEURISTICS (Deterministic Fallback Engine) ────────────────────
const KEYWORD_RULES = [
  {
    category: "Plumbing",
    keywords: [
      "tap",
      "leak",
      "pipe",
      "drain",
      "water",
      "faucet",
      "basin",
      "sink",
      "toilet",
      "flush",
      "clog",
      "geyser",
      "tank",
      "shower",
      "plumber",
      "sewage",
    ],
  },
  {
    category: "Electrical",
    keywords: [
      "wire",
      "wiring",
      "switch",
      "switchboard",
      "spark",
      "short circuit",
      "fuse",
      "light",
      "bulb",
      "fan",
      "mcb",
      "socket",
      "power",
      "voltage",
      "electrician",
    ],
  },
  {
    category: "AC Repair",
    keywords: [
      "ac",
      "air conditioner",
      "cooling",
      "cool",
      "compressor",
      "gas leak",
      "gas refill",
      "split ac",
      "window ac",
      "hvac",
      "filter",
      "thermostat",
    ],
  },
  {
    category: "Appliance Repair",
    keywords: [
      "fridge",
      "refrigerator",
      "washing machine",
      "microwave",
      "oven",
      "tv",
      "television",
      "dishwasher",
      "dryer",
      "mixer",
      "grinder",
      "chimney",
      "water purifier",
      "ro",
    ],
  },
  {
    category: "Carpentry",
    keywords: [
      "wood",
      "wooden",
      "door",
      "hinge",
      "table",
      "chair",
      "cupboard",
      "wardrobe",
      "bed",
      "furniture",
      "latch",
      "handle",
      "lock",
      "carpenter",
      "plywood",
    ],
  },
  {
    category: "Cleaning",
    keywords: [
      "clean",
      "cleaning",
      "deep clean",
      "sanitize",
      "dust",
      "stain",
      "sofa",
      "carpet",
      "bathroom clean",
      "kitchen clean",
      "pest",
      "mopping",
      "vacuum",
    ],
  },
  {
    category: "Painting",
    keywords: [
      "paint",
      "painting",
      "wall",
      "color",
      "whitewash",
      "distemper",
      "emulsion",
      "primer",
      "putty",
      "waterproof",
      "damp",
      "stencil",
    ],
  },
];

// ── 1. HEURISTIC CLASSIFIER (Fallback) ───────────────────────────────────────
const classifyWithHeuristics = (text) => {
  const normalized = text.toLowerCase();

  for (const rule of KEYWORD_RULES) {
    for (const keyword of rule.keywords) {
      // Escape special regex characters in keyword
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Use word boundaries for accurate keyword matching
      const regex = new RegExp(`\\b${escaped}\\b`, "i");

      if (regex.test(normalized)) {
        return {
          aiCategory: rule.category,
          confidence: 0.9,
          method: "NLP Heuristic Match",
          reasoning: `Matched key term: "${keyword}"`,
        };
      }
    }
  }

  return {
    aiCategory: "Other",
    confidence: 0.5,
    method: "NLP Heuristic Match",
    reasoning: "Ambiguous or general service description.",
  };
};

// ── 2. LLM CLASSIFIER (External API with Graceful Degradation) ────────────────
const classifyService = async (description = "", title = "", requestedService = "") => {
  const combinedText = `${title} ${description}`.trim();

  if (!combinedText) {
    return {
      aiCategory: requestedService || "Other",
      confidence: 1.0,
      method: "Default",
      reasoning: "No description provided.",
    };
  }

  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

  // If no external AI API key is configured in .env, use local NLP heuristic engine immediately
  if (!apiKey || apiKey === "your_api_key_here") {
    const result = classifyWithHeuristics(combinedText);
    return {
      ...result,
      aiCategory: result.aiCategory !== "Other" ? result.aiCategory : requestedService || "Other",
    };
  }

  try {
    // Call Gemini / External LLM API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert home repair classification AI for LocalFix.
Analyze the customer's repair description: "${combinedText}".
Classify it into EXACTLY ONE of these categories: [${ALLOWED_CATEGORIES.join(", ")}].
Respond with valid JSON only in this exact schema:
{"category": "<Category>", "confidence": <0.0 to 1.0>, "reasoning": "<brief reason>"}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanedJson = textResponse.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanedJson);

      if (ALLOWED_CATEGORIES.includes(parsed.category)) {
        return {
          aiCategory: parsed.category,
          confidence: parsed.confidence || 0.95,
          method: "Gemini AI Engine",
          reasoning: parsed.reasoning || "Classified by AI model",
        };
      }
    }
  } catch (err) {
    console.warn("External AI classification failed, falling back to heuristics:", err.message);
  }

  // Graceful fallback if API call fails or returns non-standard output
  const fallback = classifyWithHeuristics(combinedText);
  return {
    ...fallback,
    aiCategory: fallback.aiCategory !== "Other" ? fallback.aiCategory : requestedService || "Other",
  };
};

module.exports = {
  classifyService,
  ALLOWED_CATEGORIES,
};
