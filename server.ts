import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI lazily as recommended
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using graceful fallback mock mode.");
      throw new Error("GEMINI_API_KEY is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API: Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Analyze Report using Gemini 3.5 Flash
app.post("/api/analyze-report", async (req, res) => {
  const { description, userLocation } = req.body;

  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return res.status(400).json({ error: "Description is required" });
  }

  // Generate random Bengaluru-based coords if no location provided
  const baseLat = 12.9716;
  const baseLng = 77.5946;
  const randomOffsetLat = (Math.random() - 0.5) * 0.08;
  const randomOffsetLng = (Math.random() - 0.5) * 0.08;
  
  const finalLat = userLocation?.latitude || (baseLat + randomOffsetLat);
  const finalLng = userLocation?.longitude || (baseLng + randomOffsetLng);
  
  // Set up a structured fallback mock response in case the API is keyless or fails
  const mockFallbackResponse = {
    title: "Reported Civic Infraction",
    category: "Roads & Infrastructure",
    urgency: "Medium",
    departmentId: "bbmp",
    needsHumanReview: false,
    confidence: 0.85,
    formalLetter: `To the Public Works Department Office,\nBruhat Bengaluru Mahanagara Palike (BBMP),\nBengaluru.\n\nSubject: Formal Notification of Infrastructure Complaint at ${userLocation?.display_name || "Assigned Sector"}.\n\nDear Sir/Madam,\n\nThis is a formal communication notifying your department of a reported public infrastructure hazard described as follows:\n\n"${description}"\n\nUnder applicable municipal standards, the local authority holds a statutory duty of care to maintain safe pathways and roadways for all citizens. We require your immediate dispatch team to inspect the coordinates (${finalLat.toFixed(4)}, ${finalLng.toFixed(4)}) and draft an action plan to rectify this issue.\n\nSincerely,\nConcerned Citizen Community Group`
  };

  try {
    const ai = getAiClient();
    
    const prompt = `You are a legal-expert civic advocacy agent. Your job is to read a citizen's complaint regarding a public issue and analyze it to determine categories, urgency, assign it to a local department, assess confidence (if it's gibberish or not a real public hazard set needsHumanReview to true), and draft a highly detailed, professional formal complaint letter addressed to that department referencing relevant public safety expectations or local codes.

The citizen's issue is:
"${description}"

Departments available:
- bbmp: Bruhat Bengaluru Mahanagara Palike (Handles Roads, Pavements, Infrastructure, Parks, Waste, Sanitation)
- bwssb: Bengaluru Water Supply and Sewerage Board (Handles Water leaks, pipe burst, sewer overflow, drainage, water supply)
- bescom: Bangalore Electricity Supply Company (Handles Electrical wires, transformers, blackouts, surges, streetlights)
- police: Bengaluru City Police Department (Handles Public Safety, Traffic blockage, safety hazard, noise pollution, law enforcement)

If the user's input is ambiguous, contains swearing, or does not describe a valid municipal infrastructure or safety problem, set "needsHumanReview" to true.

Output your response strictly according to the requested JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A short, precise title for the issue (e.g. 'Sewer Pipeline Overflow')"
            },
            category: {
              type: Type.STRING,
              description: "Exactly one of: 'Water Supply & Sewage', 'Roads & Infrastructure', 'Electricity & Power Grid', 'Public Safety & Law', 'Other / Uncategorized'"
            },
            urgency: {
              type: Type.STRING,
              description: "Exactly one of: 'Routine', 'Medium', 'Urgent', 'Critical'"
            },
            departmentId: {
              type: Type.STRING,
              description: "Exactly one of: 'bbmp', 'bwssb', 'bescom', 'police'"
            },
            needsHumanReview: {
              type: Type.BOOLEAN,
              description: "Set to true if user description is not a valid civic complaint, is ambiguous, gibberish, or low confidence."
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence value between 0.0 and 1.0"
            },
            formalLetter: {
              type: Type.STRING,
              description: "A comprehensive, beautifully structured formal complaint letter addressed to the department head. It should be highly official, formal, authoritative, and mention statutory duties of care or municipal laws."
            }
          },
          required: ["title", "category", "urgency", "departmentId", "needsHumanReview", "confidence", "formalLetter"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const analyzed = JSON.parse(text.trim());
    
    // Attach location details
    const resultReport = {
      ...analyzed,
      latitude: finalLat,
      longitude: finalLng,
      display_name: userLocation?.display_name || `Bengaluru Sector Zone ${Math.floor(Math.random() * 15 + 1)}-A`,
      zone: userLocation?.zone || `Zone 0${Math.floor(Math.random() * 9 + 1)}-A`
    };

    return res.json(resultReport);

  } catch (error: any) {
    console.error("Gemini analysis error:", error.message || error);
    
    // In case of error (or missing API key), send back the structured fallback
    const resultReport = {
      ...mockFallbackResponse,
      latitude: finalLat,
      longitude: finalLng,
      display_name: userLocation?.display_name || `Bengaluru Sector Zone ${Math.floor(Math.random() * 15 + 1)}-A`,
      zone: userLocation?.zone || `Zone 0${Math.floor(Math.random() * 9 + 1)}-A`
    };
    
    // We append a tiny note in the formal letter so the developer knows a fallback happened
    if (!process.env.GEMINI_API_KEY) {
      resultReport.formalLetter = `[MOCK MODE / NO API KEY DETECTED]\n\n${resultReport.formalLetter}`;
    } else {
      resultReport.formalLetter = `[API FALLBACK MODE]\n\n${resultReport.formalLetter}`;
    }

    return res.json(resultReport);
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
