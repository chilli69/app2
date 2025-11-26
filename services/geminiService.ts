import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WaveTheme } from "../types";

// Initialize Gemini
// CRITICAL: Using process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const waveSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "A creative short title for the wave vibe (e.g., 'Neon Nostalgia', 'Coffee Jitters')."
    },
    description: {
      type: Type.STRING,
      description: "A short, poetic description of this wave's feeling (max 2 sentences)."
    },
    colors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A palette of 3 to 5 hex color codes that match the mood."
    },
    params: {
      type: Type.OBJECT,
      properties: {
        frequency: { type: Type.NUMBER, description: "Wave frequency (0.005 = slow rolling, 0.05 = chaotic jitter)." },
        amplitude: { type: Type.NUMBER, description: "Wave height/intensity (20 = subtle, 150 = massive)." },
        speed: { type: Type.NUMBER, description: "Animation speed (0.005 = flow, 0.08 = rush)." },
        complexity: { type: Type.NUMBER, description: "Number of overlapping layers (1 = simple sine, 8 = turbulent noise)." },
        tension: { type: Type.NUMBER, description: "Sharpness of peaks (0.5 = round, 2.0 = spiky)." }
      },
      required: ["frequency", "amplitude", "speed", "complexity", "tension"]
    }
  },
  required: ["name", "description", "colors", "params"]
};

export const generateWaveFromPrompt = async (prompt: string): Promise<WaveTheme> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a visual and parameter configuration for a wave based on this concept: "${prompt}".
      Think about how this concept translates to physics:
      - High energy/anger = high frequency, high speed, spiky tension, red/orange colors.
      - Calm/ocean = low frequency, slow speed, round tension, blue/teal colors.
      - Nostalgia/dream = medium frequency, slow speed, multi-layered complexity, pink/purple colors.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: waveSchema,
        systemInstruction: "You are a Synesthetic Wave Generator. You translate words and feelings into visual mathematics and color theory.",
        temperature: 1.2 // High creativity
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text) as WaveTheme;
    return data;
  } catch (error) {
    console.error("Error generating wave:", error);
    throw error;
  }
};